"""DataUpdateCoordinator for the Maintenance Supporter integration."""

from __future__ import annotations

import logging
import time
from datetime import date, datetime, timedelta
from typing import TYPE_CHECKING, Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.util import dt as dt_util

if TYPE_CHECKING:
    from .calendar import MaintenanceCalendar
    from .todo import MaintenanceTodoList
from homeassistant.helpers import issue_registry as ir
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator

from .const import (
    BUDGET_CACHE_KEY,
    BUDGET_CURRENCIES,
    CONF_BUDGET_ALERT_THRESHOLD,
    CONF_BUDGET_ALERTS_ENABLED,
    CONF_BUDGET_CURRENCY,
    CONF_BUDGET_MONTHLY,
    CONF_BUDGET_YEARLY,
    CONF_OBJECT,
    CONF_TASKS,
    DEFAULT_BUDGET_CURRENCY,
    DEFAULT_INTERVAL_DAYS,
    DEFAULT_UPDATE_INTERVAL_MINUTES,
    DOMAIN,
    EVENT_TASK_COMPLETED,
    EVENT_TASK_RESET,
    EVENT_TASK_SKIPPED,
    MANUAL_COMPLETION_DEDUP_SECONDS,
    MISSING_ENTITY_THRESHOLD_REFRESHES,
    NOTIFICATION_MANAGER_KEY,
    SIGNAL_TASK_RESET,
    STARTUP_GRACE_PERIOD_SECONDS,
    TRIGGER_COMPLETION_COOLDOWN_SECONDS,
    UNAVAILABLE_STATES,
    HistoryEntryType,
    MaintenanceStatus,
    ScheduleType,
    TriggerEntityState,
)
from .helpers.budget import compute_spend
from .helpers.entry_tasks import write_task
from .helpers.global_options import get_global_options, is_schedule_time_enabled
from .helpers.schedule import normalize_task_storage, read_legacy_fields
from .models.maintenance_object import MaintenanceObject
from .models.maintenance_task import MaintenanceTask
from .storage import MaintenanceStore

_LOGGER = logging.getLogger(__name__)


def _notify_task_label(task: dict[str, Any]) -> str:
    """Task name for notifications — phased tasks (#139) name the due step,
    so "Mower blades · Replace blades" tells the user what the work IS."""
    from .helpers.phases import current_phase

    name = task.get("name", "")
    phase = current_phase(task)
    return f"{name} · {phase['name']}" if phase else name


def _inert_task_result(task: MaintenanceTask, status: str, **extra: Any) -> dict[str, Any]:
    """Coordinator payload for a task that gets NO live evaluation (archived /
    paused): due fields nulled, trigger off, only cost/history-derived fields
    surfaced. The archived and paused short-circuits were hand-copied twins."""
    task_result = task.to_dict()
    task_result["_status"] = status
    task_result["_days_until_due"] = None
    task_result["_next_due"] = None
    task_result["_is_done"] = task.is_done
    task_result["_trigger_active"] = False
    task_result["_times_performed"] = task.times_performed
    task_result["_total_cost"] = task.total_cost
    task_result["_average_duration"] = task.average_duration
    task_result["_last_entry"] = task.last_entry
    task_result.update(extra)
    return task_result


class MaintenanceCoordinator(DataUpdateCoordinator[dict[str, Any]]):
    """Coordinator for a single maintenance object and its tasks."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry, store: MaintenanceStore) -> None:
        """Initialize the coordinator.

        A per-entry :class:`MaintenanceStore` is always provided (created in
        async_setup_entry). Dynamic task state — last_performed, history,
        adaptive_config and all trigger runtime (change_count,
        accumulated_seconds, on_since, baseline_value) — lives in that Store,
        never in ConfigEntry.data. `trigger_config["_trigger_state"]` is only a
        transient read-model reconstructed by MaintenanceStore.merge_task_data.
        """
        super().__init__(
            hass,
            _LOGGER,
            name=f"Maintenance Supporter ({entry.title})",
            update_interval=timedelta(minutes=DEFAULT_UPDATE_INTERVAL_MINUTES),
        )
        self.entry = entry
        self._store = store
        self._calendar_entity: MaintenanceCalendar | None = None
        self._todo_entity: MaintenanceTodoList | None = None
        self._previous_statuses: dict[str, str] = {}  # task_id -> status

        # Trigger completion cooldown tracking
        self._recently_completed: dict[str, float] = {}  # task_id -> monotonic timestamp
        # Manual completions only — the double-tap dedup window (journey M1).
        self._recent_manual_completions: dict[str, float] = {}
        # Backdated completions (explicit completed_at) get their OWN dedup,
        # keyed by (task_id, timestamp): a double-submitted backfill wrote two
        # identical history entries and consumed parts/budget twice (bug audit
        # 2026-08-22). Distinct timestamps stay unguarded on purpose — a user
        # backfilling several past days in a row is legitimate.
        self._recent_backfills: dict[tuple[str, str], float] = {}

        # Trigger entity availability tracking
        self._startup_time: float = time.monotonic()
        self._entity_missing_refresh_count: dict[str, int] = {}  # task_id -> count
        self._entity_unavailable_logged: dict[str, bool] = {}  # task_id -> logged?
        self._trigger_entity_states: dict[str, str] = {}  # task_id -> TriggerEntityState

    def _is_schedule_time_feature_enabled(self) -> bool:
        """Return True iff the global advanced flag for time-of-day scheduling is on."""
        return is_schedule_time_enabled(self.hass)

    def _in_startup_grace_period(self) -> bool:
        """Return True if still within the startup grace period."""
        return (time.monotonic() - self._startup_time) < STARTUP_GRACE_PERIOD_SECONDS

    async def _async_maybe_auto_resume(self) -> None:
        """Resume a seasonal pause whose ``paused_until`` day has arrived (N3).

        Runs at the top of every refresh (5-min granularity is plenty for a
        day-granular date). Uses the same resume core as the ``object/resume``
        WS command: pause cleared, active recurring tasks re-anchored to a
        fresh cycle from today.
        """
        from .helpers.pause import build_resumed_entry_data, pause_due_for_auto_resume

        obj_data = self.entry.data.get(CONF_OBJECT, {})
        today = dt_util.now().date()
        if not pause_due_for_auto_resume(obj_data, today):
            return

        new_data = build_resumed_entry_data(dict(self.entry.data), self._store, today.isoformat())
        self.hass.config_entries.async_update_entry(self.entry, data=new_data)
        await self._store.async_save()
        _LOGGER.info(
            "Seasonal pause on '%s' ended (paused_until reached) — resumed",
            obj_data.get("name"),
        )

    @property
    def maintenance_object(self) -> MaintenanceObject:
        """Return the maintenance object from config entry data."""
        return MaintenanceObject.from_dict(self.entry.data.get(CONF_OBJECT, {}))

    @property
    def tasks(self) -> dict[str, MaintenanceTask]:
        """Return all tasks, merging static config with Store dynamic state."""
        tasks_data = self._store.merge_all_tasks(self.entry.data.get(CONF_TASKS, {}))
        return {task_id: MaintenanceTask.from_dict(task_data) for task_id, task_data in tasks_data.items()}

    async def _async_update_data(self) -> dict[str, Any]:
        """Fetch and compute the current state of all tasks."""
        # Seasonal pause (N3): auto-resume on the first refresh on/after
        # paused_until, then continue this refresh un-paused.
        await self._async_maybe_auto_resume()

        obj = self.maintenance_object
        tasks = self.tasks
        object_paused = obj.paused_at is not None

        # Preserve live trigger state from previous data to avoid resetting
        # trigger state that was set by event-driven triggers between refreshes
        prev_tasks = (self.data or {}).get(CONF_TASKS, {})

        # Clean up expired cooldown entries
        now_mono = time.monotonic()
        self._recently_completed = {
            tid: ts for tid, ts in self._recently_completed.items() if now_mono - ts < TRIGGER_COMPLETION_COOLDOWN_SECONDS
        }
        self._recent_manual_completions = {
            tid: ts for tid, ts in self._recent_manual_completions.items() if now_mono - ts < MANUAL_COMPLETION_DEDUP_SECONDS
        }
        self._recent_backfills = {
            key: ts for key, ts in self._recent_backfills.items() if now_mono - ts < MANUAL_COMPLETION_DEDUP_SECONDS
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

            # v2.10.0: an archived task is inert. Short-circuit before any
            # trigger evaluation / adaptive analysis / issue check — its status
            # reads ARCHIVED (highest precedence, so it's excluded from notify +
            # binary_sensor + status counts) and only cost/history-derived fields
            # are surfaced (budget keeps counting; the detail view still renders
            # the record).
            if task.archived_at is not None:
                result[CONF_TASKS][task_id] = _inert_task_result(task, MaintenanceStatus.ARCHIVED)
                continue

            # v2.20 (N3): tasks of a paused object are frozen — status PAUSED,
            # no trigger evaluation, no due computation, nothing to notify.
            # Same short-circuit surface as archived, but the object remains a
            # first-class citizen in every view. `_paused` mirrors the status
            # for the dict-twin recomputation in helpers.status.
            if object_paused:
                result[CONF_TASKS][task_id] = _inert_task_result(task, MaintenanceStatus.PAUSED, _paused=True)
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
            if task.schedule_type == ScheduleType.SENSOR_BASED and task.trigger_config:
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
            task_result["_next_due"] = task.next_due.isoformat() if task.next_due else None
            task_result["_is_done"] = task.is_done
            task_result["_trigger_active"] = task._trigger_active
            task_result["_trigger_current_value"] = task._trigger_current_value
            task_result["_trigger_entity_state"] = self._trigger_entity_states.get(task_id, TriggerEntityState.AVAILABLE)

            # Expose counter delta data for frontend visualization
            tc = task.trigger_config
            if tc and tc.get("type") == "counter" and tc.get("trigger_delta_mode"):
                # Check per-entity _trigger_state first, fall back to flat key
                baseline = None
                trigger_state = tc.get("_trigger_state", {})
                for eid in tc.get("entity_ids") or [tc.get("entity_id")]:
                    if eid:
                        es = trigger_state.get(eid, {})
                        if "baseline_value" in es:
                            baseline = es["baseline_value"]
                            break
                if baseline is None:
                    baseline = tc.get("trigger_baseline_value")
                if baseline is not None:
                    # Expose the baseline independently of the live value. After a
                    # completion the trigger is in its post-reset cooldown, so
                    # _trigger_current_value is None — but the baseline HAS moved
                    # to the current reading (reset_baseline persisted it). The
                    # chart measures "progress since service" as reading − baseline,
                    # so it needs the fresh baseline to return to 0; gating it on
                    # current_value left the graph stuck at the old delta (#runtime-graph).
                    task_result["_trigger_baseline_value"] = baseline
                    if task._trigger_current_value is not None:
                        task_result["_trigger_current_delta"] = task._trigger_current_value - baseline
            task_result["_times_performed"] = task.times_performed
            task_result["_total_cost"] = task.total_cost
            task_result["_average_duration"] = task.average_duration
            task_result["_last_entry"] = task.last_entry

            # Adaptive scheduling analysis — day-based tasks only. The analyzer
            # reasons entirely in days and applying a suggestion overwrites
            # interval_days; on a weeks/months/years task that would corrupt the
            # schedule (e.g. interval_days=90 left with unit=months → +90 months).
            if task.adaptive_config and task.adaptive_config.get("enabled") and task.interval_unit in (None, "days"):
                # Guarded like the sensor-prediction block below: a malformed
                # history / analysis error must not abort the whole refresh and
                # stall every task in this object.
                try:
                    from .helpers.interval_analyzer import IntervalAnalyzer

                    analyzer = IntervalAnalyzer()
                    # Inject hemisphere and current month for seasonal awareness.
                    # latitude is None on an un-onboarded HA → default to north.
                    analysis_config = dict(task.adaptive_config)
                    analysis_config["hemisphere"] = "south" if (self.hass.config.latitude or 0) < 0 else "north"
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
                except Exception:  # noqa: BLE001 — never let analysis break refresh
                    _LOGGER.debug(
                        "Adaptive interval analysis failed for task %s",
                        task_id,
                        exc_info=True,
                    )

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
                    prediction = await predictor.async_analyze(task_result, adaptive_cfg)
                    if prediction:
                        # Degradation data
                        if prediction.degradation:
                            deg = prediction.degradation
                            task_result["_degradation_rate"] = deg.slope_per_day
                            task_result["_degradation_trend"] = deg.trend
                            task_result["_degradation_r_squared"] = deg.r_squared
                            task_result["_degradation_data_points"] = deg.data_points
                            task_result["_prediction_cycles"] = deg.cycles_learned

                        # Threshold prediction
                        if prediction.threshold_prediction:
                            tp = prediction.threshold_prediction
                            task_result["_days_until_threshold"] = tp.days_until_threshold
                            task_result["_threshold_prediction_date"] = tp.predicted_date
                            task_result["_threshold_prediction_confidence"] = tp.confidence

                            # Urgency check: threshold will be reached sooner
                            # than the current maintenance interval
                            current_interval = task.interval_days or DEFAULT_INTERVAL_DAYS
                            suggested = task_result.get("_suggested_interval")
                            effective_interval = suggested or current_interval
                            if (
                                tp.days_until_threshold is not None
                                and tp.days_until_threshold > 0
                                and tp.days_until_threshold < effective_interval * 0.9
                            ):
                                task_result["_sensor_prediction_urgency"] = True
                                # Override suggested interval with 90% safety
                                urgency_interval = max(
                                    1,
                                    int(tp.days_until_threshold * 0.9),
                                )
                                task_result["_suggested_interval"] = urgency_interval

                        # Environmental factor
                        if prediction.environmental:
                            env = prediction.environmental
                            task_result["_environmental_factor"] = env.adjustment_factor
                            task_result["_environmental_entity"] = env.entity_id
                            task_result["_environmental_correlation"] = env.correlation

                            # Apply environmental factor to suggested interval
                            si = task_result.get("_suggested_interval")
                            if si is not None and env.adjustment_factor != 1.0 and env.has_sufficient_data:
                                task_result["_suggested_interval"] = max(
                                    1,
                                    int(si * env.adjustment_factor),
                                )
                except Exception:  # noqa: BLE001 - one task's prediction failure must not break the whole coordinator update
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

            nm = self.hass.data.get(DOMAIN, {}).get(NOTIFICATION_MANAGER_KEY)
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

        # Repaint the to-do list if registered and added to hass
        if self._todo_entity is not None and self._todo_entity.hass is not None:
            self._todo_entity.refresh()

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
        from .helpers.trigger_fallback import (
            evaluate_counter,
            evaluate_runtime,
            evaluate_state_change,
            evaluate_threshold,
        )

        # Dispatch to the pure per-type evaluators (helpers/trigger_fallback);
        # this method only applies what they learned.
        if trigger_type == "threshold":
            result = evaluate_threshold(self.hass.states.get, task.trigger_config, entity_ids)
        elif trigger_type == "counter":
            result = evaluate_counter(self.hass.states.get, task.trigger_config, entity_ids)
        elif trigger_type == "state_change":
            result = evaluate_state_change(task.trigger_config, entity_ids)
        elif trigger_type == "runtime":
            result = evaluate_runtime(task.trigger_config, entity_ids)
        else:
            return

        if result.current_value is not None:
            task._trigger_current_value = result.current_value
        if result.active is not None:
            task._trigger_active = result.active

    async def _async_check_for_issues(self, tasks: dict[str, MaintenanceTask]) -> None:
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
            # Archived tasks are inert — don't raise missing-entity issues for
            # a trigger that's no longer doing anything.
            if task.archived_at is not None:
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

                if state is not None and state.state not in UNAVAILABLE_STATES:
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
                        "Trigger entity %s not yet available (startup grace period), skipping issue creation for task '%s'",
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
                            "Trigger entity %s missing for task '%s' (refresh %d/%d before issue)",
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

        # v1.3.0: scan on_complete_action.target.entity_id refs for staleness.
        # Posts/clears repair issues so a renamed/deleted target doesn't
        # silently cause failed service-calls. Re-uses the same issue_registry
        # lifecycle as the trigger-entity scan above.
        self._check_stale_action_entities()

    def _check_stale_action_entities(self) -> None:
        """Create/clear repair issues for invalid on_complete_action targets."""
        for task_id, task_dict in self._get_merged_tasks_data().items():
            if task_dict.get("archived_at") is not None:
                continue  # archived task: inert, don't flag stale action targets
            action = task_dict.get("on_complete_action") or {}
            if not isinstance(action, dict):
                continue
            target = action.get("target") or {}
            if not isinstance(target, dict):
                continue
            raw_eid = target.get("entity_id")
            # Only single-entity targets are checked here. List/template targets
            # are out of scope (HA's service-call already validates them at
            # call-time and our action_listener tolerates failures).
            if isinstance(raw_eid, list):
                eids: list[str] = [e for e in raw_eid if isinstance(e, str)]
            elif isinstance(raw_eid, str):
                eids = [raw_eid]
            else:
                continue

            for entity_id in eids:
                issue_id = f"stale_action_entity_{self.entry.entry_id}_{task_id}_{entity_id}"
                state = self.hass.states.get(entity_id)
                if state is not None:
                    ir.async_delete_issue(self.hass, DOMAIN, issue_id)
                elif not self._in_startup_grace_period():
                    task_name = task_dict.get("name", "?")
                    ir.async_create_issue(
                        self.hass,
                        DOMAIN,
                        issue_id,
                        is_fixable=True,
                        severity=ir.IssueSeverity.WARNING,
                        translation_key="stale_action_entity",
                        translation_placeholders={
                            "entity_id": entity_id,
                            "task_name": task_name,
                            "object_name": self.maintenance_object.name,
                        },
                        data={
                            "entry_id": self.entry.entry_id,
                            "task_id": task_id,
                            "task_name": task_name,
                            "stale_entity": entity_id,
                        },
                    )

    async def _async_notify_status_changes(self, task_results: dict[str, Any]) -> None:
        """Pass tasks with notifiable statuses to the NotificationManager.

        The NotificationManager handles deduplication and repeat intervals
        via its own ``_last_notified`` timestamps.  On startup the coordinator
        seeds the NM so that already-notifiable tasks don't trigger an
        immediate burst but will still repeat after the configured interval.
        """
        from .helpers.notification_manager import NotificationManager

        nm = self.hass.data.get(DOMAIN, {}).get(NOTIFICATION_MANAGER_KEY)
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

        # Vacation mode silences some tasks. Filter them out HERE — before the
        # bundle-threshold check below — so a silenced/exempt task neither
        # triggers a bundle nor rides inside one. async_send_bundled has no
        # per-task vacation gate (async_task_status_changed does), and the bundle
        # COUNT must also exclude them so N-1 silenced tasks don't force a bundle.
        from .helpers.vacation import get_vacation_state

        _vac = get_vacation_state(self.hass)
        notifiable = [row for row in notifiable if not _vac.is_silent_for(row[0])]
        # A status the user switched off, or a task they snoozed, must neither
        # count toward the bundle threshold nor ride inside the bundle - the
        # per-task path checks both, the bundle path did not (bug audit
        # 2026-08-29).
        notifiable = [
            row
            for row in notifiable
            if nm._is_status_enabled(row[2]) and not nm._is_snoozed(f"{self.entry.entry_id}_{row[0]}_{row[2]}")
        ]

        # v2.26 notification routing: a saved-view scope ("only notify about
        # view X") drops tasks the view's label/user filters don't match —
        # BEFORE the bundle threshold, like the vacation filter above. A stale
        # view id (view deleted) means no scope, never "silence everything".
        from .const import CONF_NOTIFY_SCOPE_VIEW_ID

        scope_view_id = get_global_options(self.hass).get(CONF_NOTIFY_SCOPE_VIEW_ID) or ""
        if scope_view_id:
            from .helpers.saved_views import list_saved_views, view_matches_task

            scope = next((v for v in list_saved_views(self.hass) if v["id"] == scope_view_id), None)
            if scope is not None:
                notifiable = [row for row in notifiable if view_matches_task(scope["filters"], row[1])]

        if not notifiable:
            # No notifications needed — still update the cache
            for task_id, task_result in task_results.items():
                self._previous_statuses[task_id] = task_result.get("_status")
            return

        # Check if bundling is enabled and threshold met
        from .const import (
            CONF_NOTIFICATION_BUNDLE_THRESHOLD,
            CONF_NOTIFICATION_BUNDLING_ENABLED,
        )

        global_options = get_global_options(self.hass)
        bundling_enabled = global_options.get(CONF_NOTIFICATION_BUNDLING_ENABLED, False)
        bundle_threshold = int(global_options.get(CONF_NOTIFICATION_BUNDLE_THRESHOLD, 2))

        if bundling_enabled and len(notifiable) >= bundle_threshold:
            await nm.async_send_bundled(
                entry_id=self.entry.entry_id,
                object_name=obj_name,
                tasks=[
                    {
                        "task_id": tid,
                        "task_name": _notify_task_label(tr),
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
                    task_name=_notify_task_label(task_result),
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

        Stores the result in hass.data[DOMAIN][BUDGET_CACHE_KEY] so that
        every coordinator reads from the same cache instead of each one
        re-scanning all entries on every 5-minute refresh.

        The scan itself lives in :func:`helpers.budget.compute_spend`, shared
        with the ``budget_status`` WS command — this method only owns the
        *caching* around it. The two used to hold divergent copies of the same
        loop, so the alert and the panel could report different spend.
        """
        monthly, yearly = compute_spend(self.hass)

        self.hass.data.setdefault(DOMAIN, {})[BUDGET_CACHE_KEY] = {
            "monthly_spent": monthly,
            "yearly_spent": yearly,
            "last_updated": dt_util.now(),
        }

    async def _async_check_budget(self, task_results: dict[str, Any]) -> None:
        """Check budget thresholds using cached totals."""
        from .helpers.notification_manager import NotificationManager

        nm = self.hass.data.get(DOMAIN, {}).get(NOTIFICATION_MANAGER_KEY)
        if not isinstance(nm, NotificationManager) or not nm.enabled:
            return

        global_options = get_global_options(self.hass)
        if not global_options.get(CONF_BUDGET_ALERTS_ENABLED, False):
            return

        threshold_pct = int(global_options.get(CONF_BUDGET_ALERT_THRESHOLD, 80)) / 100.0
        monthly_budget = float(global_options.get(CONF_BUDGET_MONTHLY, 0))
        yearly_budget = float(global_options.get(CONF_BUDGET_YEARLY, 0))

        if monthly_budget <= 0 and yearly_budget <= 0:
            return

        currency_code = str(global_options.get(CONF_BUDGET_CURRENCY, DEFAULT_BUDGET_CURRENCY))
        currency_symbol = BUDGET_CURRENCIES.get(currency_code, "€")

        # Use cached budget totals (recalculate if stale or missing)
        cache: dict[str, Any] | None = self.hass.data.get(DOMAIN, {}).get(BUDGET_CACHE_KEY)
        # Stale when old — OR when the local month/year rolled over since the
        # compute: the cached buckets are tied to the month they were computed
        # in, and a purely age-based rule fired a false "budget nearly
        # exhausted" alert for the NEW month during the first cached hour of
        # the 1st (bug audit 2026-08-22).
        now_local = dt_util.now()
        if (
            cache is None
            or (now_local - cache["last_updated"]).total_seconds() > 3600
            or cache["last_updated"].month != now_local.month
            or cache["last_updated"].year != now_local.year
        ):
            self._recalculate_budget_cache()
            cache = self.hass.data[DOMAIN][BUDGET_CACHE_KEY]

        monthly_spent: float = cache["monthly_spent"]
        yearly_spent: float = cache["yearly_spent"]

        # Check monthly
        if monthly_budget > 0 and monthly_spent >= monthly_budget * threshold_pct:
            await nm.async_budget_alert("monthly", monthly_spent, monthly_budget, currency_symbol)

        # Check yearly
        if yearly_budget > 0 and yearly_spent >= yearly_budget * threshold_pct:
            await nm.async_budget_alert("yearly", yearly_spent, yearly_budget, currency_symbol)

    # --- Helpers ---

    def _get_merged_tasks_data(self) -> dict[str, Any]:
        """Return merged static (ConfigEntry) + dynamic (Store) task data."""
        return self._store.merge_all_tasks(dict(self.entry.data.get(CONF_TASKS, {})))

    def _persist_dynamic_state(self, task_id: str, task: MaintenanceTask) -> None:
        """Write task's dynamic state to Store (debounced)."""
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
        # Per-occurrence postpone (set by async_postpone_task, cleared on complete).
        do = td.get("due_override")
        if do is not None:
            state["due_override"] = do
        elif "due_override" in state:
            del state["due_override"]
        # Phase cursor (#139): to_dict emits it only for phase-carrying tasks.
        pc = td.get("phase_cursor")
        if pc is not None:
            self._store.set_phase_cursor(task_id, pc)
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

        self._persist_dynamic_state(task_id, task)

    async def _link_completion_photo(self, photo_doc_id: str, task_id: str) -> None:
        """Link an uploaded completion photo to its task (best-effort).

        The photo is already stored object-scoped by the upload view; this just
        appends the task to the doc's ``task_ids`` so it also surfaces under the
        task's documents and is deref'd on cleanup. Any failure (unknown id,
        store not loaded) is swallowed — it must never fail the completion.
        """
        try:
            from . import DOCUMENT_STORE_KEY

            store = self.hass.data[DOMAIN][DOCUMENT_STORE_KEY]
            doc = store.get(photo_doc_id)
            if doc is None:
                return
            linked = list(doc.get("task_ids") or [])
            if task_id not in linked:
                linked.append(task_id)
                await store.async_update(photo_doc_id, task_ids=linked)
        except (KeyError, AttributeError, OSError, ValueError):
            _LOGGER.debug("Could not link completion photo %s", photo_doc_id)

    async def complete_maintenance(
        self,
        task_id: str,
        notes: str | None = None,
        cost: float | None = None,
        duration: int | None = None,
        checklist_state: dict[str, bool] | None = None,
        feedback: str | None = None,
        completed_by: str | None = None,
        photo_doc_id: str | None = None,
        reading_value: float | None = None,
        restock_quantity: float | None = None,
        used_parts: list[dict[str, Any]] | None = None,
        auto: bool = False,
        unattended: bool = False,
        completed_at: datetime | None = None,
        tag_verified: bool = False,
    ) -> None:
        """Mark a task as completed and persist.

        ``unattended`` marks a surface that cannot ask a human for anything —
        a button press, a to-do tick, an NFC tap, a notification button, a
        voice command. Those paths attach a canned provenance note
        ("Completed via NFC tag"), which must NOT be mistaken for the note a
        task demands: the point of a required note is that somebody wrote it.

        ``completed_at`` (#133) records the completion at a past moment
        (dialog date field / service parameter). Validated HERE — the one
        point the WS command and the HA service both funnel through. See
        :meth:`MaintenanceTask.complete` for the latest-vs-backfill split.
        """
        merged = self._get_merged_tasks_data()
        if task_id not in merged:
            _LOGGER.error("Task %s not found in entry %s", task_id, self.entry.title)
            return

        if completed_at is not None:
            # Naive input (datetime-local field, service YAML) means local time.
            if completed_at.tzinfo is None:
                completed_at = completed_at.replace(tzinfo=dt_util.DEFAULT_TIME_ZONE)
            if completed_at > dt_util.now():
                raise ServiceValidationError(
                    "The completion date cannot be in the future",
                    translation_domain=DOMAIN,
                    translation_key="completed_at_in_future",
                )

        # Required completion details. Checked HERE — the one point every
        # surface funnels through — so a task demanding a note cannot be
        # closed out from a button, the to-do list, an NFC tag, a
        # notification action, voice or a service call.
        #
        # Deliberately BEFORE the double-complete guard below: a rejected
        # attempt must not stamp that guard, or the corrected completion the
        # user makes seconds later (after filling in the dialog) would be
        # silently swallowed as a duplicate.
        #
        # Automatic completions are exempt — a self-clearing problem sensor
        # has nobody to ask, and a required photo would strand the task.
        if not auto:
            from .helpers.completion_requirements import (
                missing_completion_fields,
                required_completion_fields,
            )

            if unattended:
                # Nobody was asked, so nothing the caller attached counts as
                # an answer — a canned "Completed from the To-do list" note is
                # provenance, not the note the task demands.
                missing = required_completion_fields(merged[task_id])
            else:
                missing = missing_completion_fields(
                    merged[task_id],
                    notes=notes,
                    cost=cost,
                    duration=duration,
                    photo_doc_id=photo_doc_id,
                    completed_by=completed_by,
                )
            if missing:
                raise ServiceValidationError(
                    translation_domain=DOMAIN,
                    translation_key="completion_details_required",
                    translation_placeholders={
                        "task_name": str(merged[task_id].get("name", task_id)),
                        "fields": ", ".join(missing),
                    },
                )

        # Proof of presence: a task flagged require_tag_scan only completes
        # from a surface that proves someone stood at the thing — an NFC tap
        # or the QR quick-complete. Checked at THIS choke point so every
        # other surface (panel, card, to-do, voice, notification button)
        # gets the same refusal. Automatic completions are exempt (a
        # recovered trigger has nobody to send to the machine), and
        # automations may assert the scan via the service's `via_tag_scan`.
        if not auto and not tag_verified and merged[task_id].get("require_tag_scan"):
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="tag_scan_required",
                translation_placeholders={
                    "task_name": str(merged[task_id].get("name", task_id)),
                },
            )

        # Inert tasks (bug audit 2026-08-29): the auto path refuses archived /
        # disabled tasks and paused objects (see async_auto_complete_on_recovery),
        # but the manual path let an NFC sticker on a retired machine, a stale
        # panel or a voice command record a completion on a task nobody can
        # see any more - rotation advanced, parts consumed. Same gate here.
        if not auto:
            _td = merged[task_id]
            if (
                _td.get("archived_at") is not None
                or _td.get("enabled") is False
                or self.entry.data.get(CONF_OBJECT, {}).get("paused_at") is not None
            ):
                raise ServiceValidationError(
                    translation_domain=DOMAIN,
                    translation_key="task_inactive",
                    translation_placeholders={"task_name": str(_td.get("name", task_id))},
                )

        # Completion window (earliest_completion_days) - at the choke point like
        # every other rule. The WS / to-do / voice surfaces pre-check it for a
        # friendly code, but the service, the dashboard button, an NFC tap and a
        # notification button reached this method with no gate at all (bug audit
        # 2026-08-29). A completion dated on a PAST day is a history correction,
        # not early work, and bypasses the window exactly like the WS pre-check.
        if not auto:
            _past_dated = completed_at is not None and completed_at.date() < dt_util.now().date()
            if not _past_dated and not MaintenanceTask.from_dict(merged[task_id]).can_complete_now:
                raise ServiceValidationError(
                    translation_domain=DOMAIN,
                    translation_key="too_early",
                    translation_placeholders={"task_name": str(merged[task_id].get("name", task_id))},
                )

        # Household double-complete guard (journey M1): two people seeing the
        # same overdue task and both tapping Complete within seconds would
        # record two completions — duplicated history/cost and a DOUBLE
        # rotation advance (skipping a pool member). Within a short window the
        # second completion is treated as the same real-world action and
        # dropped; the tap still "succeeds" from the user's perspective
        # because the task is already completed. Deliberately a SEPARATE map
        # from _recently_completed: that one is also stamped by skip/reset,
        # and a complete right after a date-correction reset must go through.
        # An explicit completed_at is a deliberate backfill, not a double-tap
        # — it neither checks nor stamps the guard (a stamped guard would
        # swallow a normal completion made right after backfilling, and a
        # normal completion's stamp must not swallow the backfill).
        if completed_at is None and not auto:
            last_manual = self._recent_manual_completions.get(task_id)
            if last_manual is not None and time.monotonic() - last_manual < MANUAL_COMPLETION_DEDUP_SECONDS:
                _LOGGER.info(
                    "Ignoring duplicate completion of %s within %.0fs (double-tap from a second device?)",
                    task_id,
                    time.monotonic() - last_manual,
                )
                return
            # Stamp the guard NOW, before any await (the photo-link below yields the
            # loop). Stamping only at the end let two photo-carrying completions in
            # the same tick both pass the check and interleave → double rotation /
            # part-consume / history entry.
            self._recent_manual_completions[task_id] = time.monotonic()

        if completed_at is not None:
            backfill_key = (task_id, completed_at.isoformat())
            last_backfill = self._recent_backfills.get(backfill_key)
            if last_backfill is not None and time.monotonic() - last_backfill < MANUAL_COMPLETION_DEDUP_SECONDS:
                _LOGGER.info(
                    "Ignoring duplicate backdated completion of %s @ %s (double submit)",
                    task_id,
                    completed_at.isoformat(),
                )
                return
            self._recent_backfills[backfill_key] = time.monotonic()

        task = MaintenanceTask.from_dict(merged[task_id])
        pre_rotation_responsible = task.responsible_user_id
        effective_ts = completed_at if completed_at is not None else dt_util.now()

        # Compute actual interval before updating last_performed. Anchored on
        # the EFFECTIVE moment: "did it three days ago" must feed the real
        # elapsed interval into adaptive learning, and a pure backfill yields
        # a negative interval the learning guard below already rejects.
        actual_interval: int | None = None
        if task.last_performed:
            try:
                last = date.fromisoformat(task.last_performed)
                actual_interval = (effective_ts.date() - last).days
            except (ValueError, TypeError):
                actual_interval = None

        # #99: enrich the per-completion parts selection with names so the
        # history entry is readable without a part-id lookup. Since #130 the
        # AUTOMATIC path records too: with no explicit selection, the task's
        # consumes_parts links — exactly what async_handle_completion_parts
        # will consume below — go on the record, so completions from the
        # no-dialog surfaces (service, button, QR, to-do, voice, recovery)
        # stay correctable through the history editor like dialog ones.
        from .helpers.phases import effective_field as _phase_effective

        # A pure backfill (dated before the last completion) performed no work
        # in the CURRENT cycle: the automatic consumes_parts / buy-task restock
        # must not run for it (bug audit 2026-08-29) - an explicit used_parts
        # selection is still honoured. Mirrors MaintenanceTask.complete's
        # is_latest split (ISO-date string compare).
        _is_backfill = (
            completed_at is not None
            and bool(task.last_performed)
            and effective_ts.date().isoformat() < str(task.last_performed)
        )
        record_links = (
            used_parts
            if used_parts is not None
            else ([] if _is_backfill else (_phase_effective(merged[task_id], "consumes_parts") or []))
        )
        enriched_used: list[dict[str, Any]] | None = None
        if used_parts is not None or record_links:

            def _part_name(link: dict[str, Any]) -> str:
                from .parts_runtime import part_link_name

                return part_link_name(self.hass, self.entry, link)

            enriched_used = [
                {
                    "part_id": link["part_id"],
                    "name": _part_name(link),
                    "quantity": link.get("quantity", 1),
                    # #130: keep the pool owner on the record so a later
                    # history edit can resolve the part without guessing.
                    **({"entry_id": link["entry_id"]} if link.get("entry_id") else {}),
                }
                for link in record_links
                if isinstance(link, dict) and link.get("part_id")
            ]

        is_latest = task.complete(
            notes=notes,
            cost=cost,
            duration=duration,
            checklist_state=checklist_state,
            feedback=feedback,
            completed_by=completed_by,
            photo_doc_id=photo_doc_id,
            reading_value=reading_value,
            used_parts=enriched_used,
            auto=auto,
            completed_at=completed_at,
        )
        # #73: a completed cycle retires its in-cycle checklist ticks — the
        # snapshot that matters is in the history entry above. A pure backfill
        # closed no current cycle, so the live ticks stay.
        if is_latest:
            self._store.clear_checklist_progress(task_id)

        # Link the completion photo to this task so it also surfaces under the
        # object's documents and is deref'd correctly on cleanup. Best-effort:
        # a bad/removed doc_id must never block the completion itself.
        if photo_doc_id:
            await self._link_completion_photo(photo_doc_id, task_id)

        # Update adaptive scheduling if enabled. Gated on is_latest: a pure
        # backfill is not a fresh service interval (its negative
        # actual_interval would be rejected below anyway — the gate makes the
        # intent explicit and keeps the seasonal stamps off stale months).
        if is_latest and task.adaptive_config and task.adaptive_config.get("enabled"):
            if actual_interval is not None and actual_interval > 0:
                from .helpers.interval_analyzer import IntervalAnalyzer

                analyzer = IntervalAnalyzer()
                # Store the base interval for blending reference
                if "base_interval" not in task.adaptive_config:
                    task.adaptive_config["base_interval"] = task.interval_days or DEFAULT_INTERVAL_DAYS
                # Inject hemisphere + month/date of the EFFECTIVE completion
                # moment for seasonal awareness (a completion logged today but
                # performed in March belongs to March).
                task.adaptive_config["hemisphere"] = "south" if (self.hass.config.latitude or 0) < 0 else "north"
                task.adaptive_config["_current_month"] = effective_ts.month
                task.adaptive_config["_current_date"] = effective_ts.date().isoformat()
                try:
                    updated_config = analyzer.update_on_completion(task.adaptive_config, actual_interval, feedback)
                    task.adaptive_config = updated_config
                except (TypeError, ValueError, ZeroDivisionError):  # hand-edited / imported adaptive_config
                    _LOGGER.warning("Adaptive learning skipped for %s: malformed adaptive_config", task_id)

        try:
            await self._persist_and_signal_task_change(task_id, task)
        except Exception:
            # The completion did not land on disk - release the double-tap
            # guard stamped above, or the user's retry within 30 s would be
            # swallowed as a duplicate of a completion that never happened
            # (bug audit 2026-08-29).
            if completed_at is None and not auto:
                self._recent_manual_completions.pop(task_id, None)
            elif completed_at is not None:
                self._recent_backfills.pop((task_id, completed_at.isoformat()), None)
            raise

        # Shared-task rotation: advance_rotation() (inside task.complete)
        # mutates responsible_user_id, which is a STATIC config field — the
        # Store's dynamic overlay deliberately doesn't carry it. Persist the
        # rotated pointer to entry.data or the rotation evaporates with this
        # model object (the pointer never actually moved in released 2.17).
        # Ordered AFTER the store flush (journey I1): a crash between the two
        # writes then loses only the rotation — the completion is recorded,
        # and a retried completion can't double-advance the pointer.
        if task.responsible_user_id != pre_rotation_responsible:
            td = dict(self.entry.data.get(CONF_TASKS, {}).get(task_id, {}))
            td["responsible_user_id"] = task.responsible_user_id
            write_task(self.hass, self.entry, task_id, td)

        # Invalidate budget cache when a cost is recorded
        if cost is not None:
            self._recalculate_budget_cache()

        # Spare parts: consume linked parts / restock a completed buy task.
        # Best-effort side effect — a broken part link must never fail the
        # completion. Runs AFTER persistence so a crash loses only stock math.
        from .parts_runtime import async_handle_completion_parts

        try:
            if is_latest or used_parts is not None:
                await async_handle_completion_parts(
                    self.hass,
                    self.entry,
                    merged[task_id],
                    restock_quantity=restock_quantity,
                    used_parts=used_parts,
                )
        except Exception:
            _LOGGER.exception("Part consumption failed for task %s", task_id)

        # A status configured to notify ONCE (interval 0) stays silenced by the
        # _SENT_ONCE sentinel until something clears it; nothing did after a
        # completion, so a sensor task that re-triggered weeks later was never
        # announced again until HA restarted (bug audit 2026-08-29).
        if is_latest:
            self._clear_notification_state(task_id)

        _LOGGER.debug("Maintenance completed: %s on %s", task.name, self.maintenance_object.name)

        # Fire event after persistence — power users wire HA automations on
        # this; the integration's own action_listener also subscribes here
        # to dispatch the per-task on_complete_action service-call.
        self.hass.bus.async_fire(
            EVENT_TASK_COMPLETED,
            self._lifecycle_event_payload(
                task,
                task_id,
                notes=notes,
                cost=cost,
                duration=duration,
                feedback=feedback,
                completed_by=completed_by,
                # #133: the history entry's own timestamp — identical to what
                # the history records, so automations can attribute backdated
                # completions to the right period instead of time_fired.
                completed_at=effective_ts.isoformat(),
                # True when this completion was OLDER than the latest one (a
                # pure history backfill): the action listener skips
                # on_complete_action for those, and automations can filter.
                backfill=not is_latest,
            ),
        )

    async def async_auto_complete_on_recovery(self, task_id: str, trigger_value: float) -> None:
        """Record a completion because the task's trigger cleared itself (#53).

        Called from ``BaseTrigger._on_trigger_deactivated`` when the task opted
        in via ``trigger_config.auto_complete_on_recovery``: the sensor
        recovering (salt refilled, filter swapped) IS the maintenance being
        done, so ``last_performed`` and the time-between-services statistics
        should reflect it. Runs through the canonical complete path (history,
        adaptive learning, events, on_complete_action).
        """
        merged = self._get_merged_tasks_data()
        task_data = merged.get(task_id)
        if task_data is None:
            return
        # Inert tasks never auto-complete.
        if task_data.get("archived_at") is not None or task_data.get("enabled") is False:
            return
        # A paused object fires nothing — the periodic evaluator gates on this,
        # but this event-driven recovery path must too (else a paused object
        # whose sensor recovers records a real completion, defeating the pause).
        if self.entry.data.get(CONF_OBJECT, {}).get("paused_at") is not None:
            return
        # Race guard: if a completion was recorded moments ago (e.g. a manual
        # complete whose trigger reset crossed paths with a queued state
        # change), don't record a second one.
        history = task_data.get("history") or []
        for entry in reversed(history):
            if entry.get("type") != "completed":
                continue
            # parse_persisted_utc, NOT dt_util.parse_datetime: history can
            # hold NAIVE timestamps (the history-edit dialog sends
            # datetime-local without an offset), and `aware - naive` raised
            # TypeError OUTSIDE the old try — the recovery coroutine died and
            # the auto-completion was silently never recorded (bug audit
            # 2026-08-22). The UTC assumption is harmless for a 120 s guard.
            from .helpers.dates import parse_persisted_utc

            last_ts = parse_persisted_utc(entry.get("timestamp", ""))
            if last_ts is not None and (dt_util.utcnow() - last_ts).total_seconds() < 120:
                _LOGGER.debug(
                    "Skipping auto-complete for %s: completed %.0fs ago",
                    task_id,
                    (dt_util.utcnow() - last_ts).total_seconds(),
                )
                return
            break

        _LOGGER.info(
            "Auto-completing task %s on %s: trigger recovered (value: %s)",
            task_id,
            self.maintenance_object.name,
            trigger_value,
        )
        await self.complete_maintenance(
            task_id,
            notes=f"Auto-completed: sensor recovered ({trigger_value:g})",
            auto=True,
        )

    async def reset_maintenance(
        self,
        task_id: str,
        date: date | None = None,
    ) -> None:
        """Reset the last performed date of a task."""
        # A reset starts a new cycle — a following completion is a NEW
        # real-world action, never a double-tap of the previous one.
        self._recent_manual_completions.pop(task_id, None)
        self._clear_notification_state(task_id)
        merged = self._get_merged_tasks_data()
        if task_id not in merged:
            _LOGGER.error("Task %s not found in entry %s", task_id, self.entry.title)
            return

        task = MaintenanceTask.from_dict(merged[task_id])
        task.reset(reset_date=date)

        await self._persist_and_signal_task_change(task_id, task)

        _LOGGER.debug("Maintenance reset: %s on %s", task.name, self.maintenance_object.name)

        self.hass.bus.async_fire(
            EVENT_TASK_RESET,
            self._lifecycle_event_payload(
                task,
                task_id,
                reset_date=task.last_performed,
            ),
        )

    async def async_postpone_task(self, task_id: str, until: date) -> None:
        """Postpone just the current occurrence to ``until`` (per-occurrence
        defer). Sets a one-shot ``due_override`` that the next completion clears;
        the cadence is untouched."""
        merged = self._get_merged_tasks_data()
        if task_id not in merged:
            _LOGGER.error("Task %s not found in entry %s", task_id, self.entry.title)
            return
        task = MaintenanceTask.from_dict(merged[task_id])
        task.due_override = until.isoformat()
        await self._persist_and_signal_task_change(task_id, task)
        _LOGGER.debug("Occurrence postponed to %s: %s on %s", until, task.name, self.maintenance_object.name)

    def _clear_notification_state(self, task_id: str) -> None:
        """Forget the per-status notification bookkeeping for a task.

        The notification manager lives on the shared runtime; it may be absent
        in tests or during teardown - then there is nothing to clear.
        """
        from .const import NOTIFICATION_MANAGER_KEY

        nm = self.hass.data.get(DOMAIN, {}).get(NOTIFICATION_MANAGER_KEY)
        if nm is not None:
            nm.clear_task_state(self.entry.entry_id, task_id)

    async def skip_maintenance(
        self,
        task_id: str,
        reason: str | None = None,
        as_missed: bool = False,
    ) -> None:
        """Skip the current maintenance cycle for a task."""
        # Same as reset: skipping restarts the cycle — clear the double-tap
        # window so a follow-up completion counts.
        self._recent_manual_completions.pop(task_id, None)
        self._clear_notification_state(task_id)
        merged = self._get_merged_tasks_data()
        if task_id not in merged:
            _LOGGER.error("Task %s not found in entry %s", task_id, self.entry.title)
            return

        # #150: the per-task skip lock is enforced HERE — the choke point
        # every surface funnels through (WS, voice, vacation preview).
        if merged[task_id].get("allow_skip") is False:
            raise ServiceValidationError(
                f"Skipping is disabled for task {merged[task_id].get('name', task_id)!r}"
            )

        task = MaintenanceTask.from_dict(merged[task_id])
        # Skipping an already-overdue task means it lapsed → record it as MISSED
        # (not a deliberate skip). An explicit as_missed=True always wins.
        missed = as_missed or task.status == MaintenanceStatus.OVERDUE
        task.skip(reason=reason, as_missed=missed)
        # #73: skipping restarts the cycle — the ticks belong to the old one.
        self._store.clear_checklist_progress(task_id)

        await self._persist_and_signal_task_change(task_id, task)

        _LOGGER.debug("Maintenance skipped: %s on %s", task.name, self.maintenance_object.name)

        self.hass.bus.async_fire(
            EVENT_TASK_SKIPPED,
            self._lifecycle_event_payload(task, task_id, reason=reason),
        )


    async def async_refresh_now(self) -> None:
        """Recompute immediately — for changes a person just made.

        ``async_request_refresh`` is debounced, and Home Assistant's default
        window is **ten seconds** (``REQUEST_REFRESH_DEFAULT_COOLDOWN``). That
        is right for trigger-driven churn — a noisy sensor must not recompute
        the object on every state change — and wrong for a user action: any
        second action within that window had its request coalesced to the end
        of it, so the panel kept showing the old computed status for up to ten
        seconds and the change looked like it had done nothing.

        Assigning a user and then postponing the task was the reported case
        (#111 review, 2026-07-28), but nothing about it is specific to those
        two: completing two tasks on one object in quick succession, or any
        bulk action, hit the same window.

        The recompute covers one object's tasks, so doing it per user action is
        cheap; the debounced path stays exactly as it was for triggers.
        """
        await self.async_refresh()

    async def _persist_and_signal_task_change(
        self,
        task_id: str,
        task: MaintenanceTask,
    ) -> None:
        """Single source of truth for the post-mutation persistence dance.

        Used by complete/reset/skip — every path that mutates a task's
        dynamic state (last_performed, history) flows through here so the
        Store-vs-ConfigEntry split, the recently-completed marker, the
        dispatcher signal and the refresh request stay in lockstep.
        """
        # Dynamic state only → Store (no ConfigEntry write needed)
        self._persist_dynamic_state(task_id, task)
        await self._store.async_save()  # Flush immediately for user actions
        self._recently_completed[task_id] = time.monotonic()
        async_dispatcher_send(
            self.hass,
            SIGNAL_TASK_RESET.format(entry_id=self.entry.entry_id, task_id=task_id),
        )
        await self.async_refresh_now()

    def _lifecycle_event_payload(
        self,
        task: MaintenanceTask,
        task_id: str,
        **extra: Any,
    ) -> dict[str, Any]:
        """Build the common envelope shared by all task-lifecycle events.

        Guarantees that every EVENT_TASK_COMPLETED/SKIPPED/RESET payload
        carries the four identification keys (entry_id, task_id, task_name,
        object_name) — listeners can rely on them being present.
        Variant-specific fields (notes, cost, reason, reset_date, …) are
        passed via **extra.
        """
        return {
            "entry_id": self.entry.entry_id,
            "task_id": task_id,
            "task_name": task.name,
            "object_name": self.maintenance_object.name,
            **extra,
        }

    async def async_apply_suggested_interval(self, task_id: str, interval: int) -> None:
        """Apply a suggested interval to a task (static config → ConfigEntry)."""
        tasks_data = dict(self.entry.data.get(CONF_TASKS, {}))
        if task_id not in tasks_data:
            _LOGGER.error("Task %s not found in entry %s", task_id, self.entry.title)
            return

        task_dict = dict(tasks_data[task_id])
        fields = read_legacy_fields(task_dict)
        old_interval = fields["interval_days"]
        # The suggested interval is expressed in days; rebuild the recurrence as
        # a days interval (preserving the anchor) and store it nested. Adaptive
        # is gated to day-based tasks upstream, so this can't reinterpret a
        # weeks/months/years task.
        task_dict.pop("schedule", None)
        task_dict["schedule_type"] = "time_based"
        task_dict["interval_days"] = interval
        task_dict["interval_unit"] = "days"
        task_dict["interval_anchor"] = fields["interval_anchor"]
        task_dict = normalize_task_storage(task_dict)
        tasks_data[task_id] = task_dict

        await self._async_persist_tasks(tasks_data)

        _LOGGER.info(
            "Adaptive: interval %s→%s for task %s",
            old_interval,
            interval,
            task_id,
        )

    async def _async_persist_tasks(self, tasks_data: dict[str, Any]) -> None:
        """Persist updated task data to the config entry and refresh."""
        new_data = dict(self.entry.data)
        new_data[CONF_TASKS] = tasks_data
        self.hass.config_entries.async_update_entry(self.entry, data=new_data)
        await self.async_refresh_now()

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
        # Runtime state → per-entry Store file (debounced). Per-entity under
        # trigger_runtime[entity_id]; the legacy flat call (entity_id is None)
        # stores under a synthetic "_flat" key.
        self._store.set_trigger_runtime(task_id, entity_id or "_flat", runtime_data)
        if immediate:
            await self._store.async_save()
        else:
            self._store.async_delay_save()

        _LOGGER.debug(
            "Persisted trigger runtime data for task %s (entity=%s): %s",
            task_id,
            entity_id or "flat",
            runtime_data,
        )

    def register_calendar_entity(self, calendar_entity: MaintenanceCalendar) -> None:
        """Register the calendar entity for state updates."""
        self._calendar_entity = calendar_entity

    def register_todo_entity(self, todo_entity: MaintenanceTodoList) -> None:
        """Register the global to-do list entity for state updates."""
        self._todo_entity = todo_entity
