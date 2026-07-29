"""The Maintenance Supporter integration."""

from __future__ import annotations

import logging
from dataclasses import dataclass
from datetime import timedelta
from typing import Any

import voluptuous as vol
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import ATTR_ENTITY_ID, EVENT_HOMEASSISTANT_STOP
from homeassistant.core import (
    Event,
    HomeAssistant,
    ServiceCall,
    SupportsResponse,
    callback,
)
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import (
    config_validation as cv,
)
from homeassistant.helpers import (
    device_registry as dr,
)
from homeassistant.helpers import (
    entity_registry as er,
)
from homeassistant.helpers.event import (
    async_track_time_change,
    async_track_time_interval,
)
from homeassistant.helpers.start import async_at_started
from homeassistant.helpers.typing import ConfigType

from .const import (
    CONF_ADMIN_PANEL_USER_IDS,
    CONF_ADVANCED_ADAPTIVE,
    CONF_ADVANCED_BUDGET,
    CONF_ADVANCED_CHECKLISTS,
    CONF_ADVANCED_ENVIRONMENTAL,
    CONF_ADVANCED_GROUPS,
    CONF_ADVANCED_PREDICTIONS,
    CONF_ADVANCED_SCHEDULE_TIME,
    CONF_ADVANCED_SEASONAL,
    CONF_BUDGET_MONTHLY,
    CONF_BUDGET_YEARLY,
    CONF_GROUPS,
    CONF_INSTALL_ASSIST_SENTENCES,
    CONF_OBJECT,
    CONF_PANEL_ENABLED,
    CONF_TASKS,
    CONF_WEEKLY_DIGEST_ENABLED,
    DEFAULT_PANEL_ENABLED,
    DEFAULT_WARNING_DAYS,
    DOMAIN,
    EVENT_UNSUBS_KEY,
    GLOBAL_UNIQUE_ID,
    MAX_COST,
    MAX_DURATION_MINUTES,
    MAX_LABEL_LENGTH,
    MAX_LABELS,
    MAX_NAME_LENGTH,
    MAX_TEXT_LENGTH,
    MAX_TYPE_LENGTH,
    PLATFORMS,
    SERVICE_ADD_OBJECT,
    SERVICE_ADD_TASK,
    SERVICE_COMPLETE,
    SERVICE_DELETE_TASK,
    SERVICE_EXPORT,
    SERVICE_LIST_TASKS,
    SERVICE_RESET,
    SERVICE_SKIP,
    SERVICE_UPDATE_TASK,
    SIGNAL_NEW_OBJECT_ENTRY,
    SIGNAL_OBJECT_ENTRY_REMOVED,
    STORES_CACHE_KEY,
)
from .const import (
    DOCUMENT_STORE_KEY as _DS_KEY,
)
from .const import (
    NOTIFICATION_MANAGER_KEY as _NM_KEY,
)
from .coordinator import MaintenanceCoordinator
from .entity.summary_coordinator import MaintenanceSummaryCoordinator
from .frontend import async_register_card
from .helpers.assist_sentences import async_sync as async_sync_assist_sentences
from .helpers.dates import INTERVAL_UNITS
from .helpers.documents import DocumentStore
from .helpers.notification_manager import NotificationManager
from .helpers.schedule import normalize_task_storage
from .helpers.task_fields import (
    INTERVAL_DAYS_RANGE,
    TASK_PRIORITIES,
    WARNING_DAYS_RANGE,
)
from .panel import async_register_panel, async_unregister_panel
from .storage import MaintenanceStore, async_migrate_to_store
from .websocket import async_register_commands

_LOGGER = logging.getLogger(__name__)

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)
# Re-exported from const for the existing deferred `from . import ...` users.
NOTIFICATION_MANAGER_KEY = _NM_KEY
DOCUMENT_STORE_KEY = _DS_KEY


@dataclass
class MaintenanceSupporterData:
    """Runtime data for a Maintenance Supporter config entry."""

    coordinator: MaintenanceCoordinator | None = None
    store: MaintenanceStore | None = None
    # Only set on the global entry: aggregates status counts for the summary
    # sensors. None on per-object entries.
    summary_coordinator: MaintenanceSummaryCoordinator | None = None


type MaintenanceSupporterConfigEntry = ConfigEntry[MaintenanceSupporterData]


# --- Service Schemas ---
SERVICE_COMPLETE_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_ENTITY_ID): cv.entity_id,
        vol.Optional("notes"): vol.All(cv.string, vol.Length(max=2000)),
        vol.Optional("cost"): vol.All(vol.Coerce(float), vol.Range(min=0, max=MAX_COST)),
        vol.Optional("duration"): vol.All(vol.Coerce(int), vol.Range(min=0, max=MAX_DURATION_MINUTES)),
        # Meter readings (v2.20, #83): recorded value for `reading` tasks.
        vol.Optional("reading_value"): vol.All(vol.Coerce(float), vol.Range(min=-1e12, max=1e12)),
    }
)

SERVICE_RESET_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_ENTITY_ID): cv.entity_id,
        vol.Optional("date"): cv.date,
    }
)

SERVICE_SKIP_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_ENTITY_ID): cv.entity_id,
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
        vol.Required("name"): vol.All(cv.string, vol.Length(min=1, max=255)),
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
SERVICE_ADD_TASK_SCHEMA = vol.Schema(
    {
        vol.Required("entry_id"): cv.string,
        vol.Required("name"): vol.All(cv.string, vol.Length(min=1, max=MAX_NAME_LENGTH)),
        vol.Optional("task_type"): vol.All(cv.string, vol.Length(max=MAX_TYPE_LENGTH)),
        vol.Optional("schedule_type"): vol.All(cv.string, vol.Length(max=MAX_TYPE_LENGTH)),
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
    }
)

SERVICE_UPDATE_TASK_SCHEMA = vol.Schema(
    {
        vol.Required("entry_id"): cv.string,
        vol.Required("task_id"): cv.string,
        vol.Optional("name"): vol.All(cv.string, vol.Length(min=1, max=MAX_NAME_LENGTH)),
        vol.Optional("task_type"): vol.All(cv.string, vol.Length(max=MAX_TYPE_LENGTH)),
        vol.Optional("schedule_type"): vol.All(cv.string, vol.Length(max=MAX_TYPE_LENGTH)),
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
        vol.Optional("status"): vol.In(["ok", "due_soon", "overdue", "triggered"]),
    }
)


async def async_maybe_send_weekly_digest(hass: HomeAssistant, *, force: bool = False) -> None:
    """Send the opt-in weekly digest when it's due.

    Gated on: it being Monday (skipped when ``force``), the global
    ``weekly_digest_enabled`` setting, and there being something to report.
    Extracted from the daily 08:00 time-change tick so it's unit-testable and
    can be triggered directly.
    """
    from homeassistant.util import dt as dt_util

    if not force and dt_util.now().weekday() != 0:  # Monday only
        return
    global_entry = next(
        (e for e in hass.config_entries.async_entries(DOMAIN) if e.unique_id == GLOBAL_UNIQUE_ID),
        None,
    )
    if global_entry is None:
        return
    options = global_entry.options or global_entry.data
    if not options.get(CONF_WEEKLY_DIGEST_ENABLED, False):
        return
    from .helpers.aggregate import compute_status_counts

    counts = compute_status_counts(hass)
    overdue = int(counts.get("overdue", 0))
    due_soon = int(counts.get("due_soon", 0)) + int(counts.get("triggered", 0))
    if overdue == 0 and due_soon == 0:
        return  # nothing to report — stay silent
    nm = hass.data.get(DOMAIN, {}).get(NOTIFICATION_MANAGER_KEY)
    if nm is not None:
        await nm.async_send_weekly_digest(overdue, due_soon)


async def async_maybe_send_warranty_reminders(hass: HomeAssistant, *, force: bool = False) -> None:
    """Remind about maintenance-object warranties nearing expiry.

    Opt-in (``warranty_reminder_enabled``). Fires the day an object's warranty is
    exactly ``warranty_reminder_days`` days out — once, no per-object persistence
    needed. ``force`` widens it to the whole 0..N window (for the test hook).
    """
    from datetime import date

    from homeassistant.util import dt as dt_util

    from .const import (
        CONF_WARRANTY_REMINDER_DAYS,
        CONF_WARRANTY_REMINDER_ENABLED,
        DEFAULT_WARRANTY_REMINDER_DAYS,
    )

    global_entry = next(
        (e for e in hass.config_entries.async_entries(DOMAIN) if e.unique_id == GLOBAL_UNIQUE_ID),
        None,
    )
    if global_entry is None:
        return
    options = global_entry.options or global_entry.data
    if not options.get(CONF_WARRANTY_REMINDER_ENABLED, False):
        return
    days = int(options.get(CONF_WARRANTY_REMINDER_DAYS, DEFAULT_WARRANTY_REMINDER_DAYS))
    today = dt_util.now().date()
    names: list[str] = []
    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.unique_id == GLOBAL_UNIQUE_ID:
            continue
        obj = entry.data.get(CONF_OBJECT) or {}
        expiry = obj.get("warranty_expiry")
        if not expiry:
            continue
        try:
            delta = (date.fromisoformat(expiry) - today).days
        except (ValueError, TypeError):
            continue
        if delta == days or (force and 0 <= delta <= days):
            names.append(obj.get("name") or entry.title)
    if not names:
        return
    nm = hass.data.get(DOMAIN, {}).get(NOTIFICATION_MANAGER_KEY)
    if nm is not None:
        await nm.async_send_warranty_reminder(names, days)


async def async_maybe_send_lead_reminders(hass: HomeAssistant) -> None:
    """Send extra lead-time reminders for tasks due in exactly N days.

    Opt-in via the ``reminder_lead_days`` list (e.g. [14, 3, 0]) — for every
    active task whose days-until-due matches one of the configured leads, one
    reminder fires through the notification manager (per-user routing, quiet
    hours, vacation, snooze, daily limit all apply). Runs from the daily
    08:00 tick, so each lead fires at most once per day per task, and once
    per cycle overall (the day-match only occurs on one day per lead).
    Complements — does not replace — the warning_days status-change path.
    """
    from .const import CONF_REMINDER_LEAD_DAYS
    from .models.maintenance_task import MaintenanceTask

    global_entry = next(
        (e for e in hass.config_entries.async_entries(DOMAIN) if e.unique_id == GLOBAL_UNIQUE_ID),
        None,
    )
    if global_entry is None:
        return
    options = global_entry.options or global_entry.data
    leads_raw = options.get(CONF_REMINDER_LEAD_DAYS) or []
    leads = {v for v in leads_raw if isinstance(v, int) and not isinstance(v, bool)}
    if not leads:
        return

    nm = hass.data.get(DOMAIN, {}).get(NOTIFICATION_MANAGER_KEY)
    if nm is None:
        return

    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.unique_id == GLOBAL_UNIQUE_ID:
            continue
        obj = entry.data.get(CONF_OBJECT) or {}
        if obj.get("archived_at") is not None:
            continue
        # v2.20 (N3): a seasonally paused object's schedules are frozen — no
        # lead reminders until it resumes.
        if obj.get("paused_at") is not None:
            continue
        rd = getattr(entry, "runtime_data", None)
        coordinator = getattr(rd, "coordinator", None)
        if coordinator is None:
            continue
        # Merged data so last_performed reflects the Store, not stale entry data.
        merged = coordinator._get_merged_tasks_data()
        obj_name = obj.get("name") or entry.title
        for task_id, task_data in merged.items():
            if not task_data.get("enabled", True):
                continue
            if task_data.get("archived_at") is not None:
                continue
            task = MaintenanceTask.from_dict(task_data)
            days = task.days_until_due
            # days == 0 is a valid lead ("on the due date"); negatives are the
            # overdue path's job (notify_overdue_interval_hours).
            if days is None or days < 0 or days not in leads:
                continue
            await nm.async_send_lead_reminder(
                entry_id=entry.entry_id,
                task_id=task_id,
                task_name=task.name,
                object_name=obj_name,
                days=days,
                next_due=task.next_due.isoformat() if task.next_due else None,
                responsible_user_id=task.responsible_user_id,
            )


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the Maintenance Supporter integration."""
    return await _async_setup_shared(hass)


async def _async_setup_shared(hass: HomeAssistant) -> bool:
    """Build the entry-independent runtime (services, WS API, listeners,
    notification manager, document store).

    HA calls ``async_setup`` exactly once per boot, but unloading the LAST
    entry pops ``hass.data[DOMAIN]`` — so an uninstall → reinstall within the
    same HA run must rebuild all of this (journey O1). ``async_setup_entry``
    re-invokes this when it finds the shared runtime missing. Re-running is
    safe: service/WS registrations overwrite in place, and the HTTP-level
    registrations (card static paths, document views) carry their own guards
    outside the popped dict.
    """
    hass.data.setdefault(DOMAIN, {})

    # "Business day" scheduling (the day-of-month `business` flag) follows the
    # user's Workday integration when one is configured — public holidays and
    # custom working weekdays instead of the plain Mon-Fri rule (#83 follow-up).
    from .helpers.workday import async_setup_business_days

    await async_setup_business_days(hass)

    # Create the notification manager (shared across all entries)
    hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY] = NotificationManager(hass)

    # Create + load the global document store (per-object doc metadata + the
    # content-addressed blob registry; binaries live on disk under /config).
    doc_store = DocumentStore(hass)
    await doc_store.async_load()
    hass.data[DOMAIN][DOCUMENT_STORE_KEY] = doc_store

    # Authenticated upload + serve endpoints for document blobs (the blobs live
    # under /config, so they must never be exposed via an unauthenticated path).
    from .views import async_register_document_views

    async_register_document_views(hass)

    async def _handle_complete(call: ServiceCall) -> None:
        """Handle the complete service call."""
        entity_id = call.data[ATTR_ENTITY_ID]
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
        await coordinator.complete_maintenance(
            task_id=task_id,
            notes=call.data.get("notes"),
            cost=call.data.get("cost"),
            duration=call.data.get("duration"),
            reading_value=call.data.get("reading_value"),
        )

    async def _handle_reset(call: ServiceCall) -> None:
        """Handle the reset service call."""
        entity_id = call.data[ATTR_ENTITY_ID]
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
        await coordinator.reset_maintenance(
            task_id=task_id,
            date=call.data.get("date"),
        )

    async def _handle_skip(call: ServiceCall) -> None:
        """Handle the skip service call."""
        entity_id = call.data[ATTR_ENTITY_ID]
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
        await coordinator.skip_maintenance(
            task_id=task_id,
            reason=call.data.get("reason"),
        )

    async def _handle_export(call: ServiceCall) -> None:
        """Handle the export_data service call."""
        from .export import build_export_data, serialize_export_to_file

        fmt = call.data.get("format", "json")
        include_history = call.data.get("include_history", True)

        # Phase 1: gather data on the event loop (accesses HA APIs)
        data = build_export_data(hass, include_history=include_history)

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
        from .websocket.objects import async_create_object
        from .websocket.tasks import _is_safe_url

        url = call.data.get("documentation_url")
        if url and not _is_safe_url(url):
            raise ServiceValidationError("Only http/https URLs are allowed")
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
            raise ServiceValidationError(str(err)) from err
        return {"entry_id": entry_id} if call.return_response else None

    async def _handle_add_task(call: ServiceCall) -> dict[str, Any] | None:
        """Handle the add_task service — add a task to an existing object."""
        from .websocket.tasks import async_create_task_simple

        try:
            task_id = await async_create_task_simple(
                hass,
                entry_id=call.data["entry_id"],
                name=call.data["name"],
                task_type=call.data.get("task_type", "custom"),
                schedule_type=call.data.get("schedule_type", "time_based"),
                interval_days=call.data.get("interval_days"),
                interval_unit=call.data.get("interval_unit", "days"),
                due_date=call.data.get("due_date"),
                warning_days=call.data.get("warning_days", DEFAULT_WARNING_DAYS),
                enabled=call.data.get("enabled", True),
                notes=call.data.get("notes"),
                schedule=call.data.get("schedule"),
            )
        except ValueError as err:
            raise ServiceValidationError(str(err)) from err
        return {"task_id": task_id} if call.return_response else None

    hass.services.async_register(DOMAIN, SERVICE_COMPLETE, _handle_complete, schema=SERVICE_COMPLETE_SCHEMA)
    hass.services.async_register(DOMAIN, SERVICE_RESET, _handle_reset, schema=SERVICE_RESET_SCHEMA)
    hass.services.async_register(DOMAIN, SERVICE_SKIP, _handle_skip, schema=SERVICE_SKIP_SCHEMA)
    hass.services.async_register(DOMAIN, SERVICE_EXPORT, _handle_export, schema=SERVICE_EXPORT_SCHEMA)
    hass.services.async_register(
        DOMAIN,
        SERVICE_ADD_OBJECT,
        _handle_add_object,
        schema=SERVICE_ADD_OBJECT_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_ADD_TASK,
        _handle_add_task,
        schema=SERVICE_ADD_TASK_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )

    async def _handle_update_task(call: ServiceCall) -> None:
        """Handle update_task — patch the common fields of an existing task."""
        from .websocket.tasks_persist import async_update_task_simple

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
        try:
            await async_update_task_simple(
                hass,
                entry_id=call.data["entry_id"],
                task_id=call.data["task_id"],
                updates=updates,
            )
        except ValueError as err:
            raise ServiceValidationError(str(err)) from err

    async def _handle_delete_task(call: ServiceCall) -> None:
        """Handle delete_task — remove a task and its side-state."""
        from .websocket.tasks_crud import async_delete_task

        entry_id = call.data["entry_id"]
        entry = hass.config_entries.async_get_entry(entry_id)
        if entry is None or entry.domain != DOMAIN or entry.unique_id == GLOBAL_UNIQUE_ID:
            raise ServiceValidationError(f"No maintenance object found for entry_id {entry_id!r}")
        if not await async_delete_task(hass, entry, call.data["task_id"]):
            raise ServiceValidationError(f"No task {call.data['task_id']!r} in {entry.title!r}")
        await hass.config_entries.async_reload(entry_id)

    async def _handle_list_tasks(call: ServiceCall) -> dict[str, Any]:
        """Handle list_tasks — a queryable snapshot for automations/voice."""
        wanted_entry = call.data.get("entry_id")
        wanted_status = call.data.get("status")
        tasks: list[dict[str, Any]] = []
        for ce in hass.config_entries.async_entries(DOMAIN):
            if ce.unique_id == GLOBAL_UNIQUE_ID:
                continue
            if wanted_entry and ce.entry_id != wanted_entry:
                continue
            rd = getattr(ce, "runtime_data", None)
            coordinator = getattr(rd, "coordinator", None) if rd else None
            if coordinator is None or not coordinator.data:
                continue
            object_name = ce.data.get(CONF_OBJECT, {}).get("name", ce.title)
            for task_id, task in coordinator.data.get(CONF_TASKS, {}).items():
                status = str(task.get("_status", ""))
                if status == "archived":
                    continue
                if wanted_status and status != wanted_status:
                    continue
                tasks.append(
                    {
                        "entry_id": ce.entry_id,
                        "task_id": task_id,
                        "object_name": object_name,
                        "name": task.get("name"),
                        "status": status,
                        "next_due": task.get("_next_due"),
                        "days_until_due": task.get("_days_until_due"),
                        "type": task.get("type"),
                        "priority": task.get("priority", "normal"),
                    }
                )
        return {"tasks": tasks, "count": len(tasks)}

    hass.services.async_register(
        DOMAIN,
        SERVICE_UPDATE_TASK,
        _handle_update_task,
        schema=SERVICE_UPDATE_TASK_SCHEMA,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_DELETE_TASK,
        _handle_delete_task,
        schema=SERVICE_DELETE_TASK_SCHEMA,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_LIST_TASKS,
        _handle_list_tasks,
        schema=SERVICE_LIST_TASKS_SCHEMA,
        supports_response=SupportsResponse.ONLY,
    )

    # Register WebSocket commands
    async_register_commands(hass)

    # Register Lovelace card (always available)
    await async_register_card(hass)

    # Register listener for mobile app notification action buttons
    async def _handle_notification_action(event: Event) -> None:
        """Handle mobile_app_notification_action events from Companion App."""
        action = event.data.get("action", "")
        if not action.startswith("MS_"):
            return

        # Parse action: MS_COMPLETE_{entry_id}_{task_id}
        #                MS_SKIP_{entry_id}_{task_id}
        #                MS_SNOOZE_{entry_id}_{task_id}
        # entry_id is a 32-char hex UUID, task_id is a 32-char hex UUID
        if action.startswith("MS_COMPLETE_"):
            action_type = "complete"
            remainder = action[len("MS_COMPLETE_") :]
        elif action.startswith("MS_SKIP_"):
            action_type = "skip"
            remainder = action[len("MS_SKIP_") :]
        elif action.startswith("MS_SNOOZE_"):
            action_type = "snooze"
            remainder = action[len("MS_SNOOZE_") :]
        else:
            return

        # Split on underscore — entry_id and task_id contain no underscores
        parts = remainder.split("_", 1)
        if len(parts) != 2 or not parts[0] or not parts[1]:
            _LOGGER.warning("Invalid notification action format: %s", action)
            return

        entry_id, task_id = parts

        config_entry = hass.config_entries.async_get_entry(entry_id)
        runtime_data = getattr(config_entry, "runtime_data", None) if config_entry else None
        if not runtime_data or not hasattr(runtime_data, "coordinator") or not runtime_data.coordinator:
            _LOGGER.warning("No coordinator found for notification action (entry_id=%s)", entry_id)
            return

        nm = hass.data.get(DOMAIN, {}).get(NOTIFICATION_MANAGER_KEY)

        try:
            if action_type == "complete":
                _LOGGER.info("Completing task %s via notification action", task_id)
                await runtime_data.coordinator.complete_maintenance(task_id=task_id, unattended=True)
            elif action_type == "skip":
                _LOGGER.info("Skipping task %s via notification action", task_id)
                await runtime_data.coordinator.skip_maintenance(task_id=task_id, reason="Skipped from notification")
            elif action_type == "snooze":
                _LOGGER.info("Snoozing task %s via notification action", task_id)
                if nm is not None:
                    nm.snooze_task(entry_id, task_id)
                return  # Snooze: keep notification visible for later reminder
        except ServiceValidationError as err:
            # The task demands details a notification button cannot capture.
            # Not an error in our code — log it plainly and deliberately do
            # NOT dismiss the notification, so the reminder survives until the
            # user completes the task properly in the panel.
            _LOGGER.warning(
                "Notification completion of task %s rejected: %s",
                task_id,
                err,
            )
            return
        except Exception:
            _LOGGER.exception(
                "Failed to handle notification action %s for task %s",
                action_type,
                task_id,
            )
            return

        # Action succeeded — dismiss notification and clear NM rate-limit state
        if nm is not None:
            await nm.async_dismiss_task_notification(task_id)
            nm.clear_task_state(entry_id, task_id)

    unsub_notification = hass.bus.async_listen("mobile_app_notification_action", _handle_notification_action)

    # Register listener for NFC tag scans → complete linked tasks
    async def _handle_tag_scanned(event: Event) -> None:
        """Handle tag_scanned events — complete task linked to NFC tag."""
        tag_id = event.data.get("tag_id", "")
        if not tag_id:
            return

        # Search all entries for a task with matching nfc_tag_id
        for ce in hass.config_entries.async_entries(DOMAIN):
            if ce.unique_id == GLOBAL_UNIQUE_ID:
                continue
            tasks = ce.data.get(CONF_TASKS, {})
            for task_id, task_data in tasks.items():
                if task_data.get("nfc_tag_id") != tag_id:
                    continue
                # Found matching task
                runtime_data = getattr(ce, "runtime_data", None)
                if not runtime_data or not getattr(runtime_data, "coordinator", None):
                    _LOGGER.warning(
                        "No coordinator for NFC tag match (entry=%s)",
                        ce.entry_id,
                    )
                    continue
                _LOGGER.debug(
                    "Completing task %s via NFC tag scan (%s)",
                    task_id,
                    tag_id,
                )
                user_id = event.context.user_id if event.context else None
                try:
                    await runtime_data.coordinator.complete_maintenance(
                        task_id=task_id,
                        completed_by=user_id,
                        notes="Completed via NFC tag",
                        unattended=True,
                    )
                except ServiceValidationError as err:
                    # A tag tap cannot capture a cost or a photo. Log it
                    # plainly and leave the task open so the user finishes it
                    # in the panel — the honest outcome, not a silent no-op.
                    _LOGGER.warning("NFC completion of task %s rejected: %s", task_id, err)
                return

        # No match found — not our tag, ignore silently

    unsub_tag = hass.bus.async_listen("tag_scanned", _handle_tag_scanned)

    # v1.3.0: per-task on_complete_action listener (Layer B). Subscribes to
    # EVENT_TASK_COMPLETED — same event power users can listen for in their
    # own automations. Single listener handles all entries' tasks.
    from .helpers.action_listener import register_action_listener

    unsub_action = register_action_listener(hass)

    # v1.5.3 (#48): reverse-sync HA device.area_id → obj.area_id when the user
    # changes the area in the HA UI / device settings. The forward sync
    # (obj.area_id → device.area_id) happens via the per-entry update listener
    # registered in async_setup_entry. Together these two listeners keep the
    # dashboard area and the HA device area in sync after the initial creation
    # (DeviceInfo.suggested_area only fires once, on first device creation).
    @callback
    def _on_device_registry_update(
        event: Event[dr.EventDeviceRegistryUpdatedData],
    ) -> None:
        if event.data["action"] != "update":
            return
        changes = event.data.get("changes") or {}
        if "area_id" not in changes:
            return
        device_id = event.data["device_id"]
        device = dr.async_get(hass).async_get(device_id)
        if device is None:
            return
        for ce_id in device.config_entries:
            ce = hass.config_entries.async_get_entry(ce_id)
            if ce is None or ce.domain != DOMAIN or ce.unique_id == GLOBAL_UNIQUE_ID:
                continue
            obj = dict(ce.data.get(CONF_OBJECT, {}))
            if obj.get("area_id") == device.area_id:
                return  # already in sync — break the loop with the forward listener
            obj["area_id"] = device.area_id
            new_data = {**ce.data, CONF_OBJECT: obj}
            hass.config_entries.async_update_entry(ce, data=new_data)
            return

    unsub_device = hass.bus.async_listen(dr.EVENT_DEVICE_REGISTRY_UPDATED, _on_device_registry_update)

    # v1.5.4: rewrite stored entity_id references when HA renames an entity.
    # Without this, ``trigger_config["entity_id"]`` /
    # ``adaptive_config["environmental_entity"]`` go stale and the underlying
    # ``async_track_state_change_event`` listeners silently miss events on the
    # new id. Same dual-storage bug class as #48 — different field, same fix.
    async def _on_entity_registry_update(
        event: Event[er.EventEntityRegistryUpdatedData],
    ) -> None:
        if event.data["action"] != "update":
            return
        changes = event.data.get("changes") or {}
        if "entity_id" not in changes:
            return  # not a rename
        new_eid = event.data["entity_id"]
        old_eid = changes["entity_id"]
        if not isinstance(old_eid, str) or old_eid == new_eid:
            return

        from .helpers.entity_rename import rewrite_store, rewrite_tasks

        for ce in hass.config_entries.async_entries(DOMAIN):
            if ce.unique_id == GLOBAL_UNIQUE_ID:
                continue

            # 1. trigger_config refs live in entry.data
            entry_changed = False
            tasks = ce.data.get(CONF_TASKS, {})
            if tasks:
                new_tasks, entry_changed = rewrite_tasks(tasks, old_eid, new_eid)
                if entry_changed:
                    new_data = {**ce.data, CONF_TASKS: new_tasks}
                    hass.config_entries.async_update_entry(ce, data=new_data)

            # 2. adaptive_config.environmental_entity + trigger_runtime keys
            #    live in Store (post-migration; see _DYNAMIC_TASK_FIELDS).
            rd = getattr(ce, "runtime_data", None)
            store = getattr(rd, "store", None) if rd else None
            store_changed = False
            if store is not None:
                store_changed = rewrite_store(store, old_eid, new_eid)
                if store_changed:
                    # Force-save before the reload — the reload re-instantiates
                    # the store from disk, so a debounced save would race the
                    # reload and lose the rewrite.
                    await store.async_save()

            if not (entry_changed or store_changed):
                continue

            # The trigger listeners on `BaseTrigger` subscribed to the OLD
            # entity_id and won't follow the rename — schedule a reload so
            # they re-instantiate against the new id.
            hass.config_entries.async_schedule_reload(ce.entry_id)
            _LOGGER.info(
                "Rewrote entity references %s → %s for entry %s (entry_data=%s, store=%s) and scheduled reload",
                old_eid,
                new_eid,
                ce.entry_id,
                entry_changed,
                store_changed,
            )

    unsub_entity = hass.bus.async_listen(er.EVENT_ENTITY_REGISTRY_UPDATED, _on_entity_registry_update)

    # v2.10.0: daily archive / auto-delete retention sweep (completed one-offs).
    # The pure decision logic + the sweep live in helpers/retention; this just
    # paces it once a day. First fire is +24h, which is plenty for a day-granular
    # policy (a freshly due archive simply waits for the next tick).
    from .helpers.retention import async_run_retention_sweep

    async def _retention_tick(_now: Any) -> None:
        await async_run_retention_sweep(hass)

    unsub_retention = async_track_time_interval(hass, _retention_tick, timedelta(hours=24), cancel_on_shutdown=True)

    # v2.15.0: opt-in weekly digest — one summary notification on Monday morning.
    # Fires daily at 08:00 local; the gating lives in async_maybe_send_weekly_digest.
    async def _weekly_digest_tick(now: Any) -> None:
        await async_maybe_send_weekly_digest(hass)
        await async_maybe_send_warranty_reminders(hass)
        await async_maybe_send_lead_reminders(hass)

    unsub_digest = async_track_time_change(hass, _weekly_digest_tick, hour=8, minute=0, second=0)
    # async_track_time_change has no cancel_on_shutdown, so cancel it explicitly
    # on HA stop too — otherwise the daily timer lingers past shutdown when the
    # entries aren't formally unloaded (e.g. test teardown).
    hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STOP, lambda _e: unsub_digest())

    # Store unsub callbacks so they can be cleaned up when domain is unloaded
    hass.data[DOMAIN][EVENT_UNSUBS_KEY] = [
        unsub_notification,
        unsub_tag,
        unsub_action,
        unsub_device,
        unsub_entity,
        unsub_retention,
        unsub_digest,
    ]

    # Once HA has started (all entries loaded), flag object entries that were
    # orphaned by a deleted global entry as a fixable repair issue (#86).
    async_at_started(hass, _sync_missing_global_entry_issue)

    return True


def _detect_advanced_feature_usage(hass: HomeAssistant, global_options: dict[str, Any]) -> dict[str, bool]:
    """Scan existing entries to detect which advanced features are in use."""
    adaptive = False
    predictions = False
    seasonal = False
    environmental = False
    checklists = False
    schedule_time = False

    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.unique_id == GLOBAL_UNIQUE_ID:
            continue
        tasks = entry.data.get(CONF_TASKS, {})
        for task_data in tasks.values():
            ac = task_data.get("adaptive_config") or {}
            if ac.get("enabled"):
                adaptive = True
            if ac.get("sensor_prediction_enabled"):
                predictions = True
            if ac.get("seasonal_enabled"):
                seasonal = True
            if ac.get("environmental_entity"):
                environmental = True
            if task_data.get("checklist"):
                checklists = True
            if task_data.get("schedule_time"):
                schedule_time = True

    budget = global_options.get(CONF_BUDGET_MONTHLY, 0) > 0 or global_options.get(CONF_BUDGET_YEARLY, 0) > 0
    groups = bool(global_options.get(CONF_GROUPS, {}))

    return {
        CONF_ADVANCED_ADAPTIVE: adaptive,
        CONF_ADVANCED_PREDICTIONS: predictions,
        CONF_ADVANCED_SEASONAL: seasonal,
        CONF_ADVANCED_ENVIRONMENTAL: environmental,
        CONF_ADVANCED_BUDGET: budget,
        CONF_ADVANCED_GROUPS: groups,
        CONF_ADVANCED_CHECKLISTS: checklists,
        CONF_ADVANCED_SCHEDULE_TIME: schedule_time,
    }


async def async_migrate_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Migrate a config entry forward in version (HA pattern).

    minor_version 1 → 2 (issue #30): backfill ``created_at`` for tasks that
    were created before the field existed. Uses the earliest history entry
    timestamp when available, otherwise today. This locks the next_due
    fallback anchor so the schedule advances normally instead of always
    pointing at "today".

    minor_version 2 → 3 (schedule-model v2): move the flat recurrence fields
    (interval_days / interval_unit / interval_anchor / schedule_type / due_date)
    into a single nested ``schedule`` object. Behaviour is identical — readers
    accept both shapes — this just makes storage canonical and unblocks the
    calendar recurrence kinds (nth-weekday etc.).

    minor_version 3 → 4 (discussion #49): seed ``responsible_user_id`` on
    rotation tasks that were configured without an initial assignee — those
    were invisible to every user filter until their first completion.
    """
    if entry.version > 1 or entry.minor_version >= 4:
        return True

    is_object_entry = entry.unique_id != GLOBAL_UNIQUE_ID
    data = dict(entry.data)
    minor = entry.minor_version

    # 1 → 2: backfill created_at (issue #30)
    if minor < 2:
        if is_object_entry:
            from homeassistant.util import dt as dt_util

            tasks_data = data.get(CONF_TASKS, {})
            if tasks_data:
                today_iso = dt_util.now().date().isoformat()
                new_tasks: dict[str, dict[str, Any]] = {}
                for task_id, td in tasks_data.items():
                    if "created_at" in td or td.get("last_performed"):
                        new_tasks[task_id] = td
                        continue
                    # Try to recover creation date from earliest history entry
                    anchor: str = today_iso
                    history = td.get("history") or []
                    if isinstance(history, list) and history:
                        timestamps: list[str] = [
                            ts for h in history if isinstance(h, dict) and isinstance((ts := h.get("timestamp")), str) and ts
                        ]
                        if timestamps:
                            # ISO timestamps sort lexicographically; take YYYY-MM-DD
                            anchor = min(timestamps)[:10]
                    new_td = dict(td)
                    new_td["created_at"] = anchor
                    new_tasks[task_id] = new_td
                data[CONF_TASKS] = new_tasks
        minor = 2

    # 2 → 3: flat recurrence fields → nested `schedule` (schedule-model v2)
    if minor < 3:
        if is_object_entry:
            tasks_data = data.get(CONF_TASKS, {})
            if tasks_data:
                data[CONF_TASKS] = {task_id: normalize_task_storage(td) for task_id, td in tasks_data.items()}
        minor = 3

    # 3 → 4: rotation tasks without an initial assignee get one (discussion #49)
    if minor < 4:
        if is_object_entry:
            from .helpers.sanitize import seed_rotation_assignee

            tasks_data = data.get(CONF_TASKS, {})
            if tasks_data:
                new_tasks = {}
                for task_id, td in tasks_data.items():
                    new_td = dict(td)
                    seed_rotation_assignee(new_td)
                    new_tasks[task_id] = new_td
                data[CONF_TASKS] = new_tasks
        minor = 4

    hass.config_entries.async_update_entry(entry, data=data, minor_version=minor)
    _LOGGER.info("Migrated entry %s to minor_version %s", entry.entry_id, minor)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: MaintenanceSupporterConfigEntry) -> bool:
    """Set up Maintenance Supporter from a config entry."""
    # Unloading the LAST entry pops hass.data[DOMAIN] (notification manager,
    # document store, event listeners) and HA runs async_setup only once per
    # boot — a reinstall in the same run must rebuild the shared runtime
    # (journey O1: sensor setup crashed on the missing document store).
    if NOTIFICATION_MANAGER_KEY not in hass.data.setdefault(DOMAIN, {}):
        await _async_setup_shared(hass)

    is_global = entry.unique_id == GLOBAL_UNIQUE_ID

    if is_global:
        # Global entry: no per-object coordinator, but a summary coordinator
        # aggregates task status counts across all objects to back the global
        # summary sensors (sensor.maintenance_supporter_overdue, etc.).
        summary_coordinator = MaintenanceSummaryCoordinator(hass)
        entry.runtime_data = MaintenanceSupporterData(summary_coordinator=summary_coordinator)
        summary_coordinator.async_setup_listeners()
        entry.async_on_unload(summary_coordinator.async_teardown_listeners)
        await summary_coordinator.async_refresh()

        # One-time migration: auto-enable advanced feature flags for existing users
        options = dict(entry.options or entry.data)
        if CONF_ADVANCED_ADAPTIVE not in options:
            flags = _detect_advanced_feature_usage(hass, options)
            options.update(flags)
            hass.config_entries.async_update_entry(entry, options=options)
            _LOGGER.info("Migrated advanced feature flags: %s", flags)

        # Register panel if enabled in options (on by default — see const).
        if entry.options.get(CONF_PANEL_ENABLED, DEFAULT_PANEL_ENABLED):
            await async_register_panel(hass)

        # Listen for options changes (panel toggle)
        entry.async_on_unload(entry.add_update_listener(_async_global_options_updated))

        # Keep <config>/custom_sentences/ in step with the opt-in setting. Runs
        # on every setup, not just on change, so an upgrade that ships new
        # sentences reaches an install that already opted in.
        await async_sync_assist_sentences(
            hass, entry.options.get(CONF_INSTALL_ASSIST_SENTENCES, False)
        )

        # Initial orphan check for admin_panel_user_ids (HA users deleted
        # while the integration was offline land here as repair issues).
        await _check_admin_panel_user_orphans(hass, entry)

        # v1.5.4: also clear stale ``task.responsible_user_id`` so the
        # dashboard stops showing the ghost of deleted users.
        await _check_task_responsible_user_orphans(hass)

        # Surface a configured-but-missing notify service as a repair issue.
        # Deferred to HA-started so lazily-registered notify services (mobile_app,
        # notify groups) are present before we judge the service missing.
        entry.async_on_unload(async_at_started(hass, _verify_notify_service))

        # Surface document-storage anomalies (orphan/dangling blobs after a
        # crash or partial restore) as a fixable repair issue. Deferred to
        # HA-started so the store has finished loading.
        entry.async_on_unload(async_at_started(hass, _check_document_storage_issues))

        # A global entry now exists — clear the orphan repair issue immediately
        # (e.g. right after the repair flow recreated it, when HA is already
        # started and the async_at_started check above won't fire again).
        _sync_missing_global_entry_issue(hass)

        _LOGGER.debug("Global config entry set up: %s", entry.entry_id)
    else:
        # Maintenance object entry: fetch-or-create the Store. Reused across
        # entry RELOADS (cache in a top-level hass.data key): a second Store
        # instance for the same file would race the first one's pending
        # debounced save — see STORES_CACHE_KEY in const.py.
        stores: dict[str, MaintenanceStore] = hass.data.setdefault(STORES_CACHE_KEY, {})
        cached_store = stores.get(entry.entry_id)
        store = cached_store if cached_store is not None else MaintenanceStore(hass, entry.entry_id)
        stores[entry.entry_id] = store

        if cached_store is None:
            # First setup this run: load from disk + one-time migration.
            # Compare against the CAPTURED snapshot, not the live entry.data:
            # the migration awaits store I/O, and a concurrent WS write during
            # that window replaces entry.data — an identity check against the
            # live attribute then fails spuriously and this write clobbers the
            # concurrent update with the pre-await snapshot (lost update, seen
            # live when rapid part creates raced a reload's setup).
            data_before_migration = entry.data
            cleaned_data = await async_migrate_to_store(hass, entry.entry_id, data_before_migration, store)
            if cleaned_data is not data_before_migration:
                hass.config_entries.async_update_entry(entry, data=dict(cleaned_data))
        # A cached store's memory is authoritative — re-loading from disk here
        # would drop any change still sitting in its debounce window.

        # Reconcile the entry.data <-> Store split (journey I1): drop store
        # state orphaned by a crash between the two writes of a deletion.
        # Same reconciliation for spare-part stock state (journey S6): a crash
        # between the ConfigEntry write and the Store save on a part deletion
        # leaves its stock orphaned forever otherwise.
        pruned_parts = store.prune_part_orphans(set(entry.data.get("parts") or {}))
        if pruned_parts:
            _LOGGER.info("Pruned %d orphaned part stock state(s) for %s", pruned_parts, entry.title)
            await store.async_save()

        pruned = store.prune_orphans(set(entry.data.get(CONF_TASKS, {})))
        if pruned:
            _LOGGER.info(
                "Pruned %d orphaned task state(s) from store for %s",
                pruned,
                entry.title,
            )
            await store.async_save()

        coordinator = MaintenanceCoordinator(hass, entry, store)
        entry.runtime_data = MaintenanceSupporterData(coordinator=coordinator, store=store)
        await coordinator.async_config_entry_first_refresh()

        # v1.5.3 (#48): forward-sync obj fields → device_registry whenever the
        # entry data changes (WS update OR config-flow re-edit). DeviceInfo
        # only seeds these on first device creation; after that, dashboard
        # edits never reach the device unless we push them. Combined with the
        # global EVENT_DEVICE_REGISTRY_UPDATED listener registered in
        # async_setup, this gives the area a true bidirectional sync.
        entry.async_on_unload(entry.add_update_listener(_async_sync_obj_to_device))

        # Notify WS subscribers that a new object entry is available
        from homeassistant.helpers.dispatcher import async_dispatcher_send

        async_dispatcher_send(hass, SIGNAL_NEW_OBJECT_ENTRY, entry.entry_id)

        # Buy-task catch-up (spare parts): converge the shopping reminders with
        # the current stock/pause/archive state — covers import/restore, a
        # resume/unarchive, and any change made while this entry was unloaded.
        # Declarative + idempotent, reloads only when something changed.
        if entry.data.get("parts"):
            from .parts_runtime import schedule_buy_task_reconcile

            schedule_buy_task_reconcile(hass, entry)

        _LOGGER.debug(
            "Maintenance object entry set up: %s (%s)",
            entry.title,
            entry.entry_id,
        )

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def _async_sync_obj_to_device(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Push obj.* (area_id, name, manufacturer, model, serial_number) → device.

    Fires whenever an object entry's data is updated. Without this, the
    dashboard's WS update of obj.area_id never reaches HA's device_registry,
    so the device stays stuck on whatever DeviceInfo.suggested_area set at
    first creation (issue #48).
    """
    obj = entry.data.get(CONF_OBJECT, {}) or {}
    if obj.get("ha_device_id"):
        # Linked to an EXISTING device owned by another integration (2.19) —
        # pushing our object metadata would overwrite that device's
        # name/manufacturer/area. The owning integration stays authoritative.
        return
    dev_reg = dr.async_get(hass)
    devices = dr.async_entries_for_config_entry(dev_reg, entry.entry_id)
    obj_name = obj.get("name")
    obj_area = obj.get("area_id")
    obj_manu = obj.get("manufacturer")
    obj_model = obj.get("model")
    obj_serial = obj.get("serial_number")
    for device in devices:
        kwargs: dict[str, Any] = {}
        if device.area_id != obj_area:
            kwargs["area_id"] = obj_area
        # Only push name when obj has one (HA requires non-empty device.name).
        if obj_name and device.name != obj_name:
            kwargs["name"] = obj_name
        if device.manufacturer != obj_manu:
            kwargs["manufacturer"] = obj_manu
        if device.model != obj_model:
            kwargs["model"] = obj_model
        if device.serial_number != obj_serial:
            kwargs["serial_number"] = obj_serial
        if kwargs:
            dev_reg.async_update_device(device.id, **kwargs)


@callback
def _verify_notify_service(hass: HomeAssistant) -> None:
    """Sync the "configured notify service missing" repair issue with reality.

    Runs once HA has started (lazily-registered services such as mobile_app are
    available by then, avoiding a false alarm during boot) and again whenever the
    global options change (the service may have just been (re)configured).
    """
    nm = hass.data.get(DOMAIN, {}).get(NOTIFICATION_MANAGER_KEY)
    if isinstance(nm, NotificationManager):
        nm.async_verify_configured_service()


_DOC_STORAGE_ISSUE_ID = "document_storage_issues"


async def _check_document_storage_issues(hass: HomeAssistant) -> None:
    """Sync the document-storage repair issue with the current on-disk reality.

    The store is consistent under normal operation; anomalies (orphaned blobs,
    dangling records, stale registry entries) only arise from a crash, an
    external file delete, or a partial restore — so a boot-time scan is the
    right trigger. The fixable issue's flow reclaims the space; once a later
    scan comes back clean the issue is removed.
    """
    from homeassistant.helpers import issue_registry as ir

    store = hass.data.get(DOMAIN, {}).get(DOCUMENT_STORE_KEY)
    if not isinstance(store, DocumentStore):
        return
    issues = await store.async_find_issues()
    if any(issues.values()):
        ir.async_create_issue(
            hass,
            DOMAIN,
            _DOC_STORAGE_ISSUE_ID,
            is_fixable=True,
            severity=ir.IssueSeverity.WARNING,
            translation_key=_DOC_STORAGE_ISSUE_ID,
        )
    else:
        ir.async_delete_issue(hass, DOMAIN, _DOC_STORAGE_ISSUE_ID)


_MISSING_GLOBAL_ISSUE_ID = "missing_global_entry"


@callback
def _sync_missing_global_entry_issue(hass: HomeAssistant) -> None:
    """Surface "object entries exist but the global entry is gone" as a repair.

    The config flow always creates the global "Maintenance Supporter" entry
    before the first object, but a user can later delete just that entry from
    Settings → Devices & Services, leaving orphan object entries behind. That
    strips the summary sensors, the sidebar panel and the digests — and the
    dashboard KPI chips read "unknown" (#86, 2nd report). The fixable issue's
    flow recreates the global entry with default settings; it clears itself once
    a global entry is present again.
    """
    from homeassistant.helpers import issue_registry as ir

    entries = hass.config_entries.async_entries(DOMAIN)
    has_global = any(e.unique_id == GLOBAL_UNIQUE_ID for e in entries)
    has_objects = any(e.unique_id != GLOBAL_UNIQUE_ID for e in entries)
    if has_objects and not has_global:
        ir.async_create_issue(
            hass,
            DOMAIN,
            _MISSING_GLOBAL_ISSUE_ID,
            is_fixable=True,
            severity=ir.IssueSeverity.ERROR,
            translation_key=_MISSING_GLOBAL_ISSUE_ID,
        )
    else:
        ir.async_delete_issue(hass, DOMAIN, _MISSING_GLOBAL_ISSUE_ID)


async def _async_global_options_updated(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """React to global options changes (panel toggle / sidebar title)."""
    panel_enabled = entry.options.get(CONF_PANEL_ENABLED, DEFAULT_PANEL_ENABLED)
    if panel_enabled:
        # force=True so a changed sidebar title (CONF_PANEL_TITLE) re-registers
        # the panel; it's a no-op refresh when the title is unchanged.
        await async_register_panel(hass, force=True)
    else:
        await async_unregister_panel(hass)
    await _check_admin_panel_user_orphans(hass, entry)
    # The notify service may have just been (re)configured — re-check it.
    _verify_notify_service(hass)
    # Install or remove the Assist sentence files to match the setting.
    await async_sync_assist_sentences(
        hass, entry.options.get(CONF_INSTALL_ASSIST_SENTENCES, False)
    )


_ORPHAN_ISSUE_PREFIX = "orphan_admin_panel_user_"


async def _check_task_responsible_user_orphans(
    hass: HomeAssistant,
) -> None:
    """Clear task assignments pointing at deleted HA users.

    Same class of bug as ``admin_panel_user_ids`` orphans (#48 audit) but for
    tasks: a user can be deleted in HA while we hold their UUID in entry data.
    Two references need pruning:

    * ``responsible_user_id`` — dashboards would render "Unknown user"
      forever; notifications already fall back to the global service.
    * ``assignee_pool`` (2.17 rotation) — a ghost member is WORSE than a
      ghost pointer: ``advance_rotation`` keeps assigning the deleted user
      (``least_completed`` picks them forever at 0 completions), so pruning
      only the pointer would resurrect it on the next completion.

    When the pool shrinks below 2 members the rotation is dissolved
    (mirroring the task-dialog save rule); when the orphaned pointer leaves a
    healthy pool behind, responsibility moves to the first remaining member
    so the shared task never goes unassigned. Silent removal with an info
    log — no repair issue, no user prompt.
    """
    valid_ids = {u.id for u in await hass.auth.async_get_users()}
    if not valid_ids:
        # Defensive: production HA always has at least the owner user. An
        # empty list means we're in a test harness without an auth fixture
        # or auth is mid-load — either way, don't prune references we
        # can't actually verify as orphaned.
        return
    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.unique_id == GLOBAL_UNIQUE_ID:
            continue
        tasks = entry.data.get(CONF_TASKS, {})
        new_tasks: dict[str, dict[str, Any]] = {}
        changed = False
        for tid, td in tasks.items():
            ruid = td.get("responsible_user_id")
            pool = [u for u in (td.get("assignee_pool") or []) if isinstance(u, str)]
            pruned_pool = [u for u in pool if u in valid_ids]
            resp_orphaned = bool(ruid) and ruid not in valid_ids
            if not resp_orphaned and pruned_pool == pool:
                new_tasks[tid] = td
                continue

            new_td = dict(td)
            changed = True
            if pruned_pool != pool:
                _LOGGER.info(
                    "Removing %d deleted user(s) from assignee_pool on task %s (%s)",
                    len(pool) - len(pruned_pool),
                    tid,
                    entry.title,
                )
                if len(pruned_pool) >= 2:
                    new_td["assignee_pool"] = pruned_pool
                else:
                    # A rotation needs at least two members.
                    new_td.pop("assignee_pool", None)
                    new_td.pop("rotation_strategy", None)
            if resp_orphaned:
                _LOGGER.info(
                    "Clearing orphaned responsible_user_id %s on task %s (%s)",
                    ruid,
                    tid,
                    entry.title,
                )
                if len(pruned_pool) >= 2:
                    # Keep the shared task assigned: hand over to the pool.
                    new_td["responsible_user_id"] = pruned_pool[0]
                else:
                    new_td.pop("responsible_user_id", None)
            new_tasks[tid] = new_td
        if changed:
            new_data = {**entry.data, CONF_TASKS: new_tasks}
            hass.config_entries.async_update_entry(entry, data=new_data)


async def _check_admin_panel_user_orphans(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Surface admin_panel_user_ids entries pointing at deleted HA users.

    Each orphaned id becomes a fixable repair issue. The repair flow lets
    the admin remove the entry from the list with one click. Issues for
    ids that have been validated, removed from the list, or restored are
    cleared automatically.
    """
    from homeassistant.helpers import issue_registry as ir

    user_ids_raw = entry.options.get(CONF_ADMIN_PANEL_USER_IDS, []) or []
    if not isinstance(user_ids_raw, list):
        user_ids_raw = []
    user_ids: set[str] = {u for u in user_ids_raw if isinstance(u, str)}
    valid_ids = {u.id for u in await hass.auth.async_get_users()}

    # 1) Drop any pre-existing orphan issue whose target id is no longer
    #    in the list (admin removed it) OR is now valid (user re-created).
    #    Scope the iteration to OUR domain via the (domain, issue_id) tuple
    #    keys instead of scanning every integration's issues.
    issue_reg = ir.async_get(hass)
    stale_issue_ids = [iid for (dom, iid) in issue_reg.issues if dom == DOMAIN and iid.startswith(_ORPHAN_ISSUE_PREFIX)]
    for issue_id in stale_issue_ids:
        target_uid = issue_id[len(_ORPHAN_ISSUE_PREFIX) :]
        if target_uid not in user_ids or target_uid in valid_ids:
            ir.async_delete_issue(hass, DOMAIN, issue_id)

    # 2) Create issues for ids in the list that no longer match a HA user.
    for uid in user_ids:
        if uid in valid_ids:
            continue
        ir.async_create_issue(
            hass,
            DOMAIN,
            f"{_ORPHAN_ISSUE_PREFIX}{uid}",
            is_fixable=True,
            severity=ir.IssueSeverity.WARNING,
            translation_key="orphan_admin_panel_user",
            translation_placeholders={"user_id": uid[:8]},
            data={"user_id": uid, "entry_id": entry.entry_id},
        )


async def async_unload_entry(hass: HomeAssistant, entry: MaintenanceSupporterConfigEntry) -> bool:
    """Unload a config entry."""
    if entry.unique_id == GLOBAL_UNIQUE_ID:
        # Unregister panel when global entry is unloaded
        await async_unregister_panel(hass)

    # Flush a pending debounced store save BEFORE tearing down — belt and
    # suspenders next to the store cache: disk is current the moment the entry
    # goes away, whether or not it ever comes back this run.
    store = hass.data.get(STORES_CACHE_KEY, {}).get(entry.entry_id)
    if store is not None:
        await store.async_save()

    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)

    # Clean up domain data if no entries left
    remaining = [e for e in hass.config_entries.async_entries(DOMAIN) if e.entry_id != entry.entry_id]
    if not remaining:
        nm = hass.data.get(DOMAIN, {}).get(NOTIFICATION_MANAGER_KEY)
        if nm is not None:
            await nm.async_unload()
        for unsub in hass.data.get(DOMAIN, {}).get(EVENT_UNSUBS_KEY, []):
            unsub()
        hass.data.pop(DOMAIN, None)

    return unload_ok


async def async_remove_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Clean up store file when a config entry is permanently deleted."""
    if entry.unique_id == GLOBAL_UNIQUE_ID:
        # Deleting the global entry while object entries remain is a broken
        # state (no summary sensors / panel / digests) — surface it right away
        # as a fixable repair issue so the user can restore it (#86).
        _sync_missing_global_entry_issue(hass)
        return
    # #111: hand any shared spare-part pool to a borrower BEFORE the Store goes
    # — the stock numbers exist nowhere else. Must happen here rather than in
    # the panel's delete: HA's own Configure-UI removal never reaches that path.
    from .helpers.shared_parts import async_transfer_pools_on_removal

    try:
        await async_transfer_pools_on_removal(hass, entry)
    except Exception:
        _LOGGER.exception("Could not transfer shared spare parts from %s", entry.title)

    store = hass.data.get(STORES_CACHE_KEY, {}).pop(entry.entry_id, None)
    if store is None:
        store = MaintenanceStore(hass, entry.entry_id)
    await store.async_remove()
    # Drop the per-entry reconcile lock — the module dict would otherwise grow
    # by one lock per object ever created in this HA run.
    from .parts_runtime import discard_reconcile_lock

    discard_reconcile_lock(entry.entry_id)
    # v1.5.4: also called from ws_delete_object — but if the user removes the
    # config entry from HA's "Configure" UI, that path doesn't run, leaving
    # phantom task_refs in groups. Belt-and-suspenders.
    from .websocket import cleanup_group_refs, object_id_for_entry

    cleanup_group_refs(hass, entry_id=entry.entry_id)

    # Remove this object's documents (refcount-aware — a blob shared with another
    # object survives; only bytes freed for good are reclaimed). Archiving keeps
    # docs; permanent deletion is the trigger, and this hook fires for the WS,
    # the Configure-UI, and the service delete paths alike — the single place it
    # belongs.
    doc_store = hass.data.get(DOMAIN, {}).get(DOCUMENT_STORE_KEY)
    if isinstance(doc_store, DocumentStore):
        await doc_store.async_remove_object(object_id_for_entry(entry))

    _LOGGER.debug("Removed store for entry %s", entry.entry_id)
    # The global summary coordinator has no listener for entry removal, so tell
    # it to drop this object from its counts immediately (otherwise the summary
    # sensors stay stale until the next event or a restart).
    from homeassistant.helpers.dispatcher import async_dispatcher_send

    async_dispatcher_send(hass, SIGNAL_OBJECT_ENTRY_REMOVED, entry.entry_id)


async def async_remove_config_entry_device(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    device_entry: dr.DeviceEntry,
) -> bool:
    """Allow device removal when it has no entities."""
    entity_registry = er.async_get(hass)
    return not er.async_entries_for_device(entity_registry, device_entry.id)


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
    if config_entry is None:
        return None

    runtime_data: MaintenanceSupporterData | None = getattr(config_entry, "runtime_data", None)
    if runtime_data is None:
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

    # Look up which task matches this unique_id
    # Sensor unique_id: maintenance_supporter_{slug}_{task_id}
    # Binary sensor: maintenance_supporter_{slug}_{task_id}_overdue
    from .const import CONF_TASKS

    tasks: dict[str, Any] = config_entry.data.get(CONF_TASKS, {})
    clean_id = unique_id.removesuffix("_overdue")
    for task_id in tasks:
        if clean_id.endswith(f"_{task_id}"):
            return str(task_id)

    return None
