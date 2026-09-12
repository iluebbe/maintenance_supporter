"""Battery lifetimes: the type table, the user's overrides and what the fleet
has learned from its own replacements (D#162 follow-up).

Why this exists: a battery WITHOUT a level sensor (a Battery Notes note that
only has a type, a last-replaced date and a replaced button, or a low-only
binary) gives the fleet nothing to measure. Its due date is the one honest
estimate left — ``last_replaced + typical lifetime for the type`` — so the
lifetime table decides when such a battery shows up as due. Batteries WITH a
percentage get their forecast from the measured discharge instead (see
``battery_fleet.async_trend_predictions``); the table is only the prior the
trend falls back to.

Where a lifetime comes from, in this order:

1. ``override`` — the household's own value from *Settings → Battery fleet*
   (``battery_lifetime_months``, canonical type → months).
2. ``learned_device`` — this device's own replacements: the median of its
   intervals once it has two.
3. ``learned_model`` — devices of the SAME model (manufacturer + model from
   the device registry) pooled: the median interval once three exist. A
   CR2032 in a door sensor and one in a thermostat share nothing but the
   cell, so the pool is the model, never the type; ten identical sensors
   still teach the lifetime after about one cycle instead of one device
   living through three. Every last-replaced date the overview sees is
   logged (our Replaced action, Battery Notes' own button or service, a
   corrected date), so nothing has to be set up.
4. ``table`` — the built-in typical value for the type.
5. ``default`` — 12 months for a type the table does not know.

Battery Notes itself carries no lifetime data (its library has type and
quantity per device model, its ``check_battery_last_replaced`` service takes
the day count from the user), so there is nothing upstream to defer to; the
type vocabulary IS Battery Notes' (``AA``, ``CR2032``, ``CR123A``,
``LS14250``, ``PP3`` …), with the aliases people type normalised onto it.
"""

from __future__ import annotations

import logging
import re
from collections.abc import Callable
from dataclasses import dataclass
from datetime import date
from itertools import pairwise
from statistics import median
from typing import Any

from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

# Editorial typical service life per battery type, in MONTHS — conservative
# sensor-use estimates. Keys are Battery Notes' library spellings.
TYPICAL_LIFETIME_MONTHS: dict[str, int] = {
    "AAAA": 10,
    "AAA": 10,
    "AA": 12,
    "C": 18,
    "D": 24,
    "9V": 12,
    "N": 12,
    "CR2": 18,
    "2CR5": 12,
    "CR123A": 18,
    "CR1616": 12,
    "CR1620": 12,
    "CR1632": 12,
    "CR2016": 18,
    "CR2025": 18,
    "CR2032": 18,
    "CR2354": 18,
    "CR2430": 18,
    "CR2450": 24,
    "CR2477": 24,
    "CR3032": 24,
    "LR44": 12,
    "A23": 12,
    # Lithium-thionyl-chloride ½AA cells (Homematic, LoRa sensors …): rated
    # for years, not months.
    "LS14250": 48,
    "CR17450": 36,
}
DEFAULT_LIFETIME_MONTHS = 12
MAX_LIFETIME_MONTHS = 240
MIN_LIFETIME_MONTHS = 1

# Spellings seen in Battery Notes' library and in user notes, folded onto the
# table key. Left side is the canonicalised (upper, no spaces) input.
_ALIASES: dict[str, str] = {
    "LR6": "AA",
    "LR03": "AAA",
    "LR14": "C",
    "LR20": "D",
    "LR1": "N",
    "PP3": "9V",
    "6LR61": "9V",
    "CR123": "CR123A",
    "CR17345": "CR123A",
    "CR2/3A": "CR123A",
    "CR15H270": "CR2",
    "23A": "A23",
    "MN21": "A23",
    "AG13": "LR44",
    "SR44": "LR44",
    "DL2032": "CR2032",
    "BR2032": "CR2032",
    "DL2450": "CR2450",
    "DL2025": "CR2025",
    "DL2016": "CR2016",
    "DL1632": "CR1632",
    "ER14250": "LS14250",
    "CR14250": "LS14250",
    "1/2AA": "LS14250",
    "½AA": "LS14250",
}
# Battery Notes types that describe "no forecast possible": no cell to time.
NO_FORECAST_TYPES = frozenset({"", "UNKNOWN", "MANUAL", "IRREPLACEABLE", "SOLAR", "NONE", "N/A"})
_STRIP_SUFFIX_RE = re.compile(r"(\s*[-–]?\s*\(?3V\)?|\s+LITHIUM|\s+ALKALINE|\s+\d+MAH|\s+\d+(\.\d+)?V)$", re.IGNORECASE)

# Store key on the fleet task's dynamic state:
# {entity_id: {"type": canonical, "model": "manufacturer|model", "dates": [iso …]}}
REPLACEMENT_LOG_KEY = "battery_replacements"
_LOG_DATES_CAP = 12
_LEARN_MIN_SAMPLES = 3  # pooled intervals for a model
_LEARN_MIN_OWN_SAMPLES = 2  # a device's own intervals
# Intervals outside this window are not battery cycles (a re-seeded note, a
# date typo).
_INTERVAL_MIN_DAYS = 14
_INTERVAL_MAX_DAYS = 10 * 365


def canonical_type(raw: Any) -> str:
    """Fold a battery-type label onto the table key: upper, trimmed, common
    suffixes dropped ("CR123A Lithium", "CR123A-3V"), aliases applied
    ("LR6" → "AA", "PP3" → "9V", "CR123" → "CR123A")."""
    s = str(raw or "").strip().upper()
    if not s:
        return "UNKNOWN"
    prev = None
    while prev != s:
        prev = s
        s = _STRIP_SUFFIX_RE.sub("", s).strip()
    compact = s.replace(" ", "")
    return _ALIASES.get(compact, _ALIASES.get(s, compact if compact in TYPICAL_LIFETIME_MONTHS else s))


def has_type_forecast(raw: Any) -> bool:
    """Whether the type table can say anything about this label at all."""
    return canonical_type(raw) not in NO_FORECAST_TYPES


def table_lifetime_months(raw: Any) -> int:
    """The built-in typical value (table, else the default)."""
    return TYPICAL_LIFETIME_MONTHS.get(canonical_type(raw), DEFAULT_LIFETIME_MONTHS)


@dataclass(frozen=True)
class LifetimeInfo:
    months: int
    source: str  # "override" | "learned_device" | "learned_model" | "table" | "default"
    samples: int = 0


def sanitize_lifetime_overrides(raw: Any) -> dict[str, int]:
    """Settings sanitiser: canonical keys, integer months within range, at most
    100 entries; anything else dropped. An empty map clears every override."""
    if not isinstance(raw, dict):
        return {}
    out: dict[str, int] = {}
    for key, value in raw.items():
        ctype = canonical_type(key)
        if ctype in NO_FORECAST_TYPES:
            continue
        if isinstance(value, bool):
            continue
        try:
            as_float = float(value)
        except (TypeError, ValueError):
            continue
        if not as_float.is_integer():
            continue
        months = int(as_float)
        if MIN_LIFETIME_MONTHS <= months <= MAX_LIFETIME_MONTHS:
            out[ctype] = months
        if len(out) >= 100:
            break
    return out


def lifetime_overrides(hass: HomeAssistant) -> dict[str, int]:
    from ..const import CONF_BATTERY_LIFETIME_MONTHS
    from .global_options import get_global_options

    return sanitize_lifetime_overrides(get_global_options(hass).get(CONF_BATTERY_LIFETIME_MONTHS))


# ── the replacement log (learning) ───────────────────────────────────────────


def _fleet_store_and_task(hass: HomeAssistant) -> tuple[Any, str] | None:
    from .battery_fleet_setup import find_fleet_entry, find_fleet_task

    entry = find_fleet_entry(hass)
    if entry is None:
        return None
    rd = getattr(entry, "runtime_data", None)
    store = getattr(rd, "store", None) if rd else None
    found = find_fleet_task(entry)
    if store is None or found is None:
        return None
    return store, found[0]


def replacement_log(hass: HomeAssistant) -> dict[str, dict[str, Any]]:
    """{device key: {"type": canonical, "dates": [iso …]}} — read-only copy."""
    found = _fleet_store_and_task(hass)
    if found is None:
        return {}
    store, task_id = found
    raw = store.get_task_state(task_id).get(REPLACEMENT_LOG_KEY)
    return {k: dict(v) for k, v in raw.items() if isinstance(v, dict)} if isinstance(raw, dict) else {}


def observe_replacements(hass: HomeAssistant, batteries: list[Any]) -> int:
    """Log every battery's current last-replaced date the first time it is
    seen and every time it changes. Called from the overview computation, so
    our Replaced action, Battery Notes' own button/service and a corrected
    date all end up in the same log without a listener per path. Returns how
    many entries changed (the Store is saved only then, debounced)."""
    found = _fleet_store_and_task(hass)
    if found is None:
        return 0
    store, task_id = found
    state = store._ensure_task(task_id)  # the log is fleet-task state, owned by the store
    log = state.get(REPLACEMENT_LOG_KEY)
    if not isinstance(log, dict):
        log = {}
    changed = 0
    for bat in batteries:
        last: date | None = getattr(bat, "last_replaced", None)
        ctype = canonical_type(getattr(bat, "battery_type", ""))
        if last is None or ctype in NO_FORECAST_TYPES:
            continue
        key = getattr(bat, "entity_id", None)
        if not key:
            continue
        model = str(getattr(bat, "model_key", "") or "")
        entry = log.get(key)
        if not isinstance(entry, dict) or not isinstance(entry.get("dates"), list):
            entry = {"type": ctype, "model": model, "dates": []}
        iso = last.isoformat()
        dates: list[str] = [d for d in entry["dates"] if isinstance(d, str)]
        anchored = bool(entry.get("anchored"))
        if iso in dates and entry.get("type") == ctype and entry.get("model", "") == model:
            continue
        if iso not in dates:
            if dates and iso < min(dates):
                # Bug audit 2026-09-12: a date OLDER than everything logged is
                # a correction of the anchor (the real install date entered
                # after the fact), not another swap. It replaces the earliest
                # date - and makes the first interval trustworthy.
                dates = sorted({iso, *(d for d in dates if d != min(dates))})
                anchored = True
            else:
                dates.append(iso)
                dates = sorted(set(dates))[-_LOG_DATES_CAP:]
        log[key] = {"type": ctype, "model": model, "dates": dates, "anchored": anchored}
        changed += 1
    if changed:
        state[REPLACEMENT_LOG_KEY] = log
        store.async_delay_save()
    return changed


def _intervals(entry: dict[str, Any]) -> list[float]:
    """The intervals (months) between a device's consecutive logged replacements."""
    dates: list[date] = []
    for raw in entry.get("dates") or []:
        try:
            dates.append(date.fromisoformat(str(raw)[:10]))
        except ValueError:
            continue
    dates.sort()
    pairs = list(pairwise(dates))
    if pairs and not entry.get("anchored"):
        # The earliest date is whatever was there when the fleet started
        # watching - Battery Notes seeds it with the note's creation day, so
        # ten sensors set up together and swapped over the following weeks
        # would "learn" a one-month life. Only intervals between OBSERVED
        # swaps count; a corrected anchor (see observe_replacements) is the
        # user's real install date and counts too.
        pairs = pairs[1:]
    out: list[float] = []
    for a, b in pairs:
        days = (b - a).days
        if _INTERVAL_MIN_DAYS <= days <= _INTERVAL_MAX_DAYS:
            out.append(days / 30.44)
    return out


def _clamp(months: float) -> int:
    return max(MIN_LIFETIME_MONTHS, min(MAX_LIFETIME_MONTHS, round(months)))


@dataclass(frozen=True)
class Learned:
    """What the log teaches: per device (its own intervals) and per model
    (devices of the same manufacturer + model, pooled)."""

    by_device: dict[str, tuple[int, int]]  # entity_id → (months, samples)
    by_model: dict[tuple[str, str], tuple[int, int]]  # (type, model_key) → (months, samples)

    @classmethod
    def empty(cls) -> Learned:
        return cls({}, {})


def learned_lifetimes(hass: HomeAssistant) -> Learned:
    log = replacement_log(hass)
    by_device: dict[str, tuple[int, int]] = {}
    pooled: dict[tuple[str, str], list[float]] = {}
    for key, entry in log.items():
        months = _intervals(entry)
        ctype = str(entry.get("type") or "")
        model = str(entry.get("model") or "")
        if len(months) >= _LEARN_MIN_OWN_SAMPLES:
            by_device[key] = (_clamp(median(months)), len(months))
        if model:
            pooled.setdefault((ctype, model), []).extend(months)
    by_model = {k: (_clamp(median(v)), len(v)) for k, v in pooled.items() if len(v) >= _LEARN_MIN_SAMPLES}
    return Learned(by_device, by_model)


def resolve_lifetime(
    raw_type: Any,
    *,
    overrides: dict[str, int],
    learned: Learned | None = None,
    entity_id: str | None = None,
    model_key: str = "",
) -> LifetimeInfo:
    """override > this device's own replacements > same-model pool > table > default."""
    ctype = canonical_type(raw_type)
    if ctype in overrides:
        return LifetimeInfo(overrides[ctype], "override")
    if learned is not None:
        if entity_id and entity_id in learned.by_device:
            months, n = learned.by_device[entity_id]
            return LifetimeInfo(months, "learned_device", n)
        if model_key and (ctype, model_key) in learned.by_model:
            months, n = learned.by_model[(ctype, model_key)]
            return LifetimeInfo(months, "learned_model", n)
    if ctype in TYPICAL_LIFETIME_MONTHS:
        return LifetimeInfo(TYPICAL_LIFETIME_MONTHS[ctype], "table")
    return LifetimeInfo(DEFAULT_LIFETIME_MONTHS, "default")


def lifetime_resolver(hass: HomeAssistant) -> Callable[[Any], LifetimeInfo]:
    """One resolver per overview computation (reads options + the log once).
    Takes a Battery (anything with battery_type / entity_id / model_key)."""
    overrides = lifetime_overrides(hass)
    learned = learned_lifetimes(hass)
    return lambda bat: resolve_lifetime(
        getattr(bat, "battery_type", ""),
        overrides=overrides,
        learned=learned,
        entity_id=getattr(bat, "entity_id", None),
        model_key=str(getattr(bat, "model_key", "") or ""),
    )


def lifetime_catalog(hass: HomeAssistant, types_in_fleet: list[str] | None = None, *, model_names: dict[str, str] | None = None) -> list[dict[str, Any]]:
    """What Settings shows: every type in the fleet plus the table's, with the
    effective months for the TYPE (override / table / default) and, per type,
    what the fleet has learned per device model — a learned value never
    replaces the type row, it applies to the batteries of that model only.
    Sorted: fleet types first, then the rest."""
    overrides = lifetime_overrides(hass)
    learned = learned_lifetimes(hass)
    fleet = [canonical_type(t) for t in (types_in_fleet or [])]
    fleet = [t for t in fleet if t not in NO_FORECAST_TYPES]
    order: list[str] = []
    for t in [*sorted(set(fleet)), *sorted(TYPICAL_LIFETIME_MONTHS), *sorted(overrides)]:
        if t not in order:
            order.append(t)
    names = model_names or {}
    rows: list[dict[str, Any]] = []
    for t in order:
        info = resolve_lifetime(t, overrides=overrides)
        learned_models = [
            {"model": names.get(model, model), "model_key": model, "months": months, "samples": n}
            for (ctype, model), (months, n) in sorted(learned.by_model.items())
            if ctype == t
        ]
        rows.append(
            {
                "type": t,
                "months": info.months,
                "source": info.source,
                "samples": 0,
                "default_months": TYPICAL_LIFETIME_MONTHS.get(t, DEFAULT_LIFETIME_MONTHS),
                "override_months": overrides.get(t),
                "learned_models": learned_models,
                "in_fleet": t in fleet,
            }
        )
    return rows
