"""Global options flow for the Maintenance Supporter integration.

Contains GlobalOptionsFlow: menu-based global settings (notifications, budget, groups).
Split from config_flow_options.py for better maintainability.
"""

from __future__ import annotations

import logging
import re
from typing import Any
from uuid import uuid4

import voluptuous as vol

from homeassistant.config_entries import ConfigFlowResult, OptionsFlow
from homeassistant.core import HomeAssistant
from homeassistant.helpers import selector

from .const import (
    CONF_ACTION_COMPLETE_ENABLED,
    CONF_ACTION_SKIP_ENABLED,
    CONF_ACTION_SNOOZE_ENABLED,
    CONF_ADVANCED_ADAPTIVE,
    CONF_ADVANCED_BUDGET,
    CONF_ADVANCED_CHECKLISTS,
    CONF_ADVANCED_ENVIRONMENTAL,
    CONF_ADVANCED_GROUPS,
    CONF_ADVANCED_PREDICTIONS,
    CONF_ADVANCED_SEASONAL,
    CONF_BUDGET_ALERT_THRESHOLD,
    CONF_BUDGET_ALERTS_ENABLED,
    CONF_BUDGET_MONTHLY,
    CONF_BUDGET_YEARLY,
    CONF_DEFAULT_WARNING_DAYS,
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
    CONF_PANEL_ENABLED,
    CONF_QUIET_HOURS_ENABLED,
    CONF_QUIET_HOURS_END,
    CONF_QUIET_HOURS_START,
    CONF_SNOOZE_DURATION_HOURS,
    DEFAULT_MAX_NOTIFICATIONS_PER_DAY,
    DEFAULT_SNOOZE_DURATION_HOURS,
    DEFAULT_WARNING_DAYS,
)


_LOGGER = logging.getLogger(__name__)

_VALID_SERVICE_PART = re.compile(r"^[a-z0-9_]+$")


def validate_notify_service(
    raw: str, hass: HomeAssistant | None = None
) -> tuple[str, str | None]:
    """Normalize and validate a notify service string.

    Returns (normalized_value, error_key | None).
    """
    value = raw.strip()
    if not value:
        return ("", None)

    # Auto-fix: prepend "notify." if missing
    if "." not in value:
        value = f"notify.{value}"

    parts = value.split(".")
    if (
        len(parts) != 2
        or parts[0] != "notify"
        or not parts[1]
        or not _VALID_SERVICE_PART.match(parts[1])
    ):
        return (value, "invalid_notify_service")

    # Check service existence (only when hass available, i.e. options flow)
    if hass is not None and not hass.services.has_service(parts[0], parts[1]):
        return (value, "notify_service_not_found")

    return (value, None)


_TEST_NOTIFICATION_RESULTS: dict[str, dict[str, str]] = {
    "de": {
        "success": "✅ Testbenachrichtigung erfolgreich gesendet! Prüfen Sie Ihr Gerät.",
        "no_service": "⚠️ Kein Benachrichtigungsdienst konfiguriert. Bitte zuerst unter Allgemeine Einstellungen einen Dienst einrichten.",
        "invalid_service": "❌ Das Format des Benachrichtigungsdienstes ist ungültig. Verwenden Sie 'notify.dienstname'.",
        "failed": "❌ Testbenachrichtigung konnte nicht gesendet werden. Bitte prüfen Sie Ihre Konfiguration.",
        "push_message": "🔧 Testbenachrichtigung — Ihre Benachrichtigungseinrichtung funktioniert!",
    },
    "nl": {
        "success": "✅ Testmelding succesvol verzonden! Controleer uw apparaat.",
        "no_service": "⚠️ Geen meldingsservice geconfigureerd. Stel eerst een service in onder Algemene instellingen.",
        "invalid_service": "❌ Het formaat van de meldingsservice is ongeldig. Gebruik 'notify.servicenaam'.",
        "failed": "❌ Testmelding kon niet worden verzonden. Controleer uw configuratie.",
        "push_message": "🔧 Testmelding — uw meldingsinstellingen werken!",
    },
    "fr": {
        "success": "✅ Notification de test envoyée avec succès ! Vérifiez votre appareil.",
        "no_service": "⚠️ Aucun service de notification configuré. Veuillez d'abord configurer un service dans les paramètres généraux.",
        "invalid_service": "❌ Le format du service de notification est invalide. Utilisez 'notify.nom_du_service'.",
        "failed": "❌ Impossible d'envoyer la notification de test. Veuillez vérifier votre configuration.",
        "push_message": "🔧 Notification de test — votre configuration de notifications fonctionne !",
    },
    "it": {
        "success": "✅ Notifica di test inviata con successo! Controlla il tuo dispositivo.",
        "no_service": "⚠️ Nessun servizio di notifica configurato. Configura prima un servizio nelle impostazioni generali.",
        "invalid_service": "❌ Il formato del servizio di notifica non è valido. Usa 'notify.nome_servizio'.",
        "failed": "❌ Impossibile inviare la notifica di test. Verifica la tua configurazione.",
        "push_message": "🔧 Notifica di test — la configurazione delle notifiche funziona!",
    },
    "es": {
        "success": "✅ Notificación de prueba enviada con éxito. Revise su dispositivo.",
        "no_service": "⚠️ No hay servicio de notificación configurado. Configure primero un servicio en la configuración general.",
        "invalid_service": "❌ El formato del servicio de notificación no es válido. Use 'notify.nombre_servicio'.",
        "failed": "❌ No se pudo enviar la notificación de prueba. Verifique su configuración.",
        "push_message": "🔧 Notificación de prueba — ¡su configuración de notificaciones funciona!",
    },
    "en": {
        "success": "✅ Test notification sent successfully! Check your device.",
        "no_service": "⚠️ No notification service configured. Please configure a service in General Settings first.",
        "invalid_service": "❌ The notification service format is invalid. Use 'notify.service_name'.",
        "failed": "❌ Failed to send the test notification. Please verify your service configuration.",
        "push_message": "🔧 Test notification — your notification setup is working!",
    },
}


def _get_test_result_text(hass: HomeAssistant, key: str) -> str:
    """Get localized test notification result text."""
    lang = (getattr(hass.config, "language", None) or "en")[:2].lower()
    texts = _TEST_NOTIFICATION_RESULTS.get(lang, _TEST_NOTIFICATION_RESULTS["en"])
    return texts.get(key, texts.get("failed", key))


class GlobalOptionsFlow(OptionsFlow):
    """Handle global options with menu-based navigation."""

    @property
    def _current(self) -> dict[str, Any]:
        """Get current options."""
        return dict(self.config_entry.options or self.config_entry.data)

    def _save_and_return(self, user_input: dict[str, Any]) -> ConfigFlowResult:
        """Merge user input into options and return to the menu."""
        merged = self._current
        merged.update(user_input)
        self.hass.config_entries.async_update_entry(
            self.config_entry, options=merged
        )
        return self.async_show_menu(
            step_id="global_init",
            menu_options=self._menu_options(),
        )

    def _menu_options(self) -> list[str]:
        """Build dynamic menu options."""
        current = self._current
        options = ["general_settings", "advanced_features"]
        if current.get(CONF_ADVANCED_BUDGET, False):
            options.append("budget_settings")
        if current.get(CONF_ADVANCED_GROUPS, False):
            options.append("manage_groups")
        if current.get(CONF_NOTIFICATIONS_ENABLED, False):
            options.extend([
                "notification_settings",
                "notification_actions",
                "test_notification",
            ])
        options.append("done")
        return options

    # --- Menu ---

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Show global options menu."""
        return self.async_show_menu(
            step_id="global_init",
            menu_options=self._menu_options(),
        )

    async def async_step_global_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle menu selection redirect."""
        return await self.async_step_init()

    # Keep old step name as redirect for HA compatibility
    async def async_step_global_options(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Redirect old step name."""
        return await self.async_step_init()

    async def async_step_done(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Finish and close the options flow."""
        return self.async_create_entry(
            title="", data=self._current
        )

    # --- Advanced Features ---

    async def async_step_advanced_features(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Toggle visibility of advanced feature sections."""
        if user_input is not None:
            return self._save_and_return(user_input)

        current = self._current

        return self.async_show_form(
            step_id="advanced_features",
            data_schema=vol.Schema(
                {
                    vol.Optional(
                        CONF_ADVANCED_ADAPTIVE,
                        default=current.get(CONF_ADVANCED_ADAPTIVE, False),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_ADVANCED_PREDICTIONS,
                        default=current.get(CONF_ADVANCED_PREDICTIONS, False),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_ADVANCED_SEASONAL,
                        default=current.get(CONF_ADVANCED_SEASONAL, False),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_ADVANCED_ENVIRONMENTAL,
                        default=current.get(CONF_ADVANCED_ENVIRONMENTAL, False),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_ADVANCED_BUDGET,
                        default=current.get(CONF_ADVANCED_BUDGET, False),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_ADVANCED_GROUPS,
                        default=current.get(CONF_ADVANCED_GROUPS, False),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_ADVANCED_CHECKLISTS,
                        default=current.get(CONF_ADVANCED_CHECKLISTS, False),
                    ): selector.BooleanSelector(),
                }
            ),
        )

    # --- General Settings ---

    async def async_step_general_settings(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """General settings: warning days, notifications toggle, service, panel."""
        errors: dict[str, str] = {}

        if user_input is not None:
            raw_service = user_input.get(CONF_NOTIFY_SERVICE, "")
            normalized, error = validate_notify_service(raw_service, hass=self.hass)
            if error:
                errors[CONF_NOTIFY_SERVICE] = error
            else:
                user_input[CONF_NOTIFY_SERVICE] = normalized

            if not errors:
                return self._save_and_return(user_input)

        current = self._current

        return self.async_show_form(
            step_id="general_settings",
            data_schema=vol.Schema(
                {
                    vol.Optional(
                        CONF_DEFAULT_WARNING_DAYS,
                        default=current.get(CONF_DEFAULT_WARNING_DAYS, DEFAULT_WARNING_DAYS),
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=1, max=365, step=1, mode=selector.NumberSelectorMode.BOX
                        )
                    ),
                    vol.Optional(
                        CONF_NOTIFICATIONS_ENABLED,
                        default=current.get(CONF_NOTIFICATIONS_ENABLED, False),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_NOTIFY_SERVICE,
                        default=current.get(CONF_NOTIFY_SERVICE, ""),
                    ): selector.TextSelector(
                        selector.TextSelectorConfig(type=selector.TextSelectorType.TEXT)
                    ),
                    vol.Optional(
                        CONF_PANEL_ENABLED,
                        default=current.get(CONF_PANEL_ENABLED, False),
                    ): selector.BooleanSelector(),
                }
            ),
            errors=errors,
        )

    # --- Notification Settings ---

    async def async_step_notification_settings(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Per-status notification toggles, intervals, quiet hours, daily limit."""
        if user_input is not None:
            return self._save_and_return(user_input)

        current = self._current

        return self.async_show_form(
            step_id="notification_settings",
            data_schema=vol.Schema(
                {
                    # --- Due Soon ---
                    vol.Optional(
                        CONF_NOTIFY_DUE_SOON_ENABLED,
                        default=current.get(CONF_NOTIFY_DUE_SOON_ENABLED, True),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_NOTIFY_DUE_SOON_INTERVAL,
                        default=current.get(CONF_NOTIFY_DUE_SOON_INTERVAL, 24),
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=0, max=168, step=1, mode=selector.NumberSelectorMode.BOX
                        )
                    ),
                    # --- Overdue ---
                    vol.Optional(
                        CONF_NOTIFY_OVERDUE_ENABLED,
                        default=current.get(CONF_NOTIFY_OVERDUE_ENABLED, True),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_NOTIFY_OVERDUE_INTERVAL,
                        default=current.get(CONF_NOTIFY_OVERDUE_INTERVAL, 12),
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=0, max=168, step=1, mode=selector.NumberSelectorMode.BOX
                        )
                    ),
                    # --- Triggered ---
                    vol.Optional(
                        CONF_NOTIFY_TRIGGERED_ENABLED,
                        default=current.get(CONF_NOTIFY_TRIGGERED_ENABLED, True),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_NOTIFY_TRIGGERED_INTERVAL,
                        default=current.get(CONF_NOTIFY_TRIGGERED_INTERVAL, 0),
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=0, max=168, step=1, mode=selector.NumberSelectorMode.BOX
                        )
                    ),
                    # --- Quiet Hours ---
                    vol.Optional(
                        CONF_QUIET_HOURS_ENABLED,
                        default=current.get(CONF_QUIET_HOURS_ENABLED, True),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_QUIET_HOURS_START,
                        default=current.get(CONF_QUIET_HOURS_START, "22:00"),
                    ): selector.TimeSelector(),
                    vol.Optional(
                        CONF_QUIET_HOURS_END,
                        default=current.get(CONF_QUIET_HOURS_END, "08:00"),
                    ): selector.TimeSelector(),
                    # --- Daily Limit ---
                    vol.Optional(
                        CONF_MAX_NOTIFICATIONS_PER_DAY,
                        default=current.get(
                            CONF_MAX_NOTIFICATIONS_PER_DAY, DEFAULT_MAX_NOTIFICATIONS_PER_DAY
                        ),
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=0, max=100, step=1, mode=selector.NumberSelectorMode.BOX
                        )
                    ),
                    # --- Bundling ---
                    vol.Optional(
                        CONF_NOTIFICATION_BUNDLING_ENABLED,
                        default=current.get(CONF_NOTIFICATION_BUNDLING_ENABLED, False),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_NOTIFICATION_BUNDLE_THRESHOLD,
                        default=current.get(CONF_NOTIFICATION_BUNDLE_THRESHOLD, 2),
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=2, max=20, step=1, mode=selector.NumberSelectorMode.BOX
                        )
                    ),
                }
            ),
        )

    # --- Notification Actions ---

    async def async_step_notification_actions(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Interactive action buttons for mobile notifications."""
        if user_input is not None:
            return self._save_and_return(user_input)

        current = self._current

        return self.async_show_form(
            step_id="notification_actions",
            data_schema=vol.Schema(
                {
                    vol.Optional(
                        CONF_ACTION_COMPLETE_ENABLED,
                        default=current.get(CONF_ACTION_COMPLETE_ENABLED, False),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_ACTION_SKIP_ENABLED,
                        default=current.get(CONF_ACTION_SKIP_ENABLED, False),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_ACTION_SNOOZE_ENABLED,
                        default=current.get(CONF_ACTION_SNOOZE_ENABLED, False),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_SNOOZE_DURATION_HOURS,
                        default=current.get(
                            CONF_SNOOZE_DURATION_HOURS, DEFAULT_SNOOZE_DURATION_HOURS
                        ),
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=1, max=72, step=1, mode=selector.NumberSelectorMode.BOX
                        )
                    ),
                }
            ),
        )

    # --- Test Notification ---

    async def async_step_test_notification(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Send a test notification and show the result."""
        if user_input is not None:
            # User acknowledged the result — return to menu
            return self.async_show_menu(
                step_id="global_init",
                menu_options=self._menu_options(),
            )

        # First call: send the test notification
        current = self._current
        notify_service = current.get(CONF_NOTIFY_SERVICE, "")

        if not notify_service:
            result_key = "no_service"
        else:
            normalized, error = validate_notify_service(
                notify_service, hass=self.hass
            )
            if error:
                result_key = "invalid_service"
            else:
                try:
                    parts = normalized.split(".")
                    push_msg = _get_test_result_text(self.hass, "push_message")
                    await self.hass.services.async_call(
                        parts[0],
                        parts[1],
                        {
                            "title": "Maintenance Supporter",
                            "message": push_msg,
                        },
                        blocking=True,
                    )
                    result_key = "success"
                except Exception:
                    _LOGGER.debug(
                        "Test notification failed for %s", notify_service, exc_info=True
                    )
                    result_key = "failed"

        result_text = _get_test_result_text(self.hass, result_key)

        return self.async_show_form(
            step_id="test_notification",
            data_schema=vol.Schema({}),
            description_placeholders={"result": result_text},
        )

    # --- Budget Settings ---

    async def async_step_budget_settings(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Budget settings: monthly/yearly budget, alerts."""
        if user_input is not None:
            return self._save_and_return(user_input)

        current = self._current

        return self.async_show_form(
            step_id="budget_settings",
            data_schema=vol.Schema(
                {
                    vol.Optional(
                        CONF_BUDGET_MONTHLY,
                        default=current.get(CONF_BUDGET_MONTHLY, 0.0),
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=0, max=100000, step=0.01,
                            mode=selector.NumberSelectorMode.BOX,
                            unit_of_measurement="€",
                        )
                    ),
                    vol.Optional(
                        CONF_BUDGET_YEARLY,
                        default=current.get(CONF_BUDGET_YEARLY, 0.0),
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=0, max=1000000, step=0.01,
                            mode=selector.NumberSelectorMode.BOX,
                            unit_of_measurement="€",
                        )
                    ),
                    vol.Optional(
                        CONF_BUDGET_ALERTS_ENABLED,
                        default=current.get(CONF_BUDGET_ALERTS_ENABLED, False),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_BUDGET_ALERT_THRESHOLD,
                        default=current.get(CONF_BUDGET_ALERT_THRESHOLD, 80),
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=10, max=100, step=5,
                            mode=selector.NumberSelectorMode.SLIDER,
                            unit_of_measurement="%",
                        )
                    ),
                }
            ),
        )

    # --- Manage Groups ---

    async def async_step_manage_groups(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """List and manage maintenance groups."""
        from .const import CONF_GROUPS  # noqa: PLC0415

        current = self._current
        groups = current.get(CONF_GROUPS, {})

        if user_input is not None:
            selected = user_input.get("selected_group")
            if selected == "_add_new":
                return await self.async_step_add_group()
            if selected and selected in groups:
                return await self._delete_group(selected)

        if not groups:
            # No groups yet — go directly to add
            return await self.async_step_add_group()

        options = [
            selector.SelectOptionDict(
                value=gid,
                label=f"{gdata.get('name', gid)} ({len(gdata.get('task_refs', []))} tasks)",
            )
            for gid, gdata in groups.items()
        ]
        options.append(
            selector.SelectOptionDict(value="_add_new", label="+ Add New Group")
        )

        return self.async_show_form(
            step_id="manage_groups",
            data_schema=vol.Schema(
                {
                    vol.Required("selected_group"): selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=options,
                            mode=selector.SelectSelectorMode.LIST,
                        )
                    ),
                }
            ),
        )

    async def async_step_add_group(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Add a new maintenance group."""
        from .const import CONF_GROUPS  # noqa: PLC0415

        if user_input is not None:
            group_name = user_input.get("group_name", "").strip()
            if group_name:
                group_id = uuid4().hex
                merged = self._current
                groups = dict(merged.get(CONF_GROUPS, {}))
                groups[group_id] = {
                    "name": group_name,
                    "description": user_input.get("group_description", ""),
                    "task_refs": [],
                }
                merged[CONF_GROUPS] = groups
                self.hass.config_entries.async_update_entry(
                    self.config_entry, options=merged
                )
            return self.async_show_menu(
                step_id="global_init",
                menu_options=self._menu_options(),
            )

        return self.async_show_form(
            step_id="add_group",
            data_schema=vol.Schema(
                {
                    vol.Required("group_name"): selector.TextSelector(
                        selector.TextSelectorConfig(
                            type=selector.TextSelectorType.TEXT
                        )
                    ),
                    vol.Optional("group_description", default=""): selector.TextSelector(
                        selector.TextSelectorConfig(
                            type=selector.TextSelectorType.TEXT,
                            multiline=True,
                        )
                    ),
                }
            ),
        )

    async def _delete_group(self, group_id: str) -> ConfigFlowResult:
        """Delete a group and return to menu."""
        from .const import CONF_GROUPS  # noqa: PLC0415

        merged = self._current
        groups = dict(merged.get(CONF_GROUPS, {}))
        groups.pop(group_id, None)
        merged[CONF_GROUPS] = groups
        self.hass.config_entries.async_update_entry(
            self.config_entry, options=merged
        )
        return self.async_show_menu(
            step_id="global_init",
            menu_options=self._menu_options(),
        )
