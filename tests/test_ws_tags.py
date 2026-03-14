"""Tests for WebSocket tag listing handler (websocket/tags.py)."""

from __future__ import annotations

from unittest.mock import MagicMock

import pytest

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.websocket.tags import ws_list_tags

from .conftest import (
    call_ws_handler,
    build_global_entry_data,
    setup_integration,
)


def _mock_connection() -> MagicMock:
    conn = MagicMock()
    conn.send_result = MagicMock()
    conn.send_error = MagicMock()
    conn.user = MagicMock(is_admin=True)
    return conn


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


# ─── List Tags ─────────────────────────────────────────────────────────


async def test_ws_list_tags_with_items(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test listing tags when tag integration has registered tags."""
    await setup_integration(hass, global_entry)

    # Simulate tag registry with dict-style items
    hass.data["tag"] = MagicMock()
    hass.data["tag"].async_items.return_value = [
        {"id": "tag-001", "name": "Kitchen NFC"},
        {"id": "tag-002", "name": "Garage NFC"},
    ]

    conn = _mock_connection()
    await call_ws_handler(ws_list_tags, hass, conn, {
        "id": 1, "type": "maintenance_supporter/tags/list",
    })

    result = conn.send_result.call_args[0][1]
    assert len(result["tags"]) == 2
    assert result["tags"][0] == {"id": "tag-001", "name": "Kitchen NFC"}
    assert result["tags"][1] == {"id": "tag-002", "name": "Garage NFC"}


async def test_ws_list_tags_with_object_items(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test listing tags when items are objects with attributes (not dicts)."""
    await setup_integration(hass, global_entry)

    # Simulate tag registry with object-style items (TagEntry)
    tag1 = MagicMock()
    tag1.id = "tag-abc"
    tag1.name = "Bathroom Tag"
    # Make isinstance(tag1, dict) return False
    tag1.__class__ = type("TagEntry", (), {})

    tag2 = MagicMock()
    tag2.id = "tag-def"
    tag2.name = ""  # Empty name should fallback to id
    tag2.__class__ = type("TagEntry", (), {})

    hass.data["tag"] = MagicMock()
    hass.data["tag"].async_items.return_value = [tag1, tag2]

    conn = _mock_connection()
    await call_ws_handler(ws_list_tags, hass, conn, {
        "id": 1, "type": "maintenance_supporter/tags/list",
    })

    result = conn.send_result.call_args[0][1]
    assert len(result["tags"]) == 2
    assert result["tags"][0] == {"id": "tag-abc", "name": "Bathroom Tag"}
    # Empty name falls back to id
    assert result["tags"][1] == {"id": "tag-def", "name": "tag-def"}


async def test_ws_list_tags_no_tag_integration(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test listing tags when tag integration is not loaded."""
    await setup_integration(hass, global_entry)

    # Ensure no "tag" key in hass.data
    hass.data.pop("tag", None)

    conn = _mock_connection()
    await call_ws_handler(ws_list_tags, hass, conn, {
        "id": 1, "type": "maintenance_supporter/tags/list",
    })

    result = conn.send_result.call_args[0][1]
    assert result["tags"] == []


async def test_ws_list_tags_empty_registry(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test listing tags when registry exists but is empty."""
    await setup_integration(hass, global_entry)

    hass.data["tag"] = MagicMock()
    hass.data["tag"].async_items.return_value = []

    conn = _mock_connection()
    await call_ws_handler(ws_list_tags, hass, conn, {
        "id": 1, "type": "maintenance_supporter/tags/list",
    })

    result = conn.send_result.call_args[0][1]
    assert result["tags"] == []


async def test_ws_list_tags_exception_handling(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test that exceptions in tag registry are handled gracefully."""
    await setup_integration(hass, global_entry)

    hass.data["tag"] = MagicMock()
    hass.data["tag"].async_items.side_effect = RuntimeError("Tag store broken")

    conn = _mock_connection()
    await call_ws_handler(ws_list_tags, hass, conn, {
        "id": 1, "type": "maintenance_supporter/tags/list",
    })

    # Should return empty list, not error
    result = conn.send_result.call_args[0][1]
    assert result["tags"] == []
    conn.send_error.assert_not_called()


async def test_ws_list_tags_name_fallback_to_id(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test that tags with empty name use id as display name."""
    await setup_integration(hass, global_entry)

    hass.data["tag"] = MagicMock()
    hass.data["tag"].async_items.return_value = [
        {"id": "tag-no-name", "name": ""},
        {"id": "tag-with-name", "name": "My Tag"},
    ]

    conn = _mock_connection()
    await call_ws_handler(ws_list_tags, hass, conn, {
        "id": 1, "type": "maintenance_supporter/tags/list",
    })

    result = conn.send_result.call_args[0][1]
    assert result["tags"][0]["name"] == "tag-no-name"  # Fallback to id
    assert result["tags"][1]["name"] == "My Tag"
