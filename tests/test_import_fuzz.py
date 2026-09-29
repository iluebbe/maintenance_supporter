"""A backup file is untrusted input: no value in it may break the integration.

The bug audit of 2026-09-29 found an import that took a list where a user id
belongs: the object was created, the import aborted halfway, and from then on
the integration's main entry failed to start — panel and summary gone until
someone edited the storage by hand. Every earlier import test fed files the
export itself had written, so a value of the wrong TYPE was never tried.

This test takes the real export of the full move seed (which gives every
exported field a value — tripwired in test_migration_roundtrip) and, for every
field at every level (object, task, history entry, part, document, the move
hints and the settings), imports a copy where exactly that field holds a list,
a mapping, a number or junk text. A field added later is fuzzed without
anyone remembering to. What must hold for each:

- the import answers (no exception escapes the handler),
- the object still imports — a bad value is dropped, not the whole object,
- afterwards the main entry and every imported object start cleanly, and
  nothing logs an error (an entity that fails to be added is an error, not a
  started object).
"""

from __future__ import annotations

import copy
import json
import logging
from typing import Any

import pytest
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.websocket.io import ws_import_json

from .conftest import call_ws_handler, make_ws_connection
from .test_migration_roundtrip import _export_all, _seed, global_entry  # global_entry: the fixture

JUNK: dict[str, Any] = {
    "list": ["x", ["y"]],
    "mapping": {"x": [1]},
    "number": 7,
    "text": "\u0000 not a value",
}
# A name is what an object or task is matched and reported by; an empty or
# junk name has its own, tested rejection path.
KEEP = {"name"}


def _richest(items: list[dict[str, Any]]) -> dict[str, Any]:
    return max(items, key=lambda i: len(json.dumps(i)))


def _variants(export: dict[str, Any], junk: Any, kind: str) -> list[dict[str, Any]]:
    """One object per fuzzed field: the richest exported object, trimmed to
    its richest task, with exactly that field replaced by ``junk``."""
    objects = [o for o in export["objects"] if not o["object"].get("battery_fleet")]
    base = copy.deepcopy(_richest(objects))
    base["tasks"] = [copy.deepcopy(_richest(base.get("tasks") or [{}]))]
    task = base["tasks"][0]
    out: list[dict[str, Any]] = []

    def variant(label: str, mutate: Any) -> None:
        obj = copy.deepcopy(base)
        mutate(obj)
        obj["object"]["name"] = f"{base['object']['name']} [{kind} {label}]"
        out.append(obj)

    for key in sorted(set(base) - {"object"}):
        variant(f"entry.{key}", lambda o, k=key: o.__setitem__(k, junk))
    for key in sorted(set(base["object"]) - KEEP):
        variant(f"object.{key}", lambda o, k=key: o["object"].__setitem__(k, junk))
    for key in sorted(set(task) - KEEP):
        variant(f"task.{key}", lambda o, k=key: o["tasks"][0].__setitem__(k, junk))
    history_keys = sorted({k for h in task.get("history") or [] for k in h})
    for key in history_keys:
        variant(f"history.{key}", lambda o, k=key: [h.__setitem__(k, junk) for h in o["tasks"][0]["history"]])
    variant("history[0]", lambda o: o["tasks"][0].__setitem__("history", [junk]))
    for key in sorted({k for p in base.get("parts") or [] for k in p} - KEEP):
        variant(f"part.{key}", lambda o, k=key: [p.__setitem__(k, junk) for p in o["parts"]])
    for key in sorted({k for d in base.get("documents") or [] for k in d}):
        variant(f"document.{key}", lambda o, k=key: [d.__setitem__(k, junk) for d in o["documents"]])
    return out


async def _import(hass: HomeAssistant, payload: dict[str, Any]) -> dict[str, Any]:
    conn = make_ws_connection()
    await call_ws_handler(ws_import_json, hass, conn, {"id": 5, "type": "x", "json_content": json.dumps(payload)})
    await hass.async_block_till_done()
    assert not conn.send_error.called, conn.send_error.call_args
    return conn.send_result.call_args[0][1]


async def _problems_after(hass: HomeAssistant, global_entry: MockConfigEntry, caplog: pytest.LogCaptureFixture) -> list[str]:
    """Everything that shows the import broke something, named by the object
    (and so the field) it came from."""
    problems: list[str] = []
    if not await hass.config_entries.async_reload(global_entry.entry_id):
        problems.append("the main entry no longer starts")
    await hass.async_block_till_done()
    objects = [e for e in hass.config_entries.async_entries(DOMAIN) if e.unique_id != GLOBAL_UNIQUE_ID]
    problems += [f"does not start: {e.title}" for e in objects if e.state is not ConfigEntryState.LOADED]
    task_owner = {tid: e.title for e in objects for tid in (e.data.get("tasks") or {})}
    for record in caplog.records:
        message = record.getMessage()
        if record.levelno >= logging.ERROR:
            problems.append(f"error: {message[:200]}")
        elif "Computing the status of task" in message:
            # The task shows without a due date — imported data the scheduler cannot read.
            tid = message.split("Computing the status of task ", 1)[1].split(" ", 1)[0]
            problems.append(f"no status: {task_owner.get(tid, tid)}")
    return sorted(set(problems))


@pytest.mark.parametrize("kind", sorted(JUNK))
async def test_no_field_of_an_import_breaks_the_integration(
    hass: HomeAssistant, global_entry: MockConfigEntry, kind: str, caplog: pytest.LogCaptureFixture
) -> None:
    await _seed(hass, global_entry)
    objects_json, settings_json, _archive = await _export_all(hass)
    export = json.loads(objects_json)
    junk = JUNK[kind]
    caplog.clear()

    variants = _variants(export, junk, kind)
    assert len(variants) > 80, "the seed lost fields — the fuzz would prove little"
    payload = {**export, "objects": variants}
    for hint in ("users", "devices"):
        payload[hint] = junk if hint not in export else {k: junk for k in export[hint]}
    result = await _import(hass, payload)
    problems = [f"dropped: {e['name']} ({e['reason']})" for e in result.get("errors") or []]
    if result["created"] + len(result.get("errors") or []) != len(variants):
        problems.append(f"created {result['created']} of {len(variants)}")

    # The settings file, one field at a time.
    settings = json.loads(settings_json)
    for key in sorted(settings.get("global_settings") or {}):
        bad = copy.deepcopy(settings)
        bad["global_settings"][key] = junk
        await _import(hass, bad)
    for hint in ("users", "task_names"):
        if hint in settings:
            await _import(hass, {**settings, hint: {k: junk for k in settings[hint]}})

    problems += await _problems_after(hass, global_entry, caplog)
    assert not problems, f"{len(problems)} problem(s) from {kind} values:\n" + "\n".join(problems)
