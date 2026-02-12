"""Notification manager for maintenance reminders."""

from __future__ import annotations

import logging
from datetime import date, datetime, time, timedelta
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.util import dt as dt_util

from ..const import (
    CONF_ACTION_COMPLETE_ENABLED,
    CONF_ACTION_SKIP_ENABLED,
    CONF_ACTION_SNOOZE_ENABLED,
    CONF_BUDGET_ALERT_THRESHOLD,
    CONF_BUDGET_ALERTS_ENABLED,
    CONF_BUDGET_MONTHLY,
    CONF_BUDGET_YEARLY,
    CONF_MAX_NOTIFICATIONS_PER_DAY,
    CONF_NOTIFICATION_BUNDLING_ENABLED,
    CONF_NOTIFICATION_BUNDLE_THRESHOLD,
    CONF_NOTIFICATIONS_ENABLED,
    CONF_NOTIFY_DUE_SOON_ENABLED,
    CONF_NOTIFY_DUE_SOON_INTERVAL,
    CONF_NOTIFY_OVERDUE_ENABLED,
    CONF_NOTIFY_OVERDUE_INTERVAL,
    CONF_NOTIFY_SERVICE,
    CONF_NOTIFY_TRIGGERED_ENABLED,
    CONF_NOTIFY_TRIGGERED_INTERVAL,
    CONF_QUIET_HOURS_ENABLED,
    CONF_QUIET_HOURS_END,
    CONF_QUIET_HOURS_START,
    CONF_SNOOZE_DURATION_HOURS,
    DEFAULT_MAX_NOTIFICATIONS_PER_DAY,
    DEFAULT_SNOOZE_DURATION_HOURS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceStatus,
)

_LOGGER = logging.getLogger(__name__)

# Sentinel value: interval=0 means "notify once, never repeat"
_SENT_ONCE = datetime.max

# --- Notification message translations ---
_NOTIFICATION_STRINGS: dict[str, dict[str, str]] = {
    "de": {
        "due_soon_title": "Wartung bald fällig",
        "due_soon_message": "{task} für {object} ist in {days} Tag(en) fällig (Fällig: {due}).",
        "overdue_title": "Wartung überfällig!",
        "overdue_message": "{task} für {object} ist {days} Tag(e) überfällig!",
        "triggered_title": "Wartung ausgelöst",
        "triggered_message": "{task} für {object} wurde durch Sensordaten ausgelöst.",
        "action_complete": "Erledigt",
        "action_skip": "Überspringen",
        "action_snooze": "Später",
        "bundled_title": "Wartung: {count} Aufgaben",
        "bundled_message": "{object}: {task_list}",
        "bundled_overdue": "{task} (überfällig)",
        "bundled_due_soon": "{task} (bald fällig)",
        "bundled_triggered": "{task} (ausgelöst)",
        "budget_alert_title": "Wartungsbudget-Warnung",
        "budget_alert_monthly": "Monatsbudget zu {pct}% ausgeschöpft ({spent} von {budget})",
        "budget_alert_yearly": "Jahresbudget zu {pct}% ausgeschöpft ({spent} von {budget})",
    },
    "en": {
        "due_soon_title": "Maintenance Due Soon",
        "due_soon_message": "{task} for {object} is due in {days} day(s) (Due: {due}).",
        "overdue_title": "Maintenance Overdue!",
        "overdue_message": "{task} for {object} is {days} day(s) overdue!",
        "triggered_title": "Maintenance Triggered",
        "triggered_message": "{task} for {object} has been triggered by sensor data.",
        "action_complete": "Complete",
        "action_skip": "Skip",
        "action_snooze": "Snooze",
        "bundled_title": "Maintenance: {count} tasks",
        "bundled_message": "{object}: {task_list}",
        "bundled_overdue": "{task} (overdue)",
        "bundled_due_soon": "{task} (due soon)",
        "bundled_triggered": "{task} (triggered)",
        "budget_alert_title": "Maintenance Budget Warning",
        "budget_alert_monthly": "Monthly budget at {pct}% ({spent} of {budget})",
        "budget_alert_yearly": "Yearly budget at {pct}% ({spent} of {budget})",
    },
}


def _notif_t(key: str, lang: str, **kwargs: str) -> str:
    """Get notification translation string."""
    strings = _NOTIFICATION_STRINGS.get(lang, _NOTIFICATION_STRINGS["en"])
    text = strings.get(key, _NOTIFICATION_STRINGS["en"].get(key, key))
    if kwargs:
        text = text.format(**kwargs)
    return text


# Per-status config mapping
_STATUS_ENABLED_KEYS: dict[str, str] = {
    MaintenanceStatus.DUE_SOON: CONF_NOTIFY_DUE_SOON_ENABLED,
    MaintenanceStatus.OVERDUE: CONF_NOTIFY_OVERDUE_ENABLED,
    MaintenanceStatus.TRIGGERED: CONF_NOTIFY_TRIGGERED_ENABLED,
}

_STATUS_INTERVAL_KEYS: dict[str, tuple[str, int]] = {
    MaintenanceStatus.DUE_SOON: (CONF_NOTIFY_DUE_SOON_INTERVAL, 24),
    MaintenanceStatus.OVERDUE: (CONF_NOTIFY_OVERDUE_INTERVAL, 12),
    MaintenanceStatus.TRIGGERED: (CONF_NOTIFY_TRIGGERED_INTERVAL, 0),
}


class NotificationManager:
    """Manages maintenance notifications and reminders."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the notification manager."""
        self.hass = hass
        self._last_notified: dict[str, datetime] = {}
        self._snoozed_until: dict[str, datetime] = {}
        self._daily_count: int = 0
        self._daily_reset_date: date | None = None

    @property
    def _global_options(self) -> dict[str, Any]:
        """Get global options from the global config entry."""
        for entry in self.hass.config_entries.async_entries(DOMAIN):
            if entry.unique_id == GLOBAL_UNIQUE_ID:
                return entry.options or entry.data
        return {}

    @property
    def _lang(self) -> str:
        """Get the HA system language."""
        return self.hass.config.language or "en"

    @property
    def enabled(self) -> bool:
        """Check if notifications are globally enabled."""
        return self._global_options.get(CONF_NOTIFICATIONS_ENABLED, False)

    @property
    def notify_service(self) -> str:
        """Get the configured notify service."""
        return self._global_options.get(CONF_NOTIFY_SERVICE, "")

    def _is_status_enabled(self, status: str) -> bool:
        """Check if notifications for this specific status are enabled."""
        key = _STATUS_ENABLED_KEYS.get(status)
        if key is None:
            return False
        return self._global_options.get(key, True)

    def _get_interval_hours(self, status: str) -> int:
        """Get repeat interval for a status. 0 = single notification."""
        entry = _STATUS_INTERVAL_KEYS.get(status)
        if entry is None:
            return 24
        key, default = entry
        return int(self._global_options.get(key, default))

    def _is_quiet_hours(self) -> bool:
        """Check if current time is in quiet hours."""
        options = self._global_options

        # Quiet hours are opt-in (default: disabled)
        if not options.get(CONF_QUIET_HOURS_ENABLED, False):
            return False

        start_str = options.get(CONF_QUIET_HOURS_START, "22:00")
        end_str = options.get(CONF_QUIET_HOURS_END, "08:00")

        try:
            start = time.fromisoformat(start_str)
            end = time.fromisoformat(end_str)
        except (ValueError, TypeError):
            return False

        now = dt_util.now().time()

        if start <= end:
            return start <= now <= end
        # Overnight quiet hours (e.g., 22:00 - 08:00)
        return now >= start or now <= end

    def _check_daily_limit(self) -> bool:
        """Check if daily notification limit has been reached."""
        today = dt_util.now().date()
        if self._daily_reset_date != today:
            self._daily_count = 0
            self._daily_reset_date = today

        max_per_day = self._global_options.get(
            CONF_MAX_NOTIFICATIONS_PER_DAY, DEFAULT_MAX_NOTIFICATIONS_PER_DAY
        )
        if max_per_day > 0 and self._daily_count >= max_per_day:
            _LOGGER.debug(
                "Daily notification limit reached (%s/%s)", self._daily_count, max_per_day
            )
            return False
        return True

    def _is_snoozed(self, key: str) -> bool:
        """Check if a notification key is snoozed."""
        until = self._snoozed_until.get(key)
        if until is None:
            return False
        if dt_util.now() >= until:
            # Snooze expired
            del self._snoozed_until[key]
            return False
        return True

    def snooze_task(self, entry_id: str, task_id: str) -> None:
        """Snooze all notifications for a task."""
        hours = self._global_options.get(
            CONF_SNOOZE_DURATION_HOURS, DEFAULT_SNOOZE_DURATION_HOURS
        )
        until = dt_util.now() + timedelta(hours=hours)
        # Snooze for all status types
        for status in (MaintenanceStatus.DUE_SOON, MaintenanceStatus.OVERDUE, MaintenanceStatus.TRIGGERED):
            key = f"{entry_id}_{task_id}_{status}"
            self._snoozed_until[key] = until
        _LOGGER.debug(
            "Snoozed task %s for %s hours (until %s)", task_id, hours, until
        )

    async def async_task_status_changed(
        self,
        entry_id: str,
        task_id: str,
        task_name: str,
        object_name: str,
        old_status: str | None,
        new_status: str,
        days_until_due: int | None = None,
        next_due: str | None = None,
        entity_id: str | None = None,
    ) -> None:
        """Handle status change / repeat check and send notification if appropriate."""
        if not self.enabled or not self.notify_service:
            return

        # Only notify for certain statuses
        if new_status not in _STATUS_ENABLED_KEYS:
            return

        # Check if this status is enabled
        if not self._is_status_enabled(new_status):
            return

        # Check quiet hours
        if self._is_quiet_hours():
            _LOGGER.debug("Skipping notification during quiet hours")
            return

        # Rate limiting / interval
        key = f"{entry_id}_{task_id}_{new_status}"

        # Check snooze
        if self._is_snoozed(key):
            _LOGGER.debug("Notification snoozed for %s", key)
            return

        interval_hours = self._get_interval_hours(new_status)

        if key in self._last_notified:
            last = self._last_notified[key]
            if last == _SENT_ONCE:
                # interval=0: already sent once, never repeat
                return
            elapsed = (dt_util.now() - last).total_seconds()
            if interval_hours > 0 and elapsed < interval_hours * 3600:
                return
            # interval=0 but hasn't been sent yet → allow

        # Check daily limit
        if not self._check_daily_limit():
            return

        # Build translated message
        lang = self._lang
        title, message = self._build_message(
            new_status, lang, task_name, object_name, days_until_due, next_due
        )

        # Send notification
        success = await self._async_send_notification(
            title=title,
            message=message,
            entry_id=entry_id,
            task_id=task_id,
        )

        if not success:
            return

        # Record send time (only on success)
        if interval_hours == 0:
            self._last_notified[key] = _SENT_ONCE
        else:
            self._last_notified[key] = dt_util.now()
        self._daily_count += 1

        _LOGGER.debug("Notification sent: %s - %s", title, message)

    def _build_message(
        self,
        status: str,
        lang: str,
        task_name: str,
        object_name: str,
        days_until_due: int | None,
        next_due: str | None,
    ) -> tuple[str, str]:
        """Build translated notification title and message."""
        if status == MaintenanceStatus.DUE_SOON:
            title = _notif_t("due_soon_title", lang)
            message = _notif_t(
                "due_soon_message",
                lang,
                task=task_name,
                object=object_name,
                days=str(days_until_due or "?"),
                due=next_due or "?",
            )
        elif status == MaintenanceStatus.OVERDUE:
            title = _notif_t("overdue_title", lang)
            days_overdue = str(abs(days_until_due)) if days_until_due is not None else "?"
            message = _notif_t(
                "overdue_message",
                lang,
                task=task_name,
                object=object_name,
                days=days_overdue,
            )
        elif status == MaintenanceStatus.TRIGGERED:
            title = _notif_t("triggered_title", lang)
            message = _notif_t(
                "triggered_message",
                lang,
                task=task_name,
                object=object_name,
            )
        else:
            title = "Maintenance"
            message = f"{task_name} ({object_name})"

        return title, message

    async def _async_send_notification(
        self,
        title: str,
        message: str,
        entry_id: str,
        task_id: str,
    ) -> bool:
        """Send notification via configured service, optionally with action buttons.

        Returns True if the notification was sent successfully, False otherwise.
        """
        options = self._global_options
        lang = self._lang

        # Build action buttons for Companion App
        actions: list[dict[str, str]] = []
        if options.get(CONF_ACTION_COMPLETE_ENABLED, False):
            actions.append({
                "action": f"MS_COMPLETE_{entry_id}_{task_id}",
                "title": f"\u2705 {_notif_t('action_complete', lang)}",
            })
        if options.get(CONF_ACTION_SKIP_ENABLED, False):
            actions.append({
                "action": f"MS_SKIP_{entry_id}_{task_id}",
                "title": f"\u23ed\ufe0f {_notif_t('action_skip', lang)}",
            })
        if options.get(CONF_ACTION_SNOOZE_ENABLED, False):
            actions.append({
                "action": f"MS_SNOOZE_{entry_id}_{task_id}",
                "title": f"\U0001f4a4 {_notif_t('action_snooze', lang)}",
            })

        service_data: dict[str, Any] = {"title": title, "message": message}
        if actions:
            service_data["data"] = {
                "actions": actions[:3],  # Android supports max 3
                "tag": f"maintenance_{task_id}",
            }

        try:
            service_parts = self.notify_service.split(".")
            if len(service_parts) == 2:
                await self.hass.services.async_call(
                    service_parts[0],
                    service_parts[1],
                    service_data,
                    blocking=False,
                )
                return True
            _LOGGER.warning("Invalid notify service format: %s", self.notify_service)
            return False
        except (HomeAssistantError, ValueError, TypeError):
            _LOGGER.exception("Failed to send notification")
            return False

    async def async_send_bundled(
        self,
        entry_id: str,
        object_name: str,
        tasks: list[dict[str, Any]],
    ) -> None:
        """Send a single bundled notification summarising multiple tasks."""
        if not self.enabled or not self.notify_service:
            return

        if self._is_quiet_hours():
            return

        # Rate-limit bundled notifications (once per hour)
        bundle_key = f"{entry_id}_bundled"
        if bundle_key in self._last_notified:
            last = self._last_notified[bundle_key]
            if last != _SENT_ONCE:
                elapsed = (dt_util.now() - last).total_seconds()
                if elapsed < 3600:
                    return

        if not self._check_daily_limit():
            return

        lang = self._lang
        status_key_map = {
            MaintenanceStatus.OVERDUE: "bundled_overdue",
            MaintenanceStatus.DUE_SOON: "bundled_due_soon",
            MaintenanceStatus.TRIGGERED: "bundled_triggered",
        }

        task_parts: list[str] = []
        for t in tasks:
            key = status_key_map.get(t["status"], "bundled_due_soon")
            task_parts.append(_notif_t(key, lang, task=t["task_name"]))

        title = _notif_t("bundled_title", lang, count=str(len(tasks)))
        message = _notif_t(
            "bundled_message", lang, object=object_name, task_list=", ".join(task_parts)
        )

        service_data: dict[str, Any] = {
            "title": title,
            "message": message,
            "data": {"tag": f"maintenance_bundled_{entry_id}"},
        }

        try:
            service_parts = self.notify_service.split(".")
            if len(service_parts) == 2:
                await self.hass.services.async_call(
                    service_parts[0],
                    service_parts[1],
                    service_data,
                    blocking=False,
                )
                self._last_notified[bundle_key] = dt_util.now()
                self._daily_count += 1
                _LOGGER.debug("Bundled notification sent: %s - %s", title, message)
        except (HomeAssistantError, ValueError, TypeError):
            _LOGGER.exception("Failed to send bundled notification")

    async def async_budget_alert(
        self,
        period: str,
        spent: float,
        budget: float,
    ) -> None:
        """Send a budget threshold alert notification."""
        if not self.enabled or not self.notify_service:
            return

        if self._is_quiet_hours():
            return

        # Rate-limit budget alerts (once per 24 hours per period)
        budget_key = f"_budget_{period}"
        if budget_key in self._last_notified:
            last = self._last_notified[budget_key]
            if last != _SENT_ONCE:
                elapsed = (dt_util.now() - last).total_seconds()
                if elapsed < 86400:  # 24 hours
                    return

        if not self._check_daily_limit():
            return

        pct = round(spent / budget * 100) if budget > 0 else 0
        lang = self._lang
        title = _notif_t("budget_alert_title", lang)
        key = f"budget_alert_{period}"
        message = _notif_t(
            key, lang,
            pct=str(pct),
            spent=f"{spent:.2f}",
            budget=f"{budget:.2f}",
        )

        service_data: dict[str, Any] = {
            "title": title,
            "message": message,
            "data": {"tag": f"maintenance_budget_{period}"},
        }

        try:
            service_parts = self.notify_service.split(".")
            if len(service_parts) == 2:
                await self.hass.services.async_call(
                    service_parts[0],
                    service_parts[1],
                    service_data,
                    blocking=False,
                )
                self._last_notified[budget_key] = dt_util.now()
                self._daily_count += 1
                _LOGGER.debug("Budget alert sent: %s - %s", title, message)
        except (HomeAssistantError, ValueError, TypeError):
            _LOGGER.exception("Failed to send budget alert")

    def clear_task_state(self, entry_id: str, task_id: str) -> None:
        """Clear notification state for a task (after completion/reset)."""
        for status in (MaintenanceStatus.DUE_SOON, MaintenanceStatus.OVERDUE, MaintenanceStatus.TRIGGERED):
            key = f"{entry_id}_{task_id}_{status}"
            self._last_notified.pop(key, None)
            self._snoozed_until.pop(key, None)

    async def async_unload(self) -> None:
        """Clean up the notification manager."""
        self._last_notified.clear()
        self._snoozed_until.clear()
        self._daily_count = 0
        self._daily_reset_date = None
