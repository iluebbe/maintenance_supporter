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

from .const import DOMAIN, GLOBAL_UNIQUE_ID, MAX_DOCS_PER_OBJECT
from .helpers import documents as docmod
from .helpers.documents import KIND_FILE
from .helpers.permissions import user_can_write

UPLOAD_URL = "/api/maintenance_supporter/document/upload"
SERVE_URL = "/api/maintenance_supporter/document/{doc_id}"
EXCERPT_URL = "/api/maintenance_supporter/document/{doc_id}/excerpt"
# Documents archive (ZIP with blobs) — the one export carrying file contents.
DOCS_ARCHIVE_URL = "/api/maintenance_supporter/documents/archive"

# Survives the hass.data[DOMAIN] pop on last-entry unload (see registrar).
_VIEWS_REGISTERED_KEY = f"{DOMAIN}_views_registered"


# MIME types safe to render inline on the HA origin. Anything else (notably
# text/html and image/svg+xml, which can carry active content) is served as an
# opaque attachment so a write-capable user's upload can't become stored XSS.
_INLINE_SAFE_MIMES = frozenset({"application/pdf", "image/png", "image/jpeg", "image/gif", "image/webp"})


def _content_disposition(filename: str, *, inline: bool = True) -> str:
    """Build a safe ``Content-Disposition`` header value for ``filename``.

    ``inline`` (PDFs/known-safe images) previews in the browser; otherwise
    ``attachment`` forces a download. A plain ASCII fallback plus the RFC 5987
    ``filename*`` form together handle non-ASCII names without letting quotes or
    control chars break the header.
    """
    ascii_name = "".join(c for c in filename if c.isascii() and c not in '"\\\r\n').strip() or "document"
    kind = "inline" if inline else "attachment"
    return f"{kind}; filename=\"{ascii_name}\"; filename*=UTF-8''{quote(filename)}"


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
            return self.json_message("entry_id and file are required", HTTPStatus.BAD_REQUEST)

        entry = self.hass.config_entries.async_get_entry(entry_id)
        if entry is None or entry.domain != DOMAIN or entry.unique_id == GLOBAL_UNIQUE_ID:
            return self.json_message("Object not found", HTTPStatus.NOT_FOUND)

        from .websocket import object_id_for_entry

        content = await self.hass.async_add_executor_job(file_field.file.read)
        filename = file_field.filename or "document"
        mime = file_field.content_type or "application/octet-stream"

        title = data.get("title")
        tags = [t.strip() for t in data.getall("tags", []) if isinstance(t, str) and t.strip()][:20]

        try:
            doc = await _get_store(self.hass).async_add_file(
                object_id_for_entry(entry),
                content=content,
                filename=filename,
                mime=mime,
                title=title.strip() if isinstance(title, str) and title.strip() else None,
                tags=tags,
            )
        except ValueError as err:
            if str(err) == "too_many_documents":
                return self.json_message(
                    f"At most {MAX_DOCS_PER_OBJECT} documents per object",
                    HTTPStatus.CONFLICT,
                )
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
        # Only preview known-safe types inline; serve anything else (text/html,
        # image/svg+xml, unknown) as an opaque attachment so a malicious upload
        # can't execute as script on the HA origin. nosniff blocks sniffing on
        # top of the declared type.
        raw_mime = doc.get("mime") or "application/octet-stream"
        inline_safe = raw_mime in _INLINE_SAFE_MIMES
        return web.Response(
            body=content,
            content_type=raw_mime if inline_safe else "application/octet-stream",
            headers={
                hdrs.CONTENT_DISPOSITION: _content_disposition(doc.get("filename") or "document", inline=inline_safe),
                "X-Content-Type-Options": "nosniff",
            },
        )


class DocumentExcerptView(HomeAssistantView):
    """Serve a page range of a stored PDF as its own small PDF (v2.21).

    Backs the task work sheet's "manual excerpt": the documents feature
    stores a per-task page hint (``task_pages``), and this view cuts pages
    ``start .. start+count-1`` out of the attached manual so the user can
    print exactly the relevant section alongside the work sheet. Requires
    ``pypdf`` (a manifest requirement); auth-gated like the serve view and
    reachable through HA's signed-path mechanism.
    """

    url = EXCERPT_URL
    name = "api:maintenance_supporter:document:excerpt"

    def __init__(self, hass: HomeAssistant) -> None:
        """Store the hass reference (the view outlives any single request)."""
        self.hass = hass

    async def get(self, request: web.Request, doc_id: str) -> web.StreamResponse:
        """Return pages ``start``..``start+count-1`` of the blob as a PDF."""
        store = _get_store(self.hass)
        doc = store.get(doc_id)
        if doc is None or doc.get("kind") != KIND_FILE:
            return web.Response(status=HTTPStatus.NOT_FOUND)
        if (doc.get("mime") or "") != "application/pdf":
            return web.Response(status=HTTPStatus.UNSUPPORTED_MEDIA_TYPE)

        try:
            start = int(request.query.get("start", "1"))
            count = int(request.query.get("count", "4"))
        except ValueError:
            return web.Response(status=HTTPStatus.BAD_REQUEST)
        if start < 1 or not 1 <= count <= 20:
            return web.Response(status=HTTPStatus.BAD_REQUEST)

        try:
            path = store.blob_path(cast(str, doc.get("hash")))
        except (ValueError, TypeError):
            return web.Response(status=HTTPStatus.NOT_FOUND)
        if not await self.hass.async_add_executor_job(path.is_file):
            return web.Response(status=HTTPStatus.NOT_FOUND)

        def _extract() -> bytes | None:
            import io as _io

            from pypdf import PdfReader, PdfWriter

            reader = PdfReader(str(path))
            total = len(reader.pages)
            if start > total:
                return None
            writer = PdfWriter()
            for i in range(start - 1, min(start - 1 + count, total)):
                writer.add_page(reader.pages[i])
            buf = _io.BytesIO()
            writer.write(buf)
            return buf.getvalue()

        try:
            content = await self.hass.async_add_executor_job(_extract)
        except Exception:  # noqa: BLE001 - a damaged PDF must 4xx, not 500-trace
            return web.Response(status=HTTPStatus.UNPROCESSABLE_ENTITY)
        if content is None:
            return web.Response(status=HTTPStatus.BAD_REQUEST)

        filename = f"excerpt-p{start}-{doc.get('filename') or 'document'}"
        return web.Response(
            body=content,
            content_type="application/pdf",
            headers={
                hdrs.CONTENT_DISPOSITION: _content_disposition(filename, inline=True),
                "X-Content-Type-Options": "nosniff",
            },
        )


class DocumentsArchiveView(HomeAssistantView):
    """Export/import the documents archive — a ZIP that carries file BLOBS.

    ``GET`` streams a ZIP (manifest + blobs) for all objects, or a selection
    via ``?entry_ids=a,b``. ``POST`` a ZIP restores blobs + re-attaches
    metadata. Admin-only both ways (it moves file contents in and out).
    """

    url = DOCS_ARCHIVE_URL
    name = "api:maintenance_supporter:documents:archive"

    def __init__(self, hass: HomeAssistant) -> None:
        """Store the hass reference (the view outlives any single request)."""
        self.hass = hass

    def _require_admin(self, request: web.Request) -> bool:
        user = request.get("hass_user")
        return bool(user and user.is_admin)

    async def get(self, request: web.Request) -> web.StreamResponse:
        """Stream the documents archive ZIP (all objects or ?entry_ids=…)."""
        if not self._require_admin(request):
            return web.Response(status=HTTPStatus.FORBIDDEN)
        from .helpers.doc_archive import build_documents_archive

        raw = request.query.get("entry_ids")
        entry_ids = {e for e in raw.split(",") if e} if raw else None
        content = await self.hass.async_add_executor_job(build_documents_archive, self.hass, entry_ids)
        return web.Response(
            body=content,
            content_type="application/zip",
            headers={
                hdrs.CONTENT_DISPOSITION: _content_disposition("maintenance-documents.zip", inline=False),
                "X-Content-Type-Options": "nosniff",
            },
        )

    async def post(self, request: web.Request) -> web.Response:
        """Restore a documents archive ZIP (blobs + metadata)."""
        if not self._require_admin(request):
            return self.json_message("Not authorized", HTTPStatus.FORBIDDEN)
        from .helpers.doc_archive import MAX_ARCHIVE_BYTES, import_documents_archive

        request._client_max_size = MAX_ARCHIVE_BYTES + 1024 * 1024
        data = await request.post()
        file_field = data.get("file")
        if not isinstance(file_field, web.FileField):
            return self.json_message("file is required", HTTPStatus.BAD_REQUEST)
        content = await self.hass.async_add_executor_job(file_field.file.read)
        result = await import_documents_archive(self.hass, content)
        if "error" in result:
            return self.json_message(result["error"], HTTPStatus.BAD_REQUEST)
        return self.json(result)


def async_register_document_views(hass: HomeAssistant) -> None:
    """Register the upload + serve views on the HTTP component.

    Guarded outside hass.data[DOMAIN] (which is popped on last-entry unload):
    the views stay mounted on the HTTP app, so a reinstall in the same HA run
    must not add them a second time (journey O1).
    """
    if hass.data.get(_VIEWS_REGISTERED_KEY):
        return
    hass.http.register_view(DocumentUploadView(hass))
    hass.http.register_view(DocumentServeView(hass))
    hass.http.register_view(DocumentExcerptView(hass))
    hass.http.register_view(DocumentsArchiveView(hass))
    hass.data[_VIEWS_REGISTERED_KEY] = True
