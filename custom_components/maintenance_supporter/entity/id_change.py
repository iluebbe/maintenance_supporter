"""In-place entity_id changes (Home Assistant 2026.11, #214).

From Home Assistant Core 2026.11 a renamed entity keeps running: its
``entity_id`` is changed in place instead of the entity being removed and
added again, and ``async_entity_id_changed(old_entity_id)`` is called. A
custom integration's class that defines ``async_added_to_hass``,
``async_will_remove_from_hass`` or ``async_prepare_to_add_to_hass`` is only
changed in place when it (or a subclass of it) also defines that hook; from
2027.11 every entity is. Nothing in this integration is keyed on an entity's
own entity_id, so each such class defines the hook and hands the call on
(``tests/test_entity_id_change.py`` keeps new classes from missing it).
"""

from __future__ import annotations

from typing import Any


def entity_id_changed(parent: Any, old_entity_id: str) -> None:
    """Hand an in-place entity_id change on to ``super()``'s own hook.

    Before 2026.11 Home Assistant's ``Entity`` has no such hook and nothing
    calls ours, so a missing one is skipped rather than looked up blindly.
    """
    hook = getattr(parent, "async_entity_id_changed", None)
    if callable(hook):
        hook(old_entity_id)
