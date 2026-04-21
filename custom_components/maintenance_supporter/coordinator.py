"""DataUpdateCoordinator for the Maintenance Supporter integration."""

from __future__ import annotations

import logging
import time
from collections.abc import Mapping
from datetime import date, datetime, timedelta
from typing import TYPE_CHECKING, Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

if TYPE_CHECKING:
    from .calendar import MaintenanceCalendar
from homeassistant.helpers import issue_registry as ir
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator

from .const import (
    BUDGET_CURRENCIES,
    CONF_ADVANCED_SCHEDULE_TIME,
    CONF_BUDGET_ALERT_THRESHOLD,
    CONF_BUDGET_ALERTS_ENABLED,
    CONF_BUDGET_CURRENCY,
    CONF_BUDGET_MONTHLY,
    CONF_BUDGET_YEARLY,
    CONF_OBJECT,
    CONF_TASKS,
    DEFAULT_UPDATE_INTERVAL_MINUTES,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MISSING_ENTITY_THRESHOLD_REFRESHES,
    SIGNAL_TASK_RESET,
    STARTUP_GRACE_PERIOD_SECONDS,
    TRIGGER_COMPLETION_COOLDOWN_SECONDS,
    HistoryEntryType,
    MaintenanceStatus,
    ScheduleType,
    TriggerEntityState,
)
from .models.maintenance_object import MaintenanceObject
from .models.maintenance_task import MaintenanceTask
from .storage import MaintenanceStore

_LOGGER = logging.getLogger(__name__)


class MaintenanceCoordinator(DataUpdateCoordinator[dict[str, Any]]):
    """Coordinator for a single maintenance object and its tasks."""

    def __init__(
        self, hass: HomeAssistant, entry: ConfigEntry, store: MaintenanceStore | None = None
    ) -> None:
        """Initialize the coordinator."""
        super().__init__(
            hass,
            _LOGGER,
            name=f"Maintenance Supporter ({entry.title})",
            update_interval=timedelta(minutes=DEFAULT_UPDATE_INTERVAL_MINUTES),
        )
        self.entry = entry
        self._store = store
        self._calendar_entity: MaintenanceCalendar | None = None
        self._previous_statuses: dict[str, str] = {}  # task_id -> status

        # Trigger completion cooldown tracking
        self._recently_completed: dict[str, float] = {}  # task_id -> monotonic timestamp

        # Trigger entity availability tracking
        self._startup_time: float = time.monotonic()
        self._entity_missing_refresh_count: dict[str, int] = {}  # task_id -> count
        self._entity_unavailable_logged: dict[str, bool] = {}  # task_id -> logged?
        self._trigger_entity_states: dict[str, str] = {}  # task_id -> TriggerEntityState

    def _is_schedule_time_feature_enabled(self) -> bool:
        """Return True iff the global advanced flag for time-of-day scheduling is on.

        Reads the global config entry's options on every call. Cheap (just a
        dict lookup over the small list of integration entries) and means a
        toggle in Settings takes effect on the next coordinator refresh
        without needing a restart.
        """
        for ce in self.hass.config_entries.async_entries(DOMAIN):
            if ce.unique_id == GLOBAL_UNIQUE_ID:
                opts = ce.options or ce.data
                return bool(opts.get(CONF_ADVANCED_SCHEDULE_TIME, False))
        return False

    def _in_startup_grace_period(self) -> bool:
        """Return True if still within the startup grace period."""
        return (
            time.monotonic() - self._startup_time
        ) < STARTUP_GRACE_PERIOD_SECONDS

    @property
    def maintenance_object(self) -> MaintenanceObject:
        """Return the maintenance object from config entry data."""
        return MaintenanceObject.from_dict(self.entry.data.get(CONF_OBJECT, {}))

    @property
    def tasks(self) -> dict[str, MaintenanceTask]:
        """Return all tasks, merging static config with Store dynamic state."""
        tasks_data = self.entry.data.get(CONF_TASKS, {})
        if self._store is not None:
            tasks_data = self._store.merge_all_tasks(tasks_data)
        return {
            task_id: MaintenanceTask.from_dict(task_data)
            for task_id, task_data in tasks_data.items()
        }

    async def _async_update_data(self) -> dict[str, Any]:
        """Fetch and compute the current state of all tasks."""
        obj = self.maintenance_object
        tasks = self.tasks

        # Preserve live trigger state from previous data to avoid resetting
        # trigger state that was set by event-driven triggers between refreshes
        prev_tasks = (self.data or {}).get(CONF_TASKS, {})

        # Clean up expired cooldown entries
        now_mono = time.monotonic()
        self._recently_completed = {
            tid: ts for tid, ts in self._recently_completed.items()
            if now_mono - ts < TRIGGER_COMPLETION_COOLDOWN_SECONDS
        }

        result: dict[str, Any] = {
            CONF_OBJECT: obj.to_dict(),
            CONF_TASKS: {},
        }

        # Read the global advanced-feature flag once per refresh. When the
        # `schedule_time` feature is disabled, we strip it from each task
        # before computing status so behaviour reverts to the historical
        # midnight semantic — even though the value stays persisted on disk
        # and re-applies the moment the flag is re-enabled.
        schedule_time_enabled = self._is_schedule_time_feature_enabled()

        for task_id, task in tasks.items():
            if not task.enabled:
                result[CONF_TASKS][task_id] = task.to_dict()
                result[CONF_TASKS][task_id]["_status"] = MaintenanceStatus.OK
                continue

            # Restore live trigger state from previous coordinator data
            # but NOT for recently completed/skipped/reset tasks
            prev_task = prev_tasks.get(task_id, {})
            if task_id not in self._recently_completed:
                if prev_task.get("_trigger_active", False):
                    task._trigger_active = True
                if prev_task.get("_trigger_current_value") is not None:
                    task._trigger_current_value = prev_task["_trigger_current_value"]

            # Check sensor-based triggers (fallback for threshold/counter)
            if (
                task.schedule_type == ScheduleType.SENSOR_BASED
                and task.trigger_config
            ):
                await self._evaluate_trigger_fallback(task, task_id)

            # Feature-flag gate: zero out schedule_time so the model's
            # _is_past_schedule_time() short-circuits to False. Mutate the
            # in-memory model directly (next refresh re-instantiates fresh
            # tasks anyway, so disk state is unaffected).
            if not schedule_time_enabled:
                task.schedule_time = None

            # Compute status
            status = task.status

            # Build task result
            task_result = task.to_dict()
            task_result["_status"] = status
            task_result["_days_until_due"] = task.days_until_due
            task_result["_next_due"] = (
                task.next_due.isoformat() if task.next_due else None
            )
            task_result["_trigger_active"] = task._trigger_active
            task_result["_trigger_current_value"] = task._trigger_current_value
            task_result["_trigger_entity_state"] = self._trigger_entity_states.get(
                task_id, TriggerEntityState.AVAILABLE
            )

            # Expose counter delta data for frontend visualization
            tc = task.trigger_config
            if tc and tc.get("type") == "counter" and tc.get("trigger_delta_mode"):
                # Check per-entity _trigger_state first, fall back to flat key
                baseline = None
                trigger_state = tc.get("_trigger_state", {})
                for eid in (tc.get("entity_ids") or [tc.get("entity_id")]):
                    if eid:
                        es = trigger_state.get(eid, {})
                        if "baseline_value" in es:
                            baseline = es["baseline_value"]
                            break
                if baseline is None:
                    baseline = tc.get("trigger_baseline_value")
                if baseline is not None and task._trigger_current_value is not None:
                    task_result["_trigger_current_delta"] = (
                        task._trigger_current_value - baseline
                    )
                    task_result["_trigger_baseline_value"] = baseline
            task_result["_times_performed"] = task.times_performed
            task_result["_total_cost"] = task.total_cost
            task_result["_average_duration"] = task.average_duration
            task_result["_last_entry"] = task.last_entry

            # Adaptive scheduling analysis
            if task.adaptive_config and task.adaptive_config.get("enabled"):
                from .helpers.interval_analyzer import IntervalAnalyzer

                analyzer = IntervalAnalyzer()
                # Inject hemisphere and current month for seasonal awareness
                analysis_config = dict(task.adaptive_config)
                analysis_config["hemisphere"] = (
                    "south" if self.hass.config.latitude < 0 else "north"
                )
                analysis_config["_current_month"] = dt_util.now().month
                analysis = analyzer.analyze(task_result, analysis_config)
                task_result["_suggested_interval"] = analysis.recommended_interval
                task_result["_interval_confidence"] = analysis.confidence
                task_result["_interval_analysis"] = {
                    "average_actual": analysis.average_actual_interval,
                    "ewa_prediction": analysis.ewa_prediction,
                    "weibull_beta": analysis.weibull_beta,
                    "weibull_eta": analysis.weibull_eta,
                    "weibull_r_squared": analysis.weibull_r_squared,
                    "confidence_interval_low": analysis.confidence_interval_low,
                    "confidence_interval_high": analysis.confidence_interval_high,
                    "data_points": analysis.data_points,
                    "reason": analysis.recommendation_reason,
                    "seasonal_factor": analysis.seasonal_factor,
                    "seasonal_factors": analysis.seasonal_factors,
                    "seasonal_reason": analysis.seasonal_adjustment_reason,
                }

            # Sensor-driven predictions (Phase 3)
            # Only for sensor_based tasks with threshold/counter triggers
            adaptive_cfg = task.adaptive_config or {}
            if (
                task.schedule_type == ScheduleType.SENSOR_BASED
                and task.trigger_config
                and task.trigger_config.get("type") in ("threshold", "counter")
                and adaptive_cfg.get("sensor_prediction_enabled", True)
            ):
                try:
                    from .helpers.sensor_predictor import SensorPredictor

                    predictor = SensorPredictor(self.hass)
                    prediction = await predictor.async_analyze(
                        task_result, adaptive_cfg
                    )
                    if prediction:
                        # Degradation data
                        if prediction.degradation:
                            deg = prediction.degradation
                            task_result["_degradation_rate"] = deg.slope_per_day
                            task_result["_degradation_trend"] = deg.trend
                            task_result["_degradation_r_squared"] = deg.r_squared
                            task_result["_degradation_data_points"] = deg.data_points

                        # Threshold prediction
                        if prediction.threshold_prediction:
                            tp = prediction.threshold_prediction
                            task_result["_days_until_threshold"] = (
                                tp.days_until_threshold
                            )
                            task_result["_threshold_prediction_date"] = (
                                tp.predicted_date
                            )
                            task_result["_threshold_prediction_confidence"] = (
                                tp.confidence
                            )

                            # Urgency check: threshold will be reached sooner
                            # than the current maintenance interval
                            current_interval = task.interval_days or 30
                            suggested = task_result.get("_suggested_interval")
                            effective_interval = suggested or current_interval
                            if (
                                tp.days_until_threshold is not None
                                and tp.days_until_threshold > 0
                                and tp.days_until_threshold
                                < effective_interval * 0.9
                            ):
                                task_result["_sensor_prediction_urgency"] = True
                                # Override suggested interval with 90% safety
                                urgency_interval = max(
                                    1,
                                    int(tp.days_until_threshold * 0.9),
                                )
                                task_result["_suggested_interval"] = (
                                    urgency_interval
                                )

                        # Environmental factor
                        if prediction.environmental:
                            env = prediction.environmental
                            task_result["_environmental_factor"] = (
                                env.adjustment_factor
                            )
                            task_result["_environmental_entity"] = env.entity_id
                            task_result["_environmental_correlation"] = (
                                env.correlation
                            )

                            # Apply environmental factor to suggested interval
                            si = task_result.get("_suggested_interval")
                            if (
                                si is not None
                                and env.adjustment_factor != 1.0
                                and env.has_sufficient_data
                            ):
                                task_result["_suggested_interval"] = max(
                                    1,
                                    int(si * env.adjustment_factor),
                                )
                except Exception:
                    _LOGGER.debug(
                        "Sensor prediction failed for task %s",
                        task_id,
                        exc_info=True,
                    )

            result[CONF_TASKS][task_id] = task_result

        # Check for issues (repairs)
        await self._async_check_for_issues(tasks)

        # Send notifications for status changes / repeats.
        # On first refresh after startup, seed both _previous_statuses and
        # the NotificationManager's _last_notified to avoid a burst of stale
        # alerts while still allowing future repeat reminders.
        if not self._previous_statuses:
            from .helpers.notification_manager import NotificationManager

            nm = self.hass.data.get(DOMAIN, {}).get("_notification_manager")
            notify_statuses = {
                MaintenanceStatus.DUE_SOON,
                MaintenanceStatus.OVERDUE,
                MaintenanceStatus.TRIGGERED,
            }
            for task_id_n, task_result_n in result[CONF_TASKS].items():
                status = task_result_n.get("_status", MaintenanceStatus.OK)
                self._previous_statuses[task_id_n] = status
                if isinstance(nm, NotificationManager) and status in notify_statuses:
                    nm.seed_startup_state(self.entry.entry_id, task_id_n, status)
        else:
            await self._async_notify_status_changes(result[CONF_TASKS])

        # Check budget alerts
        await self._async_check_budget(result[CONF_TASKS])

        # Notify calendar entity if registered and added to hass
        if self._calendar_entity is not None and self._calendar_entity.hass is not None:
            self._calendar_entity.invalidate_cache()
            self._calendar_entity.async_write_ha_state()

        return result

    async def _evaluate_trigger_fallback(self, task: MaintenanceTask, task_id: str) -> None:
        """Evaluate trigger state as fallback (main evaluation is event-driven).

        The event-driven triggers (in entity/triggers/) handle real-time state
        changes with features like for_minutes timers. This fallback ensures
        that the coordinator also evaluates the basic trigger condition during
        periodic refreshes, so the status is correct even if an event was missed.

        For multi-entity threshold triggers, evaluates each entity and
        aggregates using entity_logic ("any" or "all").
        """
        if task.trigger_config is None:
            return

        # Don't re-activate triggers during the cooldown period after completion
        if task_id in self._recently_completed:
            return

        from .entity.triggers import normalize_entity_ids

        trigger_type = task.trigger_config.get("type")

        # Compound triggers have entity_ids inside conditions, not at top level
        if trigger_type == "compound":
            # Compound is fully event-driven; fallback cannot re-evaluate
            return

        entity_ids = normalize_entity_ids(task.trigger_config)
        if not entity_ids:
            return
        attribute = task.trigger_config.get("attribute")

        if trigger_type == "threshold":
            entity_logic = task.trigger_config.get("entity_logic", "any")
            for_minutes = task.trigger_config.get("trigger_for_minutes", 0)
            above = task.trigger_config.get("trigger_above")
            below = task.trigger_config.get("trigger_below")

            per_entity_triggered: list[bool] = []
            last_value = None

            for eid in entity_ids:
                state = self.hass.states.get(eid)
                if state is None or state.state in ("unavailable", "unknown"):
                    per_entity_triggered.append(False)
                    continue

                try:
                    if attribute:
                        raw_value = state.attributes.get(attribute)
                    else:
                        raw_value = state.state
                    if raw_value is None:
                        per_entity_triggered.append(False)
                        continue
                    value = float(raw_value)
                    last_value = value
                except (ValueError, TypeError):
                    per_entity_triggered.append(False)
                    continue

                exceeds = False
                if above is not None and value > above:
                    exceeds = True
                if below is not None and value < below:
                    exceeds = True
                per_entity_triggered.append(exceeds)

            if last_value is not None:
                task._trigger_current_value = last_value

            # Aggregated trigger state
            if per_entity_triggered:
                if entity_logic == "all":
                    aggregated = all(per_entity_triggered)
                else:
                    aggregated = any(per_entity_triggered)
            else:
                aggregated = False

            if for_minutes == 0:
                task._trigger_active = aggregated
            elif not aggregated and last_value is not None:
                # Value back in normal range — safe to deactivate even with for_minutes
                task._trigger_active = False
            # else: for_minutes > 0 and still exceeds — leave to event-driven trigger

        elif trigger_type == "counter":
            entity_logic = task.trigger_config.get("entity_logic", "any")
            target = task.trigger_config.get("trigger_target_value", 0)
            delta_mode = task.trigger_config.get("trigger_delta_mode", False)
            trigger_state = task.trigger_config.get("_trigger_state", {})

            per_entity_triggered = []
            last_value = None

            for eid in entity_ids:
                state = self.hass.states.get(eid)
                if state is None or state.state in ("unavailable", "unknown"):
                    per_entity_triggered.append(False)
                    continue
                try:
                    if attribute:
                        raw_value = state.attributes.get(attribute)
                    else:
                        raw_value = state.state
                    if raw_value is None:
                        per_entity_triggered.append(False)
                        continue
                    value = float(raw_value)
                    last_value = value
                except (ValueError, TypeError):
                    per_entity_triggered.append(False)
                    continue

                if delta_mode:
                    # Per-entity baseline from _trigger_state, fall back to flat
                    es = trigger_state.get(eid, {})
                    baseline = es.get("baseline_value")
                    if baseline is None:
                        baseline = task.trigger_config.get("trigger_baseline_value")
                    if baseline is not None:
                        delta = value - baseline
                        per_entity_triggered.append(delta >= target)
                    else:
                        per_entity_triggered.append(False)
                else:
                    per_entity_triggered.append(value >= target)

            if last_value is not None:
                task._trigger_current_value = last_value

            if per_entity_triggered:
                if entity_logic == "all":
                    task._trigger_active = all(per_entity_triggered)
                else:
                    task._trigger_active = any(per_entity_triggered)

        elif trigger_type == "state_change":
            # State change triggers are purely event-driven (count transitions)
            # The fallback cannot evaluate them, so we leave _trigger_active as-is
            pass

        elif trigger_type == "runtime":
            # Runtime triggers are event-driven with a self-timer for periodic
            # persistence.  The fallback cannot meaningfully evaluate them
            # (no numeric entity value), so we leave _trigger_active as-is.
            pass

    async def _async_check_for_issues(
        self, tasks: dict[str, MaintenanceTask]
    ) -> None:
        """Check trigger entity availability and create/remove repair issues.

        Uses a tiered approach:
        - During startup grace period: no issues, log debug only
        - Entity exists + available: clear everything
        - Entity exists + unavailable/unknown: log once, no issue
        - Entity missing + within threshold: increment counter
        - Entity missing + past threshold: create repair issue with data

        For multi-entity triggers, checks each entity_id independently.
        """
        from .entity.triggers import normalize_entity_ids

        for task_id, task in tasks.items():
            if not task.enabled or task.trigger_config is None:
                continue

            entity_ids = normalize_entity_ids(task.trigger_config)
            if not entity_ids:
                continue

            # Track overall task-level trigger entity state
            # (worst state across all entities)
            worst_state = TriggerEntityState.AVAILABLE

            for trigger_entity_id in entity_ids:
                # Per-entity issue tracking key
                entity_key = f"{task_id}_{trigger_entity_id}"
                issue_id = f"missing_trigger_{self.entry.entry_id}_{task_id}_{trigger_entity_id}"
                state = self.hass.states.get(trigger_entity_id)

                if state is not None and state.state not in ("unavailable", "unknown"):
                    # Entity exists and is available
                    self._entity_missing_refresh_count.pop(entity_key, None)
                    self._entity_unavailable_logged.pop(entity_key, None)
                    ir.async_delete_issue(self.hass, DOMAIN, issue_id)

                elif state is not None:
                    # Entity exists but is unavailable/unknown
                    if worst_state == TriggerEntityState.AVAILABLE:
                        worst_state = TriggerEntityState.UNAVAILABLE
                    self._entity_missing_refresh_count.pop(entity_key, None)

                    if not self._entity_unavailable_logged.get(entity_key, False):
                        _LOGGER.warning(
                            "Trigger entity %s for task '%s' is %s",
                            trigger_entity_id,
                            task.name,
                            state.state,
                        )
                        self._entity_unavailable_logged[entity_key] = True

                    ir.async_delete_issue(self.hass, DOMAIN, issue_id)

                elif self._in_startup_grace_period():
                    # Entity missing during startup
                    if worst_state in (
                        TriggerEntityState.AVAILABLE,
                        TriggerEntityState.UNAVAILABLE,
                    ):
                        worst_state = TriggerEntityState.STARTUP
                    _LOGGER.debug(
                        "Trigger entity %s not yet available (startup grace period), "
                        "skipping issue creation for task '%s'",
                        trigger_entity_id,
                        task.name,
                    )

                else:
                    # Entity missing after startup grace period
                    worst_state = TriggerEntityState.MISSING
                    count = self._entity_missing_refresh_count.get(entity_key, 0) + 1
                    self._entity_missing_refresh_count[entity_key] = count

                    if count < MISSING_ENTITY_THRESHOLD_REFRESHES:
                        _LOGGER.debug(
                            "Trigger entity %s missing for task '%s' "
                            "(refresh %d/%d before issue)",
                            trigger_entity_id,
                            task.name,
                            count,
                            MISSING_ENTITY_THRESHOLD_REFRESHES,
                        )
                    else:
                        obj = self.maintenance_object
                        if count == MISSING_ENTITY_THRESHOLD_REFRESHES:
                            _LOGGER.warning(
                                "Trigger entity %s for task '%s' on '%s' has been "
                                "missing for %d refreshes — creating repair issue",
                                trigger_entity_id,
                                task.name,
                                obj.name,
                                count,
                            )
                        ir.async_create_issue(
                            self.hass,
                            DOMAIN,
                            issue_id,
                            is_fixable=True,
                            severity=ir.IssueSeverity.WARNING,
                            translation_key="missing_trigger_entity",
                            translation_placeholders={
                                "entity_id": trigger_entity_id,
                                "task_name": task.name,
                                "object_name": obj.name,
                            },
                            data={
                                "entry_id": self.entry.entry_id,
                                "task_id": task_id,
                                "task_name": task.name,
                                "object_name": obj.name,
                                "entity_id": trigger_entity_id,
                            },
                        )

            self._trigger_entity_states[task_id] = worst_state

    async def _async_notify_status_changes(
        self, task_results: dict[str, Any]
    ) -> None:
        """Pass tasks with notifiable statuses to the NotificationManager.

        The NotificationManager handles deduplication and repeat intervals
        via its own ``_last_notified`` timestamps.  On startup the coordinator
        seeds the NM so that already-notifiable tasks don't trigger an
        immediate burst but will still repeat after the configured interval.
        """
        from .helpers.notification_manager import NotificationManager

        nm = self.hass.data.get(DOMAIN, {}).get("_notification_manager")
        if not isinstance(nm, NotificationManager):
            return

        if not nm.enabled:
            return

        obj_name = self.maintenance_object.name
        notify_statuses = {
            MaintenanceStatus.DUE_SOON,
            MaintenanceStatus.OVERDUE,
            MaintenanceStatus.TRIGGERED,
        }

        # Collect all tasks with notifiable statuses.
        # The NM's own rate-limiting decides whether to actually send.
        notifiable: list[tuple[str, dict[str, Any], str, str | None]] = []
        for task_id, task_result in task_results.items():
            new_status = task_result.get("_status")
            old_status = self._previous_statuses.get(task_id)
            if new_status in notify_statuses:
                notifiable.append((task_id, task_result, new_status, old_status))

        if not notifiable:
            # No notifications needed — still update the cache
            for task_id, task_result in task_results.items():
                self._previous_statuses[task_id] = task_result.get("_status")
            return

        # Check if bundling is enabled and threshold met
        from .const import (
            CONF_NOTIFICATION_BUNDLE_THRESHOLD,
            CONF_NOTIFICATION_BUNDLING_ENABLED,
            GLOBAL_UNIQUE_ID,
        )

        global_options: Mapping[str, Any] = {}
        for entry in self.hass.config_entries.async_entries(DOMAIN):
            if entry.unique_id == GLOBAL_UNIQUE_ID:
                global_options = entry.options or entry.data
                break

        bundling_enabled = global_options.get(CONF_NOTIFICATION_BUNDLING_ENABLED, False)
        bundle_threshold = int(global_options.get(CONF_NOTIFICATION_BUNDLE_THRESHOLD, 2))

        if bundling_enabled and len(notifiable) >= bundle_threshold:
            await nm.async_send_bundled(
                entry_id=self.entry.entry_id,
                object_name=obj_name,
                tasks=[
                    {
                        "task_id": tid,
                        "task_name": tr.get("name", ""),
                        "status": status,
                        "days_until_due": tr.get("_days_until_due"),
                    }
                    for tid, tr, status, _old in notifiable
                ],
            )
        else:
            for task_id, task_result, new_status, _old_status in notifiable:
                await nm.async_task_status_changed(
                    entry_id=self.entry.entry_id,
                    task_id=task_id,
                    task_name=task_result.get("name", ""),
                    object_name=obj_name,
                    new_status=new_status,
                    days_until_due=task_result.get("_days_until_due"),
                    next_due=task_result.get("_next_due"),
                    responsible_user_id=task_result.get("responsible_user_id"),
                )

        # Update the cache AFTER all notifications have been sent
        for task_id, task_result in task_results.items():
            self._previous_statuses[task_id] = task_result.get("_status")

    def _recalculate_budget_cache(self) -> None:
        """Recompute global budget totals from all entries' history.

        Stores the result in hass.data[DOMAIN]["_budget_cache"] so that
        every coordinator reads from the same cache instead of each one
        re-scanning all entries on every 5-minute refresh.
        """
        now = dt_util.now()
        monthly = 0.0
        yearly = 0.0

        for ce in self.hass.config_entries.async_entries(DOMAIN):
            if ce.unique_id == GLOBAL_UNIQUE_ID:
                continue

            rd = getattr(ce, "runtime_data", None)
            ce_store = getattr(rd, "store", None) if rd else None

            for tid in ce.data.get(CONF_TASKS, {}):
                if ce_store is not None:
                    history = ce_store.get_history(tid)
                else:
                    history = (
                        ce.data.get(CONF_TASKS, {})
                        .get(tid, {})
                        .get("history", [])
                    )

                for h_entry in history:
                    if h_entry.get("type") != "completed":
                        continue
                    cost = h_entry.get("cost")
                    if cost is None:
                        continue
                    try:
                        cost_val = float(cost)
                    except (ValueError, TypeError):
                        continue
                    ts = h_entry.get("timestamp", "")
                    try:
                        entry_dt = datetime.fromisoformat(ts)
                    except (ValueError, TypeError):
                        continue
                    # Ensure TZ-aware so year/month boundaries are evaluated
                    # in HA's local timezone (otherwise off-by-one near midnight).
                    if entry_dt.tzinfo is None:
                        entry_dt = entry_dt.replace(tzinfo=dt_util.DEFAULT_TIME_ZONE)
                    entry_dt = dt_util.as_local(entry_dt)
                    if entry_dt.year == now.year:
                        yearly += cost_val
                        if entry_dt.month == now.month:
                            monthly += cost_val

        self.hass.data.setdefault(DOMAIN, {})["_budget_cache"] = {
            "monthly_spent": monthly,
            "yearly_spent": yearly,
            "last_updated": now,
        }

    async def _async_check_budget(
        self, task_results: dict[str, Any]
    ) -> None:
        """Check budget thresholds using cached totals."""
        from .helpers.notification_manager import NotificationManager

        nm = self.hass.data.get(DOMAIN, {}).get("_notification_manager")
        if not isinstance(nm, NotificationManager) or not nm.enabled:
            return

        global_options: Mapping[str, Any] = {}
        for entry in self.hass.config_entries.async_entries(DOMAIN):
            if entry.unique_id == GLOBAL_UNIQUE_ID:
                global_options = entry.options or entry.data
                break

        if not global_options.get(CONF_BUDGET_ALERTS_ENABLED, False):
            return

        threshold_pct = int(global_options.get(CONF_BUDGET_ALERT_THRESHOLD, 80)) / 100.0
        monthly_budget = float(global_options.get(CONF_BUDGET_MONTHLY, 0))
        yearly_budget = float(global_options.get(CONF_BUDGET_YEARLY, 0))

        if monthly_budget <= 0 and yearly_budget <= 0:
            return

        currency_code = str(global_options.get(CONF_BUDGET_CURRENCY, "EUR"))
        currency_symbol = BUDGET_CURRENCIES.get(currency_code, "€")

        # Use cached budget totals (recalculate if stale or missing)
        cache: dict[str, Any] | None = self.hass.data.get(DOMAIN, {}).get(
            "_budget_cache"
        )
        if cache is None or (
            dt_util.now() - cache["last_updated"]
        ).total_seconds() > 3600:
            self._recalculate_budget_cache()
            cache = self.hass.data[DOMAIN]["_budget_cache"]

        monthly_spent: float = cache["monthly_spent"]
        yearly_spent: float = cache["yearly_spent"]

        # Check monthly
        if monthly_budget > 0 and monthly_spent >= monthly_budget * threshold_pct:
            await nm.async_budget_alert(
                "monthly", monthly_spent, monthly_budget, currency_symbol
            )

        # Check yearly
        if yearly_budget > 0 and yearly_spent >= yearly_budget * threshold_pct:
            await nm.async_budget_alert(
                "yearly", yearly_spent, yearly_budget, currency_symbol
            )

    # --- Helpers ---

    def _get_merged_tasks_data(self) -> dict[str, Any]:
        """Return merged static (ConfigEntry) + dynamic (Store) task data."""
        tasks_data = dict(self.entry.data.get(CONF_TASKS, {}))
        if self._store is not None:
            return self._store.merge_all_tasks(tasks_data)
        return tasks_data

    def _persist_dynamic_state(self, task_id: str, task: MaintenanceTask) -> None:
        """Write task's dynamic state to Store (debounced)."""
        if self._store is None:
            return
        td = task.to_dict()
        lp = td.get("last_performed")
        if lp is not None:
            self._store.set_last_performed(task_id, lp)
        lpd = td.get("last_planned_due")
        state = self._store._ensure_task(task_id)
        if lpd is not None:
            state["last_planned_due"] = lpd
        elif "last_planned_due" in state:
            del state["last_planned_due"]
        self._store.set_history(task_id, td.get("history", []))
        if task.adaptive_config:
            self._store.set_adaptive_config(task_id, task.adaptive_config)
        self._store.async_delay_save()

    # --- Mutation Methods ---

    async def async_add_trigger_history_entry(
        self,
        task_id: str,
        trigger_value: float | None = None,
    ) -> None:
        """Add a TRIGGERED history entry to a task and persist."""
        merged = self._get_merged_tasks_data()
        if task_id not in merged:
            return

        task = MaintenanceTask.from_dict(merged[task_id])
        task.add_history_entry(
            entry_type=HistoryEntryType.TRIGGERED,
            notes="Sensor trigger activated",
            trigger_value=trigger_value,
        )

        if self._store is not None:
            self._persist_dynamic_state(task_id, task)
        else:
            tasks_data = dict(self.entry.data.get(CONF_TASKS, {}))
            tasks_data[task_id] = task.to_dict()
            new_data = dict(self.entry.data)
            new_data[CONF_TASKS] = tasks_data
            self.hass.config_entries.async_update_entry(self.entry, data=new_data)

    async def complete_maintenance(
        self,
        task_id: str,
        notes: str | None = None,
        cost: float | None = None,
        duration: int | None = None,
        checklist_state: dict[str, bool] | None = None,
        feedback: str | None = None,
        completed_by: str | None = None,
    ) -> None:
        """Mark a task as completed and persist."""
        merged = self._get_merged_tasks_data()
        if task_id not in merged:
            _LOGGER.error("Task %s not found in entry %s", task_id, self.entry.title)
            return

        task = MaintenanceTask.from_dict(merged[task_id])

        # Compute actual interval before updating last_performed
        actual_interval: int | None = None
        if task.last_performed:
            try:
                last = date.fromisoformat(task.last_performed)
                actual_interval = (dt_util.now().date() - last).days
            except (ValueError, TypeError):
                actual_interval = None

        task.complete(
            notes=notes, cost=cost, duration=duration,
            checklist_state=checklist_state, feedback=feedback,
            completed_by=completed_by,
        )

        # Update adaptive scheduling if enabled
        if task.adaptive_config and task.adaptive_config.get("enabled"):
            if actual_interval is not None and actual_interval > 0:
                from .helpers.interval_analyzer import IntervalAnalyzer

                analyzer = IntervalAnalyzer()
                # Store the base interval for blending reference
                if "base_interval" not in task.adaptive_config:
                    task.adaptive_config["base_interval"] = task.interval_days or 30
                # Inject hemisphere, current month/date for seasonal awareness
                task.adaptive_config["hemisphere"] = (
                    "south" if self.hass.config.latitude < 0 else "north"
                )
                now = dt_util.now()
                task.adaptive_config["_current_month"] = now.month
                task.adaptive_config["_current_date"] = now.date().isoformat()
                updated_config = analyzer.update_on_completion(
                    task.adaptive_config, actual_interval, feedback
                )
                task.adaptive_config = updated_config

        if self._store is not None:
            # Dynamic state only → Store (no ConfigEntry write needed)
            self._persist_dynamic_state(task_id, task)
            await self._store.async_save()  # Flush immediately for user actions
            self._recently_completed[task_id] = time.monotonic()
            async_dispatcher_send(
                self.hass,
                SIGNAL_TASK_RESET.format(entry_id=self.entry.entry_id, task_id=task_id),
            )
            await self.async_request_refresh()
        else:
            tasks_data = dict(self.entry.data.get(CONF_TASKS, {}))
            tasks_data[task_id] = task.to_dict()
            self._recently_completed[task_id] = time.monotonic()
            async_dispatcher_send(
                self.hass,
                SIGNAL_TASK_RESET.format(entry_id=self.entry.entry_id, task_id=task_id),
            )
            await self._async_persist_tasks(tasks_data)

        # Invalidate budget cache when a cost is recorded
        if cost is not None:
            self._recalculate_budget_cache()

        _LOGGER.info(
            "Maintenance completed: %s on %s", task.name, self.maintenance_object.name
        )

    async def reset_maintenance(
        self,
        task_id: str,
        date: date | None = None,
    ) -> None:
        """Reset the last performed date of a task."""
        merged = self._get_merged_tasks_data()
        if task_id not in merged:
            _LOGGER.error("Task %s not found in entry %s", task_id, self.entry.title)
            return

        task = MaintenanceTask.from_dict(merged[task_id])
        task.reset(reset_date=date)

        if self._store is not None:
            self._persist_dynamic_state(task_id, task)
            await self._store.async_save()  # Flush immediately for user actions
            self._recently_completed[task_id] = time.monotonic()
            async_dispatcher_send(
                self.hass,
                SIGNAL_TASK_RESET.format(entry_id=self.entry.entry_id, task_id=task_id),
            )
            await self.async_request_refresh()
        else:
            tasks_data = dict(self.entry.data.get(CONF_TASKS, {}))
            tasks_data[task_id] = task.to_dict()
            self._recently_completed[task_id] = time.monotonic()
            async_dispatcher_send(
                self.hass,
                SIGNAL_TASK_RESET.format(entry_id=self.entry.entry_id, task_id=task_id),
            )
            await self._async_persist_tasks(tasks_data)

        _LOGGER.info(
            "Maintenance reset: %s on %s", task.name, self.maintenance_object.name
        )

    async def skip_maintenance(
        self,
        task_id: str,
        reason: str | None = None,
    ) -> None:
        """Skip the current maintenance cycle for a task."""
        merged = self._get_merged_tasks_data()
        if task_id not in merged:
            _LOGGER.error("Task %s not found in entry %s", task_id, self.entry.title)
            return

        task = MaintenanceTask.from_dict(merged[task_id])
        task.skip(reason=reason)

        if self._store is not None:
            self._persist_dynamic_state(task_id, task)
            await self._store.async_save()  # Flush immediately for user actions
            self._recently_completed[task_id] = time.monotonic()
            async_dispatcher_send(
                self.hass,
                SIGNAL_TASK_RESET.format(entry_id=self.entry.entry_id, task_id=task_id),
            )
            await self.async_request_refresh()
        else:
            tasks_data = dict(self.entry.data.get(CONF_TASKS, {}))
            tasks_data[task_id] = task.to_dict()
            self._recently_completed[task_id] = time.monotonic()
            async_dispatcher_send(
                self.hass,
                SIGNAL_TASK_RESET.format(entry_id=self.entry.entry_id, task_id=task_id),
            )
            await self._async_persist_tasks(tasks_data)

        _LOGGER.info(
            "Maintenance skipped: %s on %s", task.name, self.maintenance_object.name
        )

    async def async_apply_suggested_interval(
        self, task_id: str, interval: int
    ) -> None:
        """Apply a suggested interval to a task (static config → ConfigEntry)."""
        tasks_data = dict(self.entry.data.get(CONF_TASKS, {}))
        if task_id not in tasks_data:
            _LOGGER.error("Task %s not found in entry %s", task_id, self.entry.title)
            return

        task_dict = dict(tasks_data[task_id])
        old_interval = task_dict.get("interval_days")
        task_dict["interval_days"] = interval
        tasks_data[task_id] = task_dict

        await self._async_persist_tasks(tasks_data)

        _LOGGER.info(
            "Adaptive: interval %s→%s for task %s",
            old_interval, interval, task_id,
        )

    async def _async_persist_tasks(self, tasks_data: dict[str, Any]) -> None:
        """Persist updated task data to the config entry and refresh."""
        new_data = dict(self.entry.data)
        new_data[CONF_TASKS] = tasks_data
        self.hass.config_entries.async_update_entry(self.entry, data=new_data)
        await self.async_request_refresh()

    async def async_persist_trigger_runtime(
        self,
        task_id: str,
        runtime_data: dict[str, Any],
        entity_id: str | None = None,
        *,
        immediate: bool = False,
    ) -> None:
        """Persist trigger runtime values.

        This is called by triggers to save values that must survive restarts.

        When *entity_id* is provided the data is stored per-entity under
        ``trigger_runtime[entity_id]``.  When *entity_id* is ``None`` the
        legacy flat storage is used for backwards compatibility.
        """
        if self._store is not None:
            # Store-based: write to per-entry store file (debounced)
            if entity_id is not None:
                self._store.set_trigger_runtime(task_id, entity_id, runtime_data)
            else:
                # Legacy flat: store under a synthetic key
                self._store.set_trigger_runtime(task_id, "_flat", runtime_data)
            if immediate:
                await self._store.async_save()
            else:
                self._store.async_delay_save()
        else:
            # Legacy: write to ConfigEntry.data
            tasks_data = dict(self.entry.data.get(CONF_TASKS, {}))
            if task_id not in tasks_data:
                return

            task_dict = dict(tasks_data[task_id])
            trigger_config = dict(task_dict.get("trigger_config", {}))

            if entity_id is not None:
                trigger_state = dict(trigger_config.get("_trigger_state", {}))
                entity_state = dict(trigger_state.get(entity_id, {}))
                for key, value in runtime_data.items():
                    entity_state[key] = value
                trigger_state[entity_id] = entity_state
                trigger_config["_trigger_state"] = trigger_state
            else:
                for key, value in runtime_data.items():
                    trigger_config[key] = value

            task_dict["trigger_config"] = trigger_config
            tasks_data[task_id] = task_dict

            new_data = dict(self.entry.data)
            new_data[CONF_TASKS] = tasks_data
            self.hass.config_entries.async_update_entry(self.entry, data=new_data)

        _LOGGER.debug(
            "Persisted trigger runtime data for task %s (entity=%s): %s",
            task_id,
            entity_id or "flat",
            runtime_data,
        )

    def register_calendar_entity(self, calendar_entity: MaintenanceCalendar) -> None:
        """Register the calendar entity for state updates."""
        self._calendar_entity = calendar_entity
