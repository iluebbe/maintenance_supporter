"""Document excerpt endpoint (v2.21) — pages X..X+N of a stored PDF manual.

Backs the task work sheet's "manual excerpt": pypdf cuts the requested page
range out of the attached PDF so the user prints exactly the relevant
section. Auth-gated like the serve view.
"""

from __future__ import annotations

import io
from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter import DOCUMENT_STORE_KEY
from custom_components.maintenance_supporter.const import (
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.websocket import object_id_for_entry

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _five_page_pdf() -> bytes:
    """A real 5-page PDF, generated with the same library the view uses."""
    from pypdf import PdfWriter

    writer = PdfWriter()
    for _ in range(5):
        writer.add_blank_page(width=595, height=842)
    buf = io.BytesIO()
    writer.write(buf)
    return buf.getvalue()


async def _seed_doc(
    hass: HomeAssistant, global_entry: MockConfigEntry, *, mime: str = "application/pdf"
) -> tuple[MockConfigEntry, str]:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Boiler",
        data=build_object_entry_data(
            object_data=build_object_data(name="Boiler"),
            tasks={TASK_ID_1: build_task_data(task_id=TASK_ID_1, interval_days=30)},
        ),
        source="user",
        unique_id="maintenance_supporter_excerpt",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, entry)
    doc_store = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    doc = await doc_store.async_add_file(
        object_id_for_entry(entry),
        content=_five_page_pdf() if mime == "application/pdf" else b"not a pdf",
        filename="manual.pdf" if mime == "application/pdf" else "notes.txt",
        mime=mime,
    )
    return entry, doc["id"]


async def test_excerpt_returns_requested_pages(hass: HomeAssistant, global_entry: MockConfigEntry, hass_client: Any) -> None:
    _, doc_id = await _seed_doc(hass, global_entry)
    client = await hass_client()

    resp = await client.get(f"/api/maintenance_supporter/document/{doc_id}/excerpt?start=2&count=3")
    assert resp.status == 200
    assert resp.content_type == "application/pdf"
    body = await resp.read()

    from pypdf import PdfReader

    assert len(PdfReader(io.BytesIO(body)).pages) == 3


async def test_excerpt_clamps_past_document_end(hass: HomeAssistant, global_entry: MockConfigEntry, hass_client: Any) -> None:
    _, doc_id = await _seed_doc(hass, global_entry)
    client = await hass_client()

    # start=4, count=10 on a 5-page doc → pages 4..5.
    resp = await client.get(f"/api/maintenance_supporter/document/{doc_id}/excerpt?start=4&count=10")
    assert resp.status == 200
    from pypdf import PdfReader

    assert len(PdfReader(io.BytesIO(await resp.read())).pages) == 2


async def test_excerpt_validation_errors(hass: HomeAssistant, global_entry: MockConfigEntry, hass_client: Any) -> None:
    _, doc_id = await _seed_doc(hass, global_entry)
    client = await hass_client()

    assert (await client.get("/api/maintenance_supporter/document/nope/excerpt")).status == 404
    assert (await client.get(f"/api/maintenance_supporter/document/{doc_id}/excerpt?start=abc")).status == 400
    assert (await client.get(f"/api/maintenance_supporter/document/{doc_id}/excerpt?start=0")).status == 400
    assert (await client.get(f"/api/maintenance_supporter/document/{doc_id}/excerpt?start=1&count=99")).status == 400
    # start beyond the last page
    assert (await client.get(f"/api/maintenance_supporter/document/{doc_id}/excerpt?start=9")).status == 400


async def test_excerpt_rejects_non_pdf(hass: HomeAssistant, global_entry: MockConfigEntry, hass_client: Any) -> None:
    _, doc_id = await _seed_doc(hass, global_entry, mime="text/plain")
    client = await hass_client()
    resp = await client.get(f"/api/maintenance_supporter/document/{doc_id}/excerpt")
    assert resp.status == 415
