"""Authorization helpers for write-capable WebSocket commands.

Home Assistant admins may always write. A non-admin user may write only when
operator write delegation is switched on (``operator_write_enabled`` global
option, default OFF) AND their user id is on the operator allowlist
(``admin_panel_user_ids``), which an admin manages under Settings → Panel
Access. With delegation off — the shipped default — content create / edit /
delete is admin-only and the allowlist grants read-only operator access.

IMPORTANT — escalation boundary: ``require_write`` must be used ONLY on
content-CRUD commands (object / task / group create-update-delete, user
assignment, per-task analysis writes). Global-config, bulk-import and vacation
commands keep ``@websocket_api.require_admin``, so an operator can never edit
the allowlist nor flip the delegation switch (both live in the global options,
gated by ``global/update``) — write access cannot be self-granted.
"""

from __future__ import annotations

from collections.abc import Callable, Coroutine
from functools import wraps
from typing import TYPE_CHECKING, Any

from homeassistant.components.websocket_api.connection import ActiveConnection
from homeassistant.components.websocket_api.const import WebSocketCommandHandler
from homeassistant.core import HomeAssistant, ServiceCall, ServiceResponse
from homeassistant.exceptions import Unauthorized, UnknownUser

from ..const import CONF_ADMIN_PANEL_USER_IDS, CONF_OPERATOR_WRITE_ENABLED
from .global_options import get_global_options

if TYPE_CHECKING:
    from homeassistant.auth.models import User


def operator_user_ids(hass: HomeAssistant) -> list[str]:
    """Return the operator allowlist (``admin_panel_user_ids``) as string ids."""
    raw = get_global_options(hass).get(CONF_ADMIN_PANEL_USER_IDS, []) or []
    return [uid for uid in raw if isinstance(uid, str)]


def operator_write_enabled(hass: HomeAssistant) -> bool:
    """Whether operator write delegation is switched on (default False).

    Reads the ``operator_write_enabled`` global option. While False — the
    shipped default — only HA admins may write and the panel-access allowlist
    is read-only; an admin must explicitly enable this for allowlisted
    non-admins to gain content CRUD.
    """
    return get_global_options(hass).get(CONF_OPERATOR_WRITE_ENABLED, False) is True


def user_can_write(hass: HomeAssistant, user: User | None) -> bool:
    """Whether a specific user may perform content writes.

    True for HA admins. For non-admin users, true only when operator write
    delegation is enabled AND their id is on the operator allowlist. False for
    anonymous / missing users. This is the user-object variant used by the HTTP
    document views (which resolve ``request["hass_user"]``); the WS layer calls
    :func:`user_may_write`, which reads the user off the connection.
    """
    if user is None:
        return False
    if user.is_admin:
        return True
    return operator_write_enabled(hass) and user.id in operator_user_ids(hass)


def user_may_write(hass: HomeAssistant, connection: ActiveConnection) -> bool:
    """Whether the connection's user may perform content writes.

    True for HA admins. For non-admin users, true only when operator write
    delegation is enabled AND their id is on the operator allowlist. False for
    anonymous connections.
    """
    return user_can_write(hass, connection.user)


def require_write(func: WebSocketCommandHandler) -> WebSocketCommandHandler:
    """Drop-in for ``@websocket_api.require_admin`` that also allows operators.

    Mirrors HA's ``require_admin`` exactly (same decorator position: between
    ``@websocket_command`` and ``@async_response``), but authorises any user for
    whom :func:`user_may_write` is true. Use ONLY on content-CRUD commands.
    """

    @wraps(func)
    def with_write(hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]) -> None:
        """Check write permission and call the wrapped handler."""
        if not user_may_write(hass, connection):
            raise Unauthorized

        func(hass, connection, msg)

    return with_write


ServiceHandler = Callable[[ServiceCall], Coroutine[Any, Any, ServiceResponse]]


def service_tier(hass: HomeAssistant, handler: ServiceHandler, *, admin: bool = False) -> ServiceHandler:
    """The service-call twin of ``require_write`` (``admin=True``: of
    ``require_admin``).

    Home Assistant does not gate custom services by user — any account can
    call them over the WebSocket ``call_service`` command or REST, so a
    plain user could delete tasks through ``delete_task`` although the
    panel's commands refuse it (bug audit 2026-09-26). A call carrying a
    user is held to the tier of the matching WS command, the way HA's own
    admin services check it; calls without one (automations, scripts
    started by the system) pass.
    """

    @wraps(handler)
    async def guarded(call: ServiceCall) -> ServiceResponse:
        user_id = call.context.user_id
        if user_id is not None:
            user = await hass.auth.async_get_user(user_id)
            if user is None:
                raise UnknownUser(context=call.context)
            if not (user.is_admin if admin else user_can_write(hass, user)):
                raise Unauthorized(context=call.context)
        return await handler(call)

    return guarded
