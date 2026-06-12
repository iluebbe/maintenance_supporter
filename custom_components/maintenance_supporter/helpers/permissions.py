"""Authorization helpers for write-capable WebSocket commands.

Home Assistant admins may always write. A non-admin user may write only if their
user id is on the operator allowlist (``admin_panel_user_ids``), which an admin
manages under Settings → Panel Access. This realises the documented "operator"
delegation: listed users get the full create / edit / delete panel.

IMPORTANT — escalation boundary: ``require_write`` must be used ONLY on
content-CRUD commands (object / task / group create-update-delete, user
assignment, per-task analysis writes). Global-config, bulk-import and vacation
commands keep ``@websocket_api.require_admin``, so an operator can never edit the
allowlist itself (``admin_panel_user_ids`` lives in the global options, gated by
``global/update``) — listing yourself cannot be self-granted.
"""

from __future__ import annotations

from functools import wraps
from typing import Any

from homeassistant.components.websocket_api.connection import ActiveConnection
from homeassistant.components.websocket_api.const import WebSocketCommandHandler
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import Unauthorized

from ..const import CONF_ADMIN_PANEL_USER_IDS
from .global_options import get_global_options


def operator_user_ids(hass: HomeAssistant) -> list[str]:
    """Return the operator allowlist (``admin_panel_user_ids``) as string ids."""
    raw = get_global_options(hass).get(CONF_ADMIN_PANEL_USER_IDS, []) or []
    return [uid for uid in raw if isinstance(uid, str)]


def user_may_write(hass: HomeAssistant, connection: ActiveConnection) -> bool:
    """Whether the connection's user may perform content writes.

    True for HA admins, and for non-admin users whose id is on the operator
    allowlist. False for anonymous connections.
    """
    user = connection.user
    if user is None:
        return False
    if user.is_admin:
        return True
    return user.id in operator_user_ids(hass)


def require_write(func: WebSocketCommandHandler) -> WebSocketCommandHandler:
    """Drop-in for ``@websocket_api.require_admin`` that also allows operators.

    Mirrors HA's ``require_admin`` exactly (same decorator position: between
    ``@websocket_command`` and ``@async_response``), but authorises any user for
    whom :func:`user_may_write` is true. Use ONLY on content-CRUD commands.
    """

    @wraps(func)
    def with_write(
        hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
    ) -> None:
        """Check write permission and call the wrapped handler."""
        if not user_may_write(hass, connection):
            raise Unauthorized

        func(hass, connection, msg)

    return with_write
