"""Tests for the global document-storage sensor (sensor.DocumentStorageSensor)."""

from __future__ import annotations

import shutil
from collections.abc import Iterator
from pathlib import Path

import pytest
from homeassistant.components.sensor import SensorDeviceClass
from homeassistant.const import UnitOfInformation
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter import DOCUMENT_STORE_KEY
from custom_components.maintenance_supporter.const import DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.helpers.documents import DocumentStore
from custom_components.maintenance_supporter.sensor import DocumentStorageSensor

from .conftest import build_global_entry_data, setup_integration

_ENTITY = "sensor.maintenance_supporter_document_storage"


@pytest.fixture(autouse=True)
def _isolate_docs_dir(hass: HomeAssistant) -> Iterator[None]:
    """Blobs live on the shared test config dir — give each test a clean one."""
    docs = Path(hass.config.path("maintenance_supporter", "docs"))
    shutil.rmtree(docs, ignore_errors=True)
    yield
    shutil.rmtree(docs, ignore_errors=True)


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


async def test_sensor_metadata_and_value(hass: HomeAssistant) -> None:
    """State is the physical footprint; the breakdown rides along as attributes."""
    store = DocumentStore(hass)
    await store.async_load()
    await store.async_add_file("o1", content=b"1234567890", filename="a.pdf", mime="application/pdf", tags=["manual"])
    await store.async_add_file("o2", content=b"1234567890", filename="b.pdf", mime="application/pdf", tags=["manual"])  # dedup
    await store.async_add_file("o1", content=b"xyz", filename="c.pdf", mime="application/pdf", tags=["warranty"])
    await store.async_add_weblink("o1", url="https://x")

    sensor = DocumentStorageSensor(hass, store)
    assert sensor.unique_id == "maintenance_supporter_global_document_storage"
    assert sensor.device_class == SensorDeviceClass.DATA_SIZE
    assert sensor.native_unit_of_measurement == UnitOfInformation.BYTES
    assert sensor.native_value == 13  # 10 + 3 (the shared 10-byte blob counts once)

    attrs = sensor.extra_state_attributes
    assert attrs["logical_bytes"] == 23  # 10 + 10 + 3
    assert attrs["dedup_savings_bytes"] == 10
    assert attrs["file_count"] == 3
    assert attrs["link_count"] == 1
    assert attrs["document_count"] == 4
    assert attrs["by_category"] == {"manual": 20, "warranty": 3}


async def test_sensor_registered_and_updates_live(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """The sensor is registered on the global device and refreshes on changes."""
    await setup_integration(hass, global_entry)

    state = hass.states.get(_ENTITY)
    assert state is not None
    assert state.state == "0"
    assert state.attributes["device_class"] == SensorDeviceClass.DATA_SIZE
    assert state.attributes["unit_of_measurement"] == UnitOfInformation.BYTES

    # Mutating the shared store fires SIGNAL_DOCUMENTS_UPDATED → live refresh.
    store = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    await store.async_add_file("o1", content=b"1234567890", filename="a.pdf", mime="application/pdf", tags=["manual"])
    await hass.async_block_till_done()

    state = hass.states.get(_ENTITY)
    assert state is not None
    assert state.state == "10"
    assert state.attributes["file_count"] == 1
    assert state.attributes["by_category"] == {"manual": 10}
