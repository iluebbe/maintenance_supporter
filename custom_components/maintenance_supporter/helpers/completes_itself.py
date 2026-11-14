"""D#250: a task that only its sensor completes, right now.

Its trigger is active and records the task as done when it ends by itself
(*Record the task as done*, ``auto_complete_on_recovery``): the robot
vacuum's water tank is empty until someone fills it, and filling it is the
completion. The rows of the panel and the card say *Completes itself*
instead of offering Complete and Skip, and its reminders carry no Complete
and Skip buttons either. A task due by its safety interval, or not due,
keeps them, and so does a counter or a runtime, which never ends by itself.

The twin of ``frontend-src/helpers/completes-itself.ts``; both read the
vectors in ``frontend-src/__tests__/fixtures/completes-itself-vectors.json``.
"""

from __future__ import annotations

from collections.abc import Mapping
from typing import Any

from ..const import CONF_TRIGGER_HOLD_UNTIL_DONE

#: Trigger types whose verdict is a level of the reading: it ends when the
#: reading does (BaseTrigger.holds_level; tests/test_completes_itself_250 pins
#: the two together).
LEVEL_TRIGGER_TYPES = frozenset({"threshold", "due_date"})


def is_state_latch(trigger_config: Mapping[str, Any] | None) -> bool:
    """A state rule that waits for one transition (a from- or a to-state):
    it ends when the entity leaves its alert state. A counter of changes does
    not."""
    if not isinstance(trigger_config, Mapping) or trigger_config.get("type") != "state_change":
        return False
    changes = trigger_config.get("trigger_target_changes")
    return (1 if changes is None else changes) == 1 and bool(
        trigger_config.get("trigger_from_state") or trigger_config.get("trigger_to_state")
    )


def can_hold_until_done(trigger_config: Mapping[str, Any] | None) -> bool:
    """D#229: a rule whose verdict ends by itself can instead hold the task
    until it is done: a level or a state latch (a compound holds through its
    conditions). The coordinator, the options flow and the panel dialog each
    had their own list (DRY audit 2026-11-07)."""
    if not isinstance(trigger_config, Mapping):
        return False
    return trigger_config.get("type") in LEVEL_TRIGGER_TYPES or is_state_latch(trigger_config)


def holds_until_done(trigger_config: Mapping[str, Any] | None) -> bool:
    """D#229: whether the rule holds its task until it is done: the flag set
    on a rule that can hold. The WS check and the options flow store it only
    then, and the coordinator's sweep reads it so; the WS kept it on a counter
    or a runtime while the options flow dropped it (DRY audit 2026-10-30,
    BI6-B7)."""
    return isinstance(trigger_config, Mapping) and bool(trigger_config.get(CONF_TRIGGER_HOLD_UNTIL_DONE)) and can_hold_until_done(trigger_config)


def ends_by_itself(trigger_config: Mapping[str, Any] | None) -> bool:
    """Whether the trigger's verdict ends without a completion: a level (a
    threshold, a date from a sensor), a state latch, or a compound whose
    conditions let it end. An AND rule ends as soon as one of its conditions
    does, an OR rule only once all of them can (the compound's recovery); a
    counter or a runtime never ends by itself."""
    if not isinstance(trigger_config, Mapping):
        return False
    kind = trigger_config.get("type")
    if kind in LEVEL_TRIGGER_TYPES or is_state_latch(trigger_config):
        return True
    if kind == "compound":
        conditions = [c for c in trigger_config.get("conditions") or [] if isinstance(c, Mapping)]
        if not conditions:
            return False
        ends = [ends_by_itself(c) for c in conditions]
        return any(ends) if str(trigger_config.get("compound_logic") or "AND").upper() == "AND" else all(ends)
    return False


def completes_itself(trigger_config: Mapping[str, Any] | None, trigger_active: bool | None) -> bool:
    """Whether the task's active trigger records it as done when it ends."""
    if not isinstance(trigger_config, Mapping) or trigger_config.get("auto_complete_on_recovery") is not True or trigger_active is not True:
        return False
    return ends_by_itself(trigger_config)
