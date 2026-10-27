"""The integration-wide event listeners: the Companion App's notification
buttons, NFC tag scans, area and entity-id changes in Home Assistant's
registries, and deleted users. Subscribed by _async_setup_shared; the last
entry's unload calls the unsubscribe callbacks."""

from __future__ import annotations

import logging
from functools import partial
from typing import Any

from homeassistant.auth import EVENT_USER_REMOVED
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import (
    CALLBACK_TYPE,
    Event,
    HomeAssistant,
    callback,
)
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import (
    device_registry as dr,
)
from homeassistant.helpers import (
    entity_registry as er,
)

from .const import (
    COMPLETION_PROVENANCE_NOTES,
    CONF_MIRROR_TODO_DEFAULT_ENTITIES,
    CONF_NOTIFY_SERVICE,
    CONF_OBJECT,
    CONF_SHOPPING_LIST_ENTITY,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    NOTIFICATION_MANAGER_KEY,
)
from .helpers.action_listener import register_action_listener
from .helpers.aggregate import async_store_even_unloaded
from .helpers.assignees import task_user_ids
from .helpers.device_link import device_owner_ids
from .helpers.entity_rename import rewrite_object, rewrite_store, rewrite_tasks
from .helpers.global_options import get_global_entry
from .helpers.history import cycle_token
from .helpers.notification_ids import action_cycle, parse_action_id
from .helpers.pause import is_task_inert
from .helpers.todo_mirror import schedule_rearm as _rearm_todo_mirror
from .helpers.user_orphans import async_prune_task_user_orphans, async_sync_admin_panel_orphan_issues
from .shopping_sync import SHOPPING_SYNC_KEY

_LOGGER = logging.getLogger(__name__)


async def _handle_notification_action(hass: HomeAssistant, event: Event) -> None:
    """Handle mobile_app_notification_action events from Companion App."""
    action = event.data.get("action", "")
    # MS_<COMPLETE|SKIP|SNOOZE>_<entry_id>_<task_id> — the one parser of
    # the ids build_action_buttons sends (helpers/notification_ids).
    try:
        parsed = parse_action_id(action)
    except ValueError:
        _LOGGER.warning("Invalid notification action format: %s", action)
        return
    if parsed is None:
        return  # not a task button of ours (or a test-send button)
    action_type, entry_id, task_id = parsed

    config_entry = hass.config_entries.async_get_entry(entry_id)
    runtime_data = getattr(config_entry, "runtime_data", None) if config_entry else None
    if not runtime_data or not hasattr(runtime_data, "coordinator") or not runtime_data.coordinator:
        _LOGGER.warning("No coordinator found for notification action (entry_id=%s)", entry_id)
        return

    nm = hass.data.get(DOMAIN, {}).get(NOTIFICATION_MANAGER_KEY)
    # Whose phones carry the reminder: read BEFORE completing, which
    # hands a rotation on to the next person.
    task_cfg = (config_entry.data.get(CONF_TASKS) or {}).get(task_id) or {} if config_entry is not None else {}
    reminded_user_ids = task_user_ids(task_cfg)

    # A reminder whose cycle was closed elsewhere (panel, voice, a tag,
    # another phone) is outdated: its Complete or Skip acted on the NEXT
    # cycle — a second history entry, the rotation handed on twice, a
    # planned date skipped (bug audit 2026-10-16, N1). It is only taken
    # off the phones. Buttons from before 2.104 carry no cycle.
    sent_cycle = action_cycle(action)
    if sent_cycle is not None and action_type in ("complete", "skip"):
        current = runtime_data.coordinator.merged_task(task_id)
        if current is not None and cycle_token(current.get("history")) != sent_cycle:
            _LOGGER.info("Ignoring %s of task %s from an outdated reminder", action_type, task_id)
            if nm is not None:
                await nm.async_dismiss_task_notification(task_id, user_ids=reminded_user_ids)
            return

    try:
        if action_type == "complete":
            _LOGGER.info("Completing task %s via notification action", task_id)
            await runtime_data.coordinator.complete_maintenance(
                task_id=task_id,
                notes=COMPLETION_PROVENANCE_NOTES["notification_action"],
                unattended=True,
                source="notification_action",
                # mobile_app fires the action with the registration's
                # user in the context - credit them (#128 attribution,
                # feeds least_completed rotation); bug audit 2026-08-29.
                completed_by=event.context.user_id if event.context else None,
            )
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
        await nm.async_dismiss_task_notification(task_id, user_ids=reminded_user_ids)
        nm.clear_task_state(entry_id, task_id)


async def _handle_tag_scanned(hass: HomeAssistant, event: Event) -> None:
    """Handle tag_scanned events — complete task linked to NFC tag."""
    tag_id = event.data.get("tag_id", "")
    if not tag_id:
        return

    # Search all entries for a task with matching nfc_tag_id. An
    # archived, disabled or paused task keeps its tag: the search stopped
    # at the first match, so a tag moved on to a new task (the sticker
    # stays on the appliance) completed nothing once the old one was
    # retired (bug audit 2026-10-16, C-E). Active matches go first.
    matches = [
        (ce, task_id)
        for ce in hass.config_entries.async_entries(DOMAIN)
        if ce.unique_id != GLOBAL_UNIQUE_ID
        for task_id, task_data in (ce.data.get(CONF_TASKS) or {}).items()
        if task_data.get("nfc_tag_id") == tag_id
    ]
    matches.sort(key=lambda m: is_task_inert(m[0].data[CONF_TASKS][m[1]], m[0].data.get(CONF_OBJECT) or {}))
    for ce, task_id in matches:
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
                notes=COMPLETION_PROVENANCE_NOTES["nfc"],
                unattended=True,
                source="nfc",
                tag_verified=True,
            )
        except ServiceValidationError as err:
            # A tag tap cannot capture a cost or a photo. Log it
            # plainly and leave the task open so the user finishes it
            # in the panel — the honest outcome, not a silent no-op.
            _LOGGER.warning("NFC completion of task %s rejected: %s", task_id, err)
        return

    # No match found — not our tag, ignore silently


# v1.5.3 (#48): reverse-sync HA device.area_id → obj.area_id when the user
# changes the area in the HA UI / device settings. The forward sync
# (obj.area_id → device.area_id) happens via the per-entry update listener
# registered in async_setup_entry. Together these two listeners keep the
# dashboard area and the HA device area in sync after the initial creation
# (DeviceInfo.suggested_area only fires once, on first device creation).
@callback
def _object_entries_for_device(
    # object: HA 2026.9 registry lookups return DeviceEntry |
    # ChildDeviceEntry (a union 2026.7 cannot import); the body reads
    # attributes via getattr already.
    hass: HomeAssistant, device: object
) -> list[ConfigEntry]:
    """Our object entries that live on this device.

    Two ways an object reaches a device page, and they need different
    lookups:

    * its OWN device — our config entry is listed on it;
    * a LINKED device owned by another integration — we deliberately do
      NOT add our config entry there any more (HA 2026.8 forbids it), so
      the only record of the link is ``obj["ha_device_id"]``. Matching on
      ``device.config_entries`` alone would silently stop syncing exactly
      the objects the user attached by hand.

    Several objects may point at the same device; all of them follow it.
    """
    found: list[ConfigEntry] = []
    seen: set[str] = set()
    # One config entry per device since 2026.8 (the plural is reported
    # from 2026.10) — helpers.device_link.device_owner_ids reads it.
    for ce_id in device_owner_ids(device):
        ce = hass.config_entries.async_get_entry(ce_id)
        if ce is not None and ce.domain == DOMAIN and ce.unique_id != GLOBAL_UNIQUE_ID:
            found.append(ce)
            seen.add(ce.entry_id)
    for ce in hass.config_entries.async_entries(DOMAIN):
        if ce.entry_id in seen or ce.unique_id == GLOBAL_UNIQUE_ID:
            continue
        if (ce.data.get(CONF_OBJECT) or {}).get("ha_device_id") == getattr(device, "id", None):
            found.append(ce)
    return found


@callback
def _on_device_registry_update(
    hass: HomeAssistant,
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
    for ce in _object_entries_for_device(hass, device):
        obj = dict(ce.data.get(CONF_OBJECT, {}))
        if obj.get("area_id") == device.area_id:
            continue  # already in sync — breaks the loop with the forward listener
        obj["area_id"] = device.area_id
        hass.config_entries.async_update_entry(ce, data={**ce.data, CONF_OBJECT: obj})


# v1.5.4: rewrite stored entity_id references when HA renames an entity.
# Without this, ``trigger_config["entity_id"]`` /
# ``adaptive_config["environmental_entity"]`` go stale and the underlying
# ``async_track_state_change_event`` listeners silently miss events on the
# new id. Same dual-storage bug class as #48 — different field, same fix.
async def _on_entity_registry_update(
    hass: HomeAssistant,
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

    # v2.67: the global shopping-list target is an entity reference too —
    # and so is a notify ENTITY picked as the notification target (a
    # renamed one used to leave notifications to a repair message; a
    # legacy notify service is no entity and never renamed).
    gentry = get_global_entry(hass)
    if gentry is not None:
        # The settings' read rule (options, else the creation data): a
        # hub entry whose settings still live in ``data`` got options of
        # the renamed key alone, and every other setting vanished behind
        # them (bug audit 2026-10-16).
        settings = gentry.options or gentry.data
        renamed: dict[str, Any] = {
            key: new_eid
            for key in (CONF_SHOPPING_LIST_ENTITY, CONF_NOTIFY_SERVICE)
            if settings.get(key) == old_eid
        }
        # #231: the to-do mirror's default lists (the Store records'
        # keys follow below, per object, with the per-task lists').
        defaults = settings.get(CONF_MIRROR_TODO_DEFAULT_ENTITIES)
        if isinstance(defaults, list) and old_eid in defaults:
            renamed[CONF_MIRROR_TODO_DEFAULT_ENTITIES] = [new_eid if e == old_eid else e for e in defaults]
        if renamed:
            hass.config_entries.async_update_entry(gentry, options={**settings, **renamed})
        if CONF_SHOPPING_LIST_ENTITY in renamed:
            sync = hass.data.get(DOMAIN, {}).get(SHOPPING_SYNC_KEY)
            if sync is not None:
                await sync.async_handle_rename(old_eid, new_eid)

    for ce in hass.config_entries.async_entries(DOMAIN):
        if ce.unique_id == GLOBAL_UNIQUE_ID:
            continue

        # 1. trigger_config refs (+ calendar-kind schedules, to-do mirror
        #    targets) live in entry.data, the battery fleet's manual
        #    include / exclude lists on the object (bug audit 2026-09-27).
        entry_changed = False
        new_data = dict(ce.data)
        tasks = ce.data.get(CONF_TASKS, {})
        if tasks:
            new_tasks, tasks_changed = rewrite_tasks(tasks, old_eid, new_eid)
            if tasks_changed:
                new_data[CONF_TASKS] = new_tasks
                entry_changed = True
        obj = ce.data.get(CONF_OBJECT)
        if isinstance(obj, dict):
            new_obj, obj_changed = rewrite_object(obj, old_eid, new_eid)
            if obj_changed:
                new_data[CONF_OBJECT] = new_obj
                entry_changed = True
        if entry_changed:
            hass.config_entries.async_update_entry(ce, data=new_data)

        # 2. adaptive_config.environmental_entity + trigger_runtime keys
        #    live in Store (post-migration; see _DYNAMIC_TASK_FIELDS),
        #    an object's that is not loaded right now included.
        store = await async_store_even_unloaded(hass, ce)
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
        # they re-instantiate against the new id. The to-do mirror's list
        # listeners are shared (global entry): re-armed on the new ids.
        hass.config_entries.async_schedule_reload(ce.entry_id)

        _rearm_todo_mirror(hass)
        _LOGGER.info(
            "Rewrote entity references %s → %s for entry %s (entry_data=%s, store=%s) and scheduled reload",
            old_eid,
            new_eid,
            ce.entry_id,
            entry_changed,
            store_changed,
        )


# A deleted HA user used to be reconciled only at the next boot: the
# least_completed rotation kept assigning the ghost meanwhile and the
# admin-panel allowlist kept the stale id (bug audit 2026-08-29).
async def _on_user_removed(hass: HomeAssistant, _event: Event) -> None:
    await async_prune_task_user_orphans(hass)
    gentry = get_global_entry(hass)
    if gentry is not None:
        await async_sync_admin_panel_orphan_issues(hass, gentry)


@callback
def async_register_listeners(hass: HomeAssistant) -> list[CALLBACK_TYPE]:
    """Subscribe the listeners above; returns their unsubscribe callbacks,
    which the last entry's unload calls."""
    unsub_notification = hass.bus.async_listen("mobile_app_notification_action", partial(_handle_notification_action, hass))
    unsub_tag = hass.bus.async_listen("tag_scanned", partial(_handle_tag_scanned, hass))

    # v1.3.0: per-task on_complete_action listener (Layer B). Subscribes to
    # EVENT_TASK_COMPLETED — same event power users can listen for in their
    # own automations. Single listener handles all entries' tasks.
    unsub_action = register_action_listener(hass)
    unsub_device = hass.bus.async_listen(dr.EVENT_DEVICE_REGISTRY_UPDATED, partial(_on_device_registry_update, hass))
    unsub_entity = hass.bus.async_listen(er.EVENT_ENTITY_REGISTRY_UPDATED, partial(_on_entity_registry_update, hass))
    unsub_user_removed = hass.bus.async_listen(EVENT_USER_REMOVED, partial(_on_user_removed, hass))
    return [unsub_user_removed, unsub_notification, unsub_tag, unsub_action, unsub_device, unsub_entity]
