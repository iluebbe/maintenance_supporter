"""Cross-language parity tripwires: frontend TS mirrors ↔ Python const.py.

Several lists are hand-maintained in BOTH const.py and the TypeScript frontend
(the objects-table column catalog and the budget-currency codes). The TS files
carry "keep in lockstep with const.py" comments but nothing enforced it — so a
change to one side could silently drift from the other.

These tests parse the TS source as text and assert the mirrored lists match
const.py exactly (order included, since both are ordered for display). If you
change one side, update the other or this fails.
"""

from __future__ import annotations

import re
from pathlib import Path

from custom_components.maintenance_supporter.const import (
    BUDGET_CURRENCIES,
    DEFAULT_OBJECTS_TABLE_COLUMNS,
    KNOWN_OBJECT_TABLE_COLUMNS,
)

_FRONTEND = (
    Path(__file__).resolve().parents[1]
    / "custom_components"
    / "maintenance_supporter"
    / "frontend-src"
)
_OBJECT_COLUMNS_TS = _FRONTEND / "helpers" / "object-columns.ts"
_SETTINGS_VIEW_TS = _FRONTEND / "components" / "settings-view.ts"


def _block(source: str, anchor: str) -> str:
    """Return the text between ``anchor`` and the next ``];``."""
    start = source.index(anchor)
    end = source.index("];", start)
    return source[start:end]


def _quoted_strings(text: str) -> list[str]:
    """Every double-quoted string in ``text``, in order."""
    return re.findall(r'"([^"]+)"', text)


def test_ts_object_columns_match_const_known_columns() -> None:
    src = _OBJECT_COLUMNS_TS.read_text(encoding="utf-8")
    # OBJECT_COLUMNS defs → the `key:` of each entry, in canonical order.
    block = _block(src, "export const OBJECT_COLUMNS")
    ts_keys = re.findall(r'key:\s*"([^"]+)"', block)
    assert ts_keys == KNOWN_OBJECT_TABLE_COLUMNS, (
        "object-columns.ts OBJECT_COLUMNS keys drifted from "
        "const.KNOWN_OBJECT_TABLE_COLUMNS"
    )


def test_ts_default_columns_match_const_defaults() -> None:
    src = _OBJECT_COLUMNS_TS.read_text(encoding="utf-8")
    block = _block(src, "export const DEFAULT_OBJECTS_TABLE_COLUMNS")
    ts_defaults = _quoted_strings(block)
    assert ts_defaults == DEFAULT_OBJECTS_TABLE_COLUMNS, (
        "object-columns.ts DEFAULT_OBJECTS_TABLE_COLUMNS drifted from const.py"
    )


def test_ts_currencies_match_const_budget_currencies() -> None:
    src = _SETTINGS_VIEW_TS.read_text(encoding="utf-8")
    block = _block(src, "const CURRENCIES")
    ts_currencies = _quoted_strings(block)
    assert ts_currencies == list(BUDGET_CURRENCIES), (
        "settings-view.ts CURRENCIES drifted from const.BUDGET_CURRENCIES keys"
    )
