"""Spare parts & consumables — pure domain logic.

Maintenance consumes things (filters, seals, descaler, salt). This module owns
the part model and every rule around it, hass-free so it is trivially
unit-testable:

- normalization/validation of the part dict stored in ``entry.data["parts"]``
- GTIN validation (GS1 check digit; the GTIN family covers EAN-13/UPC-A/EAN-8)
- edge-triggered stock transitions (``low`` / ``out`` / ``restocked``)
- the **declarative buy-task reconciler**: an auto "Buy {part}" task exists
  exactly while its part opts in AND is low. Computing the desired set and
  diffing against reality makes idempotence and self-healing fall out as
  properties instead of special cases.
- the shopping-search URL resolver (product_url wins; otherwise a configurable
  ``{q}`` template with query precedence GTIN → "{vendor} {mpn}" → name).

Static part definitions live in ``entry.data["parts"]`` (like ``tasks``); the
mutable stock count lives in the per-entry Store (like ``last_performed``) and
is passed in here as a plain ``{part_id: stock}`` map.
"""

from __future__ import annotations

import re
from collections.abc import Callable, Mapping
from datetime import date
from typing import Any
from urllib.parse import quote_plus
from uuid import uuid4

# ── Limits (mirrored in the WS schemas + panel dialog) ──────────────────────
MAX_PARTS_PER_OBJECT = 50
MAX_PART_NAME = 100
MAX_PART_MPN = 64
MAX_PART_VENDOR = 64
MAX_PART_STORAGE_LOCATION = 120
MAX_PART_NOTES = 500
MAX_PART_UNIT = 16
MAX_PART_URL = 500
MAX_PART_COST = 100_000.0
MAX_PART_STOCK = 9_999
MAX_CONSUMES_PER_TASK = 10
MAX_CONSUME_QUANTITY = 999

# Marker on auto-created buy tasks: {"part_id": "..."} — the reconciler
# exclusively owns tasks carrying it. Detached (popped) from a COMPLETED buy
# task once its part is restocked, so the task survives as a plain done
# one-off (its cost history stays in the statistics) while the next low
# episode is free to create a fresh reminder.
PART_REF_FIELD = "part_ref"

# Label + icon stamped on auto-created buy tasks (design decision: existing
# ``custom`` task type + label instead of a new task-type enum).
BUY_TASK_LABEL = "shopping"
BUY_TASK_ICON = "mdi:cart"

# Localized "Buy {name}" templates (HA config language; EN fallback). Kept as
# a flat table like templates_i18n — the backend can't reach strings.json for
# runtime-generated names.
_BUY_NAME_TEMPLATES = {
    "en": "Buy {name}",
    "de": "{name} kaufen",
    "fr": "Acheter {name}",
    "es": "Comprar {name}",
    "it": "Acquistare {name}",
    "nl": "{name} kopen",
    "pl": "Kup {name}",
    "pt": "Comprar {name}",
    "cs": "Koupit {name}",
    "da": "Køb {name}",
    "fi": "Osta {name}",
    "hi": "{name} खरीदें",
    "ja": "{name}を購入",
    "nb": "Kjøp {name}",
    "ru": "Купить {name}",
    "sv": "Köp {name}",
    "uk": "Купити {name}",
    "zh": "购买{name}",
    "pt-br": "Comprar {name}",
    "hu": "{name} vásárlása",
    "ko": "{name} 구매",
    "tr": "{name} satın al",
}

# Default shopping-search templates by UI language (the "Amazon as fallback"
# decision); overridable via the global ``part_search_url_template`` setting.
_DEFAULT_SEARCH_TEMPLATES = {
    "de": "https://www.amazon.de/s?k={q}",
    "fr": "https://www.amazon.fr/s?k={q}",
    "it": "https://www.amazon.it/s?k={q}",
    "es": "https://www.amazon.es/s?k={q}",
    "nl": "https://www.amazon.nl/s?k={q}",
    "pt-br": "https://www.amazon.com.br/s?k={q}",
    "tr": "https://www.amazon.com.tr/s?k={q}",
}
_FALLBACK_SEARCH_TEMPLATE = "https://www.amazon.com/s?k={q}"


class PartValidationError(ValueError):
    """A part payload failed validation."""


# ── GTIN ─────────────────────────────────────────────────────────────────────


def validate_gtin(raw: Any) -> str | None:
    """Normalize + validate a GTIN (EAN-13 / UPC-A / EAN-8 / GTIN-14).

    The GS1 GTIN family is the worldwide standard — EAN-13 is GTIN-13, the
    North-American UPC-A is GTIN-12 (an EAN-13 with a leading zero). Accepts
    8/12/13/14 digits (spaces/dashes tolerated), verifies the GS1 mod-10 check
    digit, and returns the normalized digit string. ``None`` for empty input;
    raises :class:`PartValidationError` for malformed input.
    """
    if raw is None:
        return None
    s = re.sub(r"[\s-]", "", str(raw))
    if not s:
        return None
    if not s.isdigit() or len(s) not in (8, 12, 13, 14):
        raise PartValidationError("gtin must be 8, 12, 13 or 14 digits (EAN/UPC/GTIN)")
    digits = [int(c) for c in s]
    check = digits[-1]
    total = 0
    # GS1: number positions from the RIGHT starting at 1 (the check digit);
    # even positions weigh 3, odd weigh 1.
    for i, d in enumerate(reversed(digits[:-1]), start=2):
        total += d * (3 if i % 2 == 0 else 1)
    if (10 - total % 10) % 10 != check:
        raise PartValidationError("gtin check digit is invalid")
    return s


# ── Part normalization ───────────────────────────────────────────────────────


def _clean_str(raw: Any, field: str, max_len: int) -> str:
    s = str(raw or "").strip()
    if len(s) > max_len:
        raise PartValidationError(f"{field} must be at most {max_len} characters")
    return s


def _clean_url(raw: Any) -> str:
    s = str(raw or "").strip()
    if not s:
        return ""
    if len(s) > MAX_PART_URL or not re.match(r"^https?://", s):
        raise PartValidationError("product_url must be an http(s) URL")
    return s


def _clean_cost(raw: Any) -> float | None:
    if raw in (None, ""):
        return None
    try:
        v = round(float(raw), 2)
    except (TypeError, ValueError) as err:
        raise PartValidationError("cost must be a number") from err
    if not 0 <= v <= MAX_PART_COST:
        raise PartValidationError("cost out of range")
    return v


def round_qty(v: float) -> float | int:
    """Canonical quantity rounding (#98 decimal consumables): 2 decimals,
    whole numbers collapse back to int so exports/UI stay clean."""
    r = round(float(v), 2)
    return int(r) if r.is_integer() else r


def _clean_stock(raw: Any, field: str) -> float | int | None:
    """Stock-ish number or None. ``stock: None`` = inventory not tracked.

    Decimal quantities are allowed (#98 — half a can of spray is 0.5),
    rounded to 2 decimals.
    """
    if raw in (None, ""):
        return None
    try:
        v = float(raw)
    except (TypeError, ValueError) as err:
        raise PartValidationError(f"{field} must be a number") from err
    if not 0 <= v <= MAX_PART_STOCK:
        raise PartValidationError(f"{field} out of range (0-{MAX_PART_STOCK})")
    return round_qty(v)


def normalize_part(raw: Mapping[str, Any]) -> dict[str, Any]:
    """Validate + normalize one part definition (the stored static shape).

    ``stock`` is intentionally NOT part of this dict — the mutable count lives
    in the per-entry Store. A part with no tracked stock is a catalog-only
    entry (identifiers + links), which is a valid, useful state.
    """
    if not isinstance(raw, Mapping):
        raise PartValidationError("part must be an object")
    name = _clean_str(raw.get("name"), "name", MAX_PART_NAME)
    if not name:
        raise PartValidationError("part name must not be empty")
    part: dict[str, Any] = {
        "id": str(raw.get("id") or uuid4().hex),
        "name": name,
        "mpn": _clean_str(raw.get("mpn"), "mpn", MAX_PART_MPN),
        "gtin": validate_gtin(raw.get("gtin")),
        "vendor": _clean_str(raw.get("vendor"), "vendor", MAX_PART_VENDOR),
        "storage_location": _clean_str(raw.get("storage_location"), "storage_location", MAX_PART_STORAGE_LOCATION),
        "product_url": _clean_url(raw.get("product_url")),
        "notes": _clean_str(raw.get("notes"), "notes", MAX_PART_NOTES),
        "unit": _clean_str(raw.get("unit"), "unit", MAX_PART_UNIT),
        "cost": _clean_cost(raw.get("cost")),
        "reorder_threshold": _clean_stock(raw.get("reorder_threshold"), "reorder_threshold"),
        "restock_quantity": _clean_stock(raw.get("restock_quantity"), "restock_quantity"),
        "auto_buy_task": bool(raw.get("auto_buy_task")),
        # Receipt/datasheet via the refcounted DocumentStore (not inline files).
        "doc_id": _clean_str(raw.get("doc_id"), "doc_id", 64) or None,
    }
    return part


def sanitize_consumes_parts(
    raw: Any,
    valid_part_ids: set[str] | None = None,
    *,
    foreign_part_ids: Callable[[str], set[str] | None] | None = None,
) -> list[dict[str, Any]]:
    """Cap/clean a task's ``consumes_parts`` list.

    Shape is ``[{part_id, quantity, entry_id?}]``. A link WITHOUT ``entry_id``
    consumes a part of the task's own object, which is every link written
    before 2.45 and stays the default. With ``entry_id`` it consumes a pool
    owned by another object (#111) — several appliances drawing on one box of
    filters — and ``foreign_part_ids`` is asked whether that entry really has
    that part. Without the callback, foreign links are dropped rather than
    trusted.

    Unknown ids are dropped when the corresponding validator is given; quantity
    is clamped to 1..MAX_CONSUME_QUANTITY; duplicates collapse (last wins).

    The dedupe key is the (entry_id, part_id) PAIR, not the id alone: part ids
    are uuid4 in general but the battery fleet mints deterministic ones
    (``batt_aa``), so two objects genuinely can carry the same id.
    """
    if not isinstance(raw, list):
        return []
    out: dict[tuple[str | None, str], dict[str, Any]] = {}
    for item in raw[:MAX_CONSUMES_PER_TASK]:
        if not isinstance(item, Mapping):
            continue
        part_id = str(item.get("part_id") or "").strip()
        if not part_id:
            continue
        entry_id = str(item.get("entry_id") or "").strip() or None
        if entry_id is None:
            if valid_part_ids is not None and part_id not in valid_part_ids:
                continue
        else:
            known = foreign_part_ids(entry_id) if foreign_part_ids else None
            if known is None or part_id not in known:
                continue
        try:
            qty = float(item.get("quantity", 1))
        except (TypeError, ValueError):
            qty = 1.0
        # Decimal consumption is allowed (#98). Zero/negative behaves like
        # invalid input (falls back to 1), matching the old integer clamp.
        if qty <= 0:
            qty = 1.0
        link: dict[str, Any] = {
            "part_id": part_id,
            "quantity": round_qty(min(qty, MAX_CONSUME_QUANTITY)),
        }
        # Only written when the pool lives elsewhere, so a same-object link is
        # byte-identical to what every earlier version wrote.
        if entry_id is not None:
            link["entry_id"] = entry_id
        out[(entry_id, part_id)] = link
    return list(out.values())


# ── Stock rules ──────────────────────────────────────────────────────────────


def part_is_low(part: Mapping[str, Any], stock: float | None) -> bool:
    """Tracked stock at/below the reorder threshold."""
    threshold = part.get("reorder_threshold")
    return stock is not None and threshold is not None and stock <= float(threshold)


def part_wants_buy_task(part: Mapping[str, Any]) -> bool:
    return bool(part.get("auto_buy_task")) and part.get("reorder_threshold") is not None


def stock_transition(part: Mapping[str, Any], old: float | None, new: float | None) -> str | None:
    """The edge this stock change crossed, if any: ``low`` / ``out`` / ``restocked``.

    Edge-triggered on purpose — a further decrease while already low never
    re-nags, and automations get exactly one event per crossing.
    """
    if new is None:
        return None
    was_low = part_is_low(part, old)
    is_low = part_is_low(part, new)
    if new == 0 and (old is None or old > 0):
        return "out"
    if is_low and not was_low:
        return "low"
    if was_low and not is_low:
        return "restocked"
    return None


# ── Shopping-search URL ──────────────────────────────────────────────────────


def default_search_template(lang: str) -> str:
    from .i18n import normalize_language_code

    return _DEFAULT_SEARCH_TEMPLATES.get(normalize_language_code(lang), _FALLBACK_SEARCH_TEMPLATE)


def search_query(part: Mapping[str, Any]) -> str:
    """Query precedence: GTIN (most precise) → "{vendor} {mpn}" → name."""
    if part.get("gtin"):
        return str(part["gtin"])
    mpn = str(part.get("mpn") or "").strip()
    if mpn:
        vendor = str(part.get("vendor") or "").strip()
        return f"{vendor} {mpn}".strip()
    return str(part.get("name") or "")


def resolve_shopping_url(part: Mapping[str, Any], template: str | None, lang: str) -> str:
    """The link to buy this part: ``product_url`` wins; else the search template."""
    if part.get("product_url"):
        return str(part["product_url"])
    tpl = (template or "").strip() or default_search_template(lang)
    if "{q}" not in tpl:
        tpl = tpl.rstrip("/") + "?q={q}"
    return tpl.replace("{q}", quote_plus(search_query(part)))


# ── Buy-task construction + declarative reconcile ────────────────────────────


def buy_task_name(part_name: str, lang: str) -> str:
    from .i18n import normalize_language_code

    tpl = _BUY_NAME_TEMPLATES.get(normalize_language_code(lang), _BUY_NAME_TEMPLATES["en"])
    return tpl.replace("{name}", part_name)


def buy_task_notes(part: Mapping[str, Any], stock: float | None) -> str:
    """Self-contained purchase notes: identifiers, qty, price, storage spot.

    Deliberately mostly language-neutral (labels are identifiers like MPN/GTIN;
    the storage location is the user's own text).
    """
    lines: list[str] = []
    qty = part.get("restock_quantity") or 1
    unit = f" {part['unit']}" if part.get("unit") else ""
    lines.append(f"{qty}×{unit} {part['name']}".replace("× ", "× ").strip())
    idents = " · ".join(
        p
        for p in (
            f"{part['vendor']}" if part.get("vendor") else "",
            f"MPN: {part['mpn']}" if part.get("mpn") else "",
            f"GTIN: {part['gtin']}" if part.get("gtin") else "",
        )
        if p
    )
    if idents:
        lines.append(idents)
    if part.get("cost") is not None:
        lines.append(f"≈ {part['cost']:.2f} × {qty}")
    if stock is not None:
        lines.append(f"◎ {stock}")
    if part.get("storage_location"):
        lines.append(f"→ {part['storage_location']}")
    return "\n".join(lines)


def build_buy_task(
    part: Mapping[str, Any],
    stock: float | None,
    *,
    object_id: str,
    lang: str,
    search_template: str | None,
    today: date,
) -> dict[str, Any]:
    """The one-off shopping reminder for a low part (due today, actionable now)."""
    return {
        "id": uuid4().hex,
        "object_id": object_id,
        "name": buy_task_name(str(part["name"]), lang),
        "type": "custom",
        "enabled": True,
        "schedule": {"kind": "one_time", "due_date": today.isoformat()},
        "warning_days": 0,
        "created_at": today.isoformat(),
        "labels": [BUY_TASK_LABEL],
        "custom_icon": BUY_TASK_ICON,
        "notes": buy_task_notes(part, stock),
        "documentation_url": resolve_shopping_url(part, search_template, lang),
        PART_REF_FIELD: {"part_id": str(part["id"])},
    }


def reconcile_buy_tasks(
    parts: Mapping[str, Mapping[str, Any]],
    stocks: Mapping[str, float | None],
    tasks: Mapping[str, Mapping[str, Any]],
    *,
    object_id: str,
    lang: str,
    search_template: str | None,
    today: date,
    is_task_done: Any,
) -> tuple[dict[str, dict[str, Any]], list[str], list[str], bool]:
    """Compute the task map with auto "buy" reminders synced to low parts.

    Declarative: a buy task is **desired** for every part that opts in
    (:func:`part_wants_buy_task`) and is low (:func:`part_is_low`). Diffing
    desired vs. the tasks carrying a ``part_ref`` yields exactly the creates
    and removals — idempotence and self-healing are properties, not bookkeeping.

    Episode semantics: an existing buy task — open OR already completed —
    occupies its part's low episode, so completing the reminder (when the
    restock didn't lift the stock above the threshold) never respawns a
    duplicate. When the part leaves the desired set (restocked / opted out /
    deleted):

    - an **open** reminder is removed (orphan cleanup), while
    - a **completed** one keeps its cost history: its ``part_ref`` is detached
      so it survives as a plain done one-off (retention applies normally) and
      the next low episode starts fresh.

    ``is_task_done(task_dict) -> bool`` is injected so this module stays free
    of the task model. Returns ``(new_tasks, created_ids, removed_ids, changed)``.
    """
    desired: set[str] = {
        part_id
        for part_id, part in parts.items()
        if part_wants_buy_task(part) and part_is_low(part, stocks.get(part_id))
    }

    result: dict[str, dict[str, Any]] = {tid: dict(t) for tid, t in tasks.items()}
    existing_by_part: dict[str, str] = {}
    for tid, task in result.items():
        ref = task.get(PART_REF_FIELD)
        if isinstance(ref, Mapping) and ref.get("part_id"):
            existing_by_part[str(ref["part_id"])] = tid

    created: list[str] = []
    removed: list[str] = []

    for part_id, tid in list(existing_by_part.items()):
        if part_id in desired:
            continue
        if is_task_done(result[tid]):
            # Keep the completed reminder (and its cost history); detach the
            # marker so the next low episode can create a fresh one.
            result[tid].pop(PART_REF_FIELD, None)
        else:
            removed.append(tid)
            del result[tid]
        existing_by_part.pop(part_id, None)

    for part_id in sorted(desired):
        if part_id in existing_by_part:
            continue
        task = build_buy_task(
            parts[part_id],
            stocks.get(part_id),
            object_id=object_id,
            lang=lang,
            search_template=search_template,
            today=today,
        )
        result[task["id"]] = task
        created.append(task["id"])

    changed = bool(created or removed) or any(
        tasks[tid].get(PART_REF_FIELD) != result[tid].get(PART_REF_FIELD) for tid in tasks if tid in result
    )
    return result, created, removed, changed
