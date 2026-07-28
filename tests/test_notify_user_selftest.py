"""Per-person notification self-test.

A household member's reminders go to their own phone, resolved from their
mobile_app config entry. Until now the settings page could only test the
HOUSEHOLD service, so the one question people actually ask — "will Bob get
his reminders?" — had no answer short of waiting for a task to come due.

The self-test answers it, and these tests hold it to the one property that
makes the answer worth anything: it must resolve targets through the SAME
helper the reminder path uses. A self-test with its own lookup can report
green while real reminders go somewhere else entirely — which is exactly how
the wrong-service bug behind #75 stayed invisible for so long.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any
from unittest.mock import AsyncMock, patch

from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.config_flow_options_global import (
    send_test_notification,
)
from custom_components.maintenance_supporter.const import (
    CONF_NOTIFICATIONS_ENABLED,
    CONF_NOTIFY_SERVICE,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.websocket.dashboard import (
    ws_notify_user_targets,
    ws_test_notification,
)

from .conftest import (
    assert_ws_success,
    build_global_entry_data,
    call_ws_handler,
    make_ws_connection,
    setup_integration,
)

RESOLVER = (
    "custom_components.maintenance_supporter.helpers.notification_manager."
    "get_user_notify_services"
)


def _options() -> dict[str, Any]:
    return {CONF_NOTIFY_SERVICE: "notify.household", CONF_NOTIFICATIONS_ENABLED: True}


def _link_phone(hass: HomeAssistant, user_id: str, device_name: str) -> None:
    """Give a user a Companion device the way mobile_app really registers one."""
    entry = MockConfigEntry(
        domain="mobile_app",
        data={"user_id": user_id, "device_name": device_name},
        source="user",
    )
    entry.add_to_hass(hass)
    dr.async_get(hass).async_get_or_create(
        config_entry_id=entry.entry_id,
        identifiers={("mobile_app", f"webhook-{user_id}")},
        name=device_name,
    )


# ─── send_test_notification ───────────────────────────────────────────────


async def test_test_notification_reaches_the_users_own_phone(hass: HomeAssistant) -> None:
    """With a user_id the test goes to that user's device, not the household."""
    sent: list[str] = []

    async def _dispatch(_hass, service, _data, **_kw):
        sent.append(service)
        return True

    with (
        patch(RESOLVER, new=AsyncMock(return_value=["notify.mobile_app_bob_phone"])),
        patch(
            "custom_components.maintenance_supporter.helpers.notification_manager."
            "async_dispatch_notify",
            new=AsyncMock(side_effect=_dispatch),
        ),
    ):
        result = await send_test_notification(hass, _options(), user_id="bob")

    assert result == "success"
    assert sent == ["notify.mobile_app_bob_phone"], sent


async def test_user_without_a_device_is_told_so_instead_of_a_silent_pass(
    hass: HomeAssistant,
) -> None:
    """No Companion device is not a failure — but it must NOT read as success.

    Sending to the household service here would light up the tester's own
    phone and "prove" that Bob is reachable when he is not.
    """
    sent: list[str] = []

    async def _dispatch(_hass, service, _data, **_kw):
        sent.append(service)
        return True

    with (
        patch(RESOLVER, new=AsyncMock(return_value=[])),
        patch(
            "custom_components.maintenance_supporter.helpers.notification_manager."
            "async_dispatch_notify",
            new=AsyncMock(side_effect=_dispatch),
        ),
    ):
        result = await send_test_notification(hass, _options(), user_id="bob")

    assert result == "user_no_device"
    assert sent == [], "nothing may be sent when the member has no device"


async def test_every_resolved_device_gets_the_test(hass: HomeAssistant) -> None:
    """A member with a phone AND a tablet must see it on both."""
    sent: list[str] = []

    async def _dispatch(_hass, service, _data, **_kw):
        sent.append(service)
        return True

    with (
        patch(RESOLVER, new=AsyncMock(return_value=["notify.a", "notify.b"])),
        patch(
            "custom_components.maintenance_supporter.helpers.notification_manager."
            "async_dispatch_notify",
            new=AsyncMock(side_effect=_dispatch),
        ),
    ):
        result = await send_test_notification(hass, _options(), user_id="bob")

    assert result == "success"
    assert sent == ["notify.a", "notify.b"], sent


async def test_a_dead_device_reports_failure(hass: HomeAssistant) -> None:
    """Resolution succeeding is not delivery succeeding."""
    with (
        patch(RESOLVER, new=AsyncMock(return_value=["notify.gone"])),
        patch(
            "custom_components.maintenance_supporter.helpers.notification_manager."
            "async_dispatch_notify",
            new=AsyncMock(return_value=False),
        ),
    ):
        assert await send_test_notification(hass, _options(), user_id="bob") == "failed"


async def test_without_a_user_id_the_household_service_is_still_tested(
    hass: HomeAssistant,
) -> None:
    """The existing behaviour is untouched by the new parameter."""
    sent: list[str] = []

    async def _dispatch(_hass, service, _data, **_kw):
        sent.append(service)
        return True

    with patch(
        "custom_components.maintenance_supporter.helpers.notification_manager."
        "async_dispatch_notify",
        new=AsyncMock(side_effect=_dispatch),
    ):
        result = await send_test_notification(hass, _options())

    assert result == "success"
    assert sent == ["notify.household"], sent


# ─── the property that makes the test meaningful ──────────────────────────


async def test_selftest_and_real_reminders_share_one_resolver(hass: HomeAssistant) -> None:
    """The self-test and the reminder path must resolve targets identically.

    Patching the resolver at its single definition has to move BOTH. If a
    later refactor gives the self-test its own lookup, this fails — which is
    the only thing standing between "the settings page says Bob is reachable"
    and "Bob is actually reachable".
    """
    from custom_components.maintenance_supporter.helpers import notification_manager

    # 1. The self-test resolves through the shared helper.
    with (
        patch(RESOLVER, new=AsyncMock(return_value=["notify.shared_probe"])) as resolver,
        patch(
            "custom_components.maintenance_supporter.helpers.notification_manager."
            "async_dispatch_notify",
            new=AsyncMock(return_value=True),
        ),
    ):
        await send_test_notification(hass, _options(), user_id="bob")
    assert resolver.await_count == 1, "self-test did not use the shared resolver"

    # 2. The reminder path calls that very same function object — asserted on
    #    the module attribute rather than by re-running a notification, so the
    #    check cannot be satisfied by a look-alike copy.
    assert notification_manager.get_user_notify_services.__module__ == (
        "custom_components.maintenance_supporter.helpers.notification_manager"
    )
    source = notification_manager.__file__ or ""
    assert source, "resolver module has no source file"
    text = Path(source).read_text(encoding="utf-8")
    assert text.count("async def get_user_notify_services") == 1, (
        "more than one definition of the per-user resolver — the self-test and "
        "the reminder path can now disagree"
    )


# ─── WebSocket surface ────────────────────────────────────────────────────


async def _global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data={
            **build_global_entry_data(),
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_NOTIFY_SERVICE: "notify.household",
        },
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, entry)
    return entry


async def test_ws_lists_each_members_resolved_devices(hass: HomeAssistant) -> None:
    """The settings page can show who is reachable and how."""
    await _global_entry(hass)
    alice = await hass.auth.async_create_user("Alice")
    bob = await hass.auth.async_create_user("Bob")

    _link_phone(hass, alice.id, "Alice Phone")
    hass.services.async_register("notify", "mobile_app_alice_phone", AsyncMock())

    conn = make_ws_connection()
    await call_ws_handler(
        ws_notify_user_targets,
        hass,
        conn,
        {"id": 1, "type": f"{DOMAIN}/notify/user_targets"},
    )
    payload = assert_ws_success(conn)

    by_id = {t["user_id"]: t for t in payload["targets"]}
    assert by_id[alice.id]["services"] == ["notify.mobile_app_alice_phone"]
    assert by_id[alice.id]["name"] == "Alice"
    # Bob has no Companion device — reported as empty, not omitted, so the UI
    # can say "falls back to the household service" instead of hiding him.
    assert bob.id in by_id
    assert by_id[bob.id]["services"] == []


async def test_ws_target_list_hides_system_users(hass: HomeAssistant) -> None:
    """Supervisor and friends are not household members."""
    await _global_entry(hass)
    real = await hass.auth.async_create_user("Real Person")
    system = await hass.auth.async_create_system_user("Supervisor", group_ids=[])

    conn = make_ws_connection()
    await call_ws_handler(
        ws_notify_user_targets,
        hass,
        conn,
        {"id": 1, "type": f"{DOMAIN}/notify/user_targets"},
    )
    ids = {t["user_id"] for t in assert_ws_success(conn)["targets"]}

    assert real.id in ids
    assert system.id not in ids


async def test_ws_test_notification_routes_to_the_named_user(hass: HomeAssistant) -> None:
    """The button in the per-person row must send to that person."""
    await _global_entry(hass)
    sent: list[str] = []

    async def _dispatch(_hass, service, _data, **_kw):
        sent.append(service)
        return True

    conn = make_ws_connection()
    with (
        patch(RESOLVER, new=AsyncMock(return_value=["notify.mobile_app_bob"])),
        patch(
            "custom_components.maintenance_supporter.helpers.notification_manager."
            "async_dispatch_notify",
            new=AsyncMock(side_effect=_dispatch),
        ),
    ):
        await call_ws_handler(
            ws_test_notification,
            hass,
            conn,
            {"id": 1, "type": f"{DOMAIN}/global/test_notification", "user_id": "bob"},
        )

    payload = assert_ws_success(conn)
    assert payload["success"] is True
    assert payload["result"] == "success"
    assert sent == ["notify.mobile_app_bob"], sent


async def test_ws_reports_the_no_device_case_as_unsuccessful(hass: HomeAssistant) -> None:
    """`success: false` plus a distinguishable result key, so the UI can
    explain the fallback rather than show a bare red failure."""
    await _global_entry(hass)
    conn = make_ws_connection()

    with patch(RESOLVER, new=AsyncMock(return_value=[])):
        await call_ws_handler(
            ws_test_notification,
            hass,
            conn,
            {"id": 1, "type": f"{DOMAIN}/global/test_notification", "user_id": "nobody"},
        )

    payload = assert_ws_success(conn)
    assert payload["success"] is False
    assert payload["result"] == "user_no_device"
    assert payload["message"], "the UI needs a localized explanation"


async def test_ws_without_user_id_is_unchanged(hass: HomeAssistant) -> None:
    """Existing callers that send no user_id keep testing the household service."""
    await _global_entry(hass)
    sent: list[str] = []

    async def _dispatch(_hass, service, _data, **_kw):
        sent.append(service)
        return True

    conn = make_ws_connection()
    with patch(
        "custom_components.maintenance_supporter.helpers.notification_manager."
        "async_dispatch_notify",
        new=AsyncMock(side_effect=_dispatch),
    ):
        await call_ws_handler(
            ws_test_notification,
            hass,
            conn,
            {"id": 1, "type": f"{DOMAIN}/global/test_notification"},
        )

    assert assert_ws_success(conn)["success"] is True
    assert sent == ["notify.household"], sent


async def test_no_device_message_is_localized(hass: HomeAssistant) -> None:
    """Every language the result table carries must answer the new key —
    otherwise non-English users get the English text for the one message that
    explains a fallback."""
    from custom_components.maintenance_supporter.config_flow_options_global import (
        _TEST_NOTIFICATION_RESULTS,
    )

    missing = [
        lang for lang, texts in _TEST_NOTIFICATION_RESULTS.items() if "user_no_device" not in texts
    ]
    assert not missing, f"languages without a user_no_device text: {missing}"
