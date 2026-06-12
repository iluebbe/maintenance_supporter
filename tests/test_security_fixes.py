"""Tests for the security-audit hardening fixes.

Covers: the operator-allowlist enforcement (`helpers/permissions.py`) and the
hardened URL-safety check (`websocket/tasks.py::_is_safe_url`).
"""

from __future__ import annotations

from typing import Any
from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import Unauthorized
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_ADMIN_PANEL_USER_IDS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.helpers.permissions import (
    operator_user_ids,
    require_write,
    user_may_write,
)
from custom_components.maintenance_supporter.websocket.tasks import _is_safe_url


# ─── #4: _is_safe_url hardening ─────────────────────────────────────────────


@pytest.mark.parametrize(
    ("url", "safe"),
    [
        ("", True),
        (None, True),
        ("https://example.com/docs", True),
        ("http://x", True),
        ("docs/manual.pdf", True),  # genuine path-relative URL, no host
        ("manual.pdf", True),
        ("//evil.com", False),  # protocol-relative
        ("   //evil.com", False),  # leading whitespace must not bypass
        ("\t//evil.com", False),  # tab
        ("\x01//evil.com", False),  # control char
        ("javascript:alert(1)", False),
        ("JavaScript:alert(1)", False),  # case
        ("java\tscript:alert(1)", False),  # interior control char
        ("data:text/html,<h1>x</h1>", False),
        ("vbscript:msgbox(1)", False),
        ("file:///etc/passwd", False),
        ("ftp://evil.com/x", False),  # only http/https hosts allowed
    ],
)
def test_is_safe_url(url: str | None, safe: bool) -> None:
    """Whitespace/control-char-masked hosts and non-http schemes are rejected."""
    assert _is_safe_url(url) is safe


# ─── #3: operator-allowlist enforcement (helpers/permissions.py) ────────────


def _conn(user_id: str | None, *, is_admin: bool) -> MagicMock:
    conn = MagicMock()
    conn.user = None if user_id is None else MagicMock(id=user_id, is_admin=is_admin)
    return conn


def _add_global(hass: HomeAssistant, allowlist: list[Any]) -> None:
    MockConfigEntry(
        domain=DOMAIN,
        unique_id=GLOBAL_UNIQUE_ID,
        options={CONF_ADMIN_PANEL_USER_IDS: allowlist},
    ).add_to_hass(hass)


async def test_operator_user_ids_filters_non_strings(hass: HomeAssistant) -> None:
    _add_global(hass, ["op-1", "op-2", 123, None])
    assert operator_user_ids(hass) == ["op-1", "op-2"]


async def test_operator_user_ids_no_global_entry(hass: HomeAssistant) -> None:
    assert operator_user_ids(hass) == []


async def test_user_may_write_admin(hass: HomeAssistant) -> None:
    # Admins may write regardless of the allowlist (no global entry needed).
    assert user_may_write(hass, _conn("anyone", is_admin=True)) is True


async def test_user_may_write_operator_allowed(hass: HomeAssistant) -> None:
    _add_global(hass, ["op-1"])
    assert user_may_write(hass, _conn("op-1", is_admin=False)) is True


async def test_user_may_write_plain_rejected(hass: HomeAssistant) -> None:
    _add_global(hass, ["op-1"])
    assert user_may_write(hass, _conn("someone-else", is_admin=False)) is False


async def test_user_may_write_anonymous_rejected(hass: HomeAssistant) -> None:
    assert user_may_write(hass, _conn(None, is_admin=False)) is False


async def test_require_write_allows_operator(hass: HomeAssistant) -> None:
    _add_global(hass, ["op-1"])
    seen: list[int] = []

    @require_write
    def handler(_hass: HomeAssistant, _conn_: MagicMock, msg: dict[str, Any]) -> None:
        seen.append(msg["id"])

    handler(hass, _conn("op-1", is_admin=False), {"id": 7})
    assert seen == [7]


async def test_require_write_rejects_plain_user(hass: HomeAssistant) -> None:
    _add_global(hass, ["op-1"])

    @require_write
    def handler(_hass: HomeAssistant, _conn_: MagicMock, msg: dict[str, Any]) -> None:
        raise AssertionError("handler must not run for an unauthorised user")

    with pytest.raises(Unauthorized):
        handler(hass, _conn("intruder", is_admin=False), {"id": 7})
