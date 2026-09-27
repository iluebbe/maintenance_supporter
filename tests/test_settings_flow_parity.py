"""2.94: the options flow edits every global setting the panel does, the
config flow's template step speaks the user's language and knows the home,
and templates the home already uses are marked "already set up".

The parity tripwire at the top is the point of the round: before 2.94 18
settings could only be changed in the panel and no test noticed.
"""

from __future__ import annotations

from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType

from custom_components.maintenance_supporter.const import (
    CONF_ADVANCED_BUDGET,
    CONF_ADVANCED_COMPLETION_ACTIONS,
    CONF_ADVANCED_GROUPS,
    CONF_ARCHIVE_ONEOFF_DAYS,
    CONF_BATTERY_LIFETIME_MONTHS,
    CONF_DEFAULT_CONSUMABLE_THRESHOLD,
    CONF_DELETE_ARCHIVED_ONEOFF_DAYS,
    CONF_DISABLED_TEMPLATE_IDS,
    CONF_HOME_TYPE,
    CONF_INSTALL_ASSIST_SENTENCES,
    CONF_MEMBER_DISPLAY,
    CONF_NOTIFICATIONS_ENABLED,
    CONF_NOTIFY_SCOPE_VIEW_ID,
    CONF_OBJECT,
    CONF_OBJECTS_TABLE_COLUMNS,
    CONF_REF_NUMBERS_IN_LISTS,
    CONF_REMINDER_LEAD_DAYS,
    CONF_ROW_ACTION_NOTICE,
    CONF_ROW_ACTION_STYLE,
    CONF_SAVED_FILTER_VIEWS,
    CONF_TASKS,
    CONF_WARRANTY_REMINDER_DAYS,
    CONF_WARRANTY_REMINDER_ENABLED,
    CONF_WEEKLY_DIGEST_ENABLED,
    DOMAIN,
)
from custom_components.maintenance_supporter.export import build_export_data
from custom_components.maintenance_supporter.helpers.settings_registry import ALLOWED_SETTING_KEYS
from custom_components.maintenance_supporter.helpers.template_usage import (
    match_template,
    object_template_id,
    templates_in_use,
)
from custom_components.maintenance_supporter.templates import get_template_by_id
from custom_components.maintenance_supporter.templates_i18n import localize_template_text
from custom_components.maintenance_supporter.websocket.io import ws_get_templates, ws_import_json
from custom_components.maintenance_supporter.websocket.objects import ws_create_from_template

from .conftest import (
    assert_ws_success,
    build_object_data,
    call_ws_handler,
    make_global_entry,
    make_object_entry,
    make_ws_connection,
    setup_integration,
)

# ─── the parity tripwire ─────────────────────────────────────────────────

# Settings the options flow edits through a step of its own whose fields are
# not the setting key itself.
_EDITED_BY_STEP = {
    CONF_MEMBER_DISPLAY: "member_avatar",  # initials + colour per member
    CONF_BATTERY_LIFETIME_MONTHS: "battery_lifetimes",  # one field per battery type
}
# Not a preference: the one-time "new look" banner flag (#145), cleared by the
# panel banner itself.
_NOT_A_SETTING = {CONF_ROW_ACTION_NOTICE}


async def _open_step(hass: HomeAssistant, entry_id: str, step: str) -> dict[str, Any]:
    result = await hass.config_entries.options.async_init(entry_id)
    return await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": step})


async def test_every_global_setting_is_editable_in_the_options_flow(hass: HomeAssistant) -> None:
    """A setting the panel can change must be changeable in HA's own settings
    UI too — adding one to the registry without a flow field fails here."""
    g = make_global_entry(hass)
    await setup_integration(hass, g)
    # unlock every menu entry (setup rewrites the advanced flags, so after it)
    unlock = {CONF_NOTIFICATIONS_ENABLED: True, CONF_ADVANCED_BUDGET: True, CONF_ADVANCED_GROUPS: True}
    hass.config_entries.async_update_entry(g, options={**g.options, **unlock})
    menu = await hass.config_entries.options.async_init(g.entry_id)
    in_flow: set[str] = set()
    steps_with_forms: set[str] = set()
    for step in menu["menu_options"]:
        if step in ("done", "test_notification"):
            continue
        result = await _open_step(hass, g.entry_id, step)
        if result["type"] == FlowResultType.FORM:
            steps_with_forms.add(result["step_id"])
            in_flow |= {str(getattr(m, "schema", m)) for m in result["data_schema"].schema}
    missing = set(ALLOWED_SETTING_KEYS) - in_flow - set(_EDITED_BY_STEP) - _NOT_A_SETTING
    assert not missing, f"panel-only settings — add them to the options flow: {sorted(missing)}"
    assert not (set(_EDITED_BY_STEP) | _NOT_A_SETTING) & in_flow, "allowlist is stale"
    # the dedicated steps exist (member_avatar sits behind member_avatars)
    assert {"member_avatars", "battery_lifetimes"} <= steps_with_forms


# ─── the new fields save through the panel's sanitiser ───────────────────


async def test_home_profile_step_saves_the_home_type_and_hidden_templates(hass: HomeAssistant) -> None:
    hass.config.latitude, hass.config.longitude, hass.config.country = 48.14, 11.58, "DE"
    g = make_global_entry(hass)
    await setup_integration(hass, g)
    result = await _open_step(hass, g.entry_id, "home_profile")
    assert result["step_id"] == "home_profile"
    placeholders = result["description_placeholders"]
    assert placeholders["country"] == "DE" and placeholders["climate"] == "Cfb"
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {CONF_HOME_TYPE: "house", CONF_DISABLED_TEMPLATE_IDS: ["pool_pump", "garden_lawn"]}
    )
    assert result["type"] == FlowResultType.MENU
    assert g.options[CONF_HOME_TYPE] == "house"
    assert g.options[CONF_DISABLED_TEMPLATE_IDS] == ["pool_pump", "garden_lawn"]
    # the frontend sends an emptied multi-select as [] — that clears the list
    result = await _open_step(hass, g.entry_id, "home_profile")
    await hass.config_entries.options.async_configure(result["flow_id"], {CONF_HOME_TYPE: "auto", CONF_DISABLED_TEMPLATE_IDS: []})
    assert g.options[CONF_DISABLED_TEMPLATE_IDS] == []


async def test_general_step_carries_the_panel_rows(hass: HomeAssistant) -> None:
    g = make_global_entry(hass, options={CONF_OBJECTS_TABLE_COLUMNS: ["name", "model", "manufacturer"]})
    await setup_integration(hass, g)
    result = await _open_step(hass, g.entry_id, "general_settings")
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            CONF_DEFAULT_CONSUMABLE_THRESHOLD: 15.0,
            CONF_ROW_ACTION_STYLE: "icons",
            CONF_REF_NUMBERS_IN_LISTS: True,
            CONF_INSTALL_ASSIST_SENTENCES: False,
            # checkbox order; "name" unticked
            CONF_OBJECTS_TABLE_COLUMNS: ["manufacturer", "model", "notes"],
        },
    )
    assert result["type"] == FlowResultType.MENU
    assert g.options[CONF_DEFAULT_CONSUMABLE_THRESHOLD] == 15 and isinstance(g.options[CONF_DEFAULT_CONSUMABLE_THRESHOLD], int)
    assert g.options[CONF_ROW_ACTION_STYLE] == "icons"
    assert g.options[CONF_REF_NUMBERS_IN_LISTS] is True
    # the panel's column order is kept, new ones appended, name always there
    assert g.options[CONF_OBJECTS_TABLE_COLUMNS] == ["name", "model", "manufacturer", "notes"]


async def test_advanced_features_carry_completion_actions(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    await setup_integration(hass, g)
    result = await _open_step(hass, g.entry_id, "advanced_features")
    await hass.config_entries.options.async_configure(result["flow_id"], {CONF_ADVANCED_COMPLETION_ACTIONS: True})
    assert g.options[CONF_ADVANCED_COMPLETION_ACTIONS] is True


async def test_notification_step_parses_leads_and_scope(hass: HomeAssistant) -> None:
    views = [{"id": "v_pool", "name": "Pool", "filters": {}}]
    g = make_global_entry(hass)
    await setup_integration(hass, g)
    hass.config_entries.async_update_entry(g, options={**g.options, CONF_NOTIFICATIONS_ENABLED: True, CONF_SAVED_FILTER_VIEWS: views})
    result = await _open_step(hass, g.entry_id, "notification_settings")
    scope_field = next(m for m in result["data_schema"].schema if str(m) == CONF_NOTIFY_SCOPE_VIEW_ID)
    assert scope_field.description == {"suggested_value": "__all__"}
    bad = await hass.config_entries.options.async_configure(result["flow_id"], {CONF_REMINDER_LEAD_DAYS: "14, soon"})
    assert bad["type"] == FlowResultType.FORM and bad["errors"] == {CONF_REMINDER_LEAD_DAYS: "invalid_reminder_lead_days"}
    ok = await hass.config_entries.options.async_configure(
        bad["flow_id"],
        {
            CONF_REMINDER_LEAD_DAYS: "3, 14, 0, 14",
            CONF_NOTIFY_SCOPE_VIEW_ID: "v_pool",
            CONF_WEEKLY_DIGEST_ENABLED: True,
            CONF_WARRANTY_REMINDER_ENABLED: True,
            CONF_WARRANTY_REMINDER_DAYS: 60.0,
        },
    )
    assert ok["type"] == FlowResultType.MENU
    # the panel's sanitiser: deduped, furthest lead first
    assert g.options[CONF_REMINDER_LEAD_DAYS] == [14, 3, 0]
    assert g.options[CONF_NOTIFY_SCOPE_VIEW_ID] == "v_pool"
    assert g.options[CONF_WEEKLY_DIGEST_ENABLED] is True and g.options[CONF_WARRANTY_REMINDER_DAYS] == 60
    # "every task" and a cleared lead list
    result = await _open_step(hass, g.entry_id, "notification_settings")
    await hass.config_entries.options.async_configure(result["flow_id"], {CONF_NOTIFY_SCOPE_VIEW_ID: "__all__"})
    assert g.options[CONF_NOTIFY_SCOPE_VIEW_ID] == "" and g.options[CONF_REMINDER_LEAD_DAYS] == []


async def test_archive_step(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    await setup_integration(hass, g)
    result = await _open_step(hass, g.entry_id, "archive_settings")
    await hass.config_entries.options.async_configure(result["flow_id"], {CONF_ARCHIVE_ONEOFF_DAYS: 30.0, CONF_DELETE_ARCHIVED_ONEOFF_DAYS: 365.0})
    assert g.options[CONF_ARCHIVE_ONEOFF_DAYS] == 30 and g.options[CONF_DELETE_ARCHIVED_ONEOFF_DAYS] == 365


async def test_member_avatar_is_set_and_reset(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    await setup_integration(hass, g)
    user = await hass.auth.async_create_user("Anna Beispiel")
    result = await _open_step(hass, g.entry_id, "member_avatars")
    assert result["step_id"] == "member_avatars"
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"member": user.id})
    assert result["step_id"] == "member_avatar" and result["description_placeholders"]["member"] == "Anna Beispiel"
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"initials": " XY ", "color": "blue"})
    assert result["type"] == FlowResultType.MENU
    assert g.options[CONF_MEMBER_DISPLAY][user.id] == {"initials": "XY", "color": "#1565c0"}
    # blank + automatic = the default again
    result = await _open_step(hass, g.entry_id, "member_avatars")
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"member": user.id})
    await hass.config_entries.options.async_configure(result["flow_id"], {"color": "auto"})
    assert user.id not in g.options[CONF_MEMBER_DISPLAY]


async def test_battery_lifetimes_one_field_per_type(hass: HomeAssistant) -> None:
    g = make_global_entry(hass, options={CONF_BATTERY_LIFETIME_MONTHS: {"CR2032": 40}})
    await setup_integration(hass, g)
    result = await _open_step(hass, g.entry_id, "battery_lifetimes")
    fields = {str(m): m for m in result["data_schema"].schema}
    assert {"AA", "CR2032"} <= set(fields)
    assert fields["CR2032"].description == {"suggested_value": 40}
    assert "AA " in result["description_placeholders"]["defaults"]
    await hass.config_entries.options.async_configure(result["flow_id"], {"AA": 30.0})
    # CR2032 left empty → its override is gone; AA stored as whole months
    assert g.options[CONF_BATTERY_LIFETIME_MONTHS] == {"AA": 30}


# ─── "already set up" ────────────────────────────────────────────────────


def test_match_by_name_in_any_language_and_by_tasks() -> None:
    assert match_template("Wärmepumpe", []) == "home_heat_pump"
    assert match_template("Wärmepumpe 2", []) == "home_heat_pump"  # the gallery's auto-number
    car = get_template_by_id("vehicle_car")
    assert car is not None
    german = [localize_template_text(t.name, "de") for t in car.tasks[:3]]
    assert match_template("Mein Golf", german) == "vehicle_car"
    # one shared task name proves nothing; two tasks of a big template neither
    assert match_template("Irgendwas", ["Replace Filter", "Dust"]) is None
    assert match_template("Irgendwas", [t.name for t in car.tasks[:2]]) is None
    assert match_template("", []) is None


def test_stored_template_id_wins_and_unknown_ids_fall_back() -> None:
    assert object_template_id({"template_id": "pool_pump", "name": "Wärmepumpe"}, {}) == "pool_pump"
    assert object_template_id({"template_id": "gone", "name": "Wärmepumpe"}, {}) == "home_heat_pump"


async def test_templates_in_use_skips_archived_objects(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    make_object_entry(hass, name="Garage", uid="a", object_data={**build_object_data(name="Garage", object_id="o1"), "template_id": "home_garage_door"})
    archived = {**build_object_data(name="Pool Pump", object_id="o2"), "archived_at": "2026-01-01T00:00:00+00:00"}
    make_object_entry(hass, name="Pool Pump", uid="b", object_data=archived)
    await setup_integration(hass, g)
    assert templates_in_use(hass) == {"home_garage_door"}


async def test_gallery_marks_set_up_and_stops_recommending_it(hass: HomeAssistant) -> None:
    g = make_global_entry(hass, options={CONF_HOME_TYPE: "apartment"})
    kitchen = make_object_entry(hass, name="Küche", uid="k", object_data={**build_object_data(name="Küche", object_id="ok"), "template_id": "household_kitchen"})
    await setup_integration(hass, g, kitchen)
    conn = make_ws_connection()
    await call_ws_handler(ws_get_templates, hass, conn, {"id": 1, "type": "maintenance_supporter/templates"})
    by_id = {t["id"]: t for t in assert_ws_success(conn)["templates"]}
    assert by_id["household_kitchen"]["set_up"] is True
    assert by_id["household_kitchen"]["recommended"] is False
    assert by_id["household_kitchen"]["reasons"] == ["starter"]  # still says why it fits
    assert by_id["garden_lawn"]["set_up"] is False


async def test_template_id_is_stored_exported_and_imported(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    await setup_integration(hass, g)
    conn = make_ws_connection()
    await call_ws_handler(
        ws_create_from_template, hass, conn, {"id": 1, "type": "maintenance_supporter/object/from_template", "template_id": "garden_lawn"}
    )
    entry = hass.config_entries.async_get_entry(assert_ws_success(conn)["entry_id"])
    assert entry is not None
    await hass.async_block_till_done()
    assert entry.data[CONF_OBJECT]["template_id"] == "garden_lawn"
    exported = next(o for o in build_export_data(hass)["objects"] if o["object"]["name"] == entry.data[CONF_OBJECT]["name"])
    assert exported["object"]["template_id"] == "garden_lawn"
    # import: a known id is kept, an unknown one dropped
    import json

    payload = {
        "objects": [
            {**exported, "object": {**exported["object"], "name": "Lawn copy"}},
            {**exported, "object": {**exported["object"], "name": "Lawn junk", "template_id": "no_such"}},
        ]
    }
    conn = make_ws_connection()
    await call_ws_handler(ws_import_json, hass, conn, {"id": 2, "type": "maintenance_supporter/import", "json_content": json.dumps(payload)})
    assert_ws_success(conn)
    await hass.async_block_till_done()
    by_name = {e.data[CONF_OBJECT]["name"]: e.data[CONF_OBJECT] for e in hass.config_entries.async_entries(DOMAIN) if CONF_OBJECT in e.data}
    assert by_name["Lawn copy"]["template_id"] == "garden_lawn"
    assert "template_id" not in by_name["Lawn junk"]


# ─── config flow: the template step ──────────────────────────────────────


async def _to_template_select(hass: HomeAssistant, category: str) -> dict[str, Any]:
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": "user"})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"next_step_id": "create_from_template"})
    assert result["step_id"] == "create_from_template"
    categories = {o["value"]: o["label"] for o in result["data_schema"].schema["template_category"].config["options"]}
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"template_category": category})
    assert result["step_id"] == "template_select"
    result["_categories"] = categories
    return result


def _labels(result: dict[str, Any]) -> list[tuple[str, str]]:
    return [(o["value"], o["label"]) for o in result["data_schema"].schema["template_id"].config["options"]]


async def test_config_flow_marks_recommended_and_set_up_templates(hass: HomeAssistant) -> None:
    g = make_global_entry(hass, options={CONF_HOME_TYPE: "apartment"})
    kitchen = make_object_entry(hass, name="Kitchen", uid="k", object_data={**build_object_data(name="Kitchen", object_id="ok"), "template_id": "household_kitchen"})
    await setup_integration(hass, g, kitchen)
    result = await _to_template_select(hass, "household")
    labels = dict(_labels(result))
    assert labels["household_kitchen"].endswith("· ✓ already set up") and "★" not in labels["household_kitchen"]
    starred = [v for v, lab in _labels(result) if lab.startswith("★ ")]
    assert starred, "an apartment has recommended household templates"
    order = [v for v, _ in _labels(result)]
    assert order[: len(starred)] == starred, "recommended first"
    assert "★" in result["_categories"]["household"]
    # the pool is untypical for an apartment: last in its category
    pool = await _to_template_select(hass, "pool")
    assert [v for v, _ in _labels(pool)][-1] in {"pool_pump", "pool_water", "pool_hot_tub"}


async def test_config_flow_template_summary_is_localized_and_stores_the_id(hass: HomeAssistant) -> None:
    hass.config.language = "de"
    g = make_global_entry(hass)
    await setup_integration(hass, g)
    result = await _to_template_select(hass, "garden")
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"template_id": "garden_lawn"})
    assert result["step_id"] == "template_customize"
    ph = result["description_placeholders"]
    lawn = get_template_by_id("garden_lawn")
    assert lawn is not None
    assert ph["template_name"] == localize_template_text(lawn.name, "de") != lawn.name
    assert localize_template_text("Mowing", "de") in ph["task_list"] and "Mowing" not in ph["task_list"]
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"name": "Rasen vorne"})
    assert result["type"] == FlowResultType.CREATE_ENTRY
    assert result["data"][CONF_OBJECT]["template_id"] == "garden_lawn"
    assert len(result["data"][CONF_TASKS]) == int(ph["task_count"])


@pytest.mark.parametrize("lang", ["de", "en", "zh", "pt-br"])
def test_config_flow_label_table_has_the_language(lang: str) -> None:
    from custom_components.maintenance_supporter.config_flow import _TEMPLATE_STRINGS

    assert _TEMPLATE_STRINGS[lang]["set_up"]
