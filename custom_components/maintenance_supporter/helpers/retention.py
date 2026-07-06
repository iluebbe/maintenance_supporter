"""Archive & auto-delete retention policy (v2.10.0).

Two parts:

* **Pure decisions** — :func:`should_auto_archive` / :func:`should_auto_delete`
  reason over a single (merged) task dict + the global day thresholds + an
  injected ``today``. No Home Assistant imports, so every branch is unit-testable
  with plain dicts.
* **The sweep** — :func:`async_run_retention_sweep` walks every object entry once
  (wired to a daily timer in ``__init__.async_setup``), applies the archives in
  one ConfigEntry write per entry, deletes the eligible tasks via the shared
  ``websocket.tasks.async_delete_task`` helper, and reloads each touched entry so
  its entities reflect the new state.

Policy (locked design):

* Auto-archive applies to **completed one-off tasks only** — recurring / sensor
  tasks never reach a terminal "done" state, so they are archived manually only.
* Auto-delete applies to **auto-archived** one-offs only (``archived_reason ==
  "auto"``). A manually archived item is never auto-deleted — deleting a manual
  archive stays an explicit user action.
* Both thresholds are "0 = disabled" (archive) / "0 = never" (delete).
"""

from __future__ import annotations

import logging
from datetime import date
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from ..const import ARCHIVE_REASON_AUTO

_LOGGER = logging.getLogger(__name__)


def _to_date(value: Any) -> date | None:
    """Coerce a stored date / ISO timestamp string to a ``date`` (or None).

    Accepts both ``"2026-06-24"`` (last_performed) and a full ISO timestamp
    ``"2026-06-24T12:00:00+00:00"`` (archived_at) — the leading ``YYYY-MM-DD``
    is all the day-granular policy needs.
    """
    if not isinstance(value, str) or len(value) < 10:
        return None
    try:
        return date.fromisoformat(value[:10])
    except ValueError:
        return None


def is_completed_oneoff(task: dict[str, Any]) -> bool:
    """True iff ``task`` is a one-off (``one_time`` recurrence) that's been done."""
    # Local import keeps this module HA-free for the pure-function tests.
    from .schedule import KIND_ONE_TIME, Schedule

    return Schedule.parse(task).kind == KIND_ONE_TIME and bool(task.get("last_performed"))


def should_auto_archive(task: dict[str, Any], *, archive_days: int, today: date) -> bool:
    """Decide whether a (merged) task should be auto-archived now.

    True only for an active (not-yet-archived) completed one-off whose completion
    is at least ``archive_days`` days in the past. ``archive_days <= 0`` disables
    auto-archive entirely.
    """
    if archive_days <= 0:
        return False
    if task.get("archived_at") is not None:
        return False
    if not is_completed_oneoff(task):
        return False
    last_performed = _to_date(task.get("last_performed"))
    if last_performed is None:
        return False
    return (today - last_performed).days >= archive_days


def should_auto_delete(task: dict[str, Any], *, delete_days: int, today: date) -> bool:
    """Decide whether an auto-archived task should be auto-deleted now.

    True only for a task archived **automatically** (``archived_reason == "auto"``
    — which, by construction, is always a completed one-off) at least
    ``delete_days`` days ago. ``delete_days <= 0`` means "never delete". Manual /
    object-cascade archives are deliberately excluded.
    """
    if delete_days <= 0:
        return False
    if task.get("archived_at") is None:
        return False
    if task.get("archived_reason") != ARCHIVE_REASON_AUTO:
        return False
    archived_on = _to_date(task.get("archived_at"))
    if archived_on is None:
        return False
    return (today - archived_on).days >= delete_days


def _coerce_int(value: Any, default: int) -> int:
    """Best-effort int coercion (settings come through the WS as int already)."""
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


def _global_options(hass: HomeAssistant) -> dict[str, Any]:
    """Return the global entry's options (or data), or {} when absent."""
    from ..const import DOMAIN, GLOBAL_UNIQUE_ID

    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.unique_id == GLOBAL_UNIQUE_ID:
            opts: dict[str, Any] = dict(entry.options or entry.data)
            return opts
    return {}


def _merged_tasks(entry: Any) -> dict[str, Any]:
    """Static (ConfigEntry) + dynamic (Store) task data for an object entry."""
    from ..const import CONF_TASKS

    tasks = entry.data.get(CONF_TASKS, {})
    rd = getattr(entry, "runtime_data", None)
    store = getattr(rd, "store", None) if rd else None
    merged: dict[str, Any] = store.merge_all_tasks(tasks) if store is not None else tasks
    return merged


async def async_run_retention_sweep(hass: HomeAssistant) -> None:
    """Auto-archive overdue-done one-offs and auto-delete aged auto-archives.

    Idempotent and cheap: only writes / reloads an entry that actually has work
    this pass. Safe to call from a daily timer or directly from a test.
    """
    from ..const import (
        ARCHIVE_REASON_AUTO as _REASON_AUTO,
    )
    from ..const import (
        CONF_ARCHIVE_ONEOFF_DAYS,
        CONF_DELETE_ARCHIVED_ONEOFF_DAYS,
        CONF_TASKS,
        DEFAULT_ARCHIVE_ONEOFF_DAYS,
        DEFAULT_DELETE_ARCHIVED_ONEOFF_DAYS,
    )
    from .aggregate import get_object_entries

    opts = _global_options(hass)
    archive_days = _coerce_int(
        opts.get(CONF_ARCHIVE_ONEOFF_DAYS, DEFAULT_ARCHIVE_ONEOFF_DAYS),
        DEFAULT_ARCHIVE_ONEOFF_DAYS,
    )
    delete_days = _coerce_int(
        opts.get(CONF_DELETE_ARCHIVED_ONEOFF_DAYS, DEFAULT_DELETE_ARCHIVED_ONEOFF_DAYS),
        DEFAULT_DELETE_ARCHIVED_ONEOFF_DAYS,
    )
    if archive_days <= 0 and delete_days <= 0:
        return

    today = dt_util.now().date()
    now_iso = dt_util.now().isoformat()

    for entry in get_object_entries(hass):
        merged = _merged_tasks(entry)
        # The two sets are disjoint by construction: archive needs archived_at
        # None; delete needs archived_at set — a task can't be both this pass.
        to_archive = [tid for tid, td in merged.items() if should_auto_archive(td, archive_days=archive_days, today=today)]
        to_delete = [tid for tid, td in merged.items() if should_auto_delete(td, delete_days=delete_days, today=today)]
        if not to_archive and not to_delete:
            continue

        if to_archive:
            new_tasks = dict(entry.data.get(CONF_TASKS, {}))
            for tid in to_archive:
                if tid not in new_tasks:
                    continue
                td = dict(new_tasks[tid])
                td["archived_at"] = now_iso
                td["archived_reason"] = _REASON_AUTO
                new_tasks[tid] = td
            new_data = dict(entry.data)
            new_data[CONF_TASKS] = new_tasks
            hass.config_entries.async_update_entry(entry, data=new_data)
            _LOGGER.info(
                "Auto-archived %d completed one-off task(s) in %s",
                len(to_archive),
                entry.title,
            )

        if to_delete:
            from ..websocket.tasks import async_delete_task

            deleted = 0
            for tid in to_delete:
                if await async_delete_task(hass, entry, tid):
                    deleted += 1
            if deleted:
                _LOGGER.info(
                    "Auto-deleted %d archived one-off task(s) in %s",
                    deleted,
                    entry.title,
                )

        # Reload once so entities reflect the archive (inert) / delete (gone).
        await hass.config_entries.async_reload(entry.entry_id)
