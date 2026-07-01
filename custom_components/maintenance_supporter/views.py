"""Authenticated HTTP views for document upload + download.

Document blobs live under ``/config`` so they ride along in every Home Assistant
backup — which means they must NOT be reachable through an unauthenticated static
path (that is exactly why ``/config/www`` → ``/local`` is unsuitable). These two
views mirror HA's own ``image_upload`` precedent:

* :class:`DocumentUploadView` — ``POST`` a multipart file → stored as a
  content-addressed, reference-counted blob (write permission required).
* :class:`DocumentServeView` — ``GET`` a document's binary content, auth-gated.
  The path parameter is a document id, resolved server-side to a blob whose name
  is a validated hex digest, so ``../`` traversal is structurally impossible.

The frontend fetches served documents through HA's signed-path mechanism
(``auth/sign_path``), so an ``<a>``/download works without exposing a token.
"""

from __future__ import annotations

from http import HTTPStatus
from typing import cast
from urllib.parse import quote

from aiohttp import hdrs, web
from homeassistant.core import HomeAssistant
from homeassistant.helpers.http import HomeAssistantView

from .const import DOMAIN, GLOBAL_UNIQUE_ID
from .helpers import documents as docmod
from .helpers.documents import KIND_FILE
from .helpers.permissions import user_can_write

UPLOAD_URL = "/api/maintenance_supporter/document/upload"
SERVE_URL = "/api/maintenance_supporter/document/{doc_id}"


def _content_disposition(filename: str) -> str:
    """Build a safe ``Content-Disposition`` header value for ``filename``.

    Serves ``inline`` so PDFs/images preview in the browser; the frontend's
    download helper can still force a save. A plain ASCII fallback plus the
    RFC 5987 ``filename*`` form together handle non-ASCII names without letting
    quotes or control chars break the header.
    """
    ascii_name = (
        "".join(c for c in filename if c.isascii() and c not in '"\\\r\n').strip()
        or "document"
    )
    return f"inline; filename=\"{ascii_name}\"; filename*=UTF-8''{quote(filename)}"


def _get_store(hass: HomeAssistant) -> docmod.DocumentStore:
    """Return the loaded document store (an async_setup invariant)."""
    from . import DOCUMENT_STORE_KEY

    store: docmod.DocumentStore = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    return store


class DocumentUploadView(HomeAssistantView):
    """Upload a file for a maintenance object (multipart, write-gated)."""

    url = UPLOAD_URL
    name = "api:maintenance_supporter:document:upload"

    def __init__(self, hass: HomeAssistant) -> None:
        """Store the hass reference (the view outlives any single request)."""
        self.hass = hass

    async def post(self, request: web.Request) -> web.Response:
        """Store the uploaded file as a content-addressed blob + metadata."""
        if not user_can_write(self.hass, request["hass_user"]):
            return self.json_message("Not authorized", HTTPStatus.FORBIDDEN)

        # aiohttp caps request bodies at 1 MiB by default; allow the full
        # per-file limit plus a margin for multipart framing.
        request._client_max_size = docmod.MAX_DOC_BYTES + 1024 * 1024

        data = await request.post()
        entry_id = data.get("entry_id")
        file_field = data.get("file")
        if not isinstance(entry_id, str) or not isinstance(file_field, web.FileField):
            return self.json_message(
                "entry_id and file are required", HTTPStatus.BAD_REQUEST
            )

        entry = self.hass.config_entries.async_get_entry(entry_id)
        if entry is None or entry.domain != DOMAIN or entry.unique_id == GLOBAL_UNIQUE_ID:
            return self.json_message("Object not found", HTTPStatus.NOT_FOUND)

        from .websocket import object_id_for_entry

        content = await self.hass.async_add_executor_job(file_field.file.read)
        filename = file_field.filename or "document"
        mime = file_field.content_type or "application/octet-stream"

        title = data.get("title")
        tags = [
            t.strip()
            for t in data.getall("tags", [])
            if isinstance(t, str) and t.strip()
        ][:20]

        try:
            doc = await _get_store(self.hass).async_add_file(
                object_id_for_entry(entry),
                content=content,
                filename=filename,
                mime=mime,
                title=title.strip() if isinstance(title, str) and title.strip() else None,
                tags=tags,
            )
        except ValueError:
            return self.json_message("File too large", HTTPStatus.REQUEST_ENTITY_TOO_LARGE)

        return self.json(doc)


class DocumentServeView(HomeAssistantView):
    """Serve a stored document's binary content (auth-gated, path-validated)."""

    url = SERVE_URL
    name = "api:maintenance_supporter:document"

    def __init__(self, hass: HomeAssistant) -> None:
        """Store the hass reference (the view outlives any single request)."""
        self.hass = hass

    async def get(self, request: web.Request, doc_id: str) -> web.StreamResponse:
        """Return the blob behind ``doc_id`` (404 for links / missing blobs)."""
        store = _get_store(self.hass)
        doc = store.get(doc_id)
        if doc is None or doc.get("kind") != KIND_FILE:
            return web.Response(status=HTTPStatus.NOT_FOUND)

        try:
            path = store.blob_path(cast(str, doc.get("hash")))
        except (ValueError, TypeError):
            return web.Response(status=HTTPStatus.NOT_FOUND)

        if not await self.hass.async_add_executor_job(path.is_file):
            return web.Response(status=HTTPStatus.NOT_FOUND)

        content = await self.hass.async_add_executor_job(path.read_bytes)
        return web.Response(
            body=content,
            content_type=doc.get("mime") or "application/octet-stream",
            headers={hdrs.CONTENT_DISPOSITION: _content_disposition(doc.get("filename") or "document")},
        )


def async_register_document_views(hass: HomeAssistant) -> None:
    """Register the upload + serve views on the HTTP component."""
    hass.http.register_view(DocumentUploadView(hass))
    hass.http.register_view(DocumentServeView(hass))
