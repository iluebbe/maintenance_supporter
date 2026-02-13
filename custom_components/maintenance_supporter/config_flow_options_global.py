"""Global options flow for the Maintenance Supporter integration.

Contains GlobalOptionsFlow: menu-based global settings (notifications, budget, groups).
Split from config_flow_options.py for better maintainability.
"""

from __future__ import annotations

from typing import Any
from uuid import uuid4

import voluptuous as vol

from homeassistant.config_entries import ConfigFlowResult, OptionsFlow
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
            options.extend(["notification_settings", "notification_actions"])
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
        if user_input is not None:
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
