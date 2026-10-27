"""Create a maintenance object: its config entry, through the config flow.
The one creation primitive behind the ``object/create`` command, the
``add_object`` service, the batch adoption and the battery fleet hub."""

from __future__ import annotations

from typing import Any
from uuid import uuid4

from homeassistant.core import HomeAssistant

from ..const import (
    CONF_OBJECT,
    CONF_OBJECT_AREA,
    CONF_OBJECT_DOCUMENTATION_URL,
    CONF_OBJECT_INSTALLATION_DATE,
    CONF_OBJECT_MANUFACTURER,
    CONF_OBJECT_MODEL,
    CONF_OBJECT_NAME,
    CONF_OBJECT_NOTES,
    CONF_OBJECT_PLACE,
    CONF_OBJECT_REMIND_ON_SITE,
    CONF_OBJECT_SERIAL_NUMBER,
    CONF_OBJECT_WARRANTY_EXPIRY,
    CONF_TASKS,
    DOMAIN,
)


async def async_create_object(
    hass: HomeAssistant,
    *,
    name: str,
    area_id: str | None = None,
    manufacturer: str | None = None,
    model: str | None = None,
    serial_number: str | None = None,
    installation_date: str | None = None,
    warranty_expiry: str | None = None,
    documentation_url: str | None = None,
    notes: str | None = None,
    ha_device_id: str | None = None,
    parent_entry_id: str | None = None,
    place: str | None = None,
    remind_on_site: bool = False,
) -> str:
    """Create a maintenance object (config entry) and return its entry_id.

    Shared creation primitive for the ``object/create`` WS command and the
    ``add_object`` service (DRY). Inputs are normalized here; callers do their
    own validation/error reporting (the WS layer keeps its specific error
    codes). Raises ValueError if the config flow does not create an entry.

    The two dates are checked here too: the WS layer refuses a malformed one
    up front, but the ``add_object`` service stored any string — "next
    spring" as an installation date broke every age / warranty computation
    that parses it (bug audit 2026-09-27). Raises ValueError.
    """
    from .dates import canonical_iso_date, parse_iso_date

    for field, value in (("installation_date", installation_date), ("warranty_expiry", warranty_expiry)):
        if value and (not isinstance(value, str) or parse_iso_date(value) is None):
            raise ValueError(f"{field} must be a valid date (YYYY-MM-DD), got {value!r}")
    # The service's "   " passed its schema and became an object called "",
    # as often as it was called; the compact date form was stored as typed
    # (bug audit 2026-10-17, W-10).
    if not name.strip():
        raise ValueError("The name must not be empty")
    installation_date = canonical_iso_date(installation_date)
    warranty_expiry = canonical_iso_date(warranty_expiry)
    data: dict[str, Any] = {
        CONF_OBJECT: {
            "id": uuid4().hex,
            CONF_OBJECT_NAME: name.strip(),
            CONF_OBJECT_AREA: area_id,
            CONF_OBJECT_MANUFACTURER: (manufacturer or "").strip() or None,
            CONF_OBJECT_MODEL: (model or "").strip() or None,
            CONF_OBJECT_SERIAL_NUMBER: (serial_number or "").strip() or None,
            CONF_OBJECT_INSTALLATION_DATE: installation_date,
            CONF_OBJECT_WARRANTY_EXPIRY: warranty_expiry,
            CONF_OBJECT_DOCUMENTATION_URL: (documentation_url or "").strip() or None,
            CONF_OBJECT_NOTES: (notes.strip() if isinstance(notes, str) and notes.strip() else None),
            "ha_device_id": ha_device_id,
            "parent_entry_id": parent_entry_id,
            # Normalized by cap_object_fields (helpers/sanitize._normalize_place).
            **({CONF_OBJECT_PLACE: place} if place else {}),
            **({CONF_OBJECT_REMIND_ON_SITE: True} if remind_on_site else {}),
            "task_ids": [],
        },
        CONF_TASKS: {},
    }
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": "websocket"}, data=data)
    if result["type"] != "create_entry":
        raise ValueError(f"Failed to create object: {result.get('reason', 'unknown')}")
    return result["result"].entry_id
