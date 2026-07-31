"""Home Assistant tells us when we use something it is retiring. Listen.

When a custom integration calls a deprecated API, HA emits a `report_usage`
record that **names the integration** and the release it stops working in:

    The deprecated function async_remove_helper_config_entry_from_source_device
    was called from maintenance_supporter. It will be removed in HA Core
    2027.8.0. Use ... instead, please create a bug report at <our issue tracker>

That is a free, authoritative early-warning channel, and it was ignored until
2026.8 broke object↔device linking in the field. Worse, the message asks the
USER to open a bug against us — so every one of these is a support request
waiting to happen.

This turns the channel into a gate: exercise the integration the way a user
does, then fail if Home Assistant reported anything about us. It catches
deprecations on whatever HA version CI installs, which is the newest — so a
breaking change lands here roughly a year before it lands on users.

What it does NOT catch: an API removed without a deprecation period, and code
paths this setup never touches. It is a net, not a proof.
"""

from __future__ import annotations

import logging
import re

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_OBJECT, DOMAIN

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)

# HA phrases these a few ways ("The deprecated function X was called from Y",
# "Detected that custom integration 'Y' calls ..."), but they all carry the
# integration name and a "stop working"/"removed in" clause.
_REPORT = re.compile(
    r"(deprecated|will stop working|is being removed|breaks? in)",
    re.IGNORECASE,
)


def _reports_about_us(caplog: pytest.LogCaptureFixture) -> list[str]:
    return [
        record.getMessage()
        for record in caplog.records
        if record.levelno >= logging.WARNING
        and DOMAIN in record.getMessage()
        and _REPORT.search(record.getMessage())
    ]


async def test_home_assistant_reports_no_deprecated_usage(
    hass: HomeAssistant, caplog: pytest.LogCaptureFixture
) -> None:
    """Set the integration up the way a user has it, then read HA's verdict."""
    caplog.set_level(logging.WARNING)

    global_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Maintenance Supporter",
        data=build_global_entry_data(), source="user", unique_id="maintenance_supporter_global",
    )
    global_entry.add_to_hass(hass)

    # A foreign device to attach to — the path that has already cost us once.
    foreign_entry = MockConfigEntry(domain="demo", title="Demo")
    foreign_entry.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=foreign_entry.entry_id,
        identifiers={("demo", "appliance-1")},
        name="Washing Machine",
    )

    obj = build_object_data(name="Linked Object")
    obj["ha_device_id"] = device.id
    linked = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Linked Object",
        data=build_object_entry_data(
            object_data=obj,
            tasks={TASK_ID_1: build_task_data(task_id=TASK_ID_1, interval_days=30)},
        ),
        source="user", unique_id="maintenance_supporter_linked",
    )
    linked.add_to_hass(hass)

    # A plain object too, so the ordinary device path is exercised as well.
    plain = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Plain Object",
        data=build_object_entry_data(
            object_data=build_object_data(name="Plain Object"),
            tasks={TASK_ID_1: build_task_data(task_id=TASK_ID_1, interval_days=30)},
        ),
        source="user", unique_id="maintenance_supporter_plain",
    )
    plain.add_to_hass(hass)

    # A nested object exercises via_device, which HA is also retiring.
    child_obj = build_object_data(name="Child Object")
    child_obj["parent_entry_id"] = plain.entry_id
    child = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Child Object",
        data=build_object_entry_data(
            object_data=child_obj,
            tasks={TASK_ID_1: build_task_data(task_id=TASK_ID_1, interval_days=30)},
        ),
        source="user", unique_id="maintenance_supporter_child",
    )
    child.add_to_hass(hass)

    await setup_integration(hass, global_entry, linked, plain, child)

    reported = _reports_about_us(caplog)
    assert not reported, (
        "Home Assistant reported deprecated usage by this integration:\n  - "
        + "\n  - ".join(reported)
        + "\n\nThese messages ask the USER to file a bug against us, and name the "
        "release the API stops working in. Migrate to what the message suggests, "
        "or — if the replacement only exists on a newer HA than we support — reach "
        "it through getattr so the older version keeps the working call."
    )


def test_the_matcher_would_recognise_a_real_report() -> None:
    """Guard the guard: a pattern that matches nothing proves nothing."""
    real = (
        "The deprecated function async_remove_helper_config_entry_from_source_device "
        f"was called from {DOMAIN}. It will be removed in HA Core 2027.8.0."
    )
    assert _REPORT.search(real)
    assert DOMAIN in real
    assert not _REPORT.search(f"{DOMAIN} set up 3 objects")
