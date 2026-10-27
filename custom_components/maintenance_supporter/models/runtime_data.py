"""What a config entry carries as ``entry.runtime_data``, and the typed
ConfigEntry the platforms receive."""

from __future__ import annotations

from dataclasses import dataclass
from typing import TYPE_CHECKING

from homeassistant.config_entries import ConfigEntry

if TYPE_CHECKING:
    from ..coordinator import MaintenanceCoordinator
    from ..entity.summary_coordinator import MaintenanceSummaryCoordinator
    from ..storage import MaintenanceStore


@dataclass
class MaintenanceSupporterData:
    """Runtime data for a Maintenance Supporter config entry."""

    coordinator: MaintenanceCoordinator | None = None
    store: MaintenanceStore | None = None
    # Only set on the global entry: aggregates status counts for the summary
    # sensors. None on per-object entries.
    summary_coordinator: MaintenanceSummaryCoordinator | None = None


type MaintenanceSupporterConfigEntry = ConfigEntry[MaintenanceSupporterData]
