"""Tests for the document-storage repair issue + its fix flow."""

from __future__ import annotations

import shutil
from collections.abc import Iterator
from pathlib import Path

import pytest
from homeassistant import data_entry_flow
from homeassistant.core import HomeAssistant
from homeassistant.helpers import issue_registry as ir

from custom_components.maintenance_supporter import (
    DOCUMENT_STORE_KEY,
    _check_document_storage_issues,
)
from custom_components.maintenance_supporter.const import DOMAIN
from custom_components.maintenance_supporter.helpers.documents import DocumentStore
from custom_components.maintenance_supporter.repairs import (
    DocumentStorageRepairFlow,
    async_create_fix_flow,
)

_ISSUE_ID = "document_storage_issues"


@pytest.fixture(autouse=True)
def _isolate_docs_dir(hass: HomeAssistant) -> Iterator[None]:
    docs = Path(hass.config.path("maintenance_supporter", "docs"))
    shutil.rmtree(docs, ignore_errors=True)
    yield
    shutil.rmtree(docs, ignore_errors=True)


async def _store_in_hass(hass: HomeAssistant) -> DocumentStore:
    store = DocumentStore(hass)
    await store.async_load()
    hass.data.setdefault(DOMAIN, {})[DOCUMENT_STORE_KEY] = store
    return store


def _make_orphan(store: DocumentStore, name: str) -> str:
    store._blobs_dir.mkdir(parents=True, exist_ok=True)
    store.blob_path(name).write_bytes(b"stray")
    return name


async def test_scan_noop_without_store(hass: HomeAssistant) -> None:
    """No store in hass.data → the scan returns quietly, no issue raised."""
    await _check_document_storage_issues(hass)
    assert ir.async_get(hass).async_get_issue(DOMAIN, _ISSUE_ID) is None


async def test_scan_creates_then_clears_issue(hass: HomeAssistant) -> None:
    store = await _store_in_hass(hass)
    reg = ir.async_get(hass)

    await _check_document_storage_issues(hass)
    assert reg.async_get_issue(DOMAIN, _ISSUE_ID) is None  # clean → no issue

    orphan = _make_orphan(store, "e" * 64)
    await _check_document_storage_issues(hass)
    issue = reg.async_get_issue(DOMAIN, _ISSUE_ID)
    assert issue is not None
    assert issue.is_fixable is True

    store.blob_path(orphan).unlink()  # reconcile → issue clears on next scan
    await _check_document_storage_issues(hass)
    assert reg.async_get_issue(DOMAIN, _ISSUE_ID) is None


async def test_create_fix_flow_dispatch(hass: HomeAssistant) -> None:
    flow = await async_create_fix_flow(hass, _ISSUE_ID, None)
    assert isinstance(flow, DocumentStorageRepairFlow)


async def test_repair_flow_shows_form_then_cleans_up(hass: HomeAssistant) -> None:
    store = await _store_in_hass(hass)
    orphan = _make_orphan(store, "f" * 64)
    assert orphan in (await store.async_find_issues())["orphan_blobs"]

    flow = DocumentStorageRepairFlow()
    flow.hass = hass

    result = await flow.async_step_init(user_input=None)
    assert result["type"] == data_entry_flow.FlowResultType.FORM
    assert result["step_id"] == "init"

    result = await flow.async_step_init(user_input={})
    assert result["type"] == data_entry_flow.FlowResultType.CREATE_ENTRY
    assert not store.blob_path(orphan).exists()
    assert (await store.async_find_issues())["orphan_blobs"] == []
