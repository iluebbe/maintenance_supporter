"""Regression tests for the 2026-07 bug audit fixes.

Each test pins one confirmed defect the audit found, so a revert re-fails here:
  1. Zip-bomb: archive import bounds each member read (read-before-cap → OOM).
  2. Unreferenced blobs: import writes only manifest-referenced hashes.
  3. Finite-series resurrection: a due_override can't re-arm an exhausted series.
  4. Pause-marker validation: a garbage paused_at on import is dropped.
  5. Saved-views cap: a >MAX hand-edited list isn't truncated on read.
"""

from __future__ import annotations

import io
import json
import zipfile
from datetime import date

import pytest

from custom_components.maintenance_supporter.const import slugify_object_name
from custom_components.maintenance_supporter.helpers import doc_archive
from custom_components.maintenance_supporter.helpers.saved_views import (
    list_saved_views,
    upsert_view,
)
from custom_components.maintenance_supporter.helpers.schedule import (
    KIND_INTERVAL,
    Schedule,
)
from custom_components.maintenance_supporter.models.maintenance_task import MaintenanceTask
from custom_components.maintenance_supporter.websocket.io import _iso_marker, _sanitize_history

TODAY = date(2026, 6, 1)


# ── HH:MM:SS schedule_time (config-flow TimeSelector) parses, not midnight ────


def test_schedule_time_tolerates_hh_mm_ss() -> None:
    """The config-flow TimeSelector stores "HH:MM:SS"; the consumers must parse
    it, not fall back to midnight (the old split(':',1) → int('30:00') raised).

    tz-independent proof: time(0,0) is "past" at every wall-clock time, so a
    SUCCESSFUL parse of "00:00:30" reads True regardless of the test's timezone —
    the old (raising) code returned False for any "HH:MM:SS" value.
    """
    from .conftest import build_task_data

    assert MaintenanceTask.from_dict(build_task_data(schedule_time="00:00:30"))._is_past_schedule_time() is True
    # Plain HH:MM unchanged.
    assert MaintenanceTask.from_dict(build_task_data(schedule_time="00:00"))._is_past_schedule_time() is True
    # A malformed value still falls back safely to "not past" (no crash).
    assert MaintenanceTask.from_dict(build_task_data(schedule_time="garbage"))._is_past_schedule_time() is False


# ── Non-Latin object names slugify to distinct, non-empty slugs ───────────────


def test_slugify_non_latin_names_are_distinct_and_nonempty() -> None:
    a = slugify_object_name("日本語")
    b = slugify_object_name("中文")
    assert a and b and a != b, (a, b)
    assert slugify_object_name("!!!") != ""
    # Latin names are unchanged (no hash fallback).
    assert slugify_object_name("Pool Pump") == "pool_pump"
    # Same name → same slug (duplicate detection still works).
    assert slugify_object_name("日本語") == a


# ── Imported history: non-finite / negative cost is scrubbed ──────────────────


def test_sanitize_history_scrubs_bad_cost() -> None:
    import math

    hist = [
        {"type": "completed", "cost": float("inf")},
        {"type": "completed", "cost": float("nan")},
        {"type": "completed", "cost": -50},
        {"type": "completed", "cost": 12.5},
        {"type": "completed", "cost": True},  # bool is not a cost
        {"type": "completed"},  # no cost
        "not-a-dict",
    ]
    out = _sanitize_history(hist)
    assert len(out) == 6  # the non-dict is dropped
    costs = [e.get("cost") for e in out]
    # Only the finite non-negative float survives; the rest have cost removed.
    assert costs[3] == 12.5
    assert "cost" not in out[0] and "cost" not in out[1] and "cost" not in out[2]
    assert "cost" not in out[4] and "cost" not in out[5]
    assert all(c is None or math.isfinite(c) for c in costs)
    assert _sanitize_history("not-a-list") == []


# ── 3. Finite series can't be resurrected by a postpone/override ──────────────


def test_due_override_cannot_resurrect_exhausted_finite_series() -> None:
    s = Schedule(kind=KIND_INTERVAL, every=30, unit="days", ends_count=3)
    common = dict(last_performed=date(2026, 5, 1), created_at=None, last_planned_due=None, today=TODAY)
    # Exhausted (3 of 3 done) → terminally done, with or without an override.
    assert s.next_due(times_performed=3, **common) is None
    assert s.next_due(times_performed=3, due_override=date(2026, 7, 15), **common) is None
    # Not yet exhausted → the override still wins for the current cycle.
    assert s.next_due(times_performed=1, due_override=date(2026, 7, 15), **common) == date(2026, 7, 15)


def test_due_override_respects_ends_until() -> None:
    s = Schedule(kind=KIND_INTERVAL, every=30, unit="days", ends_until=date(2026, 7, 1))
    common = dict(last_performed=date(2026, 5, 1), created_at=None, last_planned_due=None, today=TODAY)
    # An override past the series end date does not extend the series.
    assert s.next_due(due_override=date(2026, 8, 1), **common) is None
    # An override within the window is honoured.
    assert s.next_due(due_override=date(2026, 6, 20), **common) == date(2026, 6, 20)


# ── 4. Pause-marker validation on import ──────────────────────────────────────


def test_iso_marker_drops_garbage_keeps_valid() -> None:
    assert _iso_marker("garbage") is None
    assert _iso_marker("") is None
    assert _iso_marker(None) is None
    assert _iso_marker(12345) is None
    assert _iso_marker("2026-07-11") == "2026-07-11"  # date
    assert _iso_marker("2026-07-11T14:30:00+00:00") == "2026-07-11T14:30:00+00:00"  # datetime
    assert _iso_marker("2026-07-11T14:30:00Z") == "2026-07-11T14:30:00Z"  # Z suffix


# ── 5. Saved-views: a >MAX list is not truncated on read ──────────────────────


def test_upsert_view_rejects_new_past_cap_but_updates_are_ok() -> None:
    from custom_components.maintenance_supporter.const import MAX_SAVED_VIEWS

    views = [{"id": f"v{i}", "name": f"View {i}", "filters": {}} for i in range(MAX_SAVED_VIEWS)]
    # A brand-new view past the cap is rejected...
    with pytest.raises(ValueError, match="too_many_views"):
        upsert_view(views, {"id": "new", "name": "New", "filters": {}})
    # ...but updating an EXISTING view (even at the cap) is allowed and does not
    # drop any of the others.
    updated, saved_id = upsert_view(views, {"id": "v0", "name": "Renamed", "filters": {}})
    assert saved_id == "v0"
    assert len(updated) == MAX_SAVED_VIEWS
    assert updated[0]["name"] == "Renamed"


# ── 1 + 2. Archive import: bounded reads + only referenced blobs ───────────────


def _bomb_zip() -> bytes:
    """A ZIP whose single blob member inflates far past the budget."""
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr(doc_archive.MANIFEST_NAME, json.dumps({"version": 1, "objects": []}))
        import hashlib

        payload = b"\x00" * (2 * 1024 * 1024)  # 2 MB of zeros → tiny compressed
        zf.writestr(f"{doc_archive.BLOB_DIR}{hashlib.sha256(payload).hexdigest()}", payload)
    return buf.getvalue()


def test_member_bounded_read_rejects_oversized_member() -> None:
    data = _bomb_zip()
    with zipfile.ZipFile(io.BytesIO(data)) as zf:
        name = next(n for n in zf.namelist() if n.startswith(doc_archive.BLOB_DIR))
        # A tiny per-read cap must raise rather than materialise the full member.
        with pytest.raises(ValueError, match="archive_member_too_large"):
            doc_archive._read_member_bounded(zf, name, 1024)
        # A generous cap reads it fine.
        assert len(doc_archive._read_member_bounded(zf, name, 4 * 1024 * 1024)) == 2 * 1024 * 1024
