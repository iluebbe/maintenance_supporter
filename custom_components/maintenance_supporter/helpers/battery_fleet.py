"""Battery-fleet aggregation over the Battery Notes integration.

The user does NOT want one maintenance task per battery (30-70+ devices would
bury the task list). Instead this aggregates every Battery Notes ``battery_plus``
sensor into ONE fleet view: which batteries are low now, grouped by battery
type (so you know *what to buy*), plus a simple deterministic forecast of what
will be needed soon (so you can order in time).

Battery Notes exposes everything we need as ATTRIBUTES on the single
``battery_plus`` sensor (device_class ``battery``): ``battery_type``,
``battery_quantity``, ``battery_low``, ``battery_low_threshold``,
``battery_last_replaced``. We read that one sensor kind — no dependency on the
(optional, often-disabled) battery-low binary.

The pure builder ``build_overview`` takes plain battery dicts + an injected
``today`` so the forecast is unit-testable with synthetic dates; ``read_batteries``
is the thin HA-reading adapter.
"""

from __future__ import annotations

from collections import OrderedDict
from dataclasses import dataclass, field
from datetime import date
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

# Editorial typical service life per battery type, in MONTHS — the forecast
# anchor (battery_last_replaced + lifetime = predicted replacement). These are
# deliberately conservative sensor-use estimates and are meant to be tunable;
# unknown types fall back to DEFAULT_LIFETIME_MONTHS.
TYPICAL_LIFETIME_MONTHS: dict[str, int] = {
    "AAAA": 10,
    "AAA": 10,
    "AA": 12,
    "C": 18,
    "D": 24,
    "9V": 12,
    "CR2": 18,
    "CR123A": 18,
    "CR2032": 18,
    "CR2450": 24,
    "CR2477": 24,
    "CR2016": 18,
    "CR2025": 18,
}
DEFAULT_LIFETIME_MONTHS = 12

# How far ahead "needed soon" looks by default (days).
DEFAULT_HORIZON_DAYS = 28

# A native battery %-sensor without a dedicated low binary is treated as low
# at or below this level (editorial — HA has no universal low threshold).
NATIVE_LOW_PERCENT = 20

# States that mean "no reading" — a removed device leaves nothing; an offline
# one leaves these. We keep an OFFLINE battery visible only when its last-known
# low flag says it needs attention (a dead battery often takes its device
# offline — that's exactly the one you must not hide).
_NO_READING = {"unavailable", "unknown", "none", ""}


def _norm_type(raw: Any) -> str:
    """Canonicalize a battery-type label for grouping (upper, trimmed)."""
    s = str(raw or "").strip()
    return s.upper() if s else "UNKNOWN"


def lifetime_months(battery_type: str) -> int:
    """Typical service life for a (canonicalized) battery type."""
    return TYPICAL_LIFETIME_MONTHS.get(_norm_type(battery_type), DEFAULT_LIFETIME_MONTHS)


@dataclass
class Battery:
    """One battery-powered device — from Battery Notes (rich) or a native
    ``device_class: battery`` entity (degraded: no type/quantity/forecast)."""

    entity_id: str
    device_name: str
    battery_type: str
    quantity: int
    low: bool
    level: float | None
    last_replaced: date | None
    available: bool = True
    source: str = "battery_notes"


@dataclass
class BatteryOverview:
    """The aggregated fleet view backing the single fleet task + its detail."""

    total: int = 0
    low: list[dict[str, Any]] = field(default_factory=list)
    soon: list[dict[str, Any]] = field(default_factory=list)
    # Grouped quantities by canonical type.
    needs_now: OrderedDict[str, int] = field(default_factory=OrderedDict)
    needs_soon: OrderedDict[str, int] = field(default_factory=OrderedDict)
    types: list[str] = field(default_factory=list)

    @property
    def low_count(self) -> int:
        return len(self.low)


def _predicted_date(bat: Battery) -> date | None:
    if bat.last_replaced is None:
        return None
    months = lifetime_months(bat.battery_type)
    # Month arithmetic without dateutil: add whole months, clamp the day.
    y, m = bat.last_replaced.year, bat.last_replaced.month + months
    y += (m - 1) // 12
    m = (m - 1) % 12 + 1
    day = min(bat.last_replaced.day, 28)
    return date(y, m, day)


def build_overview(
    batteries: list[Battery],
    *,
    today: date,
    horizon_days: int = DEFAULT_HORIZON_DAYS,
) -> BatteryOverview:
    """Aggregate batteries into the fleet view.

    * ``low`` = reported low right now (Battery Notes' own threshold).
    * ``soon`` = NOT low yet but predicted to reach end-of-life within
      ``horizon_days`` (deterministic last_replaced + typical-lifetime forecast).
      A battery already low is never double-counted into soon.
    * ``needs_now`` / ``needs_soon`` = summed quantities per type — the shopping
      grouping ("2× AA, 4× AAA").
    """
    ov = BatteryOverview(total=len(batteries))
    types_seen: OrderedDict[str, None] = OrderedDict()

    for bat in sorted(batteries, key=lambda b: b.device_name.lower()):
        t = _norm_type(bat.battery_type)
        types_seen[t] = None
        if bat.low:
            ov.low.append(_row(bat, t, None))
            ov.needs_now[t] = ov.needs_now.get(t, 0) + bat.quantity
            continue
        pred = _predicted_date(bat)
        if pred is not None:
            days = (pred - today).days
            if days <= horizon_days:
                ov.soon.append(_row(bat, t, days))
                ov.needs_soon[t] = ov.needs_soon.get(t, 0) + bat.quantity

    ov.soon.sort(key=lambda r: r["days_until"] if r["days_until"] is not None else 1 << 30)
    ov.types = sorted(types_seen)
    ov.needs_now = OrderedDict(sorted(ov.needs_now.items()))
    ov.needs_soon = OrderedDict(sorted(ov.needs_soon.items()))
    return ov


def _row(bat: Battery, canon_type: str, days_until: int | None) -> dict[str, Any]:
    return {
        "entity_id": bat.entity_id,
        "device_name": bat.device_name,
        "battery_type": canon_type,
        "quantity": bat.quantity,
        "level": bat.level,
        "days_until": days_until,
        "available": bat.available,
    }


def _parse_last_replaced(raw: Any) -> date | None:
    if not raw:
        return None
    try:
        parsed = dt_util.parse_datetime(str(raw))
        if parsed is not None:
            return parsed.date()
        return date.fromisoformat(str(raw)[:10])
    except (ValueError, TypeError):
        return None


def _level_of(state_val: str) -> float | None:
    try:
        return float(state_val)
    except (ValueError, TypeError):
        return None


def read_batteries(hass: HomeAssistant) -> list[Battery]:
    """Read the battery fleet from HA state — Battery Notes AND native.

    * **Battery Notes** ``battery_plus`` sensors (device_class ``battery`` + a
      ``battery_type`` attribute) give the rich view: type, quantity, low,
      last-replaced. When the source goes offline the sensor reads
      unavailable/unknown but RETAINS its last-known ``battery_low`` — so a
      dead battery that took its device offline stays visible.
    * **Native** ``device_class: battery`` entities (a %-sensor and/or a
      battery-low binary), grouped per device, give a degraded view (type
      "Unknown", quantity 1, no forecast). A device already covered by a
      Battery Notes note is skipped (dedup by the note's source entity + its
      device) so it isn't counted twice.
    """
    from homeassistant.helpers import device_registry as dr
    from homeassistant.helpers import entity_registry as er

    ent_reg = er.async_get(hass)
    dev_reg = dr.async_get(hass)

    out: list[Battery] = []
    covered_sources: set[str] = set()
    covered_devices: set[str] = set()

    # ── Pass 1: Battery Notes battery_plus ──────────────────────────────────
    for state in hass.states.async_all("sensor"):
        attrs = state.attributes
        if attrs.get("device_class") != "battery" or "battery_type" not in attrs:
            continue
        src = attrs.get("source_entity_id")
        if src:
            covered_sources.add(src)
        reg = ent_reg.async_get(state.entity_id)
        if reg and reg.device_id:
            covered_devices.add(reg.device_id)
        level = _level_of(state.state)
        available = state.state not in _NO_READING and level is not None
        low = bool(attrs.get("battery_low"))
        # Offline AND not last-known-low = pure connectivity noise → drop it.
        if not available and not low:
            continue
        out.append(
            Battery(
                entity_id=state.entity_id,
                device_name=attrs.get("device_name") or attrs.get("friendly_name") or state.entity_id,
                battery_type=str(attrs.get("battery_type") or "Unknown"),
                quantity=int(attrs.get("battery_quantity") or 1),
                low=low,
                level=level,
                last_replaced=_parse_last_replaced(attrs.get("battery_last_replaced")),
                available=available,
                source="battery_notes",
            )
        )

    # ── Pass 2: native battery entities, grouped per device ─────────────────
    # {group_key: {"level_state": s, "low_state": s, "name": ..., "device_id": ..., "eid": ...}}
    native: dict[str, dict[str, Any]] = {}
    for domain in ("sensor", "binary_sensor"):
        for state in hass.states.async_all(domain):
            if state.attributes.get("device_class") != "battery":
                continue
            eid = state.entity_id
            if "battery_type" in state.attributes:  # Battery Notes battery_plus — handled above
                continue
            if eid in covered_sources:
                continue
            reg = ent_reg.async_get(eid)
            dev_id = reg.device_id if reg else None
            if dev_id and dev_id in covered_devices:
                continue
            key = dev_id or eid
            rec = native.setdefault(
                key,
                {"level_state": None, "low_state": None, "device_id": dev_id, "eid": eid, "name": None},
            )
            friendly = state.attributes.get("friendly_name")
            if domain == "sensor":
                rec["level_state"] = state.state
                rec["eid"] = eid
            else:
                rec["low_state"] = state.state
            if rec["name"] is None and friendly:
                rec["name"] = friendly

    for key, rec in native.items():
        level = _level_of(rec["level_state"]) if rec["level_state"] is not None else None
        low_state = rec["low_state"]
        level_available = rec["level_state"] not in _NO_READING if rec["level_state"] is not None else False
        low_available = low_state not in _NO_READING if low_state is not None else False
        available = level_available or low_available
        if low_state is not None:
            low = low_available and str(low_state).lower() in ("on", "true", "1")
        else:
            low = level is not None and level <= NATIVE_LOW_PERCENT
        if not available and not low:
            continue
        name = rec["name"]
        if not name and rec["device_id"] and (dev := dev_reg.async_get(rec["device_id"])):
            name = dev.name_by_user or dev.name
        out.append(
            Battery(
                entity_id=rec["eid"],
                device_name=name or rec["eid"],
                battery_type="Unknown",
                quantity=1,
                low=low,
                level=level,
                last_replaced=None,
                available=available,
                source="native",
            )
        )
    return out


def has_battery_notes(hass: HomeAssistant) -> bool:
    """Whether the Battery Notes integration is present (any battery_plus)."""
    for state in hass.states.async_all("sensor"):
        a = state.attributes
        if a.get("device_class") == "battery" and "battery_type" in a:
            return True
    return False


def has_batteries(hass: HomeAssistant) -> bool:
    """Whether ANY battery is trackable — Battery Notes OR native. Gates setup."""
    for domain in ("sensor", "binary_sensor"):
        for state in hass.states.async_all(domain):
            if state.attributes.get("device_class") == "battery":
                return True
    return False


def compute_overview(hass: HomeAssistant, *, horizon_days: int = DEFAULT_HORIZON_DAYS) -> BatteryOverview:
    """Read + aggregate in one call (HA-side entry point)."""
    today = dt_util.now().date()
    return build_overview(read_batteries(hass), today=today, horizon_days=horizon_days)


def discover_battery_types(hass: HomeAssistant) -> OrderedDict[str, int]:
    """Battery types present across the fleet → total quantity, for part setup."""
    totals: OrderedDict[str, int] = OrderedDict()
    for bat in read_batteries(hass):
        t = _norm_type(bat.battery_type)
        totals[t] = totals.get(t, 0) + bat.quantity
    return OrderedDict(sorted(totals.items()))


__all__ = [
    "DEFAULT_HORIZON_DAYS",
    "NATIVE_LOW_PERCENT",
    "TYPICAL_LIFETIME_MONTHS",
    "Battery",
    "BatteryOverview",
    "build_overview",
    "compute_overview",
    "discover_battery_types",
    "has_batteries",
    "has_battery_notes",
    "lifetime_months",
    "read_batteries",
]
