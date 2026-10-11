"""App links (#207): a documentation link or a document's web link may open
an app (obsidian://, onenote:, mailto:), not only a web page.

Every scheme passes except the blocked ones (helpers/url_safety). Pins: the
rule on every write path (WS object/task/document link, the sanitizers behind
the flows and imports), the message that names what is refused, and the
frontend twin of the blocked list.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_OBJECT, CONF_TASKS
from custom_components.maintenance_supporter.helpers.sanitize import cap_object_fields, cap_task_fields
from custom_components.maintenance_supporter.helpers.url_safety import (
    BLOCKED_LINK_SCHEMES,
    is_safe_link,
    link_scheme,
)
from custom_components.maintenance_supporter.websocket.documents import ws_documents_add_link
from custom_components.maintenance_supporter.websocket.objects import ws_create_object, ws_update_object
from custom_components.maintenance_supporter.websocket.tasks_crud import ws_create_task

from .conftest import (
    TASK_ID_1,
    build_task_data,
    call_ws_handler,
    make_global_entry,
    make_object_entry,
    make_ws_connection,
    setup_integration,
)

_COMPONENT = Path(__file__).resolve().parents[1] / "custom_components" / "maintenance_supporter"
OBSIDIAN = "obsidian://open?vault=Home&file=Boiler%20manual"


def test_the_frontend_blocks_the_same_schemes() -> None:
    """helpers/url.ts must refuse exactly what the server refuses — a scheme
    only one side blocks is either a hole or a link that saves but never opens."""
    source = (_COMPONENT / "frontend-src" / "helpers" / "url.ts").read_text(encoding="utf-8")
    block = re.search(r"BLOCKED_LINK_SCHEMES[^=]*=\s*new Set\(\[(.*?)\]\)", source, re.S)
    assert block, "BLOCKED_LINK_SCHEMES is gone from helpers/url.ts"
    assert set(re.findall(r'"([a-z0-9+.\-]+)"', block.group(1))) == set(BLOCKED_LINK_SCHEMES)


def test_link_scheme_and_is_safe_link() -> None:
    assert link_scheme(" Obsidian://x") == "obsidian"
    assert link_scheme("manual.pdf") is None
    assert is_safe_link(OBSIDIAN) and is_safe_link("https://x.test") and is_safe_link("mailto:a@b.test")
    assert not is_safe_link("manual.pdf")  # a document link must point somewhere
    assert not is_safe_link("javascript:alert(1)")
    assert not is_safe_link(None)


def test_the_sanitizers_keep_an_app_link_and_drop_a_blocked_one() -> None:
    """The flows and the imports store through these (bug audit 2026-09-26)."""
    assert cap_task_fields({"documentation_url": OBSIDIAN})["documentation_url"] == OBSIDIAN
    assert cap_object_fields({"name": "x", "documentation_url": OBSIDIAN})["documentation_url"] == OBSIDIAN
    assert cap_task_fields({"documentation_url": "javascript:alert(1)"})["documentation_url"] is None
    assert cap_object_fields({"name": "x", "documentation_url": "file:///etc/passwd"})["documentation_url"] is None


async def _objects(hass: HomeAssistant) -> tuple[MockConfigEntry, MockConfigEntry]:
    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data()}, uid="links207")
    await setup_integration(hass, g, obj)
    return g, obj


async def test_ws_object_and_task_take_an_app_link(hass: HomeAssistant) -> None:
    _g, obj = await _objects(hass)

    conn = make_ws_connection()
    await call_ws_handler(ws_create_object, hass, conn, {"id": 1, "type": "maintenance_supporter/object/create", "name": "Boiler", "documentation_url": OBSIDIAN})
    assert conn.send_error.call_count == 0
    created = hass.config_entries.async_get_entry(conn.send_result.call_args[0][1]["entry_id"])
    assert created is not None and created.data[CONF_OBJECT]["documentation_url"] == OBSIDIAN

    conn = make_ws_connection()
    await call_ws_handler(ws_update_object, hass, conn, {"id": 2, "type": "maintenance_supporter/object/update", "entry_id": obj.entry_id, "documentation_url": "onenote:https://d.docs.live.net/x/M.one"})
    assert conn.send_error.call_count == 0

    conn = make_ws_connection()
    await call_ws_handler(ws_create_task, hass, conn, {"id": 3, "type": "maintenance_supporter/task/create", "entry_id": obj.entry_id, "name": "Flush", "documentation_url": OBSIDIAN})
    assert conn.send_error.call_count == 0
    entry = hass.config_entries.async_get_entry(obj.entry_id)
    assert entry is not None
    assert OBSIDIAN in [t.get("documentation_url") for t in entry.data[CONF_TASKS].values()]


async def test_ws_refuses_a_blocked_link_and_says_what_is_refused(hass: HomeAssistant) -> None:
    _g, obj = await _objects(hass)
    conn = make_ws_connection()
    await call_ws_handler(ws_update_object, hass, conn, {"id": 1, "type": "maintenance_supporter/object/update", "entry_id": obj.entry_id, "documentation_url": "ms-msdt:/id PCWDiagnostic"})
    assert conn.send_error.call_args[0][1] == "invalid_url"
    strings = json.loads((_COMPONENT / "strings.json").read_text(encoding="utf-8"))
    message = strings["exceptions"]["unsafe_url"]["message"]
    assert "javascript:" in message and "http" not in message.replace("javascript", "")


async def test_a_document_web_link_may_open_an_app(hass: HomeAssistant) -> None:
    _g, obj = await _objects(hass)
    add = {"type": "maintenance_supporter/documents/add_link", "entry_id": obj.entry_id}

    conn = make_ws_connection()
    await call_ws_handler(ws_documents_add_link, hass, conn, {"id": 1, **add, "url": OBSIDIAN, "title": "Vault"})
    assert conn.send_error.call_count == 0
    assert conn.send_result.call_args[0][1]["url"] == OBSIDIAN

    for refused in ("manual.pdf", "javascript:alert(1)", "data:text/html,x"):
        conn = make_ws_connection()
        await call_ws_handler(ws_documents_add_link, hass, conn, {"id": 2, **add, "url": refused})
        assert conn.send_error.call_args[0][1] == "invalid_url", refused
