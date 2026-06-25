"""Button platform for the Maintenance Supporter integration.

Per-task action buttons (complete / skip / reset) on each object's device. All
presses delegate to the same coordinator methods that the panel, services, and
mobile-notification actions use — one action layer, no duplicated logic (DRY).
"""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING

from homeassistant.components.button import ButtonEntity
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import (
    CONF_OBJECT,
    CONF_TASK_ENABLED,
    CONF_TASKS,
    GLOBAL_UNIQUE_ID,
    slugify_object_name,
)
from .coordinator import MaintenanceCoordinator
from .entity.entity_base import MaintenanceEntity

if TYPE_CHECKING:
    from . import MaintenanceSupporterConfigEntry

_LOGGER = logging.getLogger(__name__)

# Per-task action buttons. The English suffix is also used in the entity_id /
# friendly name when the task has a custom entity_slug (mirrors binary_sensor's
# "{slug} overdue" convention).
_TASK_ACTIONS: tuple[tuple[str, str], ...] = (
    ("complete", "Complete"),
    ("skip", "Skip"),
    ("reset", "Reset"),
)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: MaintenanceSupporterConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up button entities for a maintenance object (or the global hub)."""
    if entry.unique_id == GLOBAL_UNIQUE_ID:
        # No global buttons — export belongs to the export_data service, not a
        # button entity (a button can't trigger a browser download).
        return

    runtime_data = entry.runtime_data
    if runtime_data is None or runtime_data.coordinator is None:
        _LOGGER.error("No coordinator found for entry %s", entry.entry_id)
        return

    coordinator = runtime_data.coordinator
    tasks = entry.data.get(CONF_TASKS, {})
    entities = [
        MaintenanceActionButton(coordinator, task_id, action, label)
        for task_id in tasks
        for action, label in _TASK_ACTIONS
    ]
    async_add_entities(entities)
    _LOGGER.debug(
        "Added %d button entities for %s", len(entities), entry.title
    )


class MaintenanceActionButton(MaintenanceEntity, ButtonEntity):
    """A per-task action button (complete / skip / reset).

    Pressing it calls the shared coordinator action method — the same path used
    by the maintenance_supporter services and the mobile-notification actions.
    """

    def __init__(
        self,
        coordinator: MaintenanceCoordinator,
        task_id: str,
        action: str,
        label: str,
    ) -> None:
        """Initialize a per-task action button."""
        super().__init__(coordinator, task_id)
        self._action = action

        obj_data = coordinator.entry.data.get(CONF_OBJECT, {})
        task_data = coordinator.entry.data.get(CONF_TASKS, {}).get(task_id, {})
        object_slug = slugify_object_name(obj_data.get("name", "unknown"))

        self._attr_unique_id = (
            f"maintenance_supporter_{object_slug}_{task_id}_{action}"
        )
        self._attr_translation_key = f"button_{action}"
        # Custom entity_slug → stable, language-independent entity_id/name.
        entity_slug = task_data.get("entity_slug")
        if entity_slug:
            self._attr_name = f"{entity_slug} {label}"
        self._attr_translation_placeholders = {"task_name": task_data.get("name", "")}

    @property
    def available(self) -> bool:
        """Available only while the coordinator is up and the task is enabled."""
        if not super().available:
            return False
        if not self._task_data:
            return False
        # Archived task → its complete/skip/reset buttons go unavailable (inert).
        if self._task_data.get("archived_at") is not None:
            return False
        task_cfg = self.coordinator.entry.data.get(CONF_TASKS, {}).get(
            self._task_id, {}
        )
        return bool(task_cfg.get(CONF_TASK_ENABLED, True))

    async def async_press(self) -> None:
        """Run the action via the shared coordinator method (single source)."""
        if not self._task_data:
            raise HomeAssistantError(f"Task {self._task_id} no longer exists")
        if self._action == "complete":
            await self.coordinator.complete_maintenance(
                self._task_id, notes="Completed from dashboard button"
            )
        elif self._action == "skip":
            await self.coordinator.skip_maintenance(
                self._task_id, reason="Skipped from dashboard button"
            )
        elif self._action == "reset":
            await self.coordinator.reset_maintenance(self._task_id)
