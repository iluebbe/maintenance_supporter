"""What the spare parts of a completion cost — and when that counts (#104).

A completion that uses parts has a price nobody typed: one filter at €15.
The budget counted only the typed ``cost``, so the owner had to pick a
discipline and stick to it (Discussion #104): book the money when buying
(the buy reminder's cost) and leave the filter changes at 0, or book each
change by hand and leave the purchase at 0. Mixing the two counted €45 for
€30 spent.

The choice is now one setting, ``parts_cost_mode``, and the bookkeeping
follows it everywhere:

* ``purchase`` (default, the behaviour so far): money counts when it leaves
  your pocket — a buy reminder's cost. A completion records the value of the
  parts it used as information (``parts_cost``, "≈ €15"), never in a total.
* ``use``: parts count when they are used. Every completion — from the
  panel, a button, an NFC tag, voice or an automation — books the value of
  the parts it consumed; a purchase is stock, not spending, and its price
  updates the part's price instead (so the next use is valued at what was
  actually paid).

Every completion records how it was booked (``cost_basis: "use"``) together
with the value of its parts at that moment (``unit_cost`` per used part).
Switching the setting therefore changes only what comes after — history is
never re-valued, and an entry someone booked by hand under the old rule is
never counted twice.
"""

from __future__ import annotations

import math
from collections.abc import Callable, Mapping
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from ..const import PARTS_COST_MODES

DEFAULT_PARTS_COST_MODE = "purchase"
COST_BASIS_USE = "use"


def _amount(value: Any) -> float | None:
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
        return None
    return float(value)


def parts_cost_mode(hass: HomeAssistant) -> str:
    """The configured mode (``purchase`` unless set to ``use``)."""
    from ..const import CONF_PARTS_COST_MODE
    from .global_options import global_option

    mode = global_option(hass, CONF_PARTS_COST_MODE)
    return mode if mode in PARTS_COST_MODES else DEFAULT_PARTS_COST_MODE


def entry_spend(entry: Mapping[str, Any], amount: Callable[[Any], float | None] = _amount) -> float:
    """What one history entry counts in every total — the budget, a task's
    and an object's cost, the area report.

    Decided by what the entry itself recorded when it was booked, so a
    changed setting never re-values the past. ``amount`` reads a stored
    number: strict by default (the budget's rule — a real finite number,
    see ``helpers.budget.is_countable_cost``); a task's total passes the
    lenient ``helpers.history.finite_amount``, as it always did.
    """
    cost = amount(entry.get("cost")) or 0.0
    if entry.get("cost_basis") != COST_BASIS_USE:
        return cost
    if entry.get("purchase"):
        cost = 0.0  # bought stock is spent when it is used
    return cost + (amount(entry.get("parts_cost")) or 0.0)


def parts_value(used_parts: Any) -> float | None:
    """Σ quantity × unit cost over the priced links, or None when none is."""
    total = 0.0
    priced = False
    for link in used_parts if isinstance(used_parts, list) else []:
        if not isinstance(link, dict):
            continue
        unit = _amount(link.get("unit_cost"))
        qty = _amount(link.get("quantity"))
        if unit is None:
            continue
        total += unit * (qty if qty is not None else 1.0)
        priced = True
    return round(total, 2) if priced else None


def refresh_parts_cost(entry: dict[str, Any]) -> None:
    """Recompute an entry's ``parts_cost`` from its used parts (in place)."""
    value = parts_value(entry.get("used_parts"))
    if value is None:
        entry.pop("parts_cost", None)
    else:
        entry["parts_cost"] = value


def link_unit_cost(hass: HomeAssistant, entry: ConfigEntry, link: Mapping[str, Any]) -> float | None:
    """The current price of one unit of a used part (pools resolved)."""
    from ..parts_runtime import resolve_part_link
    from .parts import unit_price

    _owner, part, _store = resolve_part_link(hass, entry, dict(link))
    return unit_price(part) if isinstance(part, dict) else None


def annotate_completion(
    hass: HomeAssistant,
    entry: ConfigEntry,
    task_data: Mapping[str, Any],
    history_entry: dict[str, Any],
) -> None:
    """Book a fresh completion entry (in place): the price of every used
    part at this moment, their value, whether it was a purchase, and the
    mode it was booked under."""
    from .parts import PART_REF_FIELD

    for link in history_entry.get("used_parts") or []:
        if isinstance(link, dict) and link.get("unit_cost") is None:
            unit = link_unit_cost(hass, entry, link)
            if unit is not None:
                link["unit_cost"] = unit
    refresh_parts_cost(history_entry)
    if isinstance(task_data.get(PART_REF_FIELD), dict):
        history_entry["purchase"] = True
    if parts_cost_mode(hass) == COST_BASIS_USE:
        history_entry["cost_basis"] = COST_BASIS_USE


def purchase_unit_price(part: Mapping[str, Any], cost: float, packages: float | None) -> float | None:
    """The price one package (or unit) cost on this purchase."""
    count = packages if packages and packages > 0 else _amount(part.get("restock_quantity")) or 1.0
    if count <= 0 or cost <= 0:
        return None
    return round(cost / count, 2)
