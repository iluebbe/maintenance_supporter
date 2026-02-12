"""DataUpdateCoordinator for the Maintenance Supporter integration."""

from __future__ import annotations

import logging
import time
from datetime import date, datetime, timedelta
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import issue_registry as ir
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator

from .const import (
    CONF_BUDGET_ALERT_THRESHOLD,
    CONF_BUDGET_ALERTS_ENABLED,
    CONF_BUDGET_MONTHLY,
    CONF_BUDGET_YEARLY,
    CONF_OBJECT,
    CONF_TASKS,
    DEFAULT_UPDATE_INTERVAL_MINUTES,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MISSING_ENTITY_THRESHOLD_REFRESHES,
    STARTUP_GRACE_PERIOD_SECONDS,
    HistoryEntryType,
    MaintenanceStatus,
    ScheduleType,
    TriggerEntityState,
)
from .models.maintenance_object import MaintenanceObject
from .models.maintenance_task import MaintenanceTask

_LOGGER = logging.getLogger(__name__)


class MaintenanceCoordinator(DataUpdateCoordinator[dict[str, Any]]):
    """Coordinator for a single maintenance object and its tasks."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        """Initialize the coordinator."""
        super().__init__(
            hass,
            _LOGGER,
            name=f"Maintenance Supporter ({entry.title})",
            update_interval=timedelta(minutes=DEFAULT_UPDATE_INTERVAL_MINUTES),
        )
        self.entry = entry
        self._calendar_entity = None  # Set by calendar platform
        self._previous_statuses: dict[str, str] = {}  # task_id -> status

        # Trigger entity availability tracking
        self._startup_time: float = time.monotonic()
        self._entity_missing_refresh_count: dict[str, int] = {}  # task_id -> count
        self._entity_unavailable_logged: dict[str, bool] = {}  # task_id -> logged?
        self._trigger_entity_states: dict[str, str] = {}  # task_id -> TriggerEntityState

    @property
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
        """Return all tasks from config entry data."""
        tasks_data = self.entry.data.get(CONF_TASKS, {})
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

        result: dict[str, Any] = {
            CONF_OBJECT: obj.to_dict(),
            CONF_TASKS: {},
        }

        for task_id, task in tasks.items():
            if not task.enabled:
                result[CONF_TASKS][task_id] = task.to_dict()
                result[CONF_TASKS][task_id]["_status"] = MaintenanceStatus.OK
                continue

            # Restore live trigger state from previous coordinator data
            prev_task = prev_tasks.get(task_id, {})
            if prev_task.get("_trigger_active", False):
                task._trigger_active = True
            if prev_task.get("_trigger_current_value") is not None:
                task._trigger_current_value = prev_task["_trigger_current_value"]

            # Check sensor-based triggers (fallback for threshold/counter)
            if (
                task.schedule_type == ScheduleType.SENSOR_BASED
                and task.trigger_config
            ):
                await self._evaluate_trigger_fallback(task)

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
                analysis_config["_current_month"] = datetime.now().month
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
                except Exception:  # noqa: BLE001
                    _LOGGER.debug(
                        "Sensor prediction failed for task %s",
                        task_id,
                        exc_info=True,
                    )

            result[CONF_TASKS][task_id] = task_result

        # Check for issues (repairs)
        await self._async_check_for_issues(tasks)

        # Send notifications for status changes
        await self._async_notify_status_changes(result[CONF_TASKS])

        # Check budget alerts
        await self._async_check_budget(result[CONF_TASKS])

        # Notify calendar entity if registered
        if self._calendar_entity is not None:
            self._calendar_entity.async_write_ha_state()

        return result

    async def _evaluate_trigger_fallback(self, task: MaintenanceTask) -> None:
        """Evaluate trigger state as fallback (main evaluation is event-driven).

        The event-driven triggers (in entity/triggers/) handle real-time state
        changes with features like for_minutes timers. This fallback ensures
        that the coordinator also evaluates the basic trigger condition during
        periodic refreshes, so the status is correct even if an event was missed.
        """
        if task.trigger_config is None:
            return

        trigger_entity_id = task.trigger_config.get("entity_id")
        if trigger_entity_id is None:
            return

        state = self.hass.states.get(trigger_entity_id)
        if state is None or state.state in ("unavailable", "unknown"):
            return

        # Read current value
        attribute = task.trigger_config.get("attribute")
        try:
            if attribute:
                raw_value = state.attributes.get(attribute)
            else:
                raw_value = state.state
            if raw_value is not None:
                task._trigger_current_value = float(raw_value)
        except (ValueError, TypeError):
            return

        # Evaluate basic trigger condition (without duration/timer logic)
        if task._trigger_current_value is None:
            return

        trigger_type = task.trigger_config.get("type")
        value = task._trigger_current_value

        if trigger_type == "threshold":
            above = task.trigger_config.get("trigger_above")
            below = task.trigger_config.get("trigger_below")
            exceeds = False
            if above is not None and value > above:
                exceeds = True
            if below is not None and value < below:
                exceeds = True

            for_minutes = task.trigger_config.get("trigger_for_minutes", 0)
            if exceeds and for_minutes == 0:
                # Immediate threshold: activate directly
                task._trigger_active = True
            elif not exceeds:
                # Value back in normal range: deactivate
                # (only if not managed by event-driven trigger with timer)
                if for_minutes == 0:
                    task._trigger_active = False

        elif trigger_type == "counter":
            target = task.trigger_config.get("trigger_target_value", 0)
            delta_mode = task.trigger_config.get("trigger_delta_mode", False)
            if delta_mode:
                baseline = task.trigger_config.get("trigger_baseline_value")
                if baseline is not None:
                    delta = value - baseline
                    task._trigger_active = delta >= target
            else:
                task._trigger_active = value >= target

        elif trigger_type == "state_change":
            # State change triggers are purely event-driven (count transitions)
            # The fallback cannot evaluate them, so we leave _trigger_active as-is
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
        """
        for task_id, task in tasks.items():
            if not task.enabled or task.trigger_config is None:
                continue

            trigger_entity_id = task.trigger_config.get("entity_id")
            if trigger_entity_id is None:
                continue

            issue_id = f"missing_trigger_{self.entry.entry_id}_{task_id}"
            state = self.hass.states.get(trigger_entity_id)

            if state is not None and state.state not in ("unavailable", "unknown"):
                # ✅ Entity exists and is available — all good
                self._trigger_entity_states[task_id] = TriggerEntityState.AVAILABLE
                self._entity_missing_refresh_count.pop(task_id, None)
                self._entity_unavailable_logged.pop(task_id, None)
                ir.async_delete_issue(self.hass, DOMAIN, issue_id)

            elif state is not None:
                # ⚠️ Entity exists but is unavailable/unknown — log once, no issue
                self._trigger_entity_states[task_id] = TriggerEntityState.UNAVAILABLE
                self._entity_missing_refresh_count.pop(task_id, None)

                if not self._entity_unavailable_logged.get(task_id, False):
                    _LOGGER.warning(
                        "Trigger entity %s for task '%s' is %s",
                        trigger_entity_id,
                        task.name,
                        state.state,
                    )
                    self._entity_unavailable_logged[task_id] = True

                # Clear issue if it existed (entity came back but is unavailable)
                ir.async_delete_issue(self.hass, DOMAIN, issue_id)

            elif self._in_startup_grace_period:
                # ⏳ Entity missing during startup — just wait
                self._trigger_entity_states[task_id] = TriggerEntityState.STARTUP
                _LOGGER.debug(
                    "Trigger entity %s not yet available (startup grace period), "
                    "skipping issue creation for task '%s'",
                    trigger_entity_id,
                    task.name,
                )

            else:
                # 🔍 Entity missing after startup grace period
                count = self._entity_missing_refresh_count.get(task_id, 0) + 1
                self._entity_missing_refresh_count[task_id] = count
                self._trigger_entity_states[task_id] = TriggerEntityState.MISSING

                if count < MISSING_ENTITY_THRESHOLD_REFRESHES:
                    # 📊 Still counting — entity might appear soon
                    _LOGGER.debug(
                        "Trigger entity %s missing for task '%s' "
                        "(refresh %d/%d before issue)",
                        trigger_entity_id,
                        task.name,
                        count,
                        MISSING_ENTITY_THRESHOLD_REFRESHES,
                    )
                else:
                    # 🔧 Confirmed missing — create repair issue with context data
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

    async def _async_notify_status_changes(
        self, task_results: dict[str, Any]
    ) -> None:
        """Check for status changes and send notifications.

        Calls the notification manager for any notifiable status, not just
        transitions.  The manager itself handles per-status rate limiting,
        snooze, quiet hours, and daily limits.
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

        # Collect all notifiable tasks
        notifiable: list[tuple[str, dict[str, Any], str]] = []
        for task_id, task_result in task_results.items():
            new_status = task_result.get("_status")
            if new_status in notify_statuses:
                notifiable.append((task_id, task_result, new_status))
            self._previous_statuses[task_id] = new_status

        if not notifiable:
            return

        # Check if bundling is enabled and threshold met
        from .const import (
            CONF_NOTIFICATION_BUNDLING_ENABLED,
            CONF_NOTIFICATION_BUNDLE_THRESHOLD,
            GLOBAL_UNIQUE_ID,
        )

        global_options: dict[str, Any] = {}
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
                    for tid, tr, status in notifiable
                ],
            )
        else:
            for task_id, task_result, new_status in notifiable:
                old_status = self._previous_statuses.get(task_id)
                await nm.async_task_status_changed(
                    entry_id=self.entry.entry_id,
                    task_id=task_id,
                    task_name=task_result.get("name", ""),
                    object_name=obj_name,
                    old_status=old_status,
                    new_status=new_status,
                    days_until_due=task_result.get("_days_until_due"),
                    next_due=task_result.get("_next_due"),
                )

    async def _async_check_budget(
        self, task_results: dict[str, Any]
    ) -> None:
        """Check budget thresholds and send alerts if exceeded."""
        from .helpers.notification_manager import NotificationManager

        nm = self.hass.data.get(DOMAIN, {}).get("_notification_manager")
        if not isinstance(nm, NotificationManager) or not nm.enabled:
            return

        global_options: dict[str, Any] = {}
        for entry in self.hass.config_entries.async_entries(DOMAIN):
            if entry.unique_id == GLOBAL_UNIQUE_ID:
                global_options = entry.options or entry.data
                break

        if not global_options.get(CONF_BUDGET_ALERTS_ENABLED, False):
            return

        threshold_pct = global_options.get(CONF_BUDGET_ALERT_THRESHOLD, 80) / 100.0
        monthly_budget = float(global_options.get(CONF_BUDGET_MONTHLY, 0))
        yearly_budget = float(global_options.get(CONF_BUDGET_YEARLY, 0))

        if monthly_budget <= 0 and yearly_budget <= 0:
            return

        # Sum costs across ALL coordinators (not just this one)
        from datetime import datetime as dt_cls

        now = dt_cls.now()
        monthly_spent = 0.0
        yearly_spent = 0.0

        for ce in self.hass.config_entries.async_entries(DOMAIN):
            if ce.unique_id == GLOBAL_UNIQUE_ID:
                continue
            tasks_data = ce.data.get(CONF_TASKS, {})
            for _tid, tdata in tasks_data.items():
                for h_entry in tdata.get("history", []):
                    if h_entry.get("type") != "completed":
                        continue
                    cost = h_entry.get("cost")
                    if cost is None:
                        continue
                    ts = h_entry.get("timestamp", "")
                    try:
                        entry_dt = dt_cls.fromisoformat(ts)
                    except (ValueError, TypeError):
                        continue
                    if entry_dt.year == now.year:
                        yearly_spent += cost
                        if entry_dt.month == now.month:
                            monthly_spent += cost

        # Check monthly
        if monthly_budget > 0 and monthly_spent >= monthly_budget * threshold_pct:
            await nm.async_budget_alert("monthly", monthly_spent, monthly_budget)

        # Check yearly
        if yearly_budget > 0 and yearly_spent >= yearly_budget * threshold_pct:
            await nm.async_budget_alert("yearly", yearly_spent, yearly_budget)

    # --- Mutation Methods ---

    async def async_add_trigger_history_entry(
        self,
        task_id: str,
        trigger_value: float | None = None,
    ) -> None:
        """Add a TRIGGERED history entry to a task and persist."""
        tasks_data = dict(self.entry.data.get(CONF_TASKS, {}))
        if task_id not in tasks_data:
            return

        task = MaintenanceTask.from_dict(tasks_data[task_id])
        task.add_history_entry(
            entry_type=HistoryEntryType.TRIGGERED,
            notes="Sensor trigger activated",
            trigger_value=trigger_value,
        )
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
    ) -> None:
        """Mark a task as completed and persist."""
        tasks_data = dict(self.entry.data.get(CONF_TASKS, {}))
        if task_id not in tasks_data:
            _LOGGER.error("Task %s not found in entry %s", task_id, self.entry.title)
            return

        task = MaintenanceTask.from_dict(tasks_data[task_id])

        # Compute actual interval before updating last_performed
        actual_interval: int | None = None
        if task.last_performed:
            try:
                last = date.fromisoformat(task.last_performed)
                actual_interval = (date.today() - last).days
            except (ValueError, TypeError):
                actual_interval = None

        task.complete(
            notes=notes, cost=cost, duration=duration,
            checklist_state=checklist_state, feedback=feedback,
        )

        # Update adaptive scheduling if enabled
        if task.adaptive_config and task.adaptive_config.get("enabled"):
            if actual_interval is not None and actual_interval > 0:
                from .helpers.interval_analyzer import IntervalAnalyzer

                analyzer = IntervalAnalyzer()
                # Store the base interval for blending reference
                if "base_interval" not in task.adaptive_config:
                    task.adaptive_config["base_interval"] = task.interval_days or 30
                # Inject hemisphere for seasonal awareness
                task.adaptive_config["hemisphere"] = (
                    "south" if self.hass.config.latitude < 0 else "north"
                )
                updated_config = analyzer.update_on_completion(
                    task.adaptive_config, actual_interval, feedback
                )
                task.adaptive_config = updated_config

        tasks_data[task_id] = task.to_dict()

        await self._async_persist_tasks(tasks_data)

        _LOGGER.info(
            "Maintenance completed: %s on %s", task.name, self.maintenance_object.name
        )

    async def reset_maintenance(
        self,
        task_id: str,
        date: date | None = None,
    ) -> None:
        """Reset the last performed date of a task."""
        tasks_data = dict(self.entry.data.get(CONF_TASKS, {}))
        if task_id not in tasks_data:
            _LOGGER.error("Task %s not found in entry %s", task_id, self.entry.title)
            return

        task = MaintenanceTask.from_dict(tasks_data[task_id])
        task.reset(reset_date=date)
        tasks_data[task_id] = task.to_dict()

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
        tasks_data = dict(self.entry.data.get(CONF_TASKS, {}))
        if task_id not in tasks_data:
            _LOGGER.error("Task %s not found in entry %s", task_id, self.entry.title)
            return

        task = MaintenanceTask.from_dict(tasks_data[task_id])
        task.skip(reason=reason)
        tasks_data[task_id] = task.to_dict()

        await self._async_persist_tasks(tasks_data)

        _LOGGER.info(
            "Maintenance skipped: %s on %s", task.name, self.maintenance_object.name
        )

    async def async_apply_suggested_interval(
        self, task_id: str, interval: int
    ) -> None:
        """Apply a suggested interval to a task."""
        tasks_data = dict(self.entry.data.get(CONF_TASKS, {}))
        if task_id not in tasks_data:
            _LOGGER.error("Task %s not found in entry %s", task_id, self.entry.title)
            return

        task = MaintenanceTask.from_dict(tasks_data[task_id])
        old_interval = task.interval_days
        task.interval_days = interval
        tasks_data[task_id] = task.to_dict()

        await self._async_persist_tasks(tasks_data)

        _LOGGER.info(
            "Adaptive: interval %s→%s for %s",
            old_interval, interval, task.name,
        )

    async def _async_persist_tasks(self, tasks_data: dict[str, Any]) -> None:
        """Persist updated task data to the config entry and refresh."""
        new_data = dict(self.entry.data)
        new_data[CONF_TASKS] = tasks_data
        self.hass.config_entries.async_update_entry(self.entry, data=new_data)
        await self.async_request_refresh()

    async def async_persist_trigger_runtime(
        self, task_id: str, runtime_data: dict[str, Any]
    ) -> None:
        """Persist trigger runtime values (baseline, change_count) to config entry.

        This is called by triggers to save values that must survive restarts.
        The values are stored inside the task's trigger_config dict.
        """
        tasks_data = dict(self.entry.data.get(CONF_TASKS, {}))
        if task_id not in tasks_data:
            return

        task_dict = dict(tasks_data[task_id])
        trigger_config = dict(task_dict.get("trigger_config", {}))

        for key, value in runtime_data.items():
            trigger_config[key] = value

        task_dict["trigger_config"] = trigger_config
        tasks_data[task_id] = task_dict

        new_data = dict(self.entry.data)
        new_data[CONF_TASKS] = tasks_data
        self.hass.config_entries.async_update_entry(self.entry, data=new_data)

        _LOGGER.debug(
            "Persisted trigger runtime data for task %s: %s",
            task_id,
            runtime_data,
        )

    def register_calendar_entity(self, calendar_entity: Any) -> None:
        """Register the calendar entity for state updates."""
        self._calendar_entity = calendar_entity
