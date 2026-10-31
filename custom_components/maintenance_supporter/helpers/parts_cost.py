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
  goes into the part's price instead, averaged with the stock still there
  (#238), so a use is valued at what the shelf actually cost.

Every completion records how it was booked (``cost_basis: "use"``) together
with the value of its parts at that moment (``unit_cost`` per used part).
Switching the setting therefore changes only what comes after — history is
never re-valued, and an entry someone booked by hand under the old rule is
never counted twice.

A part can make its own choice (#222, ``cost_mode`` on the part; absent =
the setting): batteries and bulbs counted where they are used, the pool
chemicals and the ink in the year they were bought. A completion is then
booked "when used" as soon as one of its parts counts when used, and a part
in it that counts at purchase is marked ``cost_basis: "purchase"`` on its
link and left out of the entry's ``parts_cost``. A purchase follows the
part it buys.
"""

from __future__ import annotations

from collections.abc import Callable, Mapping
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from ..const import BATTERY_FLEET_OBJECT_FLAG, CONF_OBJECT, CONF_PARTS_COST_MODE, PARTS_COST_MODES
from ..models.shapes import HistoryEntry
from ..parts_runtime import resolve_part_link
from .global_options import global_option
from .history import strict_amount
from .parts import PART_REF_FIELD, packages_bought, restock_units, unit_price
from .rounding import round2

DEFAULT_PARTS_COST_MODE = "purchase"
COST_BASIS_USE = "use"
# #222: on a used-part link of an entry booked "when used" — this part
# counted at purchase, so its value is not in the entry's parts_cost.
COST_BASIS_PURCHASE = "purchase"


def parts_cost_mode(hass: HomeAssistant) -> str:
    """The configured mode (``purchase`` unless set to ``use``)."""
    mode = global_option(hass, CONF_PARTS_COST_MODE)
    return mode if mode in PARTS_COST_MODES else DEFAULT_PARTS_COST_MODE


def part_cost_mode(part: Any, house: str, *, owner: ConfigEntry | None = None) -> str:
    """When this part counts as spending: its own ``cost_mode`` (#222), else
    the household's ``house`` mode (:func:`parts_cost_mode`).

    A part the battery fleet owns (``owner``) counts when bought, whatever
    is chosen (:func:`_bought_for_the_battery_fleet`). That rule sat in the
    purchase branch only: a fleet cell another object took through a pool
    link (#111) was booked when used on top of its purchase, and the paid
    price was averaged into it (DRY audit 2026-10-30, BR6-A9)."""
    if owner is not None and _bought_for_the_battery_fleet(owner):
        return COST_BASIS_PURCHASE
    mode = part.get("cost_mode") if isinstance(part, Mapping) else None
    return mode if mode in PARTS_COST_MODES else house


def entry_spend(entry: Mapping[str, Any], amount: Callable[[Any], float | None] = strict_amount) -> float:
    """What one history entry counts in every total — the budget, a task's
    and an object's cost, the area report.

    Decided by what the entry itself recorded when it was booked, so a
    changed setting never re-values the past. ``amount`` reads a stored
    number: strict by default (the budget's rule — a real finite number,
    see ``helpers.history.strict_amount``); a task's total passes the
    lenient ``helpers.history.signed_amount``. Both keep a credit's sign
    (#200): a negative cost lowers every total.
    """
    cost = amount(entry.get("cost")) or 0.0
    if entry.get("cost_basis") != COST_BASIS_USE:
        return cost
    if entry.get("purchase"):
        cost = 0.0  # bought stock is spent when it is used
    return cost + (amount(entry.get("parts_cost")) or 0.0)


def parts_value(used_parts: Any) -> float | None:
    """Σ quantity × unit cost over the priced links, or None when none is.
    A link marked as counted at purchase (#222) is not part of it."""
    total = 0.0
    priced = False
    for link in used_parts if isinstance(used_parts, list) else []:
        if not isinstance(link, dict) or link.get("cost_basis") == COST_BASIS_PURCHASE:
            continue
        unit = strict_amount(link.get("unit_cost"))
        qty = strict_amount(link.get("quantity"))
        if unit is None:
            continue
        total += unit * (qty if qty is not None else 1.0)
        priced = True
    return round2(total) if priced else None


def refresh_parts_cost(entry: HistoryEntry) -> None:
    """Recompute an entry's ``parts_cost`` from its used parts (in place)."""
    value = parts_value(entry.get("used_parts"))
    if value is None:
        entry.pop("parts_cost", None)
    else:
        entry["parts_cost"] = value


def _linked_part(hass: HomeAssistant, entry: ConfigEntry, link: Mapping[str, Any]) -> dict[str, Any] | None:
    """The part a link names (pools resolved), or None."""
    _owner, part, _store = resolve_part_link(hass, entry, dict(link))
    return part if isinstance(part, dict) else None


def _link_mode(hass: HomeAssistant, entry: ConfigEntry, link: Mapping[str, Any], house: str) -> str:
    """When the part a link names counts (:func:`part_cost_mode`, with its
    owner: a pool's part is judged on the object that holds it)."""
    owner, part, _store = resolve_part_link(hass, entry, dict(link))
    return part_cost_mode(part if isinstance(part, dict) else None, house, owner=owner)


def link_unit_cost(hass: HomeAssistant, entry: ConfigEntry, link: Mapping[str, Any]) -> float | None:
    """The current price of one unit of a used part (pools resolved)."""
    part = _linked_part(hass, entry, link)
    return unit_price(part) if part is not None else None


def mark_link_bases(
    hass: HomeAssistant,
    entry: ConfigEntry,
    history_entry: HistoryEntry,
    previous: Any = None,
) -> None:
    """Mark (in place) the used parts of an entry booked "when used" that
    count at purchase (#222), and recompute its ``parts_cost``.

    A part that was on the entry before (``previous``, a history edit) keeps
    how it was booked; one added is judged by its part's mode today. On an
    entry booked at purchase no link carries a mark: its parts value is
    information, all of it."""
    kept = {
        str(link["part_id"]): link.get("cost_basis")
        for link in (previous if isinstance(previous, list) else [])
        if isinstance(link, dict) and link.get("part_id")
    }
    house = parts_cost_mode(hass)
    booked_on_use = history_entry.get("cost_basis") == COST_BASIS_USE
    # Hand-edited / imported entries may carry anything in the list.
    links: list[Any] = history_entry.get("used_parts") or []
    for link in links:
        if not isinstance(link, dict):
            continue
        part_id = str(link.get("part_id"))
        if part_id in kept:
            basis = kept[part_id]
        else:
            counts_at_purchase = _link_mode(hass, entry, link, house) == COST_BASIS_PURCHASE
            basis = COST_BASIS_PURCHASE if counts_at_purchase else None
        if booked_on_use and basis == COST_BASIS_PURCHASE:
            link["cost_basis"] = COST_BASIS_PURCHASE
        else:
            link.pop("cost_basis", None)
    refresh_parts_cost(history_entry)


def annotate_completion(
    hass: HomeAssistant,
    entry: ConfigEntry,
    task_data: Mapping[str, Any],
    history_entry: HistoryEntry,
) -> None:
    """Book a fresh completion entry (in place): the price of every used
    part at this moment, their value, whether it was a purchase, and the
    mode it was booked under.

    A purchase is booked "when used" when the part it buys counts when used;
    any other completion when one of its parts does — or, using none, when
    the household counts parts when used (#222)."""
    links = [link for link in history_entry.get("used_parts") or [] if isinstance(link, dict)]
    for link in links:
        if link.get("unit_cost") is None:
            unit = link_unit_cost(hass, entry, link)
            if unit is not None:
                link["unit_cost"] = unit
    house = parts_cost_mode(hass)
    ref = task_data.get(PART_REF_FIELD)
    if isinstance(ref, dict):
        history_entry["purchase"] = True
        on_use = _link_mode(hass, entry, ref, house) == COST_BASIS_USE
    elif links:
        on_use = any(_link_mode(hass, entry, link, house) == COST_BASIS_USE for link in links)
    else:
        on_use = house == COST_BASIS_USE
    if on_use:
        history_entry["cost_basis"] = COST_BASIS_USE
    mark_link_bases(hass, entry, history_entry)


def _bought_for_the_battery_fleet(entry: ConfigEntry) -> bool:
    """A purchase of battery fleet cells counts when bought, whatever the
    mode: the fleet's swaps (Replaced, a recorded replacement) take cells
    without a completion that could value them, so under "count when used"
    batteries cost nothing in the budget, the area cost or any total (bug
    audit 2026-10-17, S-6)."""
    return bool((entry.data.get(CONF_OBJECT) or {}).get(BATTERY_FLEET_OBJECT_FLAG))


def purchase_unit_price(part: Mapping[str, Any], cost: float, packages: float | None) -> float | None:
    """The price one package (or unit) cost on this purchase."""
    if cost <= 0:
        return None
    return round2(cost / packages_bought(part, packages))


def averaged_price(part: Mapping[str, Any], cost: float, packages: float | None, owned_after: float | None) -> float | None:
    """The part's price after a purchase (#238): the average of what is on
    the shelf, the ones there before at the part's price and the bought ones
    at what was paid. Per package with a package size, like the price.

    The price used to become the last purchase's: the stock still there was
    revalued, and its use was booked at a price nobody paid for it.
    ``owned_after`` is the on-hand count with the purchase in it."""
    paid = purchase_unit_price(part, cost, packages)
    if paid is None:
        return None
    old = strict_amount(part.get("cost"))
    bought = restock_units(part, packages)
    before = max(0.0, (owned_after or 0.0) - bought)
    if old is None or before <= 0 or bought <= 0:
        return paid
    return round2((before * old + bought * paid) / (before + bought))
