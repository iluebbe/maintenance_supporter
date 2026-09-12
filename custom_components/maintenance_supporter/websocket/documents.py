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

from ..const import (
    CONF_OBJECT,
    DOMAIN,
    MAX_ID_LENGTH,
    MAX_NAME_LENGTH,
    MAX_TEXT_LENGTH,
    MAX_URL_LENGTH,
)
from ..helpers.permissions import require_write
from ..helpers.search_match import query_tokens, score_fields, snippet
from . import _get_object_entries, _load_object_entry, object_id_for_entry
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
# {task_id: page} jump-to-page hints; page 0 clears, >=1 sets (PDFs, #page=N).
# A plain ``str`` type-key matches any task id — a ``vol.All(str, ...)`` key is
# treated as an unknown key by voluptuous and rejected as "extra keys".
_TASK_PAGES_SCHEMA = vol.Schema({str: vol.All(int, vol.Range(min=0, max=99999))})


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


@websocket_api.websocket_command({vol.Required("type"): "maintenance_supporter/documents/storage"})
@websocket_api.async_response
async def ws_documents_storage(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return the global storage summary (physical vs logical, per object/category).

    ``search_index`` (#171) says how much of the library is full-text
    searchable: ``indexed`` blobs carry a text layer, ``no_text`` are scans /
    image-only PDFs, ``unsupported`` are photos and other binaries,
    ``pending`` still wait for the backfill.
    """
    store = _get_store(hass)
    summary = store.storage_summary()
    if store.text_index is not None:
        summary["search_index"] = store.text_index.summary()
    connection.send_result(msg["id"], summary)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/documents/add_link",
        vol.Required("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Required("url"): vol.All(str, vol.Length(min=1, max=MAX_URL_LENGTH)),
        vol.Optional("title"): vol.Any(vol.All(str, vol.Length(max=MAX_NAME_LENGTH)), None),
        vol.Optional("tags"): _TAGS_SCHEMA,
        vol.Optional("description"): vol.Any(vol.All(str, vol.Length(max=MAX_TEXT_LENGTH)), None),
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
        description=msg.get("description"),
    )
    connection.send_result(msg["id"], doc)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/documents/update",
        vol.Required("doc_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Optional("title"): vol.All(str, vol.Length(max=MAX_NAME_LENGTH)),
        vol.Optional("tags"): _TAGS_SCHEMA,
        vol.Optional("task_ids"): _TASK_IDS_SCHEMA,
        vol.Optional("task_pages"): _TASK_PAGES_SCHEMA,
        # Spare-part links (v2.26) — same shape/cap as task links.
        vol.Optional("part_ids"): _TASK_IDS_SCHEMA,
        # #164: a free-text description ('' clears).
        vol.Optional("description"): vol.All(str, vol.Length(max=MAX_TEXT_LENGTH)),
    }
)
@require_write
@websocket_api.async_response
async def ws_documents_update(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Update editable document metadata (title / tags / task links / per-task page)."""
    store = _get_store(hass)
    title = msg.get("title")
    # A present title (even empty) sets/clears it; absent or null → no change.
    # Don't collapse "" to None here — that would make an intentional clear read
    # as "leave unchanged" and the old title would survive (L5).
    ok = await store.async_update(
        msg["doc_id"],
        title=title.strip() if isinstance(title, str) else None,
        tags=msg.get("tags"),
        task_ids=msg.get("task_ids"),
        task_pages=msg.get("task_pages"),
        part_ids=msg.get("part_ids"),
        description=msg.get("description"),
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
    """Remove a document. Frees blob bytes only when the last reference goes.
    History entries' completion photos and parts' ``doc_id`` that pointed at
    it are cleared too (they used to dangle)."""
    from ..helpers.documents import async_forget_doc_ids

    store = _get_store(hass)
    if store.get(msg["doc_id"]) is None:
        connection.send_error(msg["id"], "not_found", "Document not found")
        return
    freed = await store.async_remove(msg["doc_id"])
    await async_forget_doc_ids(hass, {msg["doc_id"]})
    connection.send_result(msg["id"], {"success": True, "bytes_freed": freed})


_SEARCH_MAX_RESULTS = 50
#: Field weights for the tolerant matcher — the title is what people remember,
#: the file name and tags come next, a URL or MIME rarely.
_DOC_FIELD_WEIGHTS = (("title", 3), ("filename", 2), ("description", 2), ("url", 1), ("mime", 1))


def _object_map(hass: HomeAssistant) -> dict[str, tuple[str, str]]:
    """object id -> (entry_id, name), so hits carry a human-readable location."""
    obj_map: dict[str, tuple[str, str]] = {}
    for entry in _get_object_entries(hass):
        obj = entry.data.get(CONF_OBJECT, {})
        oid = obj.get("id")
        if isinstance(oid, str) and oid:
            obj_map[oid] = (entry.entry_id, obj.get("name", ""))
    return obj_map


def _doc_hit(did: str, doc: dict[str, Any], obj_map: dict[str, tuple[str, str]]) -> dict[str, Any]:
    entry_id, name = obj_map.get(doc.get("object_id", ""), ("", ""))
    return {
        "id": did,
        "entry_id": entry_id,
        "object_name": name,
        "kind": doc.get("kind"),
        "title": doc.get("title"),
        "filename": doc.get("filename"),
        "url": doc.get("url"),
        "size": doc.get("size"),
        "tags": doc.get("tags") or [],
        "description": doc.get("description") or "",
    }


def _doc_meta_score(tokens: list[tuple[str, ...]], doc: dict[str, Any]) -> int:
    fields: list[tuple[str, int]] = [(str(doc.get(f) or ""), w) for f, w in _DOC_FIELD_WEIGHTS]
    fields.extend((str(tag), 2) for tag in (doc.get("tags") or []))
    return score_fields(tokens, fields)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/documents/search",
        vol.Required("query"): vol.All(str, vol.Length(max=MAX_NAME_LENGTH)),
    }
)
@websocket_api.async_response
async def ws_documents_search(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Find documents across all objects by title / filename / tag (read, open).

    Tolerant matching (#171): every word of the query must match somewhere —
    as a prefix, a substring or with one typo, diacritics folded — and hits
    come back best first.
    """
    tokens = query_tokens(msg["query"])
    if not tokens:
        connection.send_result(msg["id"], {"results": []})
        return
    obj_map = _object_map(hass)
    store = _get_store(hass)
    scored: list[tuple[int, str, dict[str, Any]]] = []
    for did, doc in store.documents.items():
        score = _doc_meta_score(tokens, doc)
        if score > 0:
            scored.append((score, did, doc))
    scored.sort(key=lambda item: -item[0])
    results = [_doc_hit(did, doc, obj_map) for _, did, doc in scored[:_SEARCH_MAX_RESULTS]]
    connection.send_result(msg["id"], {"results": results})


_GLOBAL_SEARCH_MAX = 20
_HISTORY_NOTE_MAX = 4000


def _history_hit(entry_id: str, task_id: str, td: dict[str, Any], object_name: str, h: dict[str, Any], *, score: int) -> dict[str, Any]:
    """One history hit of the global search; ``ref`` is the completion's
    reference ("8.3-2", #170) when the object, task and entry all carry one."""
    from ..helpers.reference_numbers import format_entry_ref

    obj_ref = td.get("_object_ref")
    return {
        "entry_id": entry_id,
        "task_id": task_id,
        "task_name": str(td.get("name") or ""),
        "object_name": object_name,
        "timestamp": h.get("timestamp"),
        "type": h.get("type"),
        "ref": format_entry_ref(obj_ref, td.get("ref_no"), h.get("ref_no")),
        "snippet": "",
        "score": score,
    }


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/search",
        vol.Required("query"): vol.All(str, vol.Length(max=MAX_NAME_LENGTH)),
        vol.Optional("limit", default=8): vol.All(int, vol.Range(min=1, max=_GLOBAL_SEARCH_MAX)),
    }
)
@websocket_api.async_response
async def ws_search(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """The server side of the panel's global search (#171, read, open).

    Objects, tasks and parts are matched in the panel from data it already
    holds; this command covers what is NOT in the browser: documents (by
    title / file name / tags AND by their extracted text — page + snippet)
    and the notes written into task histories. Both lists come back best
    first, ``limit`` each.
    """
    from ..helpers.aggregate import merged_tasks, object_name
    from ..helpers.reference_numbers import parse_ref

    query = msg["query"]
    limit = max(1, min(int(msg.get("limit", 8)), _GLOBAL_SEARCH_MAX))

    # A typed reference ("8.3-2", #170) names ONE completion — answer with
    # exactly that entry; objects and tasks by reference the panel resolves
    # from its own data.
    parsed = parse_ref(query)
    if parsed is not None and parsed[2] is not None:
        obj_ref, task_ref, entry_ref = parsed
        for entry in _get_object_entries(hass):
            if (entry.data.get(CONF_OBJECT) or {}).get("ref_no") != obj_ref:
                continue
            for tid, td in merged_tasks(entry).items():
                if td.get("ref_no") != task_ref:
                    continue
                for h in td.get("history") or []:
                    if isinstance(h, dict) and h.get("ref_no") == entry_ref:
                        hit = _history_hit(entry.entry_id, tid, {**td, "_object_ref": obj_ref}, object_name(entry), h, score=1000)
                        hit["snippet"] = " ".join(str(h.get("notes") or "").split())[:160]
                        connection.send_result(msg["id"], {"documents": [], "history": [hit]})
                        return
        connection.send_result(msg["id"], {"documents": [], "history": []})
        return

    tokens = query_tokens(query)
    if not tokens:
        connection.send_result(msg["id"], {"documents": [], "history": []})
        return
    obj_map = _object_map(hass)
    store = _get_store(hass)

    # Documents: metadata hits first, then content hits from the text index
    # (a document that matches both keeps the higher score and gains the page).
    doc_hits: dict[str, dict[str, Any]] = {}
    for did, doc in store.documents.items():
        score = _doc_meta_score(tokens, doc)
        if score > 0:
            doc_hits[did] = {**_doc_hit(did, doc, obj_map), "score": score * 10, "match": "meta", "page": None, "snippet": ""}
    if store.text_index is not None:
        by_digest: dict[str, list[str]] = {}
        for did, doc in store.documents.items():
            digest = doc.get("hash")
            if isinstance(digest, str) and digest:
                by_digest.setdefault(digest, []).append(did)
        for hit in await store.text_index.async_search(msg["query"], limit=limit * 2):
            for did in by_digest.get(hit["digest"], []):
                cur = doc_hits.get(did)
                if cur is None:
                    doc_hits[did] = {
                        **_doc_hit(did, store.documents[did], obj_map),
                        "score": hit["score"],
                        "match": "content",
                        "page": hit["page"],
                        "snippet": hit["snippet"],
                    }
                else:
                    cur["page"] = hit["page"]
                    cur["snippet"] = hit["snippet"]
                    cur["score"] = max(cur["score"], hit["score"]) + min(cur["score"], hit["score"]) // 4
    documents = sorted(doc_hits.values(), key=lambda d: -d["score"])[:limit]

    # History notes across every task of every object.
    history: list[dict[str, Any]] = []
    for entry in _get_object_entries(hass):
        oname = object_name(entry)
        obj_ref = (entry.data.get(CONF_OBJECT) or {}).get("ref_no")
        for tid, td in merged_tasks(entry).items():
            td = {**td, "_object_ref": obj_ref}
            for h in td.get("history") or []:
                notes = h.get("notes") if isinstance(h, dict) else None
                if not isinstance(notes, str) or not notes.strip():
                    continue
                score = score_fields(tokens, [(notes[:_HISTORY_NOTE_MAX], 1)])
                if score <= 0:
                    continue
                piece, _at = snippet(notes, tokens[0][0], radius=60)
                hit = _history_hit(entry.entry_id, tid, td, oname, h, score=score)
                hit["snippet"] = piece or " ".join(notes.split())[:160]
                history.append(hit)
    # Best first; equal scores newest first (two stable sorts).
    history.sort(key=lambda h: str(h.get("timestamp") or ""), reverse=True)
    history.sort(key=lambda h: -h["score"])
    connection.send_result(msg["id"], {"documents": documents, "history": history[:limit]})
