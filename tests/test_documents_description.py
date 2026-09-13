"""#164: a description per document, carried everywhere a document travels.

Pins: add_link / update / upload accept and echo it (capped, trimmed, ''
clears), the document search matches it, the JSON export and the documents
archive carry it and the importer restores it, and the list (newest first
server-side) exposes it for the panel's own ordering.
"""

from __future__ import annotations

from http import HTTPStatus
from typing import Any

from aiohttp import FormData
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import DOCUMENT_STORE_KEY, DOMAIN, MAX_TEXT_LENGTH
from custom_components.maintenance_supporter.export import _export_documents
from custom_components.maintenance_supporter.websocket import object_id_for_entry

from .conftest import (
    make_global_entry as _global,
    make_object_entry,
    setup_integration,
)

UPLOAD_URL = "/api/maintenance_supporter/document/upload"


def _object(hass: HomeAssistant, uid: str) -> MockConfigEntry:
    return make_object_entry(hass, name="Pool Pump", title="Boiler", uid=uid)


async def _ws(client: Any, msg: dict[str, Any], id_: int) -> dict[str, Any]:
    await client.send_json({"id": id_, **msg})
    res = await client.receive_json()
    assert res["id"] == id_ and res["success"], res
    return res["result"]


async def test_description_round_trips_through_link_update_search_and_export(hass: HomeAssistant, hass_ws_client: Any) -> None:
    g = _global(hass)
    obj = _object(hass, "desc")
    await setup_integration(hass, g, obj)
    client = await hass_ws_client(hass)
    doc = await _ws(client, {"type": "maintenance_supporter/documents/add_link", "entry_id": obj.entry_id, "url": "https://example.com/burner.pdf", "title": "Burner manual", "description": "  Chapter 4 covers the ignition electrode.  "}, 1)
    assert doc["description"] == "Chapter 4 covers the ignition electrode."
    listed = await _ws(client, {"type": "maintenance_supporter/documents/list", "entry_id": obj.entry_id}, 2)
    assert listed["documents"][0]["description"] == "Chapter 4 covers the ignition electrode."
    # The search finds it by the description alone.
    hits = await _ws(client, {"type": "maintenance_supporter/documents/search", "query": "ignition electrode"}, 3)
    assert [h["id"] for h in hits["results"]] == [doc["id"]] and hits["results"][0]["description"].startswith("Chapter 4")
    # Update, cap and clear.
    await client.send_json({"id": 4, "type": "maintenance_supporter/documents/update", "doc_id": doc["id"], "description": "x" * (MAX_TEXT_LENGTH + 50)})
    refused = await client.receive_json()
    assert refused["id"] == 4 and refused["success"] is False, refused
    updated = await _ws(client, {"type": "maintenance_supporter/documents/update", "doc_id": doc["id"], "description": "Short"}, 5)
    assert updated["description"] == "Short"
    cleared = await _ws(client, {"type": "maintenance_supporter/documents/update", "doc_id": doc["id"], "description": ""}, 6)
    assert cleared["description"] == "", "an empty string clears"
    updated = await _ws(client, {"type": "maintenance_supporter/documents/update", "doc_id": doc["id"], "description": "Short"}, 7)
    store = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    exported = _export_documents(store, object_id_for_entry(obj))
    assert exported[0]["description"] == "Short"
    # An import (a backup restore, a duplicated object) restores it.
    other = _object(hass, "desc2")
    await hass.config_entries.async_setup(other.entry_id)
    await hass.async_block_till_done()
    assert await store.async_import_documents(object_id_for_entry(other), exported) == 1
    restored = store.for_object(object_id_for_entry(other))
    assert restored[0]["description"] == "Short" and restored[0]["title"] == "Burner manual"
    # A document that predates the field reports "" (no KeyError anywhere).
    store.documents[doc["id"]].pop("description", None)
    legacy = next(d for d in _export_documents(store, object_id_for_entry(obj)) if d["id"] == doc["id"])
    assert legacy["description"] == ""


async def test_upload_takes_a_description(hass: HomeAssistant, hass_client: Any) -> None:
    g = _global(hass)
    obj = _object(hass, "desc_upload")
    await setup_integration(hass, g, obj)
    client = await hass_client()
    form = FormData()
    form.add_field("entry_id", obj.entry_id)
    form.add_field("tags", "manual")
    form.add_field("description", "Scanned from the box")
    form.add_field("file", b"pdf-bytes", filename="box.pdf", content_type="application/pdf")
    resp = await client.post(UPLOAD_URL, data=form)
    assert resp.status == HTTPStatus.OK
    doc = await resp.json()
    stored = hass.data[DOMAIN][DOCUMENT_STORE_KEY].get(doc["id"])
    assert stored["description"] == "Scanned from the box"
