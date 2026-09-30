"""Maintenance cost per Home Assistant area as sensors (#191).

Two sensors per area that holds objects — archived ones included:

* ``sensor.<area>_maintenance_cost``: everything booked so far, a monetary
  ``total`` — the recorder keeps long-term statistics, so a statistics graph
  with period = year shows what the room cost per year;
* ``sensor.<area>_maintenance_cost_this_year`` (disabled by default): this
  calendar year, resetting on 1 January (``last_reset``).

The entities belong to the global entry, carry no device and are placed in
their area once, when they are created (a later move by the user sticks), so
they show up on the area's dashboard. Values follow the budget's rule (a
completion's booked spending, helpers.parts_cost.entry_spend).

An object's history can only be read while its entry is loaded. Each object's
last known spending is kept, and the sensors read unavailable until every
object has been read once — a sum that dropped to zero during startup or a
reload would be recorded as a negative and then a positive cost.
"""

from __future__ import annotations

from datetime import date, datetime

from homeassistant.components.sensor import (
    ENTITY_ID_FORMAT,
    SensorDeviceClass,
    SensorEntity,
    SensorStateClass,
)
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import CALLBACK_TYPE, Event, HomeAssistant, callback
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.entity import async_generate_entity_id
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.util import dt as dt_util

from ..const import (
    CONF_BUDGET_CURRENCY,
    CONF_CURRENCY_DECIMALS,
    DEFAULT_BUDGET_CURRENCY,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from ..helpers.aggregate import get_object_entries
from ..helpers.area_costs import AreaCost, entry_cost, object_area_id
from ..helpers.global_options import global_option
from .summary_coordinator import MaintenanceSummaryCoordinator

KINDS = ("total", "year")
_UNIQUE_PREFIX = f"{GLOBAL_UNIQUE_ID}_area_cost_"
# An entry that is still on its way up (or back up) has not been read yet.
_PENDING_STATES = (ConfigEntryState.NOT_LOADED, ConfigEntryState.SETUP_IN_PROGRESS, ConfigEntryState.SETUP_RETRY)


def area_cost_unique_id(area_id: str, kind: str) -> str:
    """Registry-stable unique id of one area's sensor (``kind``: total/year)."""
    return f"{_UNIQUE_PREFIX}{kind}_{area_id}"


def _area_of_unique_id(unique_id: str) -> str | None:
    if not unique_id.startswith(_UNIQUE_PREFIX):
        return None
    kind, _, area_id = unique_id[len(_UNIQUE_PREFIX) :].partition("_")
    return area_id if kind in KINDS and area_id else None


class AreaCostSensor(SensorEntity):
    """One area's booked maintenance spending (all time, or this year)."""

    _attr_has_entity_name = True
    _attr_should_poll = False
    _attr_device_class = SensorDeviceClass.MONETARY
    _attr_state_class = SensorStateClass.TOTAL

    def __init__(self, manager: AreaCostSensorManager, area_id: str, kind: str, area_name: str) -> None:
        """Initialize the sensor for one area."""
        self.hass = manager.hass
        self._manager = manager
        self._area_id = area_id
        self._kind = kind
        self._value = 0.0
        self._added = False
        self._attr_unique_id = area_cost_unique_id(area_id, kind)
        self._attr_translation_key = "area_cost" if kind == "total" else "area_cost_year"
        self._attr_translation_placeholders = {"area": area_name}
        self._attr_suggested_display_precision = int(global_option(manager.hass, CONF_CURRENCY_DECIMALS) or 0)
        if kind == "year":
            self._attr_entity_registry_enabled_default = False
        suffix = "maintenance_cost" if kind == "total" else "maintenance_cost_this_year"
        self.entity_id = async_generate_entity_id(ENTITY_ID_FORMAT, f"{area_id}_{suffix}", hass=manager.hass)

    @property
    def available(self) -> bool:
        """Unavailable until every object's history has been read once."""
        return self._manager.ready

    @property
    def native_unit_of_measurement(self) -> str:
        """The household's currency (Settings → General)."""
        return str(global_option(self.hass, CONF_BUDGET_CURRENCY) or DEFAULT_BUDGET_CURRENCY)

    @property
    def native_value(self) -> float:
        """The booked spending, rounded to the cent."""
        return round(self._value, 2)

    @property
    def last_reset(self) -> datetime | None:
        """1 January for the yearly sensor; the all-time one never resets."""
        if self._kind != "year":
            return None
        return dt_util.start_of_local_day(date(dt_util.now().year, 1, 1))

    async def async_added_to_hass(self) -> None:
        """Place the sensor in its area — once, so a later move sticks."""
        await super().async_added_to_hass()
        self._added = True
        ent_reg = er.async_get(self.hass)
        entry = ent_reg.async_get(self.entity_id)
        if entry is None:
            return
        own_options = entry.options.get(DOMAIN)
        if own_options is not None and own_options.get("area_assigned"):
            return
        ent_reg.async_update_entity_options(self.entity_id, DOMAIN, {"area_assigned": True})
        if entry.area_id is None and ar.async_get(self.hass).async_get_area(self._area_id) is not None:
            ent_reg.async_update_entity(self.entity_id, area_id=self._area_id)

    @callback
    def async_update_value(self, value: float) -> None:
        """Take a new value (written once the entity is live)."""
        self._value = value
        if self._added:
            self.async_write_ha_state()

    @callback
    def async_rename(self, area_name: str) -> None:
        """The area was renamed in Home Assistant."""
        self._attr_translation_placeholders = {"area": area_name}
        # The translated name is a cached property that only invalidates
        # when _attr_name changes — drop it the way Home Assistant's own
        # _attr_ setters do, so the next state carries the new name.
        self.__dict__.pop("name", None)
        if self._added:
            self.async_write_ha_state()


class AreaCostSensorManager:
    """Creates, feeds and tidies the per-area cost sensors."""

    def __init__(self, hass: HomeAssistant, global_entry_id: str, add_entities: AddEntitiesCallback) -> None:
        """Initialize the manager for the global entry's sensor platform."""
        self.hass = hass
        self._global_entry_id = global_entry_id
        self._add_entities = add_entities
        self._sensors: dict[str, dict[str, AreaCostSensor]] = {}
        # entry_id → (area_id, last known spending of that object)
        self._known: dict[str, tuple[str | None, AreaCost]] = {}
        self.ready = False

    @callback
    def async_start(self, coordinator: MaintenanceSummaryCoordinator) -> CALLBACK_TYPE:
        """Create the sensors and follow every change of the objects.

        ``coordinator`` is the summary coordinator: it recomputes whenever any
        object's coordinator updates, an object is added or removed.
        """
        self._restore_registered()
        self._refresh()
        unsubs = [
            coordinator.async_add_listener(self._refresh),
            self.hass.bus.async_listen(ar.EVENT_AREA_REGISTRY_UPDATED, self._on_area_registry),
        ]

        @callback
        def _stop() -> None:
            for unsub in unsubs:
                unsub()

        return _stop

    def _area_name(self, area_id: str) -> str:
        area = ar.async_get(self.hass).async_get_area(area_id)
        return area.name if area is not None else area_id

    @callback
    def _restore_registered(self) -> None:
        """Bring back the sensors of earlier runs whose area still exists or
        still has objects; drop the rest (the area was deleted, nothing left)."""
        ent_reg = er.async_get(self.hass)
        areas = ar.async_get(self.hass)
        with_objects = {area for entry in get_object_entries(self.hass) if (area := object_area_id(entry))}
        keep: set[str] = set()
        for reg in er.async_entries_for_config_entry(ent_reg, self._global_entry_id):
            area_id = _area_of_unique_id(reg.unique_id)
            if area_id is None:
                continue
            if area_id in with_objects or areas.async_get_area(area_id) is not None:
                keep.add(area_id)
            else:
                ent_reg.async_remove(reg.entity_id)
        self._ensure(keep)

    @callback
    def _ensure(self, area_ids: set[str]) -> None:
        new: list[AreaCostSensor] = []
        for area_id in sorted(area_ids - self._sensors.keys()):
            name = self._area_name(area_id)
            pair = {kind: AreaCostSensor(self, area_id, kind, name) for kind in KINDS}
            self._sensors[area_id] = pair
            new.extend(pair.values())
        if new:
            self._add_entities(new)

    @callback
    def _refresh(self) -> None:
        pending = False
        live: set[str] = set()
        with_objects: set[str] = set()
        for entry in get_object_entries(self.hass):
            live.add(entry.entry_id)
            area_id = object_area_id(entry)
            if area_id:
                with_objects.add(area_id)
            cost = entry_cost(self.hass, entry)
            if cost is not None:
                self._known[entry.entry_id] = (area_id, cost)
            elif entry.entry_id in self._known:
                # Mid-reload: keep the last known spending, follow an area move.
                self._known[entry.entry_id] = (area_id, self._known[entry.entry_id][1])
            elif entry.disabled_by is None and entry.state in _PENDING_STATES:
                pending = True
        for entry_id in self._known.keys() - live:
            del self._known[entry_id]  # the object was deleted

        totals: dict[str, AreaCost] = {}
        for area_id, cost in self._known.values():
            if area_id:
                area = totals.setdefault(area_id, AreaCost())
                area.total += cost.total
                area.year += cost.year
        # Once every object was read, stay ready: a later reload keeps the
        # last known spending instead.
        self.ready = self.ready or not pending
        self._ensure(set(totals) | with_objects)
        for area_id, sensors in self._sensors.items():
            cost = totals.get(area_id) or AreaCost()
            sensors["total"].async_update_value(cost.total)
            sensors["year"].async_update_value(cost.year)

    @callback
    def _on_area_registry(self, event: Event[ar.EventAreaRegistryUpdatedData]) -> None:
        if event.data.get("action") != "update":
            return
        area_id = event.data.get("area_id")
        sensors = self._sensors.get(area_id or "")
        if sensors:
            name = self._area_name(area_id or "")
            for sensor in sensors.values():
                sensor.async_rename(name)
