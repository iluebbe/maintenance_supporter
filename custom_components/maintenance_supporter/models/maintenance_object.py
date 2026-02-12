"""Maintenance object model."""

from __future__ import annotations

from dataclasses import dataclass, field
from uuid import uuid4


@dataclass
class MaintenanceObject:
    """Represents a physical object that requires maintenance.

    Examples: pool pump, car, HVAC system, water softener.
    """

    id: str = field(default_factory=lambda: uuid4().hex)
    name: str = ""
    area_id: str | None = None
    manufacturer: str | None = None
    model: str | None = None
    installation_date: str | None = None  # ISO format YYYY-MM-DD
    task_ids: list[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        """Serialize to dictionary for config entry storage."""
        return {
            "id": self.id,
            "name": self.name,
            "area_id": self.area_id,
            "manufacturer": self.manufacturer,
            "model": self.model,
            "installation_date": self.installation_date,
            "task_ids": self.task_ids,
        }

    @classmethod
    def from_dict(cls, data: dict) -> MaintenanceObject:
        """Deserialize from dictionary."""
        return cls(
            id=data.get("id", uuid4().hex),
            name=data.get("name", ""),
            area_id=data.get("area_id"),
            manufacturer=data.get("manufacturer"),
            model=data.get("model"),
            installation_date=data.get("installation_date"),
            task_ids=data.get("task_ids", []),
        )

    @property
    def slug(self) -> str:
        """Return a slugified version of the name for use in unique IDs."""
        return self.name.lower().replace(" ", "_").replace("-", "_")
