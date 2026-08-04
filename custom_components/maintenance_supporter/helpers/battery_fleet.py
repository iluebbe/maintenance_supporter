"""Battery-fleet aggregation over the Battery Notes integration.

The user does NOT want one maintenance task per battery (30-70+ devices would
bury the task list). Instead this aggregates every Battery Notes ``battery_plus``
sensor into ONE fleet view: which batteries are low now, grouped by battery
type (so you know *what to buy*), plus a simple deterministic forecast of what
will be needed soon (so you can order in time).

Battery Notes exposes everything we need as ATTRIBUTES on its entities
(device_class ``battery``): ``battery_type``, ``battery_quantity``,
``battery_low``, ``battery_low_threshold``, ``battery_last_replaced``. The
percentage sensor is the primary source; LOW-ONLY sources (a Matter lock with
just a battery-low binary, #121) are read from their ``…_battery_plus_low``
binary instead.

Forecast (#114 + follow-up): the ~replacement date comes from the DISCHARGE
TREND where recorder data supports it (``async_trend_predictions`` — the
SensorPredictor regression asking "when does the level fall below the low
threshold?", medium/high confidence only, cached 6 h) and falls back to
``battery_last_replaced`` + the type-lifetime table everywhere else.

The pure builder ``build_overview`` takes plain battery dicts + an injected
``today`` so the forecast is unit-testable with synthetic dates; ``read_batteries``
is the thin HA-reading adapter.
"""

from __future__ import annotations

import logging
import re
from collections import OrderedDict
from dataclasses import dataclass, field
from datetime import date, timedelta
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

_LOGGER = logging.getLogger(__name__)

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

# How long a NATIVE battery that was last seen LOW stays in the fleet after
# its entity goes unavailable. Battery Notes covers this case via its retained
# ``battery_low`` attribute; native entities have no equivalent, so without a
# snapshot the battery would vanish at the exact moment it died and took its
# device offline. Bounded so a permanently removed device eventually drops.
_NATIVE_RETENTION = timedelta(hours=48)

# Heuristic (sensors WITHOUT device_class): a %-sensor whose object_id talks
# about a battery — some Zigbee2MQTT/ESPHome devices ship battery levels
# without the device class. Deliberately strict: the exclusion words keep out
# charging electronics and home-storage state-of-charge sensors (a Powerwall
# is not a battery you replace).
_HEURISTIC_EXCLUDE = ("charging", "current", "power", "voltage", "energy", "load", "soc", "state_of_charge", "storage", "temp")


def _is_native_battery_sensor(state: Any) -> bool:
    """Whether a sensor state looks like a replaceable-battery level."""
    attrs = state.attributes
    if attrs.get("device_class") == "battery":
        return True
    if attrs.get("unit_of_measurement") != "%":
        return False
    object_id = state.entity_id.split(".", 1)[1]
    if "battery" not in object_id:
        return False
    return not any(word in object_id for word in _HEURISTIC_EXCLUDE)


def _native_snapshot_cache(hass: HomeAssistant) -> dict[str, dict[str, Any]]:
    """Runtime cache of last-known native battery readings (per entity_id)."""
    from ..const import DOMAIN

    cache: dict[str, dict[str, Any]] = hass.data.setdefault(DOMAIN, {}).setdefault("battery_fleet_native_cache", {})
    return cache


def _norm_type(raw: Any) -> str:
    """Canonicalize a battery-type label for grouping (upper, trimmed)."""
    s = str(raw or "").strip()
    return s.upper() if s else "UNKNOWN"


# Battery Notes' library labels rechargeable packs with type strings like
# "Rechargeable", "Nuki Battery Pack" or li-ion cell names. Such a battery is
# CHARGED, never bought — so it must not enter the shopping groupings, and the
# type-lifetime table (a primary-cell prior) has nothing honest to say about
# it. Low tracking and the discharge-trend forecast stay: "charge the lock in
# ~20 days" is exactly what the roster is for.
_RECHARGEABLE_TYPE_RE = re.compile(
    r"rechargeable|akku|accu|li[- ]?ion|li[- ]?po|lifepo|ni[- ]?mh|nicd|18650|21700|"
    r"power ?pack|battery ?pack|built[- ]?in",
    re.IGNORECASE,
)


def is_rechargeable_type(battery_type: Any) -> bool:
    """Whether a battery-type label describes a rechargeable pack/cell."""
    return bool(_RECHARGEABLE_TYPE_RE.search(str(battery_type or "")))


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
    # The level at which THIS battery counts low: Battery Notes' configured
    # threshold or the fleet-wide floor, whichever is higher (the one that
    # crosses first on the way down). One field feeds the trend regression,
    # the sparkline threshold line and the level-bar colors alike.
    low_threshold: float = float(NATIVE_LOW_PERCENT)


@dataclass
class BatteryOverview:
    """The aggregated fleet view backing the single fleet task + its detail."""

    total: int = 0
    low: list[dict[str, Any]] = field(default_factory=list)
    soon: list[dict[str, Any]] = field(default_factory=list)
    # EVERY tracked battery, each tagged low / soon / ok, device-name sorted.
    #
    # low and soon answer "what needs doing"; this answers "what is the fleet
    # watching". Without it a device that is perfectly healthy appears nowhere
    # in the payload, so it could only be excluded once it had already gone low
    # — which is exactly when it is being noisy, and after the fleet task may
    # have auto-completed and dropped it from the list again (discussion #113).
    all: list[dict[str, Any]] = field(default_factory=list)
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
    trend_predictions: dict[str, tuple[int, str]] | None = None,
) -> BatteryOverview:
    """Aggregate batteries into the fleet view.

    * ``low`` = reported low right now (Battery Notes' own threshold).
    * ``soon`` = NOT low yet but predicted to reach end-of-life within
      ``horizon_days`` (deterministic last_replaced + typical-lifetime forecast).
      A battery already low is never double-counted into soon.
    * ``needs_now`` / ``needs_soon`` = summed quantities per type — the shopping
      grouping ("2× AA, 4× AAA"). Rechargeable types never enter it: a low
      rechargeable means "charge it", not "buy one".
    * ``all`` = every battery with its status, so a healthy device can be
      excluded BEFORE it ever becomes noisy.
    """
    ov = BatteryOverview(total=len(batteries))
    types_seen: OrderedDict[str, None] = OrderedDict()

    for bat in sorted(batteries, key=lambda b: b.device_name.lower()):
        t = _norm_type(bat.battery_type)
        types_seen[t] = None
        rechargeable = is_rechargeable_type(bat.battery_type)
        # Blend (#114 follow-up): the DISCHARGE TREND wins where the recorder
        # data supports it (medium/high confidence, filtered upstream) — it is
        # device-specific and usage-aware; the type's typical lifetime is the
        # prior everything else falls back to. For rechargeables the table is
        # no prior at all (its lifetimes describe primary cells, and Battery
        # Notes seeds last_replaced at note creation — a real fleet showed
        # "replace the vacuum's pack" dated from the day the device was added),
        # so they get a ~date only when the trend has earned one.
        trend = (trend_predictions or {}).get(bat.entity_id)
        if trend is not None:
            days: int | None = max(0, trend[0])
            source, confidence = "trend", trend[1]
        else:
            pred = None if rechargeable else _predicted_date(bat)
            days = (pred - today).days if pred is not None else None
            source, confidence = "typical", None
        if bat.low:
            ov.low.append(_row(bat, t, None, rechargeable=rechargeable))
            if not rechargeable:
                ov.needs_now[t] = ov.needs_now.get(t, 0) + bat.quantity
            # A battery reported low has no meaningful forecast left to show.
            ov.all.append({**_row(bat, t, None, rechargeable=rechargeable), "status": "low"})
            continue
        if days is not None and days <= horizon_days:
            ov.soon.append(_row(bat, t, days, source, confidence, rechargeable=rechargeable))
            if not rechargeable:
                ov.needs_soon[t] = ov.needs_soon.get(t, 0) + bat.quantity
            ov.all.append({**_row(bat, t, days, source, confidence, rechargeable=rechargeable), "status": "soon"})
            continue
        ov.all.append({**_row(bat, t, days, source, confidence, rechargeable=rechargeable), "status": "ok"})

    ov.soon.sort(key=lambda r: r["days_until"] if r["days_until"] is not None else 1 << 30)
    ov.types = sorted(types_seen)
    ov.needs_now = OrderedDict(sorted(ov.needs_now.items()))
    ov.needs_soon = OrderedDict(sorted(ov.needs_soon.items()))
    return ov


def _row(
    bat: Battery,
    canon_type: str,
    days_until: int | None,
    predicted_source: str = "typical",
    prediction_confidence: str | None = None,
    *,
    rechargeable: bool = False,
) -> dict[str, Any]:
    return {
        "entity_id": bat.entity_id,
        "device_name": bat.device_name,
        "battery_type": canon_type,
        "quantity": bat.quantity,
        "level": bat.level,
        "days_until": days_until,
        "available": bat.available,
        # #114 follow-up: where the ~date comes from — "trend" (discharge
        # regression, with confidence) or "typical" (type-lifetime table).
        "predicted_source": predicted_source,
        "prediction_confidence": prediction_confidence,
        # Charged, never bought: low means "recharge", and the row never
        # contributes to the shopping groupings.
        "rechargeable": rechargeable,
        # This battery's own low threshold — the level bars color against it.
        "low_threshold": bat.low_threshold,
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


def fleet_excluded_entities(hass: HomeAssistant) -> set[str]:
    """Manually excluded battery entity_ids, stored on the fleet object entry.

    Inlined lookup (not via battery_fleet_setup.find_fleet_entry) to keep this
    module import-cycle-free — setup imports the aggregation, not vice versa.
    """
    from ..const import CONF_OBJECT, DOMAIN

    for entry in hass.config_entries.async_entries(DOMAIN):
        obj = entry.data.get(CONF_OBJECT, {})
        if obj.get("battery_fleet"):
            return set(obj.get("battery_fleet_excluded") or [])
    return set()


def _is_self_charging(hass: HomeAssistant, device_id: str | None) -> bool:
    """Whether a device recharges itself — its battery is never REPLACED.

    Issue #107: a Roborock's native battery sensor reads "low" mid-clean, but
    nobody swaps its cells. Heuristics: the device also has a
    vacuum/lawn_mower entity, exposes a ``battery_charging`` binary, or is a
    Companion-app phone/tablet (``mobile_app`` identifiers).

    Applied to BOTH passes. This originally spared Battery Notes entries on
    the theory that an explicit note is deliberate intent — but Battery Notes
    auto-discovery proposes notes for vacuums straight from its library
    (type "Rechargeable"), so a real fleet ended up telling its owner to buy
    a "RECHARGEABLE" for the vacuum.
    """
    if not device_id:
        return False
    from homeassistant.helpers import device_registry as dr
    from homeassistant.helpers import entity_registry as er

    device = dr.async_get(hass).async_get(device_id)
    if device and any(domain == "mobile_app" for domain, _ in device.identifiers):
        return True
    for reg_entry in er.async_entries_for_device(er.async_get(hass), device_id, include_disabled_entities=True):
        if reg_entry.domain in ("vacuum", "lawn_mower"):
            return True
        if (
            reg_entry.domain == "binary_sensor"
            and (reg_entry.device_class or reg_entry.original_device_class) == "battery_charging"
        ):
            return True
    return False


def read_batteries(hass: HomeAssistant) -> list[Battery]:
    """Read the battery fleet from HA state — Battery Notes AND native.

    * **Battery Notes** ``battery_plus`` sensors (device_class ``battery`` + a
      ``battery_type`` attribute) give the rich view: type, quantity, low,
      last-replaced. When the source goes offline the sensor reads
      unavailable/unknown but RETAINS its last-known ``battery_low`` — so a
      dead battery that took its device offline stays visible. A device whose
      source reports no percentage at all (a Matter lock with only a
      battery-low binary, #121) gets NO percentage sensor from Battery Notes —
      its metadata lives solely on the ``…_battery_plus_low`` BINARY, so a
      second sweep picks those up for devices the sensor sweep did not cover.
      Devices with BOTH stay one row (the binary carries the same attributes
      and would otherwise duplicate every battery and dodge exclusions).
      Self-charging devices (vacuums, mowers, phones — see
      :func:`_is_self_charging`) are skipped here too: Battery Notes
      auto-discovery notes them from its library, so a note is no proof of
      intent to track a replaceable cell.
    * **Native** ``device_class: battery`` entities (a %-sensor and/or a
      battery-low binary) — plus %-sensors matching the strict battery-name
      heuristic for devices that ship no device class — grouped per device,
      give a degraded view (type "Unknown", quantity 1, no forecast). A
      device already covered by a Battery Notes note is skipped (dedup by
      the note's source entity + its device) so it isn't counted twice;
      self-charging devices (vacuums, mowers, phones — see
      :func:`_is_self_charging`) are skipped entirely. A native battery
      last seen LOW that goes unavailable is retained from a runtime
      snapshot for ``_NATIVE_RETENTION`` (the Battery Notes path gets this
      for free via its retained ``battery_low`` attribute).
    * Manually excluded entity_ids (fleet detail → exclude) are dropped from
      BOTH passes.
    """
    from homeassistant.helpers import device_registry as dr
    from homeassistant.helpers import entity_registry as er

    ent_reg = er.async_get(hass)
    dev_reg = dr.async_get(hass)
    excluded = fleet_excluded_entities(hass)

    out: list[Battery] = []
    covered_sources: set[str] = set()
    covered_devices: set[str] = set()

    # ── Pass 1: Battery Notes battery_plus ──────────────────────────────────
    # Percentage SENSORS first, then LOW-ONLY BINARIES (#121): a source with
    # no percentage (a Matter lock's plain battery-low binary) gets no
    # ``battery_plus`` sensor from Battery Notes, so the type/quantity/
    # last-replaced metadata exists only on the ``…_battery_plus_low`` binary.
    # The binary sweep is restricted to devices the sensor sweep did NOT
    # cover: a percentage note's own low binary carries the SAME attributes,
    # and taking it too would put every battery in the roster twice — and let
    # an exclusion set on the sensor row resurrect through the binary.
    note_sensor_ids: set[str] = set()
    for domain, binary_pass in (("sensor", False), ("binary_sensor", True)):
        for state in hass.states.async_all(domain):
            attrs = state.attributes
            if attrs.get("device_class") != "battery" or "battery_type" not in attrs:
                continue
            if not binary_pass:
                # EVERY matching percentage note counts as sibling coverage —
                # kept, dropped or excluded: its low binary describes the same
                # battery and must never become a second (or resurrected) row.
                note_sensor_ids.add(state.entity_id)
            reg = ent_reg.async_get(state.entity_id)
            dev_id = reg.device_id if reg else None
            if binary_pass:
                if dev_id and dev_id in covered_devices:
                    continue
                # Registry-based dedupe is not enough on its own (caught live:
                # state-only entities have no registry entry, and every fleet
                # battery doubled). Two fallbacks: the shared source entity,
                # and Battery Notes' naming contract —
                # ``sensor.X_battery_plus`` ↔ ``binary_sensor.X_battery_plus_low``.
                src_attr = attrs.get("source_entity_id")
                if src_attr and src_attr in covered_sources:
                    continue
                object_id = state.entity_id.split(".", 1)[1]
                if object_id.endswith("_low") and f"sensor.{object_id[: -len('_low')]}" in note_sensor_ids:
                    continue
                # No percentage to read — the binary state IS the low signal.
                level = None
                available = state.state not in _NO_READING
                low = bool(attrs.get("battery_low")) or str(state.state).lower() == "on"
            else:
                level = _level_of(state.state)
                available = state.state not in _NO_READING and level is not None
                # B2 (roadmap 2026-07-22 audit): ONE low floor across both
                # passes. Battery Notes' own threshold (default 10 %) still
                # counts via its battery_low flag, but the fleet-wide
                # NATIVE_LOW_PERCENT floor is OR-ed in — a CR2032 at 11.5 %
                # was "healthy" here while the same level counted low in the
                # native pass. A HIGHER Battery Notes threshold (e.g. 30 %)
                # still wins through battery_low.
                low = bool(attrs.get("battery_low")) or (level is not None and level <= NATIVE_LOW_PERCENT)
            last_replaced = _parse_last_replaced(attrs.get("battery_last_replaced"))
            # B1 (roadmap 2026-07-22 audit): a forecast-only note — no level
            # sensor, so the state reads unknown forever — must SURVIVE when it
            # carries a replacement date: that date is all `_predicted_date`
            # needs, and dropping these hid 11 overdue batteries in a live fleet.
            # Offline AND not low AND no date = pure connectivity noise → drop.
            if not available and not low and last_replaced is None:
                continue
            # B3: only a KEPT note covers its source/device — a dropped dead note
            # must not suppress the native fallback for its own device (a device
            # with a dead note and a working level sensor was invisible in BOTH
            # passes).
            src = attrs.get("source_entity_id")
            if src:
                covered_sources.add(src)
            if dev_id:
                covered_devices.add(dev_id)
            # An EXCLUDED note still covers (above): exclusion hides the battery —
            # it must not resurrect as a degraded native "Unknown" row.
            if state.entity_id in excluded:
                continue
            # #107 follow-up: the skip covers noted devices too (it covers
            # above for the same reason exclusion does). Battery Notes
            # auto-discovers vacuums/phones from its library, so a note is
            # not evidence anyone means to swap cells there.
            if _is_self_charging(hass, dev_id):
                continue
            out.append(
                Battery(
                    entity_id=state.entity_id,
                    device_name=attrs.get("device_name") or attrs.get("friendly_name") or state.entity_id,
                    battery_type=str(attrs.get("battery_type") or "Unknown"),
                    quantity=int(attrs.get("battery_quantity") or 1),
                    low=low,
                    level=level,
                    last_replaced=last_replaced,
                    available=available,
                    source="battery_notes",
                    low_threshold=_note_low_threshold(attrs),
                )
            )

    # ── Pass 2: native battery entities, grouped per device ─────────────────
    # {group_key: {"level_state": s, "low_state": s, "name": ..., "device_id": ..., "eid": ...}}
    native: dict[str, dict[str, Any]] = {}
    for domain in ("sensor", "binary_sensor"):
        for state in hass.states.async_all(domain):
            # Sensors: device_class battery OR the strict name/% heuristic
            # (Zigbee2MQTT/ESPHome levels without a device class). Binaries:
            # device_class only — name-guessing booleans is too risky.
            if domain == "sensor":
                if not _is_native_battery_sensor(state):
                    continue
            elif state.attributes.get("device_class") != "battery":
                continue
            eid = state.entity_id
            if "battery_type" in state.attributes:  # Battery Notes battery_plus — handled above
                continue
            if eid in covered_sources or eid in excluded:
                continue
            reg = ent_reg.async_get(eid)
            dev_id = reg.device_id if reg else None
            if dev_id and dev_id in covered_devices:
                continue
            if _is_self_charging(hass, dev_id):  # #107: vacuums/mowers/phones
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

    snapshot_cache = _native_snapshot_cache(hass)
    now = dt_util.utcnow()
    for rec in native.values():
        level = _level_of(rec["level_state"]) if rec["level_state"] is not None else None
        low_state = rec["low_state"]
        level_available = rec["level_state"] not in _NO_READING if rec["level_state"] is not None else False
        low_available = low_state not in _NO_READING if low_state is not None else False
        available = level_available or low_available
        if low_state is not None:
            low = low_available and str(low_state).lower() in ("on", "true", "1")
        else:
            low = level is not None and level <= NATIVE_LOW_PERCENT
        if available:
            # Remember the last real reading — the retention path below needs
            # it once the entity goes unavailable.
            snapshot_cache[rec["eid"]] = {"low": low, "level": level, "ts": now}
        elif not low:
            # Native dead-battery retention: an entity that was LOW and then
            # went unavailable (the battery died and took the device offline)
            # stays visible for _NATIVE_RETENTION instead of vanishing at the
            # exact moment it needs replacing.
            snap = snapshot_cache.get(rec["eid"])
            if snap and snap.get("low") and now - snap["ts"] <= _NATIVE_RETENTION:
                low = True
                level = snap.get("level")
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
    """Whether the Battery Notes integration is present (any battery_plus).

    Binaries count too (#121): an install whose only noted devices are
    low-only sources has no ``battery_plus`` sensor at all.
    """
    for domain in ("sensor", "binary_sensor"):
        for state in hass.states.async_all(domain):
            a = state.attributes
            if a.get("device_class") == "battery" and "battery_type" in a:
                return True
    return False


def has_batteries(hass: HomeAssistant) -> bool:
    """Whether ANY battery is trackable — Battery Notes OR native. Gates setup."""
    if any(_is_native_battery_sensor(s) for s in hass.states.async_all("sensor")):
        return True
    return any(s.attributes.get("device_class") == "battery" for s in hass.states.async_all("binary_sensor"))


def compute_overview(hass: HomeAssistant, *, horizon_days: int = DEFAULT_HORIZON_DAYS) -> BatteryOverview:
    """Read + aggregate in one call (SYNC entry point — table forecast only).

    The summary sensors call this from their update path; recorder-backed
    trend regression stays out of it deliberately. The panel goes through
    :func:`async_compute_overview` instead.
    """
    today = dt_util.now().date()
    return build_overview(read_batteries(hass), today=today, horizon_days=horizon_days)


# ── discharge-trend forecast (#114 follow-up) ───────────────────────────────

_TREND_CACHE_KEY = "maintenance_supporter_battery_trend_cache"
_TREND_CACHE_TTL = timedelta(hours=6)
_TREND_MIN_CONFIDENCE = ("medium", "high")
# Beyond this the regression extrapolates >12x its 30 d observation window —
# a real prod evaluation produced "empty in 1142 d" at medium confidence for a
# barely-draining motion sensor, where the type table is the honest answer.
_TREND_MAX_DAYS = 365
# Reject a series whose level ROSE by more than this (percent points) after a
# minimum inside the window: real discharges are monotone-ish, big recoveries
# mean the percentage tracks something else (cold-dip voltage bounce on a
# CR2032 is the classic). Small relaxation bounces (+3-4 %, seen on a real
# LYWSD03MMC) stay below it.
_TREND_MAX_RECOVERY_PCT = 10.0


async def async_trend_predictions(hass: HomeAssistant, batteries: list[Battery]) -> dict[str, tuple[int, str]]:
    """Per-battery discharge-trend forecast: {entity_id: (days_until, confidence)}.

    Reuses the SensorPredictor's recorder regression, asking "when does this
    level sensor fall below its low threshold?". Only batteries with a live
    percentage reading are analysed (low-only binaries have no level to
    regress); low-confidence, non-falling, and far-out trends (beyond
    ``_TREND_MAX_DAYS``) are dropped so the caller can fall back to the
    type-lifetime table.

    Cached for 6 h per entity (misses included) — batteries drain over weeks,
    and the overview is fetched on every panel visit; 30+ recorder regressions
    per click would be waste.
    """
    from .sensor_predictor import SensorPredictor

    cache: dict[str, tuple[Any, tuple[int, str] | None]] = hass.data.setdefault(_TREND_CACHE_KEY, {})
    now = dt_util.utcnow()
    predictor = SensorPredictor(hass)
    out: dict[str, tuple[int, str]] = {}

    for bat in batteries:
        if bat.level is None or not bat.available or bat.low:
            continue
        cached = cache.get(bat.entity_id)
        if cached is not None and now - cached[0] < _TREND_CACHE_TTL:
            if cached[1] is not None:
                out[bat.entity_id] = cached[1]
            continue

        # The replacement moment is the fleet's low signal — the battery's
        # own low_threshold (shared with the sparkline and the level bars).
        threshold = bat.low_threshold

        result: tuple[int, str] | None = None
        try:
            pred = await predictor.async_predict_below(bat.entity_id, threshold, max_recovery=_TREND_MAX_RECOVERY_PCT)
            if (
                pred is not None
                and pred.days_until_threshold is not None
                and pred.confidence in _TREND_MIN_CONFIDENCE
                and pred.days_until_threshold <= _TREND_MAX_DAYS
            ):
                result = (int(pred.days_until_threshold), pred.confidence)
        except Exception:  # noqa: BLE001 - a recorder hiccup must never break the overview
            _LOGGER.debug("Trend prediction failed for %s", bat.entity_id, exc_info=True)
        cache[bat.entity_id] = (now, result)
        if result is not None:
            out[bat.entity_id] = result
    return out


async def async_compute_overview(hass: HomeAssistant, *, horizon_days: int = DEFAULT_HORIZON_DAYS) -> BatteryOverview:
    """Read + trend-enrich + aggregate (the panel's entry point)."""
    batteries = read_batteries(hass)
    trends = await async_trend_predictions(hass, batteries)
    return build_overview(batteries, today=dt_util.now().date(), horizon_days=horizon_days, trend_predictions=trends)


# ── level history for the roster sparklines ────────────────────────────────

_HISTORY_CACHE_KEY = "maintenance_supporter_battery_history_cache"
_HISTORY_CACHE_TTL = timedelta(hours=6)
# ~60 points draw a smooth 30 d line; hourly stats would be 720.
_HISTORY_MAX_POINTS = 60


def _downsample(points: list[tuple[float, float]], max_points: int = _HISTORY_MAX_POINTS) -> list[tuple[float, float]]:
    """Bucket-mean a point series down to at most ``max_points``.

    Mean per bucket (not every-Nth) so a short voltage dip still leaves a
    visible dent instead of being skipped entirely.
    """
    if len(points) <= max_points:
        return points
    size = (len(points) + max_points - 1) // max_points
    out: list[tuple[float, float]] = []
    for i in range(0, len(points), size):
        bucket = points[i : i + size]
        out.append((bucket[-1][0], sum(v for _, v in bucket) / len(bucket)))
    return out


# A real cell swap shows as a large upward step between adjacent 12 h buckets
# (+40..+90 typically); relaxation bounces stay under ~5. Between them: 25.
_JUMP_MIN_RISE = 25.0
# A jump already recorded within this many days of battery_last_replaced is
# NOT flagged — the user pressed the button, nothing to fix.
_JUMP_RECORDED_SLACK_DAYS = 2


def _detect_unrecorded_jump(
    points: list[tuple[float, float]],
    last_replaced: date | None,
    *,
    rechargeable: bool = False,
) -> dict[str, Any] | None:
    """An upward level step that looks like a swap nobody recorded.

    A real fleet had a sensor sit at 16 % for three weeks, get fresh cells and
    jump to 100 % — while ``battery_last_replaced`` stayed 21 months old,
    silently anchoring the type-lifetime forecast to the DEAD battery. The
    step is unmistakable in the recorder, so surface it and offer to record
    it. Rechargeables are exempt: their packs jump on every routine charge.
    """
    from itertools import pairwise

    if rechargeable:
        return None
    for (_, v_prev), (ts, v) in pairwise(points):
        if v - v_prev < _JUMP_MIN_RISE:
            continue
        jump_date = dt_util.utc_from_timestamp(ts).date()
        if last_replaced is not None and abs((jump_date - last_replaced).days) <= _JUMP_RECORDED_SLACK_DAYS:
            continue  # already recorded
        return {"at": round(ts), "from": round(v_prev, 1), "to": round(v, 1)}
    return None


def _note_low_threshold(attrs: dict[str, Any]) -> float:
    """The Battery-Notes-configured threshold OR the fleet floor — the higher."""
    raw = attrs.get("battery_low_threshold")
    if isinstance(raw, (int, float)):
        return float(max(raw, NATIVE_LOW_PERCENT))
    return float(NATIVE_LOW_PERCENT)


async def async_level_history(hass: HomeAssistant, batteries: list[Battery]) -> dict[str, dict[str, Any]]:
    """Per-battery downsampled level history: {entity_id: {points, threshold}}.

    Feeds the roster sparklines. Same 30 d recorder window the trend
    regression sees (so the drawn line IS what the forecast reasoned about),
    same 6 h cache-including-misses discipline as the trend — the roster is
    opened per panel visit and batteries drain over weeks. Low batteries are
    included (unlike the trend): the dive INTO low is exactly what the
    sparkline should show.
    """
    from .sensor_predictor import SensorPredictor

    cache: dict[str, tuple[Any, list[tuple[float, float]]]] = hass.data.setdefault(_HISTORY_CACHE_KEY, {})
    now = dt_util.utcnow()
    predictor = SensorPredictor(hass)
    out: dict[str, dict[str, Any]] = {}

    for bat in batteries:
        if bat.level is None and not bat.low:
            continue  # low-only binaries have no level series to draw
        cached = cache.get(bat.entity_id)
        if cached is not None and now - cached[0] < _HISTORY_CACHE_TTL:
            points = cached[1]
        else:
            try:
                # Deliberate reuse of the predictor's fetch so the sparkline
                # and the regression see the same series.
                points = _downsample(await predictor._async_fetch_statistics_points(bat.entity_id, 30))
            except Exception:  # noqa: BLE001 - a recorder hiccup must never break the roster
                _LOGGER.debug("Level history failed for %s", bat.entity_id, exc_info=True)
                points = []
            cache[bat.entity_id] = (now, points)
        if points:
            entry: dict[str, Any] = {
                "points": [[round(ts), round(v, 1)] for ts, v in points],
                "threshold": bat.low_threshold,
            }
            jump = _detect_unrecorded_jump(points, bat.last_replaced, rechargeable=is_rechargeable_type(bat.battery_type))
            if jump is not None:
                # The Battery Notes service that records a replacement takes
                # the DEVICE — resolve it here so the panel's one-click fix
                # doesn't need a registry lookup of its own.
                from homeassistant.helpers import entity_registry as er

                reg = er.async_get(hass).async_get(bat.entity_id)
                if reg and reg.device_id:
                    entry["jump"] = {**jump, "device_id": reg.device_id}
            out[bat.entity_id] = entry
    return out


def discover_battery_types(hass: HomeAssistant) -> OrderedDict[str, int]:
    """Battery types present across the fleet → total quantity, for part setup.

    Rechargeable types are left out: nobody stocks a "RECHARGEABLE" spare, so
    setup must not mint a part (with a reorder threshold!) for one. The
    UNKNOWN bucket is left out for the same reason — native batteries without
    a type once minted an "UNKNOWN battery" part whose buy link was an
    Amazon search for the literal word UNKNOWN (seen on a real fleet at
    0 of 22). Give the battery a type (a Battery Notes note) and it gets a
    real part.
    """
    totals: OrderedDict[str, int] = OrderedDict()
    for bat in read_batteries(hass):
        if is_rechargeable_type(bat.battery_type):
            continue
        t = _norm_type(bat.battery_type)
        if t == "UNKNOWN":
            continue
        totals[t] = totals.get(t, 0) + bat.quantity
    return OrderedDict(sorted(totals.items()))


__all__ = [
    "DEFAULT_HORIZON_DAYS",
    "NATIVE_LOW_PERCENT",
    "TYPICAL_LIFETIME_MONTHS",
    "Battery",
    "BatteryOverview",
    "async_compute_overview",
    "async_level_history",
    "async_trend_predictions",
    "build_overview",
    "compute_overview",
    "discover_battery_types",
    "fleet_excluded_entities",
    "has_batteries",
    "has_battery_notes",
    "is_rechargeable_type",
    "lifetime_months",
    "read_batteries",
]
