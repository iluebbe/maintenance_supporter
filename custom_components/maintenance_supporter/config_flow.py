"""Config flow for the Maintenance Supporter integration."""

from __future__ import annotations

import logging
from typing import Any
from uuid import uuid4

import voluptuous as vol
from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlow,
)
from homeassistant.core import HomeAssistant, State, callback
from homeassistant.helpers import selector

from .config_flow_options_global import validate_notify_service
from .config_flow_schedule import ScheduleStepsMixin
from .config_flow_trigger import TriggerConfigMixin
from .const import (
    CONF_DEFAULT_WARNING_DAYS,
    CONF_NOTIFICATIONS_ENABLED,
    CONF_NOTIFY_SERVICE,
    CONF_OBJECT,
    CONF_OBJECT_AREA,
    CONF_OBJECT_DOCUMENTATION_URL,
    CONF_OBJECT_INSTALLATION_DATE,
    CONF_OBJECT_MANUFACTURER,
    CONF_OBJECT_MODEL,
    CONF_OBJECT_NAME,
    CONF_OBJECT_NOTES,
    CONF_OBJECT_SERIAL_NUMBER,
    CONF_OBJECT_WARRANTY_EXPIRY,
    CONF_TASKS,
    DEFAULT_WARNING_DAYS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from .helpers.global_options import get_global_entry
from .helpers.i18n import normalize_language
from .helpers.schedule import normalize_task_storage
from .helpers.task_fields import WARNING_DAYS_RANGE
from .helpers.template_usage import OBJECT_TEMPLATE_ID
from .templates import (
    TEMPLATE_CATEGORIES,
    ObjectTemplate,
    get_template_by_id,
    get_templates_by_category,
)

_LOGGER = logging.getLogger(__name__)


def _localized_template_default_name(template: ObjectTemplate, hass: HomeAssistant) -> str:
    """Localized prefill for the template-customize name field (v2.21.1)."""
    from .templates import localize_template_text

    return localize_template_text(template.name, normalize_language(hass)) or template.name


# 2.94: the template list marks templates the home already has an object for
# (the gallery's "Already set up" badge). Recommended ones carry a ★, which
# the step descriptions explain — a symbol needs no translation.
_TEMPLATE_STRINGS: dict[str, dict[str, str]] = {
    "en": {"set_up": "already set up"},
    "de": {"set_up": "bereits eingerichtet"},
    "cs": {"set_up": "již nastaveno"},
    "da": {"set_up": "allerede oprettet"},
    "es": {"set_up": "ya configurado"},
    "fi": {"set_up": "jo käytössä"},
    "fr": {"set_up": "déjà configuré"},
    "hi": {"set_up": "पहले से सेट है"},
    "hu": {"set_up": "már beállítva"},
    "it": {"set_up": "già configurato"},
    "ja": {"set_up": "設定済み"},
    "ko": {"set_up": "이미 설정됨"},
    "nb": {"set_up": "allerede satt opp"},
    "nl": {"set_up": "al ingesteld"},
    "pl": {"set_up": "już skonfigurowano"},
    "pt": {"set_up": "já configurado"},
    "pt-br": {"set_up": "já configurado"},
    "ru": {"set_up": "уже настроено"},
    "sv": {"set_up": "redan konfigurerad"},
    "tr": {"set_up": "zaten kurulu"},
    "uk": {"set_up": "уже налаштовано"},
    "zh": {"set_up": "已设置"},
}


class MaintenanceSupporterConfigFlow(ScheduleStepsMixin, TriggerConfigMixin, ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Maintenance Supporter."""

    VERSION = 1
    MINOR_VERSION = 6

    def __init__(self) -> None:
        """Initialize the config flow."""
        self._object_data: dict[str, Any] = {}
        self._tasks: dict[str, dict[str, Any]] = {}
        self._current_task: dict[str, Any] = {}
        self._trigger_entity_id: str | None = None
        self._trigger_entity_state: State | None = None
        self._template_category: str = ""
        self._selected_template: ObjectTemplate | None = None
        self._template_marks: dict[str, dict[str, Any]] | None = None

    async def _marks(self) -> dict[str, dict[str, Any]]:
        """Per template: recommended for this home / already set up / untypical
        for the dwelling — the gallery's judgement (templates.recommend_template,
        helpers.template_usage), worked out once per flow."""
        if self._template_marks is None:
            from .helpers.home_profile import async_home_profile
            from .helpers.template_usage import templates_in_use
            from .templates import TEMPLATES, recommend_template

            profile = await async_home_profile(self.hass)
            in_use = templates_in_use(self.hass)
            self._template_marks = {t.id: recommend_template(t, profile, set_up=t.id in in_use) for t in TEMPLATES}
        return self._template_marks

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Handle the initial step."""
        # Check if global entry exists
        if get_global_entry(self.hass) is None:
            return await self.async_step_global_setup()

        return self.async_show_menu(
            step_id="user",
            menu_options=["create_object", "create_from_template"],
        )

    async def async_step_global_setup(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Set up global configuration."""
        errors: dict[str, str] = {}

        if user_input is not None:
            # Validate notify service format (no hass check — services may not be loaded yet)
            raw_service = user_input.get(CONF_NOTIFY_SERVICE, "")
            normalized, error = validate_notify_service(raw_service)
            if error:
                errors[CONF_NOTIFY_SERVICE] = error

            if not errors:
                await self.async_set_unique_id(GLOBAL_UNIQUE_ID)
                self._abort_if_unique_id_configured()
                return self.async_create_entry(
                    title="Maintenance Supporter",
                    data={
                        CONF_DEFAULT_WARNING_DAYS: user_input.get(CONF_DEFAULT_WARNING_DAYS, DEFAULT_WARNING_DAYS),
                        CONF_NOTIFICATIONS_ENABLED: user_input.get(CONF_NOTIFICATIONS_ENABLED, False),
                        CONF_NOTIFY_SERVICE: normalized,
                    },
                )

        # Offer notify targets as a dropdown: legacy notify *services* (mobile_app
        # devices, notify groups) plus notify *entities* (newer model) — many
        # single devices appear only as an entity. send_message is the generic
        # action, not a target → excluded. custom_value keeps it free-text (the
        # format-only validation above never blocks on existence). Matches the
        # picker in the options flow + panel.
        notify_targets = {
            f"notify.{name}" for name in self.hass.services.async_services().get("notify", {}) if name != "send_message"
        }
        notify_targets.update(self.hass.states.async_entity_ids("notify"))
        notify_services = sorted(notify_targets)

        return self.async_show_form(
            step_id="global_setup",
            data_schema=vol.Schema(
                {
                    vol.Optional(CONF_DEFAULT_WARNING_DAYS, default=DEFAULT_WARNING_DAYS): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=WARNING_DAYS_RANGE[0],
                            max=WARNING_DAYS_RANGE[1],
                            step=1,
                            mode=selector.NumberSelectorMode.BOX,
                        )
                    ),
                    vol.Optional(CONF_NOTIFICATIONS_ENABLED, default=False): selector.BooleanSelector(),
                    vol.Optional(CONF_NOTIFY_SERVICE, default=""): selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=notify_services,
                            mode=selector.SelectSelectorMode.DROPDOWN,
                            custom_value=True,
                        )
                    ),
                }
            ),
            errors=errors,
        )

    async def async_step_import(self, import_data: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Programmatically (re)create the global entry with default settings.

        Used by the missing-global-entry repair flow to restore the global
        "Maintenance Supporter" configuration after it was deleted while object
        entries remained (which strips the summary sensors + panel). Aborts if a
        global entry already exists, so it's safe to trigger unconditionally.
        """
        await self.async_set_unique_id(GLOBAL_UNIQUE_ID)
        self._abort_if_unique_id_configured()
        return self.async_create_entry(
            title="Maintenance Supporter",
            data={
                CONF_DEFAULT_WARNING_DAYS: DEFAULT_WARNING_DAYS,
                CONF_NOTIFICATIONS_ENABLED: False,
                CONF_NOTIFY_SERVICE: "",
            },
        )

    async def async_step_create_from_template(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Step 1: Select a template category."""
        if user_input is not None:
            if user_input.get("go_back"):
                return await self.async_step_user()
            self._template_category = user_input["template_category"]
            return await self.async_step_template_select()

        from .templates import get_disabled_template_ids

        lang = normalize_language(self.hass)
        marks = await self._marks()
        disabled = get_disabled_template_ids(self.hass)
        options = []
        for cat_id, cat in TEMPLATE_CATEGORIES.items():
            label = cat.get(f"name_{lang}", cat["name_en"])
            # 2.94: how many templates of the category fit this home (★ = the
            # gallery's "Recommended for your home").
            recommended = sum(1 for t in get_templates_by_category(cat_id) if t.id not in disabled and marks[t.id]["recommended"])
            options.append(selector.SelectOptionDict(value=cat_id, label=f"{label} ★ {recommended}" if recommended else label))

        return self.async_show_form(
            step_id="create_from_template",
            data_schema=vol.Schema(
                {
                    vol.Required("template_category"): selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=options,
                            mode=selector.SelectSelectorMode.LIST,
                        )
                    ),
                    vol.Optional("go_back", default=False): selector.BooleanSelector(),
                }
            ),
        )

    async def async_step_template_select(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Step 2: Select a template from the chosen category."""
        if user_input is not None:
            if user_input.get("go_back"):
                return await self.async_step_create_from_template()
            template = get_template_by_id(user_input["template_id"])
            if template is None:
                return self.async_abort(reason="template_not_found")
            self._selected_template = template
            return await self.async_step_template_customize()

        # v2.21: admin-hidden templates stay out of the picker.
        from .templates import get_disabled_template_ids, localize_template_text

        lang = normalize_language(self.hass)
        disabled = get_disabled_template_ids(self.hass)
        marks = await self._marks()
        templates = [t for t in get_templates_by_category(self._template_category) if t.id not in disabled]
        # The gallery's order: what fits this home first, what the dwelling
        # rarely has (a pool in an apartment) last; stable otherwise.
        templates.sort(key=lambda t: 0 if marks[t.id]["recommended"] else 2 if marks[t.id]["dwelling_mismatch"] else 1)
        set_up = _TEMPLATE_STRINGS.get(lang, _TEMPLATE_STRINGS["en"])["set_up"]

        def label(t: ObjectTemplate) -> str:
            name = localize_template_text(t.name, lang) or t.name
            if marks[t.id]["set_up"]:
                return f"{name} · ✓ {set_up}"
            return f"★ {name}" if marks[t.id]["recommended"] else name

        options = [selector.SelectOptionDict(value=t.id, label=label(t)) for t in templates]

        return self.async_show_form(
            step_id="template_select",
            data_schema=vol.Schema(
                {
                    vol.Required("template_id"): selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=options,
                            mode=selector.SelectSelectorMode.LIST,
                        )
                    ),
                    vol.Optional("go_back", default=False): selector.BooleanSelector(),
                }
            ),
        )

    async def async_step_template_customize(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Step 3: Customize the template before creating the entry."""
        errors: dict[str, str] = {}
        template = self._selected_template
        if template is None:
            return self.async_abort(reason="unknown")

        if user_input is not None:
            if user_input.get("go_back"):
                return await self.async_step_template_select()

            name = user_input[CONF_OBJECT_NAME]

            # Validate unique name (helpers.object_names: by slug, current names)
            from .helpers.object_names import name_taken

            if name_taken(self.hass, name):
                errors[CONF_OBJECT_NAME] = "name_exists"
            else:
                # Build object data
                self._object_data = {
                    "id": uuid4().hex,
                    CONF_OBJECT_NAME: name,
                    CONF_OBJECT_AREA: user_input.get(CONF_OBJECT_AREA),
                    CONF_OBJECT_MANUFACTURER: user_input.get(CONF_OBJECT_MANUFACTURER),
                    CONF_OBJECT_MODEL: user_input.get(CONF_OBJECT_MODEL),
                    CONF_OBJECT_SERIAL_NUMBER: user_input.get(CONF_OBJECT_SERIAL_NUMBER),
                    # 2.94: templates in use are marked "already set up".
                    OBJECT_TEMPLATE_ID: template.id,
                }

                # Build tasks from template
                from homeassistant.util import dt as dt_util

                from .helpers.sanitize import cap_object_fields, cap_task_fields

                today_iso = dt_util.now().date().isoformat()
                from .templates import async_build_template_tasks

                # Seasons follow the home's hemisphere and climate.
                self._tasks = await async_build_template_tasks(
                    self.hass, template, normalize_language(self.hass), self._object_data["id"]
                )
                for task_data in self._tasks.values():
                    # Server-managed, not user-editable (no parity concern).
                    task_data.update({"history": [], "created_at": today_iso})
                    cap_task_fields(task_data)
                cap_object_fields(self._object_data)

                self._object_data["task_ids"] = list(self._tasks.keys())

                return await self.async_step_finish()

        return self.async_show_form(
            step_id="template_customize",
            data_schema=vol.Schema(
                {
                    vol.Required(
                        CONF_OBJECT_NAME,
                        default=_localized_template_default_name(template, self.hass),
                    ): selector.TextSelector(selector.TextSelectorConfig(type=selector.TextSelectorType.TEXT)),
                    vol.Optional(CONF_OBJECT_AREA): selector.AreaSelector(),
                    vol.Optional(CONF_OBJECT_MANUFACTURER): selector.TextSelector(
                        selector.TextSelectorConfig(type=selector.TextSelectorType.TEXT)
                    ),
                    vol.Optional(CONF_OBJECT_MODEL): selector.TextSelector(
                        selector.TextSelectorConfig(type=selector.TextSelectorType.TEXT)
                    ),
                    vol.Optional(CONF_OBJECT_SERIAL_NUMBER): selector.TextSelector(
                        selector.TextSelectorConfig(type=selector.TextSelectorType.TEXT)
                    ),
                    vol.Optional("go_back", default=False): selector.BooleanSelector(),
                }
            ),
            errors=errors,
            # 2.94: in the user's language, and the tasks THIS home gets
            # (winter-only ones are left out without a cold season — the
            # same list the builder below creates).
            description_placeholders=await self._template_summary(template),
        )

    async def _template_summary(self, template: ObjectTemplate) -> dict[str, str]:
        from .templates import async_home_template_tasks, localize_template_text

        lang = normalize_language(self.hass)
        tasks = await async_home_template_tasks(self.hass, template)
        return {
            "template_name": localize_template_text(template.name, lang) or template.name,
            "task_count": str(len(tasks)),
            "task_list": ", ".join(localize_template_text(t.name, lang) or t.name for t in tasks),
        }

    async def async_step_reconfigure(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Allow user to reconfigure object settings."""
        entry = self._get_reconfigure_entry()
        obj_data = dict(entry.data.get(CONF_OBJECT, {}))
        errors: dict[str, str] = {}

        if user_input is not None:
            name = user_input[CONF_OBJECT_NAME]
            # Validate unique name — only a CHANGED name: the successor of a
            # replace shares its archived predecessor's name and must stay
            # editable (bug audit 2026-09-27, helpers.object_names).
            from .helpers.object_names import name_changed_onto_taken

            if name_changed_onto_taken(self.hass, entry, name):
                errors["base"] = "name_exists"

            if not errors:
                # Migrate name-slug-based unique_ids BEFORE overwriting the
                # name (see helpers.entity_rename.migrate_object_unique_ids).
                from .helpers.entity_rename import migrate_object_unique_ids

                migrate_object_unique_ids(self.hass, entry, obj_data.get("name"), name)
                obj_data["name"] = name
                obj_data["area_id"] = user_input.get(CONF_OBJECT_AREA)
                obj_data["manufacturer"] = user_input.get(CONF_OBJECT_MANUFACTURER)
                obj_data["model"] = user_input.get(CONF_OBJECT_MODEL)
                obj_data["serial_number"] = user_input.get(CONF_OBJECT_SERIAL_NUMBER)
                obj_data["installation_date"] = user_input.get(CONF_OBJECT_INSTALLATION_DATE)
                obj_data["warranty_expiry"] = user_input.get(CONF_OBJECT_WARRANTY_EXPIRY)
                # v1.4.0 (#43)
                obj_data["documentation_url"] = user_input.get(CONF_OBJECT_DOCUMENTATION_URL) or None
                # v1.4.10 (#46)
                obj_data["notes"] = (user_input.get(CONF_OBJECT_NOTES) or "").strip() or None
                from .helpers.sanitize import cap_object_fields

                cap_object_fields(obj_data)

                new_data = dict(entry.data)
                new_data[CONF_OBJECT] = obj_data
                return self.async_update_reload_and_abort(entry, data=new_data, title=name)

        suggested: dict[str, Any] = {
            CONF_OBJECT_NAME: obj_data.get("name", ""),
            CONF_OBJECT_MANUFACTURER: obj_data.get("manufacturer", ""),
            CONF_OBJECT_MODEL: obj_data.get("model", ""),
            CONF_OBJECT_SERIAL_NUMBER: obj_data.get("serial_number", ""),
            CONF_OBJECT_DOCUMENTATION_URL: obj_data.get("documentation_url", ""),
            CONF_OBJECT_NOTES: obj_data.get("notes", ""),
        }
        if obj_data.get("area_id"):
            suggested[CONF_OBJECT_AREA] = obj_data["area_id"]
        if obj_data.get("installation_date"):
            suggested[CONF_OBJECT_INSTALLATION_DATE] = obj_data["installation_date"]
        if obj_data.get("warranty_expiry"):
            suggested[CONF_OBJECT_WARRANTY_EXPIRY] = obj_data["warranty_expiry"]

        schema = self.add_suggested_values_to_schema(
            vol.Schema(
                {
                    vol.Required(CONF_OBJECT_NAME): str,
                    vol.Optional(CONF_OBJECT_AREA): selector.AreaSelector(),
                    vol.Optional(CONF_OBJECT_MANUFACTURER): str,
                    vol.Optional(CONF_OBJECT_MODEL): str,
                    vol.Optional(CONF_OBJECT_SERIAL_NUMBER): str,
                    vol.Optional(
                        CONF_OBJECT_INSTALLATION_DATE,
                    ): selector.DateSelector(),
                    vol.Optional(
                        CONF_OBJECT_WARRANTY_EXPIRY,
                    ): selector.DateSelector(),
                    # v1.4.0 (#43): place under serial_number per the request
                    vol.Optional(CONF_OBJECT_DOCUMENTATION_URL): selector.TextSelector(
                        selector.TextSelectorConfig(type=selector.TextSelectorType.URL)
                    ),
                    # v1.4.10 (#46): free-form notes (multiline)
                    vol.Optional(CONF_OBJECT_NOTES): selector.TextSelector(
                        selector.TextSelectorConfig(
                            type=selector.TextSelectorType.TEXT,
                            multiline=True,
                        )
                    ),
                }
            ),
            suggested,
        )

        return self.async_show_form(
            step_id="reconfigure",
            data_schema=schema,
            errors=errors,
            description_placeholders={"name": entry.title},
        )

    async def async_step_websocket(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Handle object creation from the WebSocket API (no UI)."""
        from homeassistant.util import dt as dt_util

        from .helpers.sanitize import cap_object_fields, cap_task_fields

        if user_input is None:
            return self.async_abort(reason="missing_data")

        obj_data = dict(user_input.get(CONF_OBJECT, {}))
        cap_object_fields(obj_data)
        object_name = obj_data.get(CONF_OBJECT_NAME, "Unknown")
        from .helpers.object_names import object_unique_id

        # A replacement may reuse the name of the object it retires.
        unique_id = object_unique_id(self.hass, object_name, exclude_entry_id=obj_data.get("predecessor_entry_id"))
        if unique_id is None:
            return self.async_abort(reason="already_configured")
        await self.async_set_unique_id(unique_id)
        self._abort_if_unique_id_configured()

        obj_data.setdefault("task_ids", [])

        # Stamp `created_at` on imported tasks that lack it so next_due has a
        # stable anchor (issue #30). Imports from CSV/JSON go through this
        # chokepoint regardless of format. Cap every task's strings so
        # imports can't bypass the WS-schema length limits.
        today_iso = dt_util.now().date().isoformat()
        tasks = dict(user_input.get(CONF_TASKS, {}))
        for task_id, td in list(tasks.items()):
            if not isinstance(td, dict):
                continue
            new_td = dict(td)
            if "created_at" not in new_td:
                new_td["created_at"] = today_iso
            # The completion action's owner survives: this step only receives
            # server-built task dicts — object duplicate / replace copy stored
            # tasks, and the JSON import stamps the importing admin itself
            # (a file-supplied owner is never kept). Stripping it here made a
            # copied operator action run with system rights (bug audit
            # 2026-09-27).
            cap_task_fields(new_td, keep_action_owner=True)
            # Store recurrence in the canonical nested `schedule` shape — this is
            # the CSV/JSON import chokepoint (schedule-model v2).
            tasks[task_id] = normalize_task_storage(new_td)

        # Spare parts: re-validate each imported definition through the same
        # normalizer the WS CRUD uses (bad entries are dropped, not fatal).
        parts_in = user_input.get("parts")
        parts: dict[str, dict[str, Any]] = {}
        if isinstance(parts_in, dict):
            from .helpers.parts import PartValidationError, normalize_part

            for pid, praw in parts_in.items():
                try:
                    part = normalize_part({**praw, "id": pid})
                except (PartValidationError, TypeError):
                    continue
                # A backup's stock rides along; the entry's first setup moves
                # it into the Store (storage.async_migrate_to_store).
                stock = praw.get("stock") if isinstance(praw, dict) else None
                if isinstance(stock, (int, float)) and not isinstance(stock, bool) and stock >= 0:
                    part["stock"] = stock
                parts[part["id"]] = part

        data: dict[str, Any] = {
            CONF_OBJECT: obj_data,
            CONF_TASKS: tasks,
        }
        if parts:
            data["parts"] = parts
        return self.async_create_entry(title=object_name, data=data)

    async def async_step_create_object(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Create a new maintenance object."""
        errors: dict[str, str] = {}

        if user_input is not None:
            if user_input.get("go_back"):
                return await self.async_step_user()

            name = user_input[CONF_OBJECT_NAME]

            # Validate unique name (helpers.object_names: by slug, current names)
            from .helpers.object_names import name_taken

            if name_taken(self.hass, name):
                errors[CONF_OBJECT_NAME] = "name_exists"
            else:
                from .helpers.sanitize import cap_object_fields

                self._object_data = {
                    "id": uuid4().hex,
                    CONF_OBJECT_NAME: name,
                    CONF_OBJECT_AREA: user_input.get(CONF_OBJECT_AREA),
                    CONF_OBJECT_MANUFACTURER: user_input.get(CONF_OBJECT_MANUFACTURER),
                    CONF_OBJECT_MODEL: user_input.get(CONF_OBJECT_MODEL),
                    CONF_OBJECT_SERIAL_NUMBER: user_input.get(CONF_OBJECT_SERIAL_NUMBER),
                    CONF_OBJECT_INSTALLATION_DATE: user_input.get(CONF_OBJECT_INSTALLATION_DATE),
                    CONF_OBJECT_WARRANTY_EXPIRY: user_input.get(CONF_OBJECT_WARRANTY_EXPIRY),
                    # v1.4.0 (#43)
                    CONF_OBJECT_DOCUMENTATION_URL: user_input.get(CONF_OBJECT_DOCUMENTATION_URL) or None,
                    # v1.4.10 (#46)
                    CONF_OBJECT_NOTES: ((user_input.get(CONF_OBJECT_NOTES) or "").strip() or None),
                }
                cap_object_fields(self._object_data)
                self._tasks = {}
                return await self.async_step_task_menu()

        return self.async_show_form(
            step_id="create_object",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_OBJECT_NAME): selector.TextSelector(
                        selector.TextSelectorConfig(type=selector.TextSelectorType.TEXT)
                    ),
                    vol.Optional(CONF_OBJECT_AREA): selector.AreaSelector(),
                    vol.Optional(CONF_OBJECT_MANUFACTURER): selector.TextSelector(
                        selector.TextSelectorConfig(type=selector.TextSelectorType.TEXT)
                    ),
                    vol.Optional(CONF_OBJECT_MODEL): selector.TextSelector(
                        selector.TextSelectorConfig(type=selector.TextSelectorType.TEXT)
                    ),
                    vol.Optional(CONF_OBJECT_SERIAL_NUMBER): selector.TextSelector(
                        selector.TextSelectorConfig(type=selector.TextSelectorType.TEXT)
                    ),
                    vol.Optional(CONF_OBJECT_INSTALLATION_DATE): selector.DateSelector(),
                    vol.Optional(CONF_OBJECT_WARRANTY_EXPIRY): selector.DateSelector(),
                    # v1.4.0 (#43): place under serial_number per the request
                    vol.Optional(CONF_OBJECT_DOCUMENTATION_URL): selector.TextSelector(
                        selector.TextSelectorConfig(type=selector.TextSelectorType.URL)
                    ),
                    # v1.4.10 (#46): free-form notes (multiline)
                    vol.Optional(CONF_OBJECT_NOTES): selector.TextSelector(
                        selector.TextSelectorConfig(
                            type=selector.TextSelectorType.TEXT,
                            multiline=True,
                        )
                    ),
                    vol.Optional("go_back", default=False): selector.BooleanSelector(),
                }
            ),
            errors=errors,
        )

    async def async_step_task_menu(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Show menu to add tasks or finish."""
        return self.async_show_menu(
            step_id="task_menu",
            menu_options=["add_task", "finish"],
            description_placeholders={
                "object_name": self._object_data.get(CONF_OBJECT_NAME, ""),
                "task_count": str(len(self._tasks)),
            },
        )

    async def async_step_add_task(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Add a maintenance task."""
        return await self._schedule_add_task(
            user_input,
            step_id="add_task",
            on_go_back=self.async_step_task_menu,
            time_based_step=self.async_step_time_based,
            calendar_step=self.async_step_calendar,
            sensor_step=self.async_step_sensor_select,
            one_time_step=self.async_step_one_time,
            manual_step=self.async_step_manual,
            seed_id=True,
            description_placeholders={
                "object_name": self._object_data.get(CONF_OBJECT_NAME, ""),
            },
        )

    async def async_step_time_based(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Configure time-based schedule."""
        return await self._schedule_time_based(
            user_input,
            step_id="time_based",
            on_go_back=self.async_step_add_task,
            on_complete=self._save_task_and_return,
        )

    async def async_step_calendar(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Configure a calendar recurrence kind (weekdays / nth_weekday /
        day_of_month) during initial setup."""
        return await self._schedule_calendar(
            user_input,
            step_id="calendar",
            on_go_back=self.async_step_add_task,
            on_complete=self._save_task_and_return,
        )

    async def async_step_one_time(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Configure a one-time (non-recurring) task."""
        return await self._schedule_one_time(
            user_input,
            step_id="one_time",
            on_go_back=self.async_step_add_task,
            on_complete=self._save_task_and_return,
        )

    # --- Sensor trigger steps (thin wrappers delegating to TriggerConfigMixin) ---

    async def async_step_sensor_select(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Select sensor entity for trigger."""
        self._on_cancel = lambda: self.async_step_add_task()
        return await self._trigger_sensor_select(
            user_input,
            step_id="sensor_select",
            next_step=self.async_step_sensor_attribute,
        )

    async def async_step_sensor_attribute(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Select attribute to monitor."""
        self._on_cancel = lambda: self.async_step_sensor_select()
        return await self._trigger_sensor_attribute(
            user_input,
            step_id="sensor_attribute",
            next_step=self.async_step_trigger_type,
            error_step_id="sensor_select",
        )

    async def async_step_trigger_type(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Select trigger type."""
        self._on_cancel = lambda: self.async_step_sensor_attribute()
        return await self._trigger_type_select(
            user_input,
            step_id="trigger_type",
            threshold_step=self.async_step_trigger_threshold,
            counter_step=self.async_step_trigger_counter,
            state_change_step=self.async_step_trigger_state_change,
            runtime_step=self.async_step_trigger_runtime,
            due_date_step=self.async_step_trigger_due_date,
            compound_step=self.async_step_compound_logic,
        )

    async def async_step_trigger_threshold(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Configure threshold trigger."""
        self._on_cancel = lambda: self.async_step_trigger_type()
        return await self._trigger_threshold_config(
            user_input,
            step_id="trigger_threshold",
            on_complete=self._save_task_and_return,
        )

    async def async_step_trigger_counter(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Configure counter trigger."""
        self._on_cancel = lambda: self.async_step_trigger_type()
        return await self._trigger_counter_config(
            user_input,
            step_id="trigger_counter",
            on_complete=self._save_task_and_return,
        )

    async def async_step_trigger_state_change(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Configure state change trigger."""
        self._on_cancel = lambda: self.async_step_trigger_type()
        return await self._trigger_state_change_config(
            user_input,
            step_id="trigger_state_change",
            on_complete=self._save_task_and_return,
        )

    async def async_step_trigger_runtime(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Configure runtime trigger."""
        self._on_cancel = lambda: self.async_step_trigger_type()
        return await self._trigger_runtime_config(
            user_input,
            step_id="trigger_runtime",
            on_complete=self._save_task_and_return,
        )

    async def async_step_trigger_due_date(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Configure due-date trigger."""
        self._on_cancel = lambda: self.async_step_trigger_type()
        return await self._trigger_due_date_config(
            user_input,
            step_id="trigger_due_date",
            on_complete=self._save_task_and_return,
        )

    # --- Compound Trigger Steps ---

    async def async_step_compound_logic(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Select compound trigger logic."""
        self._on_cancel = lambda: self.async_step_trigger_type()
        return await self._trigger_compound_logic(
            user_input,
            step_id="compound_logic",
            next_step=self.async_step_compound_condition_entity,
        )

    async def async_step_compound_condition_entity(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Select entity for compound condition."""
        if getattr(self, "_compound_conditions", []):
            self._on_cancel = lambda: self.async_step_compound_review()
        else:
            self._on_cancel = lambda: self.async_step_compound_logic()
        return await self._trigger_compound_condition_entity(
            user_input,
            step_id="compound_condition_entity",
            next_step=self.async_step_compound_condition_type,
        )

    async def async_step_compound_condition_type(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Select trigger type for compound condition."""
        self._on_cancel = lambda: self.async_step_compound_condition_entity()
        return await self._trigger_compound_condition_type(
            user_input,
            step_id="compound_condition_type",
            threshold_step=self.async_step_compound_condition_threshold,
            counter_step=self.async_step_compound_condition_counter,
            state_change_step=self.async_step_compound_condition_state_change,
            runtime_step=self.async_step_compound_condition_runtime,
            due_date_step=self.async_step_compound_condition_due_date,
        )

    async def async_step_compound_condition_threshold(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Configure threshold for compound condition."""
        self._on_cancel = lambda: self.async_step_compound_condition_type()
        return await self._trigger_compound_condition_config(
            user_input,
            "threshold",
            step_id="compound_condition_threshold",
            on_complete=self.async_step_compound_review,
        )

    async def async_step_compound_condition_counter(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Configure counter for compound condition."""
        self._on_cancel = lambda: self.async_step_compound_condition_type()
        return await self._trigger_compound_condition_config(
            user_input,
            "counter",
            step_id="compound_condition_counter",
            on_complete=self.async_step_compound_review,
        )

    async def async_step_compound_condition_state_change(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Configure state_change for compound condition."""
        self._on_cancel = lambda: self.async_step_compound_condition_type()
        return await self._trigger_compound_condition_config(
            user_input,
            "state_change",
            step_id="compound_condition_state_change",
            on_complete=self.async_step_compound_review,
        )

    async def async_step_compound_condition_runtime(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Configure runtime for compound condition."""
        self._on_cancel = lambda: self.async_step_compound_condition_type()
        return await self._trigger_compound_condition_config(
            user_input,
            "runtime",
            step_id="compound_condition_runtime",
            on_complete=self.async_step_compound_review,
        )

    async def async_step_compound_condition_due_date(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Configure due_date for compound condition."""
        self._on_cancel = lambda: self.async_step_compound_condition_type()
        return await self._trigger_compound_condition_config(
            user_input,
            "due_date",
            step_id="compound_condition_due_date",
            on_complete=self.async_step_compound_review,
        )

    async def async_step_compound_review(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Review compound trigger conditions."""
        self._on_cancel = lambda: self.async_step_compound_logic()
        return await self._trigger_compound_review(
            user_input,
            step_id="compound_review",
            add_condition_step=self.async_step_compound_condition_entity,
            on_complete=self._save_task_and_return,
        )

    # --- Manual & Finish ---

    async def async_step_manual(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Configure manual schedule."""
        return await self._schedule_manual(
            user_input,
            step_id="manual",
            on_go_back=self.async_step_add_task,
            on_complete=self._save_task_and_return,
        )

    async def async_step_finish(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Finish the object setup and create the config entry."""
        if not self._tasks:
            # No tasks defined: go back to task menu with error
            return self.async_show_menu(
                step_id="task_menu",
                menu_options=["add_task", "finish"],
                description_placeholders={
                    "object_name": self._object_data.get(CONF_OBJECT_NAME, ""),
                    "task_count": "0",
                },
            )

        object_name = self._object_data.get(CONF_OBJECT_NAME, "Unknown")
        from .helpers.object_names import object_unique_id

        unique_id = object_unique_id(self.hass, object_name)
        if unique_id is None:
            return self.async_abort(reason="already_configured")
        await self.async_set_unique_id(unique_id)
        self._abort_if_unique_id_configured()

        # Add task_ids to object
        self._object_data["task_ids"] = list(self._tasks.keys())

        return self.async_create_entry(
            title=object_name,
            data={
                CONF_OBJECT: self._object_data,
                # Store recurrence in the canonical nested `schedule` shape.
                CONF_TASKS: {tid: normalize_task_storage(td) for tid, td in self._tasks.items()},
            },
        )

    def _save_task_and_return(self) -> ConfigFlowResult:
        """Save the current task and return to task menu."""
        from .config_flow_schedule import build_new_task_record

        task_id = self._current_task.get("id", uuid4().hex)
        task_data = build_new_task_record(
            self._current_task,
            task_id=task_id,
            object_id=self._object_data.get("id", ""),
            hass=self.hass,
            # No entry (and thus no Store) exists yet during setup — history and
            # a backdated last_performed must ride entry.data.
            seed_history=True,
            include_last_performed=True,
        )
        self._tasks[task_id] = task_data
        self._current_task = {}

        _LOGGER.debug("Task saved: %s (total: %d)", task_data["name"], len(self._tasks))

        # Return to task menu using show_menu (not await)
        return self.async_show_menu(
            step_id="task_menu",
            menu_options=["add_task", "finish"],
            description_placeholders={
                "object_name": self._object_data.get(CONF_OBJECT_NAME, ""),
                "task_count": str(len(self._tasks)),
            },
        )

    @staticmethod
    @callback
    def async_get_options_flow(
        config_entry: ConfigEntry,
    ) -> OptionsFlow:
        """Get the options flow for this handler."""
        from .config_flow_options_global import GlobalOptionsFlow
        from .config_flow_options_task import MaintenanceOptionsFlow

        if config_entry.unique_id == GLOBAL_UNIQUE_ID:
            return GlobalOptionsFlow()
        return MaintenanceOptionsFlow()
