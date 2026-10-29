"""The service actions: complete / reset / skip on one or many task sensors,
export_data, add_object, add_task, update_task, delete_task, list_tasks and the
spare-part actions (restock, use, ready again, dispose).

Registered from async_setup (_async_setup_shared): once per boot, and again
after the last entry's unload dropped the shared runtime. A content service
holds a calling user to the tier of the matching WS command
(helpers.permissions.service_tier)."""

from __future__ import annotations

from collections.abc import Awaitable, Callable, Mapping
from datetime import date as date_cls
from typing import Any

import voluptuous as vol
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import ATTR_ENTITY_ID
from homeassistant.core import (
    HomeAssistant,
    ServiceCall,
    SupportsResponse,
    callback,
)
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
from homeassistant.helpers import (
    config_validation as cv,
)
from homeassistant.helpers import (
    entity_registry as er,
)
from homeassistant.util import dt as dt_util

from .const import (
    CONF_OBJECT,
    CONF_PARTS,
    CONF_TASKS,
    DOMAIN,
    FLAT_SCHEDULE_TYPES,
    GLOBAL_UNIQUE_ID,
    MAX_ASSIGNEE_POOL,
    MAX_COST,
    MAX_DURATION_MINUTES,
    MAX_LABEL_LENGTH,
    MAX_LABELS,
    MAX_NAME_LENGTH,
    MAX_TEXT_LENGTH,
    MAX_TYPE_LENGTH,
    MIN_COST,
    ROTATION_NONE,
    ROTATION_STRATEGIES,
    SERVICE_ADD_OBJECT,
    SERVICE_ADD_TASK,
    SERVICE_COMPLETE,
    SERVICE_DELETE_TASK,
    SERVICE_EXPORT,
    SERVICE_LIST_TASKS,
    SERVICE_PART_DISPOSE,
    SERVICE_PART_PURCHASE,
    SERVICE_PART_READY_AGAIN,
    SERVICE_PART_RESTOCK,
    SERVICE_PART_USE,
    SERVICE_RESET,
    SERVICE_SKIP,
    SERVICE_UPDATE_TASK,
    TriggerType,
)
from .coordinator import MaintenanceCoordinator
from .entity.triggers import primary_entity_id
from .export import build_export_data, serialize_export_to_file
from .helpers.aggregate import iter_live_tasks, store_of
from .helpers.aggregate import object_name as aggregate_object_name
from .helpers.aggregate import object_slug as aggregate_object_slug
from .helpers.aggregate import task_sensor_entity_id as aggregate_task_sensor_entity_id
from .helpers.assignees import task_is_for, task_people_attributes
from .helpers.dates import INTERVAL_UNITS
from .helpers.entry_tasks import ArchivedObjectError
from .helpers.global_options import get_default_warning_days
from .helpers.import_mapping import async_attach_move_hints
from .helpers.object_names import name_taken
from .helpers.parts import MAX_PART_COST, MAX_PART_STOCK
from .helpers.permissions import service_tier
from .helpers.reading_slots import resolve_reading_values_by_name
from .helpers.task_fields import (
    INTERVAL_DAYS_RANGE,
    TASK_PRIORITIES,
    WARNING_DAYS_RANGE,
)
from .helpers.task_persist import async_create_task_simple, async_delete_task, async_update_task_simple
from .helpers.url_safety import is_safe_url
from .models.runtime_data import MaintenanceSupporterData
from .parts_runtime import (
    async_change_part_stock,
    async_part_dispose,
    async_part_purchase,
    async_part_ready_again,
    async_part_use,
)

# --- Service Schemas ---
SERVICE_COMPLETE_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_ENTITY_ID): vol.All(cv.entity_ids, vol.Length(min=1)),
        vol.Optional("notes"): vol.All(cv.string, vol.Length(max=2000)),
        vol.Optional("cost"): vol.All(vol.Coerce(float), vol.Range(min=MIN_COST, max=MAX_COST)),
        vol.Optional("duration"): vol.All(vol.Coerce(int), vol.Range(min=0, max=MAX_DURATION_MINUTES)),
        # Meter readings (v2.20, #83): recorded value for `reading` tasks.
        vol.Optional("reading_value"): vol.All(vol.Coerce(float), vol.Range(min=-1e12, max=1e12)),
        # #161 phase 2: {reading name: value} for a task with reading slots —
        # automations know meters by name; resolved case-insensitively.
        vol.Optional("reading_values"): {cv.string: vol.Any(vol.All(vol.Coerce(float), vol.Range(min=-1e12, max=1e12)), None)},
        # #128: who did it — a person ENTITY (validated picker, no free text);
        # resolved to the linked HA user id. Omitted -> the calling user.
        vol.Optional("completed_by"): cv.entity_id,
        # #133: when the maintenance was actually performed (backfill a past
        # completion). Future values are rejected by the coordinator.
        vol.Optional("completed_at"): cv.datetime,
        vol.Optional("via_tag_scan"): cv.boolean,
    }
)

def _not_in_future(value: date_cls) -> date_cls:
    """A reset date is a day the work WAS done: a future one (9999-12-20 via
    the service, any household member) overflowed the schedule math inside
    every refresh and kept the object in setup-retry across restarts (bug
    audit 2026-09-27). Evaluated at call time, in HA's time zone."""
    if value > dt_util.now().date():
        raise vol.Invalid("date must not be in the future")
    return value


SERVICE_RESET_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_ENTITY_ID): vol.All(cv.entity_ids, vol.Length(min=1)),
        vol.Optional("date"): vol.All(cv.date, _not_in_future),
    }
)

SERVICE_SKIP_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_ENTITY_ID): vol.All(cv.entity_ids, vol.Length(min=1)),
        vol.Optional("reason"): vol.All(cv.string, vol.Length(max=2000)),
    }
)

SERVICE_EXPORT_SCHEMA = vol.Schema(
    {
        vol.Optional("format", default="json"): vol.In(["json", "yaml"]),
        vol.Optional("include_history", default=True): cv.boolean,
    }
)

SERVICE_ADD_OBJECT_SCHEMA = vol.Schema(
    {
        # The panel's limit (MAX_NAME_LENGTH): 255 here let the service store
        # a name no other surface could save again (BI5-A11).
        vol.Required("name"): vol.All(cv.string, vol.Length(min=1, max=MAX_NAME_LENGTH)),
        vol.Optional("area_id"): cv.string,
        vol.Optional("manufacturer"): cv.string,
        vol.Optional("model"): cv.string,
        vol.Optional("serial_number"): cv.string,
        vol.Optional("installation_date"): cv.string,
        vol.Optional("warranty_expiry"): cv.string,
        vol.Optional("documentation_url"): cv.string,
        vol.Optional("notes"): cv.string,
    }
)

# The service task schemas mirror the WS `task/create` / `task/update` schemas
# field-for-field, consuming the SAME constants + ranges (const.py /
# helpers.task_fields) rather than restating literals — the service path is
# just a third UI onto the same storage, so a value the WS API rejects must not
# be reachable from an automation. `vol.Coerce` stays (unlike the WS schemas)
# because YAML/templated service data arrives as strings.
# Only the recurrences the flat service fields can express. "sensor_based"
# was offered but a service cannot set the trigger, so it silently became an
# interval or manual task (audit 2026-09-29); calendar kinds go via `schedule`.
_SERVICE_SCHEDULE_TYPE = vol.In(sorted(str(kind) for kind in FLAT_SCHEDULE_TYPES))

SERVICE_ADD_TASK_SCHEMA = vol.Schema(
    {
        vol.Required("entry_id"): cv.string,
        vol.Required("name"): vol.All(cv.string, vol.Length(min=1, max=MAX_NAME_LENGTH)),
        vol.Optional("task_type"): vol.All(cv.string, vol.Length(max=MAX_TYPE_LENGTH)),
        vol.Optional("schedule_type"): _SERVICE_SCHEDULE_TYPE,
        vol.Optional("interval_days"): vol.All(
            vol.Coerce(int), vol.Range(min=INTERVAL_DAYS_RANGE[0], max=INTERVAL_DAYS_RANGE[1])
        ),
        vol.Optional("interval_unit"): vol.In(INTERVAL_UNITS),
        vol.Optional("due_date"): cv.string,
        # Nested recurrence for the calendar kinds (weekdays / nth_weekday /
        # day_of_month); takes precedence over the flat fields above.
        vol.Optional("schedule"): dict,
        vol.Optional("warning_days"): vol.All(vol.Coerce(int), vol.Range(min=WARNING_DAYS_RANGE[0], max=WARNING_DAYS_RANGE[1])),
        vol.Optional("enabled"): cv.boolean,
        vol.Optional("notes"): vol.All(cv.string, vol.Length(max=MAX_TEXT_LENGTH)),
        # #232: who it is for, as update_task takes it.
        vol.Optional("responsible_user"): cv.entity_id,
        # #232: *Shared with* as person entities (each resolved to its HA
        # user; an empty list clears it) and the rotation between them.
        vol.Optional("shared_with"): vol.All(cv.entity_ids, vol.Length(max=MAX_ASSIGNEE_POOL)),
        vol.Optional("rotation"): vol.In([*ROTATION_STRATEGIES, ROTATION_NONE]),
    }
)

SERVICE_UPDATE_TASK_SCHEMA = vol.Schema(
    {
        vol.Required("entry_id"): cv.string,
        vol.Required("task_id"): cv.string,
        vol.Optional("name"): vol.All(cv.string, vol.Length(min=1, max=MAX_NAME_LENGTH)),
        vol.Optional("task_type"): vol.All(cv.string, vol.Length(max=MAX_TYPE_LENGTH)),
        vol.Optional("schedule_type"): _SERVICE_SCHEDULE_TYPE,
        vol.Optional("interval_days"): vol.All(
            vol.Coerce(int), vol.Range(min=INTERVAL_DAYS_RANGE[0], max=INTERVAL_DAYS_RANGE[1])
        ),
        vol.Optional("interval_unit"): vol.In(INTERVAL_UNITS),
        vol.Optional("due_date"): cv.string,
        vol.Optional("schedule"): dict,
        vol.Optional("warning_days"): vol.All(vol.Coerce(int), vol.Range(min=WARNING_DAYS_RANGE[0], max=WARNING_DAYS_RANGE[1])),
        vol.Optional("enabled"): cv.boolean,
        vol.Optional("notes"): vol.All(cv.string, vol.Length(max=MAX_TEXT_LENGTH)),
        vol.Optional("priority"): vol.In(TASK_PRIORITIES),
        vol.Optional("labels"): vol.All([vol.All(cv.string, vol.Length(max=MAX_LABEL_LENGTH))], vol.Length(max=MAX_LABELS)),
        # #128: (re)assign via automations — a person ENTITY resolved to the
        # linked HA user; the boolean clears the assignment instead.
        vol.Optional("responsible_user"): cv.entity_id,
        vol.Optional("clear_responsible_user"): cv.boolean,
        # #232: *Shared with* as person entities (each resolved to its HA
        # user; an empty list clears it) and the rotation between them.
        vol.Optional("shared_with"): vol.All(cv.entity_ids, vol.Length(max=MAX_ASSIGNEE_POOL)),
        vol.Optional("rotation"): vol.In([*ROTATION_STRATEGIES, ROTATION_NONE]),
    }
)

SERVICE_DELETE_TASK_SCHEMA = vol.Schema(
    {
        vol.Required("entry_id"): cv.string,
        vol.Required("task_id"): cv.string,
    }
)

SERVICE_LIST_TASKS_SCHEMA = vol.Schema(
    {
        vol.Optional("entry_id"): cv.string,
        vol.Optional("status"): vol.In(["ok", "due_soon", "overdue", "triggered", "paused"]),
        # #210: only the tasks meant for this person (helpers/assignees).
        vol.Optional("person"): cv.entity_id,
    }
)

# #218: the part actions, addressed by the part's stock sensor. The bounds
# are the WS commands' (part/restock, part/ready_again, part/dispose).
_PART_COUNT = vol.All(vol.Coerce(float), vol.Range(min=0, max=MAX_PART_STOCK))

SERVICE_PART_RESTOCK_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_ENTITY_ID): vol.All(cv.entity_ids, vol.Length(min=1)),
        # Exactly one: a change (negative for a correction) or the new count.
        vol.Exclusive("delta", "amount"): vol.All(vol.Coerce(float), vol.Range(min=-MAX_PART_STOCK, max=MAX_PART_STOCK)),
        vol.Exclusive("absolute", "amount"): _PART_COUNT,
    }
)

SERVICE_PART_PILE_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_ENTITY_ID): vol.All(cv.entity_ids, vol.Length(min=1)),
        vol.Optional("quantity"): _PART_COUNT,
    }
)

# #226: the bounds of part/use — a use of nothing is no use.
SERVICE_PART_USE_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_ENTITY_ID): vol.All(cv.entity_ids, vol.Length(min=1)),
        vol.Optional("quantity"): vol.All(vol.Coerce(float), vol.Range(min=0, min_included=False, max=MAX_PART_STOCK)),
    }
)

# #238: a purchase. The bounds of part/purchase; the date a day, as bought.
SERVICE_PART_PURCHASE_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_ENTITY_ID): vol.All(cv.entity_ids, vol.Length(min=1)),
        vol.Optional("quantity"): vol.All(vol.Coerce(float), vol.Range(min=0, min_included=False, max=MAX_PART_STOCK)),
        vol.Exclusive("unit_price", "price"): vol.All(vol.Coerce(float), vol.Range(min=0, max=MAX_PART_COST)),
        vol.Exclusive("cost", "price"): vol.All(vol.Coerce(float), vol.Range(min=0, max=MAX_COST)),
        vol.Optional("date"): cv.date,
        vol.Optional("notes"): vol.All(cv.string, vol.Length(max=MAX_TEXT_LENGTH)),
    }
)


# Mirrors renderers/progress.ts: the configured limit and the unit the panel
# shows next to the live reading, per trigger type. Runtime accumulates HOURS
# regardless of the watched entity (a switch has no unit_of_measurement),
# state_change counts transitions (no unit), threshold/counter carry the
# source entity's unit.
def _trigger_target_and_unit(hass: HomeAssistant, tc: Mapping[str, Any]) -> tuple[float | None, str | None]:
    ttype = tc.get("type")
    if ttype == TriggerType.RUNTIME:
        return tc.get("trigger_runtime_hours"), "h"
    if ttype == TriggerType.STATE_CHANGE:
        return tc.get("trigger_target_changes"), None
    if ttype == TriggerType.DUE_DATE:
        return tc.get("trigger_days_before") or 0, "d"
    if ttype == TriggerType.COMPOUND:
        return None, None

    unit: str | None = None
    # The first watched entity — a trigger stored with only the plural
    # ``entity_ids`` had no unit here (DRY audit 2026-09-26 B).
    if source := primary_entity_id(tc):
        st = hass.states.get(source)
        if st:
            unit = st.attributes.get("unit_of_measurement")
    if ttype == TriggerType.COUNTER:
        return tc.get("trigger_target_value"), unit
    above, below = tc.get("trigger_above"), tc.get("trigger_below")
    return (above if above is not None else below), unit


def _get_coordinator_for_entity(hass: HomeAssistant, entity_id: str) -> MaintenanceCoordinator | None:
    """Find the coordinator that manages the given entity."""
    entity_registry = er.async_get(hass)
    entry = entity_registry.async_get(entity_id)
    if entry is None:
        return None

    config_entry_id = entry.config_entry_id
    if config_entry_id is None:
        return None

    config_entry = hass.config_entries.async_get_entry(config_entry_id)
    # Only OUR entries: a foreign integration's entry may carry its own
    # runtime_data, and reading ``.coordinator`` off it raised a bare
    # AttributeError that escaped the per-task error collection and aborted
    # the rest of a multi-entity call (bug review 2026-09-04).
    if config_entry is None or config_entry.domain != DOMAIN:
        return None

    runtime_data = getattr(config_entry, "runtime_data", None)
    if not isinstance(runtime_data, MaintenanceSupporterData):
        return None

    return runtime_data.coordinator


def _get_task_id_for_entity(hass: HomeAssistant, entity_id: str) -> str | None:
    """Extract the task ID from an entity's unique_id."""
    entity_registry = er.async_get(hass)
    entry = entity_registry.async_get(entity_id)
    if entry is None or entry.unique_id is None:
        return None

    # unique_id format: maintenance_supporter_{object_slug}_{task_id}
    # task_id is a 32-char hex UUID without dashes at the end
    unique_id = entry.unique_id
    prefix = "maintenance_supporter_"
    if not unique_id.startswith(prefix):
        return None

    # Find the task_id: last part after the object slug
    # Object slug could have underscores, so we find the task_id
    # by looking at what config entry this entity belongs to
    config_entry_id = entry.config_entry_id
    if config_entry_id is None:
        return None

    config_entry = hass.config_entries.async_get_entry(config_entry_id)
    if config_entry is None:
        return None

    # Look up which task matches this unique_id (const.task_unique_id):
    # maintenance_supporter_{slug}_{task_id}[_{suffix}] — the task sensor has
    # no suffix; the overdue binary sensor, the next-due / days-until-due
    # sensors and the complete/skip/reset buttons each add one. Only
    # "_overdue" used to be recognised, so picking a task's next-due sensor
    # as the service target failed with no_task_for_entity.
    tasks: dict[str, Any] = config_entry.data.get(CONF_TASKS, {})
    for task_id in tasks:
        marker = f"_{task_id}"
        if unique_id.endswith(marker) or f"{marker}_" in unique_id:
            return str(task_id)

    return None


def _resolve_person_user_id(hass: HomeAssistant, person_entity_id: str) -> str:
    """Resolve a person ENTITY to its linked HA user id (#128).

    Person entities are the validated way to reference a user in a
    service form (HA has no user selector) — the picker rules out typos,
    and the entity's ``user_id`` attribute carries the account link.
    """
    state = hass.states.get(person_entity_id)
    if state is None or not person_entity_id.startswith("person."):
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="person_not_found",
            translation_placeholders={"entity_id": person_entity_id},
        )
    user_id = state.attributes.get("user_id")
    if not user_id:
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="person_without_user",
            translation_placeholders={"name": state.name},
        )
    return str(user_id)


def _resolve_task_target(hass: HomeAssistant, entity_id: str) -> tuple[MaintenanceCoordinator, str]:
    """entity_id -> (coordinator, task_id), with the classic errors."""
    coordinator = _get_coordinator_for_entity(hass, entity_id)
    if coordinator is None:
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="no_coordinator_for_entity",
            translation_placeholders={"entity_id": entity_id},
        )
    task_id = _get_task_id_for_entity(hass, entity_id)
    if task_id is None:
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="no_task_for_entity",
            translation_placeholders={"entity_id": entity_id},
        )
    return coordinator, task_id


async def _run_per_task(
    hass: HomeAssistant,
    action: Callable[[MaintenanceCoordinator, str], Awaitable[None]],
    entity_ids: list[str],
    label: str,
) -> None:
    """#158: one or many task sensors. A single entity keeps today's
    exact error shape; a list runs sequentially best-effort — the
    choke-point refusals (too_early, tag_scan_required,
    completion_details_required, the skip lock, ...) hit per task, are
    collected, and never block the other tasks. Partial success stands
    and the summary error names what was refused."""
    ids = list(dict.fromkeys(entity_ids))
    if len(ids) == 1:
        coordinator, task_id = _resolve_task_target(hass, ids[0])
        await action(coordinator, task_id)
        return
    done = 0
    errors: list[str] = []
    for eid in ids:
        try:
            coordinator, task_id = _resolve_task_target(hass, eid)
            await action(coordinator, task_id)
            done += 1
        except HomeAssistantError as err:
            errors.append(f"{eid}: {err}")
    if errors:
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="bulk_partial",
            translation_placeholders={
                "action": label,
                "done": str(done),
                "total": str(len(ids)),
                "errors": " | ".join(errors),
            },
        )


async def _handle_complete(call: ServiceCall) -> None:
    """Handle the complete service call (one or many task sensors, #158)."""
    hass = call.hass
    entity_ids = call.data[ATTR_ENTITY_ID]
    if len(dict.fromkeys(entity_ids)) > 1:
        # Per-task values must not fan out: a reading belongs to ONE
        # meter, cost/duration would multiply into the budget and the
        # averages, and one physical scan proves exactly one tag.
        for field in ("reading_value", "reading_values", "cost", "duration"):
            if call.data.get(field) is not None:
                raise ServiceValidationError(
                    translation_domain=DOMAIN,
                    translation_key="single_entity_only",
                    translation_placeholders={"field": field},
                )
        # An explicit ``via_tag_scan: false`` claims nothing — only a
        # TRUE flag is the one-tag-one-task proof that must not fan out.
        if call.data.get("via_tag_scan"):
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="single_entity_only",
                translation_placeholders={"field": "via_tag_scan"},
            )
    # #128: explicit person beats the call context; the context covers the
    # common case for free (a dashboard tap propagates the tapping user).
    if call.data.get("completed_by"):
        completed_by: str | None = _resolve_person_user_id(hass, call.data["completed_by"])
    else:
        completed_by = call.context.user_id if call.context else None

    async def _one(coordinator: MaintenanceCoordinator, task_id: str) -> None:
        reading_values = None
        if call.data.get("reading_values"):
            slot_task = coordinator.merged_task(task_id) or {}
            try:
                reading_values = (
                    resolve_reading_values_by_name(
                        slot_task.get("readings") or [],
                        call.data["reading_values"],
                        default_unit=slot_task.get("reading_unit"),
                    )
                    or None
                )
            except ValueError as err:
                raise ServiceValidationError(
                    translation_domain=DOMAIN,
                    translation_key="invalid_input",
                    translation_placeholders={"error": str(err)},
                ) from err
        await coordinator.complete_maintenance(
            task_id=task_id,
            source="service",
            notes=call.data.get("notes"),
            cost=call.data.get("cost"),
            duration=call.data.get("duration"),
            reading_value=call.data.get("reading_value"),
            reading_values=reading_values,
            completed_by=completed_by,
            completed_at=call.data.get("completed_at"),
            # Proof of presence: an automation that reacted to the physical
            # scan itself passes via_tag_scan to satisfy require_tag_scan.
            tag_verified=bool(call.data.get("via_tag_scan")),
        )

    await _run_per_task(hass, _one, entity_ids, "complete")


async def _handle_reset(call: ServiceCall) -> None:
    """Handle the reset service call (one or many task sensors, #158)."""

    async def _one(coordinator: MaintenanceCoordinator, task_id: str) -> None:
        await coordinator.reset_maintenance(
            task_id=task_id,
            date=call.data.get("date"),
        )

    await _run_per_task(call.hass, _one, call.data[ATTR_ENTITY_ID], "reset")


async def _handle_skip(call: ServiceCall) -> None:
    """Handle the skip service call (one or many task sensors, #158)."""

    async def _one(coordinator: MaintenanceCoordinator, task_id: str) -> None:
        await coordinator.skip_maintenance(
            task_id=task_id,
            reason=call.data.get("reason"),
        )

    await _run_per_task(call.hass, _one, call.data[ATTR_ENTITY_ID], "skip")


async def _handle_export(call: ServiceCall) -> None:
    """Handle the export_data service call."""
    hass = call.hass

    fmt = call.data.get("format", "json")
    include_history = call.data.get("include_history", True)

    # Phase 1: gather data on the event loop (accesses HA APIs)
    data = await async_attach_move_hints(hass, build_export_data(hass, include_history=include_history))

    # Phase 2: serialize in executor (CPU-bound, no HA API calls)
    file_path = hass.config.path(f"maintenance_export.{fmt}")
    await hass.async_add_executor_job(serialize_export_to_file, data, fmt, file_path)

    # Fire lightweight event (file path only, not the full payload)
    hass.bus.async_fire(
        f"{DOMAIN}_export_completed",
        {"format": fmt, "file_path": file_path},
    )


async def _handle_add_object(call: ServiceCall) -> dict[str, Any] | None:
    """Handle the add_object service — create a maintenance object."""
    hass = call.hass
    from .helpers.object_create import async_create_object

    url = call.data.get("documentation_url")
    if url and not is_safe_url(url):
        raise ServiceValidationError(translation_domain=DOMAIN, translation_key="unsafe_url")
    # The same answer for a taken name as the panel's (it was "The action
    # could not be carried out: already_configured", BI5-A2).
    if not str(call.data["name"]).strip():
        raise ServiceValidationError(translation_domain=DOMAIN, translation_key="name_empty")
    if name_taken(hass, str(call.data["name"]).strip()):
        raise ServiceValidationError(translation_domain=DOMAIN, translation_key="object_name_taken")
    try:
        entry_id = await async_create_object(
            hass,
            name=call.data["name"],
            area_id=call.data.get("area_id"),
            manufacturer=call.data.get("manufacturer"),
            model=call.data.get("model"),
            serial_number=call.data.get("serial_number"),
            installation_date=call.data.get("installation_date"),
            warranty_expiry=call.data.get("warranty_expiry"),
            documentation_url=url,
            notes=call.data.get("notes"),
        )
    except ValueError as err:
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="invalid_input",
            translation_placeholders={"error": str(err)},
        ) from err
    return {"entry_id": entry_id} if call.return_response else None


def _people_updates(hass: HomeAssistant, data: Mapping[str, Any]) -> dict[str, Any]:
    """Who a task is for, from the add_task / update_task fields, as
    ``task_persist._apply_people`` takes it: person entities become HA user
    ids (#128), the clear flag and an empty *Shared with* map to empty
    values, and ``rotation: none`` to no rotation (#232)."""
    people: dict[str, Any] = {}
    if data.get("responsible_user"):
        people["responsible_user_id"] = _resolve_person_user_id(hass, data["responsible_user"])
    elif data.get("clear_responsible_user"):
        people["responsible_user_id"] = ""
    if "shared_with" in data:
        people["assignee_pool"] = [_resolve_person_user_id(hass, person) for person in data["shared_with"]]
    if "rotation" in data:
        people["rotation_strategy"] = "" if data["rotation"] == ROTATION_NONE else data["rotation"]
    return people


async def _handle_add_task(call: ServiceCall) -> dict[str, Any] | None:
    """Handle the add_task service — add a task to an existing object."""
    hass = call.hass

    try:
        task_id = await async_create_task_simple(
            hass,
            entry_id=call.data["entry_id"],
            name=call.data["name"],
            task_type=call.data.get("task_type", "custom"),
            schedule_type=call.data.get("schedule_type"),
            interval_days=call.data.get("interval_days"),
            interval_unit=call.data.get("interval_unit", "days"),
            due_date=call.data.get("due_date"),
            # The integration-wide default like every other create path —
            # the bare constant 7 ignored the setting (bug audit 2026-09-26).
            warning_days=call.data["warning_days"] if "warning_days" in call.data else get_default_warning_days(hass),
            enabled=call.data.get("enabled", True),
            notes=call.data.get("notes"),
            schedule=call.data.get("schedule"),
            people=_people_updates(hass, call.data),
        )
    except ArchivedObjectError as err:
        raise ServiceValidationError(translation_domain=DOMAIN, translation_key="archived_no_new_tasks") from err
    except ValueError as err:
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="invalid_input",
            translation_placeholders={"error": str(err)},
        ) from err
    return {"task_id": task_id} if call.return_response else None


async def _handle_update_task(call: ServiceCall) -> None:
    """Handle update_task — patch the common fields of an existing task."""
    hass = call.hass

    updates = {
        "name": call.data.get("name"),
        "type": call.data.get("task_type"),
        "schedule_type": call.data.get("schedule_type"),
        "interval_days": call.data.get("interval_days"),
        "interval_unit": call.data.get("interval_unit"),
        "due_date": call.data.get("due_date"),
        "schedule": call.data.get("schedule"),
        "warning_days": call.data.get("warning_days"),
        "enabled": call.data.get("enabled"),
        "notes": call.data.get("notes"),
        "priority": call.data.get("priority"),
        "labels": call.data.get("labels"),
    }
    if call.data.get("responsible_user") and call.data.get("clear_responsible_user"):
        raise ServiceValidationError(translation_domain=DOMAIN, translation_key="responsible_user_conflict")
    updates.update(_people_updates(hass, call.data))
    try:
        await async_update_task_simple(
            hass,
            entry_id=call.data["entry_id"],
            task_id=call.data["task_id"],
            updates=updates,
        )
    except ValueError as err:
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="invalid_input",
            translation_placeholders={"error": str(err)},
        ) from err


async def _handle_delete_task(call: ServiceCall) -> None:
    """Handle delete_task — remove a task and its side-state."""
    hass = call.hass

    entry_id = call.data["entry_id"]
    entry = hass.config_entries.async_get_entry(entry_id)
    if entry is None or entry.domain != DOMAIN or entry.unique_id == GLOBAL_UNIQUE_ID:
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="object_not_found",
            translation_placeholders={"entry_id": entry_id},
        )
    if not await async_delete_task(hass, entry, call.data["task_id"]):
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="task_not_found_in_object",
            translation_placeholders={"task_id": call.data["task_id"], "object_name": entry.title},
        )
    await hass.config_entries.async_reload(entry_id)


async def _handle_list_tasks(call: ServiceCall) -> dict[str, Any]:
    """Handle list_tasks — a queryable snapshot for automations/voice."""
    hass = call.hass
    wanted_entry = call.data.get("entry_id")
    wanted_status = call.data.get("status")
    wanted_user = _resolve_person_user_id(hass, call.data["person"]) if call.data.get("person") else None
    tasks: list[dict[str, Any]] = []
    # The shared cross-object walk (loaded objects, archived tasks left
    # out) — the Assist snapshot uses the same one (DRY audit 2026-09-26 B).
    for ce, task_id, result in iter_live_tasks(hass, wanted_entry or None):
        task = result.task
        status = str(result.status)
        if wanted_status and status != wanted_status:
            continue
        if wanted_user and not task_is_for(task, wanted_user):
            continue
        # #151: last completion + live trigger reading, so
        # notification automations don't need extra lookups.
        lp = task.get("last_performed")
        days_since: int | None = None
        if lp:
            try:
                days_since = (dt_util.now().date() - date_cls.fromisoformat(str(lp)[:10])).days
            except ValueError:
                days_since = None
        tc = task.get("trigger_config") or {}
        trigger_target, trigger_unit = _trigger_target_and_unit(hass, tc)
        tasks.append(
            {
                "entry_id": ce.entry_id,
                "task_id": task_id,
                # #151 follow-up: the task sensor's REGISTERED entity_id
                # (users rename them), so a row can be fed straight into
                # complete/skip.
                "entity_id": aggregate_task_sensor_entity_id(hass, ce.data.get(CONF_OBJECT) or {}, task_id),
                "object_name": aggregate_object_name(ce),
                "name": task.get("name"),
                "status": status,
                "next_due": result.next_due,
                "days_until_due": result.days_until_due,
                "type": task.get("type"),
                "priority": task.get("priority", "normal"),
                "last_performed": lp,
                "days_since_last_completed": days_since,
                "trigger_type": tc.get("type"),
                "trigger_current_value": result.trigger_current_value,
                # Delta-mode counters: progress since the last service
                # (what the panel bar shows); None for every other trigger.
                "trigger_current_delta": result.trigger_current_delta,
                "trigger_target": trigger_target,
                "trigger_unit": trigger_unit,
                # #210 / #232: who it is for, the task sensor's fields.
                **task_people_attributes(hass, task),
            }
        )
    return {"tasks": tasks, "count": len(tasks)}


# #218: restock, ready again and dispose (and #226 use) for automations
# and dashboard buttons — the panel's part actions, same tier (write) and
# the same runtime calls, so the stock, its events and the buy tasks move
# alike.
def _resolve_part_targets(hass: HomeAssistant, entity_ids: list[str]) -> list[tuple[str, ConfigEntry, str]]:
    """Each part stock sensor -> (entity_id, owner entry, part_id); all
    resolved before anything is booked."""
    registry = er.async_get(hass)
    targets: list[tuple[str, ConfigEntry, str]] = []
    for eid in dict.fromkeys(entity_ids):
        reg = registry.async_get(eid)
        entry = hass.config_entries.async_get_entry(reg.config_entry_id) if reg and reg.config_entry_id else None
        part_id = None
        if entry is not None and entry.domain == DOMAIN and reg is not None:
            prefix = f"maintenance_supporter_{aggregate_object_slug(entry.data.get(CONF_OBJECT) or {})}_part_"
            candidate = reg.unique_id[len(prefix) :] if reg.unique_id.startswith(prefix) else None
            part_id = candidate if candidate in (entry.data.get(CONF_PARTS) or {}) else None
        if entry is None or part_id is None:
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="no_part_for_entity",
                translation_placeholders={"entity_id": eid},
            )
        targets.append((eid, entry, part_id))
    return targets


async def _handle_part_restock(call: ServiceCall) -> dict[str, Any] | None:
    hass = call.hass
    if ("delta" in call.data) == ("absolute" in call.data):
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="invalid_input",
            translation_placeholders={"error": "provide exactly one of delta / absolute"},
        )
    results = []
    for eid, entry, part_id in _resolve_part_targets(hass, call.data[ATTR_ENTITY_ID]):
        stock = await async_change_part_stock(hass, entry, part_id, delta=call.data.get("delta"), absolute=call.data.get("absolute"))
        results.append({"entity_id": eid, "stock": stock})
    return {"parts": results} if call.return_response else None


def _reusable(eid: str, result: dict[str, float] | None) -> dict[str, float]:
    if result is None:
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="part_not_reusable",
            translation_placeholders={"entity_id": eid},
        )
    return result


async def _handle_part_ready_again(call: ServiceCall) -> dict[str, Any] | None:
    hass = call.hass
    results = [
        {"entity_id": eid, **_reusable(eid, await async_part_ready_again(hass, entry, part_id, call.data.get("quantity")))}
        for eid, entry, part_id in _resolve_part_targets(hass, call.data[ATTR_ENTITY_ID])
    ]
    return {"parts": results} if call.return_response else None


async def _handle_part_dispose(call: ServiceCall) -> dict[str, Any] | None:
    hass = call.hass
    results = [
        {"entity_id": eid, **_reusable(eid, await async_part_dispose(hass, entry, part_id, call.data.get("quantity")))}
        for eid, entry, part_id in _resolve_part_targets(hass, call.data[ATTR_ENTITY_ID])
    ]
    return {"parts": results} if call.return_response else None


async def _handle_part_use(call: ServiceCall) -> dict[str, Any] | None:
    hass = call.hass
    targets = _resolve_part_targets(hass, call.data[ATTR_ENTITY_ID])
    # Every one must have a stock to count down before any is booked.
    for eid, entry, part_id in targets:
        store = store_of(entry)
        if store is None or store.get_part_stock(part_id) is None:
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="part_not_counted",
                translation_placeholders={"entity_id": eid},
            )
    results = []
    for eid, entry, part_id in targets:
        result = await async_part_use(hass, entry, part_id, call.data.get("quantity"))
        results.append({"entity_id": eid, **(result or {})})
    return {"parts": results} if call.return_response else None


async def _handle_part_purchase(call: ServiceCall) -> dict[str, Any] | None:
    hass = call.hass
    if (day := call.data.get("date")) is not None and day > dt_util.now().date():
        raise ServiceValidationError(translation_domain=DOMAIN, translation_key="completed_at_in_future")
    results = []
    for eid, entry, part_id in _resolve_part_targets(hass, call.data[ATTR_ENTITY_ID]):
        try:
            result = await async_part_purchase(
                hass,
                entry,
                part_id,
                quantity=call.data.get("quantity"),
                unit_price=call.data.get("unit_price"),
                cost=call.data.get("cost"),
                day=day,
                notes=call.data.get("notes") or None,
                completed_by=call.context.user_id if call.context else None,
                source="service",
            )
        except ValueError as err:  # the object holds the most tasks it may
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="invalid_input",
                translation_placeholders={"error": str(err)},
            ) from err
        results.append({"entity_id": eid, **(result or {})})
    return {"parts": results} if call.return_response else None


@callback
def async_setup_services(hass: HomeAssistant) -> None:
    """Register the service actions. Safe to re-run: a registration
    overwrites the previous one in place."""
    hass.services.async_register(DOMAIN, SERVICE_COMPLETE, _handle_complete, schema=SERVICE_COMPLETE_SCHEMA)
    hass.services.async_register(DOMAIN, SERVICE_RESET, _handle_reset, schema=SERVICE_RESET_SCHEMA)
    hass.services.async_register(DOMAIN, SERVICE_SKIP, _handle_skip, schema=SERVICE_SKIP_SCHEMA)
    # Content services hold a calling user to the tier of the matching WS
    # command (helpers.permissions.service_tier); complete/reset/skip stay
    # open to everyone like their panel actions.
    hass.services.async_register(DOMAIN, SERVICE_EXPORT, service_tier(hass, _handle_export, admin=True), schema=SERVICE_EXPORT_SCHEMA)
    hass.services.async_register(
        DOMAIN,
        SERVICE_ADD_OBJECT,
        service_tier(hass, _handle_add_object),
        schema=SERVICE_ADD_OBJECT_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_ADD_TASK,
        service_tier(hass, _handle_add_task),
        schema=SERVICE_ADD_TASK_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )

    hass.services.async_register(
        DOMAIN,
        SERVICE_UPDATE_TASK,
        service_tier(hass, _handle_update_task),
        schema=SERVICE_UPDATE_TASK_SCHEMA,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_DELETE_TASK,
        service_tier(hass, _handle_delete_task),
        schema=SERVICE_DELETE_TASK_SCHEMA,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_LIST_TASKS,
        _handle_list_tasks,
        schema=SERVICE_LIST_TASKS_SCHEMA,
        supports_response=SupportsResponse.ONLY,
    )

    for service, handler, schema in (
        (SERVICE_PART_RESTOCK, _handle_part_restock, SERVICE_PART_RESTOCK_SCHEMA),
        (SERVICE_PART_USE, _handle_part_use, SERVICE_PART_USE_SCHEMA),
        (SERVICE_PART_PURCHASE, _handle_part_purchase, SERVICE_PART_PURCHASE_SCHEMA),
        (SERVICE_PART_READY_AGAIN, _handle_part_ready_again, SERVICE_PART_PILE_SCHEMA),
        (SERVICE_PART_DISPOSE, _handle_part_dispose, SERVICE_PART_PILE_SCHEMA),
    ):
        hass.services.async_register(DOMAIN, service, service_tier(hass, handler), schema=schema, supports_response=SupportsResponse.OPTIONAL)
