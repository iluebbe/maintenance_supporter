"""How a state rule compares an entity's state with the one it names: case
and the blanks around it do not count ("Finished " is "finished"). The state
change trigger and the Done-when rule each had a copy (DRY audit 2026-10-30,
BR6-B8)."""

from __future__ import annotations


def norm_state(value: str | None) -> str | None:
    """The state as a rule compares it."""
    return value.strip().casefold() if isinstance(value, str) else value
