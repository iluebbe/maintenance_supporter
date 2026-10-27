"""The Maintenance Supporter integration."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import (
    CoreState,
    HomeAssistant,
    callback,
)
from homeassistant.helpers import (
    config_validation as cv,
)
from homeassistant.helpers import (
    device_registry as dr,
)
from homeassistant.helpers import (
    entity_registry as er,
)
from homeassistant.helpers import issue_registry as ir
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.start import async_at_started
from homeassistant.helpers.typing import ConfigType
from homeassistant.util import dt as dt_util

from .const import (
    BATTERY_FLEET_OBJECT_FLAG,
    CONF_ADVANCED_ADAPTIVE,
    CONF_ADVANCED_BUDGET,
    CONF_ADVANCED_CHECKLISTS,
    CONF_ADVANCED_ENVIRONMENTAL,
    CONF_ADVANCED_GROUPS,
    CONF_ADVANCED_SCHEDULE_TIME,
    CONF_ADVANCED_SEASONAL,
    CONF_BUDGET_MONTHLY,
    CONF_BUDGET_YEARLY,
    CONF_GROUPS,
    CONF_INSTALL_ASSIST_SENTENCES,
    CONF_OBJECT,
    CONF_PANEL_ENABLED,
    CONF_ROW_ACTION_NOTICE,
    CONF_TASKS,
    CONF_VACATION_EXEMPT_TASK_IDS,
    DOCUMENT_STORE_KEY,
    DOCUMENT_TEXT_INDEX_KEY,
    DOMAIN,
    EVENT_UNSUBS_KEY,
    GLOBAL_UNIQUE_ID,
    NOTIFICATION_MANAGER_KEY,
    PLATFORMS,
    SIGNAL_BATTERY_FLEET_CHANGED,
    SIGNAL_NEW_OBJECT_ENTRY,
    SIGNAL_OBJECT_ENTRY_REMOVED,
    STORES_CACHE_KEY,
)
from .coordinator import MaintenanceCoordinator
from .daily_jobs import async_track_daily_jobs
from .entity.summary_coordinator import MaintenanceSummaryCoordinator
from .frontend import async_register_card
from .helpers.aggregate import object_id_for_entry
from .helpers.aggregate import object_name as aggregate_object_name
from .helpers.area_leftovers import async_check_leftover_areas
from .helpers.assist_sentences import async_sync as async_sync_assist_sentences
from .helpers.battery_fleet_setup import retranslate_seeded_texts
from .helpers.calendar_source import calendar_occurrence_provider
from .helpers.catalog_heal import heal_catalog_triggers
from .helpers.complete_when import async_track_complete_when
from .helpers.dates import local_date_from_iso
from .helpers.device_link import (
    forget_removed_parent,
    has_own_devices,
    is_self_link,
    resolve_linked_device_id,
    shed_owned_devices,
    sync_via_device_links,
)
from .helpers.document_text import DocumentTextIndex
from .helpers.documents import DocumentStore, async_forget_doc_ids
from .helpers.global_options import cleanup_group_refs, entry_option, get_global_entry
from .helpers.i18n import normalize_language
from .helpers.issues import async_purge_entry_issues, device_link_lost_issue_id
from .helpers.notification_manager import NotificationManager
from .helpers.places import PLACES_KEY, PlaceArrivals
from .helpers.reference_numbers import REFERENCE_NUMBERS_KEY, ReferenceNumbers
from .helpers.sanitize import seed_rotation_assignee
from .helpers.schedule import normalize_task_storage, set_calendar_occurrence_provider
from .helpers.task_origin import backfill_origins
from .helpers.todo_mirror import TODO_MIRROR_KEY, TodoMirror
from .helpers.todo_mirror import settings_changed as _todo_mirror_settings_changed
from .helpers.update_state import async_remember_running_version
from .helpers.user_orphans import async_prune_task_user_orphans, async_sync_admin_panel_orphan_issues
from .helpers.workday import async_setup_business_days
from .listeners import async_register_listeners
from .models.runtime_data import MaintenanceSupporterConfigEntry, MaintenanceSupporterData
from .panel import async_register_panel, async_unregister_panel
from .parts_runtime import discard_reconcile_lock, schedule_buy_task_reconcile
from .services import async_setup_services
from .shopping_sync import SHOPPING_SYNC_KEY, ShoppingListSync, schedule_resync
from .shopping_sync import schedule_resync as _schedule_shopping_resync
from .storage import MaintenanceStore, async_migrate_to_store
from .views import async_register_document_views
from .websocket import async_register_commands

_LOGGER = logging.getLogger(__name__)

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


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

    # Which version this run imported: an update HACS installs later changes
    # the files (and HA's integration cache) but not the code in memory, and
    # the panel asks for a restart until they agree again.
    await async_remember_running_version(hass)

    # The Lovelace card / calendar card / strategy modules FIRST (#184): HA
    # builds the list of extra module scripts into index.html at the moment a
    # page is served, and the frontend does not load modules registered later
    # into an already open page. Every await below (stores, indexes) used to
    # sit in front of this line — on a slow hub a dashboard opened during
    # start-up came without our modules ("Custom element doesn't exist") until
    # a manual refresh. Register before anything that can take time.
    await async_register_card(hass)

    # "Business day" scheduling (the day-of-month `business` flag) follows the
    # user's Workday integration when one is configured — public holidays and
    # custom working weekdays instead of the plain Mon-Fri rule (#83 follow-up).
    await async_setup_business_days(hass)

    # Create the notification manager (shared across all entries)
    hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY] = NotificationManager(hass)
    await hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY].async_load()

    # Create + load the global document store (per-object doc metadata + the
    # content-addressed blob registry; binaries live on disk under /config).
    doc_store = DocumentStore(hass)
    await doc_store.async_load()
    hass.data[DOMAIN][DOCUMENT_STORE_KEY] = doc_store

    # Full-text index over the blobs (#171): extraction meta loads now, the
    # sidecars are read on the first search, new blobs are extracted as they
    # arrive and the existing library is backfilled after HA started.
    text_index = DocumentTextIndex(hass, doc_store)
    await text_index.async_load()
    doc_store.text_index = text_index
    hass.data[DOMAIN][DOCUMENT_TEXT_INDEX_KEY] = text_index

    # Reference numbers (#170): the object-level counter lives in its own
    # small Store; objects are numbered when their entry is set up.
    reference_numbers = ReferenceNumbers(hass)
    await reference_numbers.async_load()
    hass.data[DOMAIN][REFERENCE_NUMBERS_KEY] = reference_numbers

    # Calendar-entity schedules (#187): the pure schedule engine reads a
    # calendar's event dates through this provider; the coordinators keep
    # the shared cache behind it warm. Removed again on the last unload.
    set_calendar_occurrence_provider(calendar_occurrence_provider(hass))

    # Authenticated upload + serve endpoints for document blobs (the blobs live
    # under /config, so they must never be exposed via an unauthenticated path).
    async_register_document_views(hass)

    async_setup_services(hass)

    # Register WebSocket commands
    async_register_commands(hass)

    # Store unsub callbacks so they can be cleaned up when domain is unloaded
    hass.data[DOMAIN][EVENT_UNSUBS_KEY] = [*async_register_listeners(hass), *async_track_daily_jobs(hass)]

    # Once HA has started (all entries loaded), flag object entries that were
    # orphaned by a deleted global entry as a fixable repair issue (#86).
    async_at_started(hass, _sync_missing_global_entry_issue)

    return True


def _detect_advanced_feature_usage(hass: HomeAssistant, global_options: dict[str, Any]) -> dict[str, bool]:
    """Scan existing entries to detect which advanced features are in use."""
    adaptive = False
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
    if entry.version > 1 or entry.minor_version >= 6:
        return True

    is_object_entry = entry.unique_id != GLOBAL_UNIQUE_ID
    data = dict(entry.data)
    minor = entry.minor_version

    # 1 → 2: backfill created_at (issue #30)
    if minor < 2:
        if is_object_entry:
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
                            # ISO timestamps sort lexicographically; the earliest one's local day
                            anchor = local_date_from_iso(min(timestamps)) or today_iso
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
            tasks_data = data.get(CONF_TASKS, {})
            if tasks_data:
                new_tasks = {}
                for task_id, td in tasks_data.items():
                    new_td = dict(td)
                    seed_rotation_assignee(new_td)
                    new_tasks[task_id] = new_td
                data[CONF_TASKS] = new_tasks
        minor = 4

    # 4 → 5: stop co-owning a linked device. Until now, attaching an object to
    # an existing device also put OUR config entry on that device. Home
    # Assistant forbids that from 2026.8 and splits such a device into one per
    # config entry on upgrade — leaving a nameless extra device holding our
    # entities while the appliance's page shows none. Removing the association
    # here means the split never has anything to split.
    if minor < 5:
        if is_object_entry and (device_id := (data.get(CONF_OBJECT) or {}).get("ha_device_id")):
            # A SELF-link (the stored id names our own device — the old picker
            # offered the object's doppelgänger) must not be shed: the "source"
            # is the very device the entities live on, and shedding it deletes
            # and restores it in one boot (prod 2026-08-01, three Roborocks).
            # Setup raises the device_link_self notice for these instead.
            if not is_self_link(hass, device_id, own_entry_id=entry.entry_id):
                shed_owned_devices(hass, own_entry_id=entry.entry_id, source_device_id=device_id)
        minor = 5

    # 5 → 6 (#145): task rows show Complete / Skip as HA buttons instead of
    # bare icons. An EXISTING install gets a one-time panel notice with a
    # "back to icons" button (the flag lives in the hub entry's options and
    # is cleared by that banner); a fresh install starts at minor 6 and
    # never sees it.
    new_options: dict[str, Any] | None = None
    if minor < 6:
        if not is_object_entry:
            # Older installs keep their settings in entry.data with EMPTY
            # options (every reader uses `entry.options or entry.data`); the
            # first options write must carry them over, or the flag alone
            # would mask every setting.
            base = dict(entry.options) if entry.options else dict(entry.data)
            new_options = {**base, CONF_ROW_ACTION_NOTICE: True}
        minor = 6

    if new_options is not None:
        hass.config_entries.async_update_entry(entry, data=data, options=new_options, minor_version=minor)
    else:
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
    # True once the object's stored device link resolved to a live device this
    # setup — drives the post-platform cleanup of empty leftover own devices.
    linked_device_live = False

    if is_global:
        # Global entry: no per-object coordinator, but a summary coordinator
        # aggregates task status counts across all objects to back the global
        # summary sensors (sensor.maintenance_supporter_overdue, etc.).
        summary_coordinator = MaintenanceSummaryCoordinator(hass)
        entry.runtime_data = MaintenanceSupporterData(summary_coordinator=summary_coordinator)
        summary_coordinator.async_setup_listeners()
        entry.async_on_unload(summary_coordinator.async_teardown_listeners)
        await summary_coordinator.async_refresh()

        # v2.67: mirror auto "buy" tasks into the user's to-do list (no-op
        # until the shopping_list_entity option is set). Owned by the GLOBAL
        # entry's lifecycle - created here, torn down in async_unload_entry -
        # so a reload of the hub entry gets a fresh instance (the shared-
        # runtime setup only runs once per boot; bug audit 2026-08-29).
        if SHOPPING_SYNC_KEY not in hass.data[DOMAIN]:
            shopping_sync = ShoppingListSync(hass)
            await shopping_sync.async_setup()
            hass.data[DOMAIN][SHOPPING_SYNC_KEY] = shopping_sync

        # D#183: per-task mirror into external to-do lists — same lifecycle
        # as the shopping sync (global entry owns it).
        if TODO_MIRROR_KEY not in hass.data[DOMAIN]:
            todo_mirror = TodoMirror(hass)
            await todo_mirror.async_setup()
            hass.data[DOMAIN][TODO_MIRROR_KEY] = todo_mirror

        # 2026-10 places: tell a person what is due where they just arrived —
        # same lifecycle as the mirrors (global entry owns it).
        if PLACES_KEY not in hass.data[DOMAIN]:
            place_arrivals = PlaceArrivals(hass)
            place_arrivals.async_setup()
            hass.data[DOMAIN][PLACES_KEY] = place_arrivals

        # One-time migration: auto-enable advanced feature flags for existing users
        options = dict(entry.options or entry.data)
        if CONF_ADVANCED_ADAPTIVE not in options:
            flags = _detect_advanced_feature_usage(hass, options)
            options.update(flags)
            hass.config_entries.async_update_entry(entry, options=options)
            _LOGGER.info("Migrated advanced feature flags: %s", flags)

        # Register panel if enabled in options (on by default — see const).
        if entry_option(entry, CONF_PANEL_ENABLED):
            await async_register_panel(hass)

        # Listen for options changes (panel toggle)
        entry.async_on_unload(entry.add_update_listener(_async_global_options_updated))

        # Keep <config>/custom_sentences/ in step with the opt-in setting. Runs
        # on every setup, not just on change, so an upgrade that ships new
        # sentences reaches an install that already opted in.
        await async_sync_assist_sentences(hass, entry_option(entry, CONF_INSTALL_ASSIST_SENTENCES))

        # Initial orphan check for admin_panel_user_ids (HA users deleted
        # while the integration was offline land here as repair issues).
        await async_sync_admin_panel_orphan_issues(hass, entry)

        # v1.5.4: also clear stale ``task.responsible_user_id`` so the
        # dashboard stops showing the ghost of deleted users.
        await async_prune_task_user_orphans(hass)

        # Surface a configured-but-missing notify service as a repair issue.
        # Deferred to HA-started so lazily-registered notify services (mobile_app,
        # notify groups) are present before we judge the service missing.
        entry.async_on_unload(async_at_started(hass, _verify_notify_service))

        # Surface document-storage anomalies (orphan/dangling blobs after a
        # crash or partial restore) as a fixable repair issue. Deferred to
        # HA-started so the store has finished loading.
        entry.async_on_unload(async_at_started(hass, _check_document_storage_issues))

        # Devices an object created in a mistaken area before 2.96 move back,
        # and the empty leftover areas are offered for removal (repair issue).
        entry.async_on_unload(async_at_started(hass, async_check_leftover_areas))

        # Backfill the document search index (#171) a couple of minutes after
        # start — pypdf is CPU work, and boot is the wrong moment for it.
        entry.async_on_unload(async_at_started(hass, _schedule_document_text_backfill))

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

        # Catalog triggers written by a signature that could never fire
        # (gree/daikin hvac_action runtime, 2026-09-25; hOn filters read
        # inverted, 2026-09-27) are repaired once.
        if (healed_data := heal_catalog_triggers(hass, entry.data)) is not None:
            _LOGGER.info("Repaired catalog trigger(s) of %s (see helpers/catalog_heal.py)", entry.title)
            hass.config_entries.async_update_entry(entry, data=healed_data)

        # 2.95: tasks created before the fingerprint get their origin once,
        # where it is certain (catalog duty by name + entity, template task
        # by name) — a later rename no longer hides them.
        if (origin_data := backfill_origins(hass, entry.data)) is not None:
            hass.config_entries.async_update_entry(entry, data=origin_data)

        # Every write path validates spare parts, but ~27 readers assume a dict
        # with an "id" — a hand-edited / damaged record crashed the sensor
        # platform and the buy-task sync at setup (found 2026-09-26). Drop
        # non-dict records and fill a missing id from the key, once.
        stored_parts = entry.data.get("parts")
        raw_parts: dict[str, Any] = stored_parts if isinstance(stored_parts, dict) else {}
        damaged = [pid for pid, p in raw_parts.items() if not isinstance(p, dict) or p.get("id") != pid]
        if damaged:
            fixed_parts = {pid: {**p, "id": pid} for pid, p in raw_parts.items() if isinstance(p, dict)}
            _LOGGER.warning("Repaired damaged spare-part record(s) %s of %s", damaged, entry.title)
            hass.config_entries.async_update_entry(entry, data={**entry.data, "parts": fixed_parts})

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

        # A device link stored before HA 2026.8 may now point at a
        # pre-migration composite id, which names no registered device — HA
        # refuses to attach entities to it and tells the user to file a bug
        # against us. Repoint it at the surviving device and write that back,
        # so the repair happens once rather than on every start.
        obj_data = entry.data.get(CONF_OBJECT) or {}
        if stored_device_id := obj_data.get("ha_device_id"):
            resolved = resolve_linked_device_id(hass, stored_device_id, own_entry_id=entry.entry_id)
            if resolved and resolved != stored_device_id:
                _LOGGER.info(
                    "Object %s was linked to device %s, which the 2026.8 split replaced; repointed to %s",
                    entry.title,
                    stored_device_id,
                    resolved,
                )
                hass.config_entries.async_update_entry(
                    entry,
                    data={**entry.data, CONF_OBJECT: {**obj_data, "ha_device_id": resolved}},
                )
            # An id we cannot resolve is deliberately LEFT ALONE. Clearing it
            # would gain nothing — a missing device already falls back to an own
            # device at render time — and would destroy the user's choice for
            # good. The id may well be meaningful again later: a JSON export
            # carries it to a foreign instance where it dangles until the backup
            # comes home, and a device can return when its integration is
            # re-added or re-enabled.
            #
            # Falling back is quiet, though, and a link the user set on purpose
            # is worth telling them about rather than letting the object drift
            # onto a device of its own unannounced. The issue clears itself the
            # moment the link resolves again.
            issue_id = device_link_lost_issue_id(entry.entry_id)
            if resolved is None:
                # Two distinct stories share one issue id (so resolve/delete
                # stays single-path): the linked device is GONE, or the link
                # points at the object's own doppelgänger device — the old
                # picker offered it under the appliance's exact name. The
                # advice differs, so the translation key does too. Both are
                # fixable: the flow relinks to the device the user picks.
                self_link = is_self_link(hass, stored_device_id, own_entry_id=entry.entry_id)
                ir.async_create_issue(
                    hass,
                    DOMAIN,
                    issue_id,
                    is_fixable=True,
                    severity=ir.IssueSeverity.WARNING,
                    translation_key="device_link_self" if self_link else "device_link_lost",
                    translation_placeholders={"object": aggregate_object_name(entry)},
                    data={"entry_id": entry.entry_id},
                )
            else:
                ir.async_delete_issue(hass, DOMAIN, issue_id)

            # A linked object owns no device. If it does, this install predates
            # the rework — either it co-owned the appliance's device (split on
            # upgrade) or it forked one carrying the appliance's identity. Hand
            # that to Home Assistant's own repair, which also relinks the
            # entities, rather than deleting devices by hand.
            if has_own_devices(hass, entry.entry_id):
                _LOGGER.info("Shedding device(s) %s should not own after linking", entry.title)
                shed_owned_devices(hass, own_entry_id=entry.entry_id, source_device_id=resolved)
            linked_device_live = resolved is not None

        # #115: the battery fleet's seeded name/notes/part texts are stored
        # snapshots — a fleet set up before localized seeding existed (or under
        # a different UI language) keeps English notes forever while every
        # runtime string around them is translated. Rewrite the ones the user
        # never touched into the instance's language; edited texts stay.
        if obj_data.get(BATTERY_FLEET_OBJECT_FLAG):
            if retranslate_seeded_texts(hass, entry, normalize_language(hass)):
                _LOGGER.info("Retranslated the battery fleet's seeded texts for %s", entry.title)

        # #170: give this object (and any other still unnumbered one) its
        # reference number before the first refresh numbers the tasks.
        reference_numbers = hass.data[DOMAIN].get(REFERENCE_NUMBERS_KEY)
        if isinstance(reference_numbers, ReferenceNumbers):
            await reference_numbers.async_assign_objects()

        coordinator = MaintenanceCoordinator(hass, entry, store)
        entry.runtime_data = MaintenanceSupporterData(coordinator=coordinator, store=store)
        if obj_data.get(BATTERY_FLEET_OBJECT_FLAG):
            # The hub counts this fleet's batteries now (its Store, with the
            # low latch, is reachable through runtime_data from here on), so
            # the first refresh and the trigger of the fleet task read the
            # real count, not the hub's count from before this fleet loaded.
            # A stale 0 there was taken for a recovery, and the count catching
            # up announced the same low battery again (2026-10-05).
            async_dispatcher_send(hass, SIGNAL_BATTERY_FLEET_CHANGED)
        await coordinator.async_config_entry_first_refresh()

        # D#229: a task may complete itself when another entity changes to a
        # state (the washer's door opens) — one listener for the entry, set up
        # once its tasks have a status to check.
        entry.async_on_unload(async_track_complete_when(hass, coordinator))

        # A shopping-list row checked while this object was not loaded (a
        # reload after a task edit, a setup retry) waits for it — the resync
        # books it now. At startup the pass after "started" covers it.
        if hass.state is CoreState.running:
            schedule_resync(hass)

        # #148: a battery type that becomes known only after fleet setup (a
        # Battery Notes note added later, a typed low-only Matter binary)
        # never got its spare part — reconcile once per start, after the
        # other integrations' entities exist. Also prunes the legacy
        # untouched "UNKNOWN battery" part older versions minted. Registered
        # AFTER runtime_data: on a running instance async_at_started fires
        # immediately, and the reconcile needs the store for stock/prune.
        if obj_data.get(BATTERY_FLEET_OBJECT_FLAG):

            async def _fleet_parts_at_start(_hass: HomeAssistant) -> None:
                from .helpers.battery_fleet_setup import reconcile_fleet_parts_at_start

                try:
                    result = await reconcile_fleet_parts_at_start(hass, entry, normalize_language(hass))
                except Exception:
                    _LOGGER.exception("Battery-fleet part reconcile at start failed")
                    return
                if result["added"] or result["pruned"] or result["orphans_removed"]:
                    _LOGGER.info(
                        "Battery-fleet parts reconciled at start: added %s, pruned legacy UNKNOWN: %s, orphaned stock sensors removed: %s",
                        result["added"] or "none",
                        result["pruned"],
                        result["orphans_removed"],
                    )
                if result.get("trigger_healed") or result["added"] or result.get("migrated"):
                    # #156: the recovery flag only reaches the LIVE trigger
                    # after a reload — and so does the stock SENSOR of a part
                    # added here: the sensor platform was set up before this
                    # ran, so the new part had no entity until the next
                    # restart (bug review 2026-09-04). Reload once; the next
                    # start finds both in place and adds nothing.
                    _LOGGER.info(
                        "Battery-fleet reconcile needs a reload of %s (trigger healed: %s, parts added: %s)",
                        entry.title,
                        bool(result.get("trigger_healed")),
                        result["added"] or "none",
                    )
                    hass.async_create_task(hass.config_entries.async_reload(entry.entry_id))

            entry.async_on_unload(async_at_started(hass, _fleet_parts_at_start))

        # v1.5.3 (#48): forward-sync obj fields → device_registry whenever the
        # entry data changes (WS update OR config-flow re-edit). DeviceInfo
        # only seeds these on first device creation; after that, dashboard
        # edits never reach the device unless we push them. Combined with the
        # global EVENT_DEVICE_REGISTRY_UPDATED listener registered in
        # async_setup, this gives the area a true bidirectional sync.
        entry.async_on_unload(entry.add_update_listener(_async_sync_obj_to_device))

        # Notify WS subscribers that a new object entry is available
        async_dispatcher_send(hass, SIGNAL_NEW_OBJECT_ENTRY, entry.entry_id)

        # Buy-task catch-up (spare parts): converge the shopping reminders with
        # the current stock/pause/archive state — covers import/restore, a
        # resume/unarchive, and any change made while this entry was unloaded.
        # Declarative + idempotent, reloads only when something changed.
        if entry.data.get("parts"):
            schedule_buy_task_reconcile(hass, entry)

        _LOGGER.debug(
            "Maintenance object entry set up: %s (%s)",
            entry.title,
            entry.entry_id,
        )

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    if not is_global:
        # Parent nesting is written as an explicit registry `via_device_id`
        # AFTER the platforms created the devices — DeviceInfo's `via_device`
        # identifier tuple is deprecated (removal HA 2027.8) and its
        # cross-entry identifier lookup is what 2026.8's scoping ends. Runs
        # both directions, so a child that boots before its parent still nests.
        sync_via_device_links(hass, entry)

    if linked_device_live:
        # The entities of a linked object live on the appliance'''s device, so a
        # device of our own with nothing on it is a leftover — of the object'''s
        # earlier unlinked life, or of the 2026.8 split — and shows up as an
        # empty duplicate named after the object. The targeted shed above only
        # removes duplicates of the SOURCE device, so an old own device (our
        # identifiers, not a fork) survives it on both HA versions. Decidable
        # only now: the platform setup above has re-attached the entities.
        dev_reg = dr.async_get(hass)
        ent_reg = er.async_get(hass)
        for device in dr.async_entries_for_config_entry(dev_reg, entry.entry_id):
            if not er.async_entries_for_device(ent_reg, device.id, include_disabled_entities=True):
                _LOGGER.info("Removing empty leftover device %s of linked object %s", device.id, entry.title)
                dev_reg.async_remove_device(device.id)

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


@callback
def _schedule_document_text_backfill(hass: HomeAssistant) -> None:
    """Kick off the delayed full-text backfill (see helpers/document_text)."""
    index = hass.data.get(DOMAIN, {}).get(DOCUMENT_TEXT_INDEX_KEY)
    if isinstance(index, DocumentTextIndex):
        index.schedule_backfill()


async def _check_document_storage_issues(hass: HomeAssistant) -> None:
    """Sync the document-storage repair issue with the current on-disk reality.

    The store is consistent under normal operation; anomalies (orphaned blobs,
    dangling records, stale registry entries) only arise from a crash, an
    external file delete, or a partial restore — so a boot-time scan is the
    right trigger. The fixable issue's flow reclaims the space; once a later
    scan comes back clean the issue is removed.
    """
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
    panel_enabled = entry_option(entry, CONF_PANEL_ENABLED)
    if panel_enabled:
        # force=True so a changed sidebar title (CONF_PANEL_TITLE) re-registers
        # the panel; it's a no-op refresh when the title is unchanged.
        await async_register_panel(hass, force=True)
    else:
        await async_unregister_panel(hass)
    await async_sync_admin_panel_orphan_issues(hass, entry)
    # The notify service may have just been (re)configured — re-check it.
    _verify_notify_service(hass)
    # Install or remove the Assist sentence files to match the setting.
    await async_sync_assist_sentences(hass, entry_option(entry, CONF_INSTALL_ASSIST_SENTENCES))
    # v2.67: the shopping-list target may have changed (set / cleared / swapped).
    # This listener does NOT reload the entry, so the sync must be nudged
    # explicitly - it re-reads the option, re-arms its state listener and
    # pulls its rows out of a list that is no longer the target.
    schedule_resync(hass)
    # #231: the to-do mirror's default lists may have changed — it compares
    # and, if so, moves the inheriting tasks' rows.
    _todo_mirror_settings_changed(hass)
    # The low/recovered battery percentages may have changed: the hub counts
    # now, not at its next poll.
    async_dispatcher_send(hass, SIGNAL_BATTERY_FLEET_CHANGED)


async def async_unload_entry(hass: HomeAssistant, entry: MaintenanceSupporterConfigEntry) -> bool:
    """Unload a config entry."""
    if entry.unique_id == GLOBAL_UNIQUE_ID:
        # Unregister panel when global entry is unloaded
        await async_unregister_panel(hass)

        shopping_sync = hass.data.get(DOMAIN, {}).pop(SHOPPING_SYNC_KEY, None)
        if shopping_sync is not None:
            shopping_sync.async_teardown()

        todo_mirror = hass.data.get(DOMAIN, {}).pop(TODO_MIRROR_KEY, None)
        if todo_mirror is not None:
            todo_mirror.async_teardown()

        place_arrivals = hass.data.get(DOMAIN, {}).pop(PLACES_KEY, None)
        if place_arrivals is not None:
            place_arrivals.async_teardown()
        # NOT the full-text index: it is shared runtime (built once per boot
        # by _async_setup_shared, which a hub reload does not re-run) — a
        # reload of the global entry (any settings save) closed it for the
        # rest of the run and new uploads were never indexed again (bug audit
        # 2026-09-27). The last entry to unload cancels it below.

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
        # The index's backfill timer / extraction tasks must not outlive the
        # integration when the LAST entry to go is an object entry (the
        # global entry may already be gone) - bug audit 2026-09-12.
        text_index = hass.data.get(DOMAIN, {}).get(DOCUMENT_TEXT_INDEX_KEY)
        if text_index is not None:
            text_index.cancel()
        for unsub in hass.data.get(DOMAIN, {}).get(EVENT_UNSUBS_KEY, []):
            unsub()

        set_calendar_occurrence_provider(None)
        hass.data.pop(DOMAIN, None)

    return unload_ok


async def _async_forget_removed_object_tasks(hass: HomeAssistant, entry: ConfigEntry, store: MaintenanceStore) -> None:
    """What a task delete cleans up per task, for every task of a deleted
    object: its rows on the family's to-do lists (D#183 — the Store record
    naming them goes with the object), its ids on the persistent vacation
    exempt list, and the notification manager's bookkeeping. All three
    outlived the object (bug audit 2026-09-27)."""
    task_ids = [str(tid) for tid in (entry.data.get(CONF_TASKS) or {})]

    mirror = hass.data.get(DOMAIN, {}).get(TODO_MIRROR_KEY)
    if mirror is not None:
        for task_id in task_ids:
            try:
                await mirror.async_forget_task(store, task_id)
            except Exception:  # a list provider error must not block the delete
                _LOGGER.warning("Could not take the to-do rows of task %s off their lists", task_id, exc_info=True)

    ge = get_global_entry(hass)
    exempt = (ge.options.get(CONF_VACATION_EXEMPT_TASK_IDS) if ge is not None else None) or []
    if ge is not None and isinstance(exempt, list) and any(t in exempt for t in task_ids):
        gone = set(task_ids)
        hass.config_entries.async_update_entry(
            ge,
            options={**dict(ge.options), CONF_VACATION_EXEMPT_TASK_IDS: [t for t in exempt if t not in gone]},
        )

    nm = hass.data.get(DOMAIN, {}).get(NOTIFICATION_MANAGER_KEY)
    if isinstance(nm, NotificationManager):
        nm.purge_entry(entry.entry_id)


async def async_remove_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Clean up store file when a config entry is permanently deleted."""
    if entry.unique_id == GLOBAL_UNIQUE_ID:
        # Deleting the global entry while object entries remain is a broken
        # state (no summary sensors / panel / digests) — surface it right away
        # as a fixable repair issue so the user can restore it (#86).
        _sync_missing_global_entry_issue(hass)
        return

    # Every repair issue about the object — its device link, a broken part
    # link, its tasks' missing trigger entities and stale action targets —
    # answers itself with the object gone. Only the device-link notice was
    # deleted; the others stayed in Repairs for good, with a fix flow that had
    # nothing left to fix (bug audit 2026-09-26).
    async_purge_entry_issues(hass, entry.entry_id)

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
        await store.async_load()
    await _async_forget_removed_object_tasks(hass, entry, store)
    await store.async_remove()
    # Drop the per-entry reconcile lock — the module dict would otherwise grow
    # by one lock per object ever created in this HA run.
    discard_reconcile_lock(entry.entry_id)
    # v1.5.4: also called from ws_delete_object — but if the user removes the
    # config entry from HA's "Configure" UI, that path doesn't run, leaving
    # phantom task_refs in groups. Belt-and-suspenders.
    cleanup_group_refs(hass, entry_id=entry.entry_id)
    # Objects nested under this one lose the parent pointer (W3).
    forget_removed_parent(hass, entry.entry_id)

    # Remove this object's documents (refcount-aware — a blob shared with another
    # object survives; only bytes freed for good are reclaimed). Archiving keeps
    # docs; permanent deletion is the trigger, and this hook fires for the WS,
    # the Configure-UI, and the service delete paths alike — the single place it
    # belongs.
    doc_store = hass.data.get(DOMAIN, {}).get(DOCUMENT_STORE_KEY)
    if not isinstance(doc_store, DocumentStore):
        # The last entry to go: its unload already dropped the integration's
        # runtime data, and the object's documents stayed on disk for good
        # (bug audit 2026-10-16). Loaded for this one clean-up.
        doc_store = DocumentStore(hass)
        await doc_store.async_load()
    if isinstance(doc_store, DocumentStore):
        object_id = object_id_for_entry(entry)
        removed_doc_ids = {doc["id"] for doc in doc_store.for_object(object_id)}
        await doc_store.async_remove_object(object_id)
        # ...and the references OTHER objects hold to those documents: a
        # completion photo on a moved task's history, a spare part's manual.
        # A document delete already forgot them; an object delete left them
        # dangling (bug audit 2026-09-26, SEC-10).
        await async_forget_doc_ids(hass, removed_doc_ids)

    _LOGGER.debug("Removed store for entry %s", entry.entry_id)
    # The global summary coordinator has no listener for entry removal, so tell
    # it to drop this object from its counts immediately (otherwise the summary
    # sensors stay stale until the next event or a restart).
    async_dispatcher_send(hass, SIGNAL_OBJECT_ENTRY_REMOVED, entry.entry_id)
    # Its buy-task rows in the shopping list are orphans now (bug audit 2026-08-29).
    _schedule_shopping_resync(hass)


async def async_remove_config_entry_device(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    device_entry: dr.DeviceEntry,
) -> bool:
    """Allow device removal when it has no entities."""
    entity_registry = er.async_get(hass)
    return not er.async_entries_for_device(entity_registry, device_entry.id)
