"""Maintenance type model."""

from __future__ import annotations

from dataclasses import dataclass

from ..const import MaintenanceTypeEnum


@dataclass(frozen=True)
class MaintenanceType:
    """Represents a type/category of maintenance work."""

    id: str
    name: str
    icon: str
    typical_duration: int  # minutes
    default_interval_days: int

    def to_dict(self) -> dict:
        """Serialize to dictionary."""
        return {
            "id": self.id,
            "name": self.name,
            "icon": self.icon,
            "typical_duration": self.typical_duration,
            "default_interval_days": self.default_interval_days,
        }

    @classmethod
    def from_dict(cls, data: dict) -> MaintenanceType:
        """Deserialize from dictionary."""
        return cls(
            id=data["id"],
            name=data["name"],
            icon=data["icon"],
            typical_duration=data.get("typical_duration", 30),
            default_interval_days=data.get("default_interval_days", 30),
        )


PREDEFINED_TYPES: dict[str, MaintenanceType] = {
    MaintenanceTypeEnum.CLEANING: MaintenanceType(
        id=MaintenanceTypeEnum.CLEANING,
        name="Cleaning",
        icon="mdi:broom",
        typical_duration=30,
        default_interval_days=30,
    ),
    MaintenanceTypeEnum.INSPECTION: MaintenanceType(
        id=MaintenanceTypeEnum.INSPECTION,
        name="Inspection",
        icon="mdi:magnify",
        typical_duration=15,
        default_interval_days=180,
    ),
    MaintenanceTypeEnum.REPLACEMENT: MaintenanceType(
        id=MaintenanceTypeEnum.REPLACEMENT,
        name="Replacement",
        icon="mdi:swap-horizontal",
        typical_duration=60,
        default_interval_days=365,
    ),
    MaintenanceTypeEnum.CALIBRATION: MaintenanceType(
        id=MaintenanceTypeEnum.CALIBRATION,
        name="Calibration",
        icon="mdi:tune",
        typical_duration=20,
        default_interval_days=90,
    ),
    MaintenanceTypeEnum.SERVICE: MaintenanceType(
        id=MaintenanceTypeEnum.SERVICE,
        name="Service",
        icon="mdi:wrench",
        typical_duration=120,
        default_interval_days=365,
    ),
    MaintenanceTypeEnum.CUSTOM: MaintenanceType(
        id=MaintenanceTypeEnum.CUSTOM,
        name="Custom",
        icon="mdi:cog",
        typical_duration=30,
        default_interval_days=30,
    ),
}
