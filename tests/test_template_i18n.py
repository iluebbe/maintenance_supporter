"""Template catalog localization (v2.21.1) + the EV template.

Template and task names (and notes) are localized through one flat table
keyed by the English source string — in the pickers AND on the objects/tasks
actually created from a template.
"""

from __future__ import annotations

from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.templates import (
    TEMPLATES,
    get_template_by_id,
    localize_template_text,
)
from custom_components.maintenance_supporter.templates_i18n import _T
from custom_components.maintenance_supporter.websocket.io import ws_get_templates
from custom_components.maintenance_supporter.websocket.objects import (
    ws_create_from_template,
)

from .conftest import make_ws_connection as _conn, build_global_entry_data, call_ws_handler, setup_integration

_LANGS = ("de", "es", "fr", "it", "nl", "pt", "ru", "uk", "pl", "cs", "sv", "da", "nb", "fi", "ja", "hi", "zh")


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




def test_every_catalog_string_is_translated_into_all_languages() -> None:
    """Tripwire: adding a template/task without translations fails here."""
    missing: list[str] = []
    for t in TEMPLATES:
        for text in [t.name, *[tt.name for tt in t.tasks], *[tt.notes for tt in t.tasks if tt.notes]]:
            entry = _T.get(text)
            if entry is None:
                missing.append(f"{text!r}: no table entry")
                continue
            gaps = [lang for lang in _LANGS if not entry.get(lang)]
            if gaps:
                missing.append(f"{text!r}: missing {gaps}")
    assert not missing, "untranslated template strings:\n" + "\n".join(missing)


def test_localize_falls_back_to_english() -> None:
    assert localize_template_text("Oil Change", "de") == "Ölwechsel"
    assert localize_template_text("Oil Change", "en") == "Oil Change"
    assert localize_template_text("Oil Change", "xx") == "Oil Change"
    assert localize_template_text("Not In Table", "de") == "Not In Table"
    assert localize_template_text(None, "de") is None


def test_ev_template_has_no_combustion_tasks() -> None:
    ev = get_template_by_id("vehicle_ev")
    assert ev is not None and ev.category == "vehicle"
    names = [tt.name for tt in ev.tasks]
    assert "Oil Change" not in names and "Spark Plug" not in names
    assert "12V Battery Check" in names


async def test_templates_ws_localizes_names(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    conn = _conn()
    await call_ws_handler(
        ws_get_templates,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/templates",
            "language": "de",
        },
    )
    templates = conn.send_result.call_args[0][1]["templates"]
    by_id = {t["id"]: t for t in templates}
    assert by_id["vehicle_car"]["name"] == "Auto"
    assert by_id["vehicle_ev"]["name"] == "Elektroauto"
    task_names = [t["name"] for t in by_id["vehicle_car"]["tasks"]]
    assert "Ölwechsel" in task_names


async def test_from_template_creates_localized_tasks(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    conn = _conn()
    await call_ws_handler(
        ws_create_from_template,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/object/from_template",
            "template_id": "vehicle_ev",
            "language": "de",
        },
    )
    await hass.async_block_till_done()
    entry_id = conn.send_result.call_args[0][1]["entry_id"]
    entry = hass.config_entries.async_get_entry(entry_id)
    assert entry.data["object"]["name"] == "Elektroauto"
    names = [t["name"] for t in entry.data[CONF_TASKS].values()]
    assert "Innenraumfilter" in names and "Bremsenservice" in names
    notes = [t.get("notes") for t in entry.data[CONF_TASKS].values() if t.get("notes")]
    assert any("Rekuperation" in n for n in notes)
