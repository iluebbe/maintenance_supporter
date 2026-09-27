"""i18n audit 2026-09-27: text that reached every user in English.

* WS refusals carry a translation key (the panel renders it through Home
  Assistant's backend translations — frontend-src/helpers/backend-errors.ts);
* the default sidebar title follows the server language;
* the generated dashboard's English fallbacks equal en.json, and the history
  notes the backend writes are all known to the frontend table that
  translates them;
* region names exist in every language.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

from homeassistant.core import HomeAssistant

from custom_components.maintenance_supporter.const import COMPLETION_PROVENANCE_NOTES, DOMAIN
from custom_components.maintenance_supporter.helpers.global_options import default_panel_title
from custom_components.maintenance_supporter.helpers.region import load_region_name_translations, load_region_names
from custom_components.maintenance_supporter.websocket.dashboard import ws_get_settings
from custom_components.maintenance_supporter.websocket.objects import ws_update_object

from .conftest import call_ws_handler, make_global_entry, make_object_entry, make_ws_connection, setup_integration

COMPONENT = Path(__file__).resolve().parents[1] / "custom_components" / "maintenance_supporter"
FRONTEND = COMPONENT / "frontend-src"
LANGUAGES = {
    "en", "de", "nl", "fr", "it", "es", "pt", "pt-br", "ru", "uk", "pl", "cs", "sv", "zh", "da", "fi", "nb", "ja", "hi", "hu", "ko", "tr",
}  # fmt: skip
NATIVE = {"ru": r"[Ѐ-ӿ]", "uk": r"[Ѐ-ӿ]", "zh": r"[一-鿿]", "ja": r"[぀-ヿ一-鿿]", "hi": r"[ऀ-ॿ]", "ko": r"[가-힣]"}


async def test_a_taken_object_name_is_refused_with_a_translation_key(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    first = make_object_entry(hass, name="Pool Pump", uid="a")
    second = make_object_entry(hass, name="Heat Pump", uid="b")
    await setup_integration(hass, g, first, second)
    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_object,
        hass,
        conn,
        {"id": 1, "type": "maintenance_supporter/object/update", "entry_id": second.entry_id, "name": "Pool Pump"},
    )
    conn.send_result.assert_not_called()
    args, kwargs = conn.send_error.call_args
    assert args[1] == "invalid_input"
    assert kwargs["translation_domain"] == DOMAIN and kwargs["translation_key"] == "object_name_taken"


async def test_the_default_sidebar_title_follows_the_server_language(hass: HomeAssistant) -> None:
    hass.config.language = "de"
    assert default_panel_title(hass) == "Wartung"
    g = make_global_entry(hass)
    await setup_integration(hass, g)
    conn = make_ws_connection()
    await call_ws_handler(ws_get_settings, hass, conn, {"id": 1, "type": "maintenance_supporter/settings"})
    assert conn.send_result.call_args[0][1]["general"]["panel_title_default"] == "Wartung"


def test_dashboard_fallbacks_equal_en_json() -> None:
    """The strategy bundle carries its own English (it has no en.json); a
    changed en.json text must change there too."""
    src = (FRONTEND / "maintenance-dashboard-strategy.ts").read_text(encoding="utf-8")
    block = src.split("const STRINGS = {", 1)[1].split("} as const;", 1)[0]
    pairs = dict(re.findall(r'^\s+(\w+): ("(?:[^"\\]|\\.)*"),$', block, re.M))
    assert len(pairs) >= 25
    en = json.loads((FRONTEND / "locales" / "en.json").read_text(encoding="utf-8"))
    drift = {k: (json.loads(v), en.get(k)) for k, v in pairs.items() if json.loads(v) != en.get(k)}
    assert not drift, drift


def test_every_backend_history_note_is_translated_by_the_frontend() -> None:
    """helpers/history-note.ts matches the backend's English wording; a note
    reworded here without the table would show in English again."""
    table = (FRONTEND / "helpers" / "history-note.ts").read_text(encoding="utf-8")
    exact = set(re.findall(r'^\s+"([^"]+)": "hist_note_\w+",$', table, re.M))
    literals = set(COMPLETION_PROVENANCE_NOTES.values())
    for rel, pattern in (
        ("__init__.py", r'reason="(Skipped from [^"]+)"'),
        ("button.py", r'reason="(Skipped from [^"]+)"'),
        ("coordinator.py", r'notes="(Sensor trigger activated)"'),
        ("websocket/tasks_crud.py", r'"notes": "(Initial value set during task creation)"'),
    ):
        found = re.findall(pattern, (COMPONENT / rel).read_text(encoding="utf-8"))
        assert found, (rel, pattern)
        literals |= set(found)
    assert literals <= exact, sorted(literals - exact)
    # the notes with values: their English shape is matched by a pattern
    for fragment in (
        r"^Auto-completed: sensor recovered \(",
        r"^Reset to (",
        r"^Trigger entity replaced: (",
        r"^Sensor trigger removed \(entity was: (",
        r"removed from compound trigger; (",
    ):
        assert fragment in table, fragment
    for rel, needle in (
        ("coordinator.py", 'f"Auto-completed: sensor recovered ('),
        ("models/maintenance_task.py", 'f"Reset to {'),
        ("repairs.py", 'f"Trigger entity replaced: {'),
        ("repairs.py", 'f"Sensor trigger removed (entity was: {'),
        ("repairs.py", 'f"Entity {'),
    ):
        assert needle in (COMPONENT / rel).read_text(encoding="utf-8"), (rel, needle)


def test_every_region_has_a_name_in_every_language() -> None:
    names = load_region_names()
    translations = load_region_name_translations()
    assert set(translations) == set(names)
    bad = []
    for code, per_lang in translations.items():
        if set(per_lang) != LANGUAGES or not all(isinstance(v, str) and v.strip() for v in per_lang.values()):
            bad.append(f"{code}: {sorted(LANGUAGES ^ set(per_lang))}")
        for lang, script in NATIVE.items():
            if not re.search(script, per_lang.get(lang, "")):
                bad.append(f"{code} [{lang}] {per_lang.get(lang)!r}")
    assert not bad, bad
    # the map's own names mix languages; English reads English
    assert translations["AT-9"]["en"] == "Vienna" and translations["AT-9"]["de"] == "Wien"
    assert translations["BE-VLG"]["de"] == "Flandern"
