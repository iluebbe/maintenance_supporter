"""Tests for Phase 1+ and Phase 2 features.

Covers: Template Library, Notification Bundling, Maintenance Checklists,
Dashboard Export, Cost Budget Tracking, CSV Import/Export, Maintenance Groups.
"""

from __future__ import annotations

import json
from datetime import timedelta
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_ADVANCED_BUDGET,
    CONF_ADVANCED_GROUPS,
    CONF_BUDGET_ALERT_THRESHOLD,
    CONF_BUDGET_ALERTS_ENABLED,
    CONF_BUDGET_MONTHLY,
    CONF_BUDGET_YEARLY,
    CONF_GROUPS,
    CONF_NOTIFICATION_BUNDLING_ENABLED,
    CONF_NOTIFICATION_BUNDLE_THRESHOLD,
    CONF_NOTIFICATIONS_ENABLED,
    CONF_NOTIFY_SERVICE,
    CONF_OBJECT,
    CONF_QUIET_HOURS_ENABLED,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    SERVICE_EXPORT,
    MaintenanceStatus,
)

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)


# ════════════════════════════════════════════════════════════════════════
# Fixtures
# ════════════════════════════════════════════════════════════════════════


@pytest.fixture
def global_with_notifications(hass: HomeAssistant) -> MockConfigEntry:
    """Global entry with notifications enabled."""
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(
            notifications_enabled=True,
            notify_service="notify.mobile_app",
        ),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
        options={
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_NOTIFY_SERVICE: "notify.mobile_app",
            CONF_QUIET_HOURS_ENABLED: False,
        },
    )
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
def global_with_bundling(hass: HomeAssistant) -> MockConfigEntry:
    """Global entry with notification bundling enabled."""
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(
            notifications_enabled=True,
            notify_service="notify.mobile_app",
        ),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
        options={
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_NOTIFY_SERVICE: "notify.mobile_app",
            CONF_NOTIFICATION_BUNDLING_ENABLED: True,
            CONF_NOTIFICATION_BUNDLE_THRESHOLD: 2,
            CONF_QUIET_HOURS_ENABLED: False,
        },
    )
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
def global_with_budget(hass: HomeAssistant) -> MockConfigEntry:
    """Global entry with budget tracking enabled."""
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
        options={
            CONF_BUDGET_MONTHLY: 100.0,
            CONF_BUDGET_YEARLY: 1200.0,
            CONF_BUDGET_ALERTS_ENABLED: True,
            CONF_BUDGET_ALERT_THRESHOLD: 80,
        },
    )
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
def object_with_checklist(hass: HomeAssistant) -> MockConfigEntry:
    """Object entry where the task has a checklist."""
    last_performed = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(last_performed=last_performed)
    task["checklist"] = [
        "Step 1: Turn off pump",
        "Step 2: Remove filter",
        "Step 3: Clean filter",
    ]
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Pool Pump",
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        source="user",
        unique_id="maintenance_supporter_pool_pump_checklist",
    )
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
def object_with_cost_history(hass: HomeAssistant) -> MockConfigEntry:
    """Object entry with tasks that have cost history."""
    now = dt_util.now()
    task = build_task_data(
        last_performed=(now.date() - timedelta(days=10)).isoformat(),
    )
    task["history"] = [
        {
            "timestamp": (now - timedelta(days=10)).isoformat(),
            "type": "completed",
            "cost": 50.0,
        },
        {
            "timestamp": (now - timedelta(days=40)).isoformat(),
            "type": "completed",
            "cost": 30.0,
        },
    ]
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Pool Pump Costs",
        data=build_object_entry_data(
            object_data=build_object_data(name="Pool Pump Costs"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_pool_pump_costs",
    )
    entry.add_to_hass(hass)
    return entry


# ════════════════════════════════════════════════════════════════════════
# Feature 1: Template Library
# ════════════════════════════════════════════════════════════════════════


class TestTemplateLibrary:
    """Tests for the template library."""

    def test_templates_module_loads(self) -> None:
        """Test that the templates module loads and contains templates."""
        from custom_components.maintenance_supporter.templates import (
            TEMPLATE_CATEGORIES,
            TEMPLATES,
        )

        assert len(TEMPLATES) > 0
        assert len(TEMPLATE_CATEGORIES) > 0
        assert "vehicle" in TEMPLATE_CATEGORIES
        assert "home" in TEMPLATE_CATEGORIES
        assert "pool" in TEMPLATE_CATEGORIES
        assert "appliance" in TEMPLATE_CATEGORIES

    def test_get_templates_by_category(self) -> None:
        """Test filtering templates by category."""
        from custom_components.maintenance_supporter.templates import (
            get_templates_by_category,
        )

        vehicle_templates = get_templates_by_category("vehicle")
        assert len(vehicle_templates) >= 2
        for t in vehicle_templates:
            assert t.category == "vehicle"

        pool_templates = get_templates_by_category("pool")
        assert len(pool_templates) >= 2
        for t in pool_templates:
            assert t.category == "pool"

    def test_get_template_by_id(self) -> None:
        """Test retrieving a template by its ID."""
        from custom_components.maintenance_supporter.templates import (
            get_template_by_id,
        )

        car = get_template_by_id("vehicle_car")
        assert car is not None
        assert car.name == "Car"
        assert car.category == "vehicle"

        missing = get_template_by_id("nonexistent_template")
        assert missing is None

    def test_all_templates_have_tasks(self) -> None:
        """Test that every template has at least one task."""
        from custom_components.maintenance_supporter.templates import TEMPLATES

        for t in TEMPLATES:
            assert len(t.tasks) > 0, f"Template {t.id} has no tasks"

    def test_template_category_has_metadata(self) -> None:
        """Test that template categories have required metadata fields."""
        from custom_components.maintenance_supporter.templates import (
            TEMPLATE_CATEGORIES,
        )

        for cat_id, cat in TEMPLATE_CATEGORIES.items():
            assert "icon" in cat, f"Category {cat_id} missing icon"
            assert "name_en" in cat, f"Category {cat_id} missing name_en"
            assert "name_de" in cat, f"Category {cat_id} missing name_de"

    async def test_config_flow_has_template_option(
        self,
        hass: HomeAssistant,
        global_config_entry: MockConfigEntry,
    ) -> None:
        """Test that the config flow includes a template creation option."""
        await setup_integration(hass, global_config_entry)

        result = await hass.config_entries.flow.async_init(
            DOMAIN, context={"source": "user"}
        )
        assert result["type"] == FlowResultType.MENU
        assert "create_from_template" in result["menu_options"]


# ════════════════════════════════════════════════════════════════════════
# Feature 2: Notification Bundling
# ════════════════════════════════════════════════════════════════════════


class TestNotificationBundling:
    """Tests for notification bundling."""

    async def test_bundled_notification_sent(
        self,
        hass: HomeAssistant,
        global_with_bundling: MockConfigEntry,
    ) -> None:
        """Test that bundled notification is sent when threshold met."""
        await setup_integration(hass, global_with_bundling)

        nm = hass.data.get(DOMAIN, {}).get("_notification_manager")
        assert nm is not None

        with patch.object(nm, "hass") as mock_hass:
            mock_hass.services = MagicMock()
            mock_hass.services.async_call = AsyncMock()
            mock_hass.config_entries = hass.config_entries

            await nm.async_send_bundled(
                entry_id="test_entry",
                object_name="Pool Pump",
                tasks=[
                    {
                        "task_id": "t1",
                        "task_name": "Filter",
                        "status": MaintenanceStatus.OVERDUE,
                    },
                    {
                        "task_id": "t2",
                        "task_name": "Seal Check",
                        "status": MaintenanceStatus.DUE_SOON,
                    },
                ],
            )

            mock_hass.services.async_call.assert_called_once()
            call_args = mock_hass.services.async_call.call_args
            assert call_args[0][0] == "notify"
            assert call_args[0][1] == "mobile_app"
            assert "2 tasks" in call_args[0][2]["title"]

    async def test_bundled_notification_rate_limited(
        self,
        hass: HomeAssistant,
        global_with_bundling: MockConfigEntry,
    ) -> None:
        """Test that bundled notifications are rate-limited (1h)."""
        await setup_integration(hass, global_with_bundling)

        nm = hass.data.get(DOMAIN, {}).get("_notification_manager")

        with patch.object(nm, "hass") as mock_hass:
            mock_hass.services = MagicMock()
            mock_hass.services.async_call = AsyncMock()
            mock_hass.config_entries = hass.config_entries

            tasks = [
                {
                    "task_id": "t1",
                    "task_name": "Filter",
                    "status": MaintenanceStatus.OVERDUE,
                },
                {
                    "task_id": "t2",
                    "task_name": "Seal",
                    "status": MaintenanceStatus.DUE_SOON,
                },
            ]

            # First call
            await nm.async_send_bundled("test_entry", "Pool Pump", tasks)
            assert mock_hass.services.async_call.call_count == 1

            # Second call within 1 hour — should be rate-limited
            await nm.async_send_bundled("test_entry", "Pool Pump", tasks)
            assert mock_hass.services.async_call.call_count == 1


# ════════════════════════════════════════════════════════════════════════
# Feature 3: Maintenance Checklists
# ════════════════════════════════════════════════════════════════════════


class TestMaintenanceChecklists:
    """Tests for maintenance checklists."""

    async def test_checklist_stored_in_task(
        self,
        hass: HomeAssistant,
        global_config_entry: MockConfigEntry,
        object_with_checklist: MockConfigEntry,
    ) -> None:
        """Test that checklist items are stored in task data."""
        await setup_integration(hass, global_config_entry, object_with_checklist)

        task_data = object_with_checklist.data[CONF_TASKS][TASK_ID_1]
        assert "checklist" in task_data
        assert len(task_data["checklist"]) == 3
        assert "Step 1: Turn off pump" in task_data["checklist"]

    def test_task_without_checklist_has_empty_list(self) -> None:
        """Test that tasks without checklist default to empty list."""
        task = build_task_data()
        assert task.get("checklist", []) == []

    async def test_complete_with_checklist_state(
        self,
        hass: HomeAssistant,
        global_config_entry: MockConfigEntry,
        object_with_checklist: MockConfigEntry,
    ) -> None:
        """Test completing a task with checklist state saves in history."""
        await setup_integration(hass, global_config_entry, object_with_checklist)

        rd = hass.data.get(DOMAIN, {}).get(object_with_checklist.entry_id)
        assert rd is not None
        assert rd.coordinator is not None

        checklist_state = {"0": True, "1": True, "2": False}
        await rd.coordinator.complete_maintenance(
            task_id=TASK_ID_1,
            notes="Partial checklist",
            checklist_state=checklist_state,
        )

        # Verify history entry contains checklist_state
        updated_entry = hass.config_entries.async_get_entry(
            object_with_checklist.entry_id
        )
        task_data = updated_entry.data[CONF_TASKS][TASK_ID_1]
        assert len(task_data["history"]) >= 1
        latest = task_data["history"][-1]
        assert latest["type"] == "completed"
        assert latest.get("checklist_state") == checklist_state

    async def test_ws_task_summary_includes_checklist(
        self,
        hass: HomeAssistant,
        global_config_entry: MockConfigEntry,
        object_with_checklist: MockConfigEntry,
    ) -> None:
        """Test that WS task summary includes checklist field."""
        await setup_integration(hass, global_config_entry, object_with_checklist)

        from custom_components.maintenance_supporter.websocket import (
            _build_task_summary,
        )

        task_data = object_with_checklist.data[CONF_TASKS][TASK_ID_1]
        summary = _build_task_summary(hass, TASK_ID_1, task_data, None)
        assert "checklist" in summary
        assert len(summary["checklist"]) == 3


# ════════════════════════════════════════════════════════════════════════
# Feature 4: Dashboard Export Service
# ════════════════════════════════════════════════════════════════════════


class TestExportService:
    """Tests for the dashboard export service."""

    def test_export_module_loads(self) -> None:
        """Test that the export module loads."""
        from custom_components.maintenance_supporter.export import (
            export_maintenance_data,
        )

        assert callable(export_maintenance_data)

    async def test_export_json(
        self,
        hass: HomeAssistant,
        global_config_entry: MockConfigEntry,
        object_config_entry: MockConfigEntry,
    ) -> None:
        """Test JSON export includes objects."""
        await setup_integration(hass, global_config_entry, object_config_entry)

        from custom_components.maintenance_supporter.export import (
            export_maintenance_data,
        )

        result = export_maintenance_data(hass, fmt="json", include_history=True)
        data = json.loads(result)
        assert data["version"] == 1
        assert len(data["objects"]) == 1
        assert data["objects"][0]["object"]["name"] == "Pool Pump"
        assert len(data["objects"][0]["tasks"]) == 1

    async def test_export_without_history(
        self,
        hass: HomeAssistant,
        global_config_entry: MockConfigEntry,
        object_with_cost_history: MockConfigEntry,
    ) -> None:
        """Test that export without history omits history entries."""
        await setup_integration(hass, global_config_entry, object_with_cost_history)

        from custom_components.maintenance_supporter.export import (
            export_maintenance_data,
        )

        result = export_maintenance_data(hass, fmt="json", include_history=False)
        data = json.loads(result)
        assert len(data["objects"]) == 1
        task = data["objects"][0]["tasks"][0]
        assert "history" not in task

    async def test_export_empty(
        self,
        hass: HomeAssistant,
        global_config_entry: MockConfigEntry,
    ) -> None:
        """Test export with no objects returns empty list."""
        await setup_integration(hass, global_config_entry)

        from custom_components.maintenance_supporter.export import (
            export_maintenance_data,
        )

        result = export_maintenance_data(hass, fmt="json")
        data = json.loads(result)
        assert data["objects"] == []

    async def test_export_service_registered(
        self,
        hass: HomeAssistant,
        global_config_entry: MockConfigEntry,
    ) -> None:
        """Test that the export_data service is registered."""
        await setup_integration(hass, global_config_entry)

        assert hass.services.has_service(DOMAIN, SERVICE_EXPORT)


# ════════════════════════════════════════════════════════════════════════
# Feature 5: Cost Budget Tracking
# ════════════════════════════════════════════════════════════════════════


class TestBudgetTracking:
    """Tests for budget tracking and alerts."""

    async def test_budget_settings_in_menu(
        self,
        hass: HomeAssistant,
        global_config_entry: MockConfigEntry,
    ) -> None:
        """Test that budget_settings appears in global options menu when enabled."""
        await setup_integration(hass, global_config_entry)
        hass.config_entries.async_update_entry(
            global_config_entry,
            options={**global_config_entry.options, CONF_ADVANCED_BUDGET: True},
        )

        result = await hass.config_entries.options.async_init(
            global_config_entry.entry_id
        )
        assert result["type"] == FlowResultType.MENU
        assert "budget_settings" in result["menu_options"]

    async def test_budget_settings_form(
        self,
        hass: HomeAssistant,
        global_config_entry: MockConfigEntry,
    ) -> None:
        """Test that budget settings form can be submitted."""
        await setup_integration(hass, global_config_entry)
        hass.config_entries.async_update_entry(
            global_config_entry,
            options={**global_config_entry.options, CONF_ADVANCED_BUDGET: True},
        )

        result = await hass.config_entries.options.async_init(
            global_config_entry.entry_id
        )

        result = await hass.config_entries.options.async_configure(
            result["flow_id"],
            {"next_step_id": "budget_settings"},
        )
        assert result["type"] == FlowResultType.FORM
        assert result["step_id"] == "budget_settings"

        # Submit budget values
        result = await hass.config_entries.options.async_configure(
            result["flow_id"],
            user_input={
                CONF_BUDGET_MONTHLY: 200.0,
                CONF_BUDGET_YEARLY: 2400.0,
                CONF_BUDGET_ALERTS_ENABLED: True,
                CONF_BUDGET_ALERT_THRESHOLD: 90,
            },
        )
        # Should return to menu
        assert result["type"] == FlowResultType.MENU

        # Verify saved
        options = global_config_entry.options
        assert options[CONF_BUDGET_MONTHLY] == 200.0
        assert options[CONF_BUDGET_YEARLY] == 2400.0

    async def test_budget_alert_sent(
        self,
        hass: HomeAssistant,
        global_with_notifications: MockConfigEntry,
    ) -> None:
        """Test that budget alert notification is sent."""
        # Update the global entry with budget options
        hass.config_entries.async_update_entry(
            global_with_notifications,
            options={
                **global_with_notifications.options,
                CONF_BUDGET_MONTHLY: 100.0,
                CONF_BUDGET_YEARLY: 1200.0,
                CONF_BUDGET_ALERTS_ENABLED: True,
                CONF_BUDGET_ALERT_THRESHOLD: 80,
            },
        )

        await setup_integration(hass, global_with_notifications)

        nm = hass.data.get(DOMAIN, {}).get("_notification_manager")
        assert nm is not None

        with patch.object(nm, "hass") as mock_hass:
            mock_hass.services = MagicMock()
            mock_hass.services.async_call = AsyncMock()
            mock_hass.config_entries = hass.config_entries

            await nm.async_budget_alert(
                period="monthly", spent=85.0, budget=100.0
            )

            mock_hass.services.async_call.assert_called_once()
            call_args = mock_hass.services.async_call.call_args
            assert "Budget" in call_args[0][2]["title"]

    async def test_budget_alert_rate_limited(
        self,
        hass: HomeAssistant,
        global_with_notifications: MockConfigEntry,
    ) -> None:
        """Test that budget alerts are rate-limited (24h)."""
        await setup_integration(hass, global_with_notifications)

        nm = hass.data.get(DOMAIN, {}).get("_notification_manager")

        with patch.object(nm, "hass") as mock_hass:
            mock_hass.services = MagicMock()
            mock_hass.services.async_call = AsyncMock()
            mock_hass.config_entries = hass.config_entries

            await nm.async_budget_alert("monthly", 85.0, 100.0)
            assert mock_hass.services.async_call.call_count == 1

            # Second call within 24h — rate limited
            await nm.async_budget_alert("monthly", 90.0, 100.0)
            assert mock_hass.services.async_call.call_count == 1


# ════════════════════════════════════════════════════════════════════════
# Feature 6: CSV Import/Export
# ════════════════════════════════════════════════════════════════════════


class TestCSVImportExport:
    """Tests for CSV import/export."""

    async def test_csv_export(
        self,
        hass: HomeAssistant,
        global_config_entry: MockConfigEntry,
        object_config_entry: MockConfigEntry,
    ) -> None:
        """Test CSV export generates valid CSV."""
        await setup_integration(hass, global_config_entry, object_config_entry)

        from custom_components.maintenance_supporter.helpers.csv_handler import (
            export_objects_csv,
        )

        csv_data = export_objects_csv(hass)
        assert "object_name" in csv_data  # Header
        assert "Pool Pump" in csv_data
        assert "Filter Cleaning" in csv_data

    def test_csv_import_basic(self) -> None:
        """Test basic CSV import parsing."""
        from custom_components.maintenance_supporter.helpers.csv_handler import (
            import_objects_csv,
        )

        csv_content = (
            "object_name,object_manufacturer,object_model,object_area_id,"
            "task_name,task_type,schedule_type,interval_days,warning_days,"
            "last_performed,notes,status,times_performed,total_cost\n"
            "My Car,Toyota,Corolla,garage,Oil Change,service,time_based,365,30,,,,0,0\n"
            "My Car,Toyota,Corolla,garage,Tire Rotation,service,time_based,180,14,,,,0,0\n"
        )

        objects = import_objects_csv(csv_content)
        assert len(objects) == 1
        obj = objects[0]
        assert obj["object"]["name"] == "My Car"
        assert obj["object"]["manufacturer"] == "Toyota"
        assert len(obj["tasks"]) == 2

    def test_csv_import_empty(self) -> None:
        """Test that importing empty CSV returns empty list."""
        from custom_components.maintenance_supporter.helpers.csv_handler import (
            import_objects_csv,
        )

        csv_content = "object_name,task_name\n"
        objects = import_objects_csv(csv_content)
        assert len(objects) == 0

    def test_csv_import_skips_rows_without_object_name(self) -> None:
        """Test that rows without object_name are skipped."""
        from custom_components.maintenance_supporter.helpers.csv_handler import (
            import_objects_csv,
        )

        csv_content = (
            "object_name,task_name,task_type\n"
            ",Oil Change,service\n"
            "  ,Tire Rotation,service\n"
        )
        objects = import_objects_csv(csv_content)
        assert len(objects) == 0

    def test_csv_import_multiple_objects(self) -> None:
        """Test importing CSV with multiple objects."""
        from custom_components.maintenance_supporter.helpers.csv_handler import (
            import_objects_csv,
        )

        csv_content = (
            "object_name,task_name,task_type,schedule_type,interval_days,warning_days\n"
            "Car,Oil Change,service,time_based,365,30\n"
            "Pool,Filter Clean,cleaning,time_based,14,3\n"
            "Pool,Water Test,inspection,time_based,7,2\n"
        )

        objects = import_objects_csv(csv_content)
        assert len(objects) == 2

        # Car: 1 task
        car = [o for o in objects if o["object"]["name"] == "Car"][0]
        assert len(car["tasks"]) == 1

        # Pool: 2 tasks
        pool = [o for o in objects if o["object"]["name"] == "Pool"][0]
        assert len(pool["tasks"]) == 2


# ════════════════════════════════════════════════════════════════════════
# Feature 7: Maintenance Groups
# ════════════════════════════════════════════════════════════════════════


class TestMaintenanceGroups:
    """Tests for maintenance groups."""

    async def test_manage_groups_in_menu(
        self,
        hass: HomeAssistant,
        global_config_entry: MockConfigEntry,
    ) -> None:
        """Test that manage_groups appears in global options menu when enabled."""
        await setup_integration(hass, global_config_entry)
        hass.config_entries.async_update_entry(
            global_config_entry,
            options={**global_config_entry.options, CONF_ADVANCED_GROUPS: True},
        )

        result = await hass.config_entries.options.async_init(
            global_config_entry.entry_id
        )
        assert result["type"] == FlowResultType.MENU
        assert "manage_groups" in result["menu_options"]

    async def test_manage_groups_redirects_to_add_when_empty(
        self,
        hass: HomeAssistant,
        global_config_entry: MockConfigEntry,
    ) -> None:
        """Test that manage_groups goes to add_group when no groups exist."""
        await setup_integration(hass, global_config_entry)
        hass.config_entries.async_update_entry(
            global_config_entry,
            options={**global_config_entry.options, CONF_ADVANCED_GROUPS: True},
        )

        result = await hass.config_entries.options.async_init(
            global_config_entry.entry_id
        )

        result = await hass.config_entries.options.async_configure(
            result["flow_id"],
            {"next_step_id": "manage_groups"},
        )
        assert result["type"] == FlowResultType.FORM
        assert result["step_id"] == "add_group"

    async def test_add_group_via_flow(
        self,
        hass: HomeAssistant,
        global_config_entry: MockConfigEntry,
    ) -> None:
        """Test adding a group through the options flow."""
        await setup_integration(hass, global_config_entry)
        hass.config_entries.async_update_entry(
            global_config_entry,
            options={**global_config_entry.options, CONF_ADVANCED_GROUPS: True},
        )

        result = await hass.config_entries.options.async_init(
            global_config_entry.entry_id
        )

        # Navigate to manage_groups → add_group (since no groups exist)
        result = await hass.config_entries.options.async_configure(
            result["flow_id"],
            {"next_step_id": "manage_groups"},
        )
        assert result["step_id"] == "add_group"

        # Submit new group
        result = await hass.config_entries.options.async_configure(
            result["flow_id"],
            user_input={
                "group_name": "Spring Maintenance",
                "group_description": "All spring tasks",
            },
        )
        # Should return to menu
        assert result["type"] == FlowResultType.MENU

        # Verify group saved in options
        groups = global_config_entry.options.get(CONF_GROUPS, {})
        assert len(groups) == 1
        group = list(groups.values())[0]
        assert group["name"] == "Spring Maintenance"
        assert group["description"] == "All spring tasks"
        assert group["task_refs"] == []

    def test_conf_groups_constant(self) -> None:
        """Test that CONF_GROUPS constant exists."""
        assert CONF_GROUPS == "groups"


# ════════════════════════════════════════════════════════════════════════
# Cross-Feature Integration Tests
# ════════════════════════════════════════════════════════════════════════


class TestIntegration:
    """Cross-feature integration tests."""

    async def test_export_includes_checklist(
        self,
        hass: HomeAssistant,
        global_config_entry: MockConfigEntry,
        object_with_checklist: MockConfigEntry,
    ) -> None:
        """Test that JSON export includes checklist data."""
        await setup_integration(hass, global_config_entry, object_with_checklist)

        from custom_components.maintenance_supporter.export import (
            export_maintenance_data,
        )

        result = export_maintenance_data(hass, fmt="json")
        data = json.loads(result)
        task = data["objects"][0]["tasks"][0]
        assert "checklist" in task
        assert len(task["checklist"]) == 3

    async def test_csv_preserves_costs(
        self,
        hass: HomeAssistant,
        global_config_entry: MockConfigEntry,
        object_with_cost_history: MockConfigEntry,
    ) -> None:
        """Test that CSV export includes cost data."""
        await setup_integration(hass, global_config_entry, object_with_cost_history)

        from custom_components.maintenance_supporter.helpers.csv_handler import (
            export_objects_csv,
        )

        csv_data = export_objects_csv(hass)
        assert "Pool Pump Costs" in csv_data
        assert "total_cost" in csv_data

    async def test_all_services_registered(
        self,
        hass: HomeAssistant,
        global_config_entry: MockConfigEntry,
    ) -> None:
        """Test that all services are registered including export_data."""
        await setup_integration(hass, global_config_entry)

        assert hass.services.has_service(DOMAIN, "complete")
        assert hass.services.has_service(DOMAIN, "reset")
        assert hass.services.has_service(DOMAIN, "skip")
        assert hass.services.has_service(DOMAIN, "export_data")

    async def test_export_service_fires_event(
        self,
        hass: HomeAssistant,
        global_config_entry: MockConfigEntry,
        object_config_entry: MockConfigEntry,
    ) -> None:
        """Test that the export service fires an event."""
        await setup_integration(hass, global_config_entry, object_config_entry)

        events = []

        def _record_event(event):
            events.append(event)

        hass.bus.async_listen(f"{DOMAIN}_export_completed", _record_event)

        await hass.services.async_call(
            DOMAIN,
            SERVICE_EXPORT,
            {"format": "json", "include_history": False},
            blocking=True,
        )
        await hass.async_block_till_done()

        assert len(events) == 1
        assert events[0].data["format"] == "json"
        assert "data" in events[0].data
