"""Whether a coordinator has run its first refresh."""

from __future__ import annotations

from typing import Any


def has_coordinator_data(coordinator: Any) -> bool:
    """True once the coordinator's first refresh has produced data.

    Home Assistant's DataUpdateCoordinator types ``data`` as the payload,
    but it is None until the first refresh — a check written against it
    reads as unreachable to mypy (warn_unreachable, as HA core runs it).
    """
    return getattr(coordinator, "data", None) is not None
