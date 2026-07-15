"""Permission-enforcement matrix for the entire WS API (audit gap #1).

``test_security_fixes.py`` proves the ``require_write`` / ``require_admin``
primitives work; this file proves they are actually *applied* to every
command. Three guarantees:

1. **Frozen inventory** — every registered ``maintenance_supporter/*`` command
   appears in ``_EXPECTED_TIERS`` with its authorization tier. Adding a
   command without consciously choosing a tier fails the build.
2. **Write tier** — every ``@require_write`` command rejects a plain
   (non-admin, non-allowlisted) user with ``Unauthorized``.
3. **Admin tier / escalation boundary** — every admin-only command rejects an
   allowlisted operator even while ``operator_write_enabled`` is ON. This pins
   the self-escalation boundary: an operator must never reach global-config,
   bulk import/export, or vacation commands (the allowlist and the delegation
   switch live behind ``global/update``).

The action commands (complete / skip / reset / snooze / quick_complete) are
deliberately "read" tier — any authenticated household member may check a task
off (the same path the entity buttons and voice use). The freeze makes any
future tier change a conscious diff.
"""

from __future__ import annotations

from typing import Any
from unittest.mock import MagicMock

import pytest
from homeassistant.components.websocket_api.const import DOMAIN as WS_DOMAIN
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import Unauthorized
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_ADMIN_PANEL_USER_IDS,
    CONF_OPERATOR_WRITE_ENABLED,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)

from .conftest import build_global_entry_data, setup_integration

# ─── The frozen {command → tier} inventory ──────────────────────────────────
# admin  = @websocket_api.require_admin (HA admins only — escalation boundary)
# write  = @require_write (admins; allowlisted operators only when delegation on)
# read   = no guard (any authenticated user)
_EXPECTED_TIERS: dict[str, str] = {
    # ── admin (global config / bulk IO / vacation) ──
    "maintenance_supporter/csv/export": "admin",
    "maintenance_supporter/csv/import": "admin",
    "maintenance_supporter/export": "admin",
    "maintenance_supporter/global/test_notification": "admin",
    "maintenance_supporter/global/update": "admin",
    "maintenance_supporter/json/import": "admin",
    "maintenance_supporter/vacation/end_now": "admin",
    "maintenance_supporter/vacation/update": "admin",
    # ── write (content CRUD) ──
    "maintenance_supporter/documents/add_link": "write",
    "maintenance_supporter/documents/delete": "write",
    "maintenance_supporter/documents/update": "write",
    "maintenance_supporter/integration_setups/adopt": "write",
    "maintenance_supporter/problem_sensors/adopt": "write",
    "maintenance_supporter/views/save": "write",
    "maintenance_supporter/views/delete": "write",
    "maintenance_supporter/group/create": "write",
    "maintenance_supporter/group/delete": "write",
    "maintenance_supporter/group/update": "write",
    "maintenance_supporter/object/archive": "write",
    "maintenance_supporter/object/create": "write",
    "maintenance_supporter/object/delete": "write",
    "maintenance_supporter/object/duplicate": "write",
    "maintenance_supporter/object/from_template": "write",
    "maintenance_supporter/object/pause": "write",
    "maintenance_supporter/object/replace": "write",
    "maintenance_supporter/object/resume": "write",
    "maintenance_supporter/object/unarchive": "write",
    "maintenance_supporter/object/update": "write",
    "maintenance_supporter/part/create": "write",
    "maintenance_supporter/part/delete": "write",
    "maintenance_supporter/part/restock": "write",
    "maintenance_supporter/part/update": "write",
    "maintenance_supporter/task/apply_suggestion": "write",
    "maintenance_supporter/task/archive": "write",
    "maintenance_supporter/task/assign_user": "write",
    "maintenance_supporter/task/create": "write",
    "maintenance_supporter/task/delete": "write",
    "maintenance_supporter/task/duplicate": "write",
    "maintenance_supporter/task/history/update": "write",
    "maintenance_supporter/task/seasonal_overrides": "write",
    "maintenance_supporter/task/set_environmental_entity": "write",
    "maintenance_supporter/task/unarchive": "write",
    "maintenance_supporter/task/update": "write",
    # ── read (any authenticated user; actions deliberately household-open) ──
    "maintenance_supporter/budget_status": "read",
    "maintenance_supporter/documents/list": "read",
    "maintenance_supporter/documents/search": "read",
    "maintenance_supporter/documents/storage": "read",
    "maintenance_supporter/entity/attributes": "read",
    "maintenance_supporter/groups": "read",
    "maintenance_supporter/object": "read",
    "maintenance_supporter/objects": "read",
    "maintenance_supporter/objects/csv": "read",
    "maintenance_supporter/qr/batch_generate": "read",
    "maintenance_supporter/qr/generate": "read",
    "maintenance_supporter/settings": "read",
    "maintenance_supporter/statistics": "read",
    "maintenance_supporter/subscribe": "read",
    "maintenance_supporter/integration_setups/discover": "read",
    "maintenance_supporter/problem_sensors/discover": "read",
    "maintenance_supporter/views/list": "read",
    "maintenance_supporter/tags/list": "read",
    "maintenance_supporter/task/analyze_interval": "read",
    "maintenance_supporter/task/complete": "read",
    "maintenance_supporter/task/list": "read",
    "maintenance_supporter/task/postpone": "read",
    "maintenance_supporter/task/quick_complete": "read",
    "maintenance_supporter/task/reset": "read",
    "maintenance_supporter/task/skip": "read",
    "maintenance_supporter/task/snooze": "read",
    "maintenance_supporter/tasks/by_user": "read",
    "maintenance_supporter/templates": "read",
    "maintenance_supporter/users/list": "read",
    "maintenance_supporter/vacation/preview": "read",
    "maintenance_supporter/vacation/state": "read",
}

OPERATOR_ID = "op-under-test"


@pytest.fixture
async def registered(hass: HomeAssistant) -> HomeAssistant:
    """Set up the integration with operator delegation ON and one allowlisted
    operator — the sharpest configuration for the escalation-boundary tests."""
    data = build_global_entry_data()
    data[CONF_OPERATOR_WRITE_ENABLED] = True
    data[CONF_ADMIN_PANEL_USER_IDS] = [OPERATOR_ID]
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=data,
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, entry)
    return hass


def _registered_ms_commands(hass: HomeAssistant) -> dict[str, Any]:
    """Return {command_type: handler} for our domain from the WS registry."""
    registry = hass.data[WS_DOMAIN]
    out: dict[str, Any] = {}
    for cmd, entry in registry.items():
        if cmd.startswith("maintenance_supporter/"):
            # Registry entries are (handler, schema) tuples.
            out[cmd] = entry[0] if isinstance(entry, tuple) else entry
    return out


def _conn(user_id: str, *, is_admin: bool) -> MagicMock:
    conn = MagicMock()
    conn.user = MagicMock(is_admin=is_admin)
    conn.user.id = user_id
    conn.send_result = MagicMock()
    conn.send_error = MagicMock()
    return conn


async def test_command_inventory_frozen(registered: HomeAssistant) -> None:
    """Every registered command must have a consciously chosen tier here."""
    cmds = set(_registered_ms_commands(registered))
    expected = set(_EXPECTED_TIERS)
    missing_from_test = cmds - expected
    gone_from_code = expected - cmds
    assert not missing_from_test, (
        f"New WS command(s) without an authorization-tier entry in "
        f"_EXPECTED_TIERS — choose admin/write/read consciously: "
        f"{sorted(missing_from_test)}"
    )
    assert not gone_from_code, f"Command(s) in _EXPECTED_TIERS no longer registered: {sorted(gone_from_code)}"


async def test_write_commands_reject_plain_user(registered: HomeAssistant) -> None:
    """Every write-tier command must raise Unauthorized for a non-admin user
    who is NOT on the operator allowlist — even with delegation switched on.

    The guard raises synchronously before the handler body (and before any
    async task spawns), so a minimal message suffices.
    """
    handlers = _registered_ms_commands(registered)
    failures: list[str] = []
    for cmd, tier in _EXPECTED_TIERS.items():
        if tier != "write":
            continue
        conn = _conn("not-on-the-allowlist", is_admin=False)
        try:
            handlers[cmd](registered, conn, {"id": 1, "type": cmd})
            failures.append(cmd)
        except Unauthorized:
            pass
    assert not failures, f"Write-tier command(s) did NOT reject a plain user — missing or misplaced @require_write: {failures}"


async def test_admin_commands_reject_operator_even_with_delegation(
    registered: HomeAssistant,
) -> None:
    """Escalation boundary: admin-only commands must reject an allowlisted
    operator even while operator_write_enabled is ON. Otherwise an operator
    could edit the allowlist / delegation switch (global/update) or bulk-import
    content and self-promote."""
    handlers = _registered_ms_commands(registered)
    failures: list[str] = []
    for cmd, tier in _EXPECTED_TIERS.items():
        if tier != "admin":
            continue
        conn = _conn(OPERATOR_ID, is_admin=False)
        try:
            handlers[cmd](registered, conn, {"id": 1, "type": cmd})
            failures.append(cmd)
        except Unauthorized:
            pass
    assert not failures, f"Admin-tier command(s) did NOT reject an allowlisted operator — escalation boundary broken: {failures}"


async def test_write_commands_reject_operator_when_delegation_off(
    hass: HomeAssistant,
) -> None:
    """With the shipped default (delegation OFF), even an allowlisted operator
    must be rejected by every write-tier command."""
    data = build_global_entry_data()
    data[CONF_OPERATOR_WRITE_ENABLED] = False
    data[CONF_ADMIN_PANEL_USER_IDS] = [OPERATOR_ID]
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=data,
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, entry)

    handlers = _registered_ms_commands(hass)
    failures: list[str] = []
    for cmd, tier in _EXPECTED_TIERS.items():
        if tier != "write":
            continue
        conn = _conn(OPERATOR_ID, is_admin=False)
        try:
            handlers[cmd](hass, conn, {"id": 1, "type": cmd})
            failures.append(cmd)
        except Unauthorized:
            pass
    assert not failures, f"Write-tier command(s) accepted an operator while delegation is OFF (shipped default): {failures}"
