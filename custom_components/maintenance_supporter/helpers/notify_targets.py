"""Canonical notify-target discovery.

Single source of truth for the "which notify targets can the user pick"
list, shared by BOTH config surfaces: the global options flow
(`config_flow_options_global.py`) and the custom panel Settings view
(served through `_build_full_settings` in `websocket/dashboard.py`).

Before this helper the same merge lived twice — once in Python, once in
TypeScript — and the two had drifted (the panel excluded the
``notify.send_message`` *entity* and never injected the saved value; the
options flow injected the saved value but only excluded the ``send_message``
*service*). Routing both through here keeps them in lockstep.
"""

from __future__ import annotations

from homeassistant.core import HomeAssistant

# The generic notify action, not a real target — never offered as a choice,
# in either its service (``notify.send_message``) or entity form.
_SEND_MESSAGE = "send_message"
_SEND_MESSAGE_ENTITY = f"notify.{_SEND_MESSAGE}"


def build_notify_targets(
    hass: HomeAssistant, *, current: str | None = None
) -> list[str]:
    """Return the sorted set of pickable notify targets.

    Merges legacy notify *services* (mobile_app devices, notify groups) from
    the service registry with notify *entities* (the newer model) from the
    state machine — many single devices appear only as an entity. The generic
    ``send_message`` action is excluded in both forms. When ``current`` is a
    non-empty saved value it is always included, so an already-configured but
    currently-unavailable target still shows up as selected.
    """
    targets: set[str] = {
        f"notify.{name}"
        for name in hass.services.async_services().get("notify", {})
        if name != _SEND_MESSAGE
    }
    targets.update(
        entity_id
        for entity_id in hass.states.async_entity_ids("notify")
        if entity_id != _SEND_MESSAGE_ENTITY
    )
    if current:
        targets.add(current)
    return sorted(targets)
