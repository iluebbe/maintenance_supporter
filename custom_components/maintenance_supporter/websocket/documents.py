"""WebSocket handlers for document metadata.

Covers everything that is pure JSON: listing an object's documents, attaching a
web-link, editing metadata (title / tags / task links), deleting, and the global
storage summary. Binary **file** upload + download go through the authenticated
HTTP views in ``views.py`` (multipart / streamed body) — websocket frames are a
poor fit for large binaries.

Authz mirrors object/task CRUD: reads (``list`` / ``storage``) are open to any
panel user; mutations require write permission (admin or delegated operator) via
``@require_write``. Documents are object content, the same tier as objects and
tasks — never the global-config tier.
"""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from ..const import DOMAIN, MAX_ID_LENGTH, MAX_NAME_LENGTH, MAX_URL_LENGTH
from ..helpers.permissions import require_write
from . import _load_object_entry, object_id_for_entry
from .tasks import _is_safe_url

if TYPE_CHECKING:
    from ..helpers.documents import DocumentStore

_MAX_TAGS = 20
_MAX_TAG_LEN = 64
_MAX_TASK_IDS = 100

# A list of non-empty, length-capped tag strings, itself length-capped.
_TAGS_SCHEMA = vol.All(
    [vol.All(str, vol.Length(min=1, max=_MAX_TAG_LEN))],
    vol.Length(max=_MAX_TAGS),
)
_TASK_IDS_SCHEMA = vol.All(
    [vol.All(str, vol.Length(max=MAX_ID_LENGTH))],
    vol.Length(max=_MAX_TASK_IDS),
)


def _get_store(hass: HomeAssistant) -> DocumentStore:
    """Return the loaded document store (an async_setup invariant)."""
    from .. import DOCUMENT_STORE_KEY

    store: DocumentStore = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    return store


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/documents/list",
        vol.Required("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
    }
)
@websocket_api.async_response
async def ws_documents_list(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """List all documents attached to an object (newest first)."""
    entry = _load_object_entry(hass, connection, msg)
    if entry is None:
        return
    store = _get_store(hass)
    documents = store.for_object(object_id_for_entry(entry))
    connection.send_result(msg["id"], {"documents": documents})


@websocket_api.websocket_command(
    {vol.Required("type"): "maintenance_supporter/documents/storage"}
)
@websocket_api.async_response
async def ws_documents_storage(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return the global storage summary (physical vs logical, per object/category)."""
    connection.send_result(msg["id"], _get_store(hass).storage_summary())


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/documents/add_link",
        vol.Required("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Required("url"): vol.All(str, vol.Length(min=1, max=MAX_URL_LENGTH)),
        vol.Optional("title"): vol.Any(vol.All(str, vol.Length(max=MAX_NAME_LENGTH)), None),
        vol.Optional("tags"): _TAGS_SCHEMA,
    }
)
@require_write
@websocket_api.async_response
async def ws_documents_add_link(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Attach an external web-link to an object (0 storage, not in backups)."""
    entry = _load_object_entry(hass, connection, msg)
    if entry is None:
        return

    url = msg["url"].strip()
    # Web-links must be absolute http/https — a relative or scheme-less URL is
    # meaningless as a stored external reference (and _is_safe_url treats those
    # as "safe", so the explicit prefix check is required here).
    if not url.lower().startswith(("http://", "https://")) or not _is_safe_url(url):
        connection.send_error(msg["id"], "invalid_url", "Only http/https URLs are allowed")
        return

    title = msg.get("title")
    doc = await _get_store(hass).async_add_weblink(
        object_id_for_entry(entry),
        url=url,
        title=title.strip() if isinstance(title, str) and title.strip() else None,
        tags=msg.get("tags"),
    )
    connection.send_result(msg["id"], doc)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/documents/update",
        vol.Required("doc_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Optional("title"): vol.All(str, vol.Length(max=MAX_NAME_LENGTH)),
        vol.Optional("tags"): _TAGS_SCHEMA,
        vol.Optional("task_ids"): _TASK_IDS_SCHEMA,
    }
)
@require_write
@websocket_api.async_response
async def ws_documents_update(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Update editable document metadata (title / tags / task associations)."""
    store = _get_store(hass)
    title = msg.get("title")
    ok = await store.async_update(
        msg["doc_id"],
        title=(title.strip() or None) if isinstance(title, str) else None,
        tags=msg.get("tags"),
        task_ids=msg.get("task_ids"),
    )
    if not ok:
        connection.send_error(msg["id"], "not_found", "Document not found")
        return
    connection.send_result(msg["id"], store.get(msg["doc_id"]))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/documents/delete",
        vol.Required("doc_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
    }
)
@require_write
@websocket_api.async_response
async def ws_documents_delete(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Remove a document. Frees blob bytes only when the last reference goes."""
    store = _get_store(hass)
    if store.get(msg["doc_id"]) is None:
        connection.send_error(msg["id"], "not_found", "Document not found")
        return
    freed = await store.async_remove(msg["doc_id"])
    connection.send_result(msg["id"], {"success": True, "bytes_freed": freed})
