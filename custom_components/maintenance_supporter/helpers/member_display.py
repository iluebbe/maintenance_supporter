"""Household member display: initials + colour per HA user (#169 follow-up).

Task lists show the responsible person as an avatar — a coloured circle with
initials — so two members stay tellable apart on a phone where a full name
does not fit. Both parts have a DEFAULT derived without any configuration
(initials from the user's name, a palette colour from a stable hash of the
user id) and an admin OVERRIDE per member stored in the global entry's
options under ``member_display``::

    {"<user id>": {"initials": "MS", "color": "#1565c0"}}

Colours are restricted to :data:`AVATAR_PALETTE` — twelve Material 800-level
tones with white-on-colour contrast that holds in both HA themes. The panel
carries the same palette (``helpers/person.ts``); a tripwire pins the two.
"""

from __future__ import annotations

import hashlib
from collections.abc import Mapping
from typing import Any

from ..const import CONF_MEMBER_DISPLAY, MAX_META_LENGTH

AVATAR_PALETTE: tuple[str, ...] = (
    "#c62828",  # red
    "#ad1457",  # pink
    "#6a1b9a",  # purple
    "#4527a0",  # deep purple
    "#283593",  # indigo
    "#1565c0",  # blue
    "#00838f",  # cyan
    "#2e7d32",  # green
    "#558b2f",  # light green
    "#ef6c00",  # orange
    "#6d4c41",  # brown
    "#546e7a",  # blue grey
)
MAX_INITIALS_LENGTH = 3
MAX_MEMBER_DISPLAY_ENTRIES = 50


def default_initials(name: str | None) -> str:
    """Initials from a display name: first letter of the first and of the
    last word ("Maximiliane Schneider-Hoffmann" → "MS", "Dev" → "D").

    One character per word keeps CJK and other single-glyph names sensible;
    an empty name yields "?".
    """
    words = [w for w in (name or "").split() if w]
    if not words:
        return "?"
    if len(words) == 1:
        return words[0][0].upper()
    return (words[0][0] + words[-1][0]).upper()


def default_color(user_id: str) -> str:
    """A stable palette colour for a user id — distinct members get distinct
    colours by default, without anybody configuring anything."""
    digest = hashlib.sha1((user_id or "").encode("utf-8")).hexdigest()
    return AVATAR_PALETTE[int(digest[:8], 16) % len(AVATAR_PALETTE)]


def sanitize_member_display(raw: Any) -> dict[str, dict[str, str]]:
    """Validate the ``member_display`` setting from the WS write path.

    Keeps ``{user_id: {initials?, color?}}`` — initials stripped and capped,
    colours only from the palette, entries with nothing left dropped, the
    map capped. Anything that is not a mapping yields ``{}``.
    """
    if not isinstance(raw, Mapping):
        return {}
    out: dict[str, dict[str, str]] = {}
    for user_id, spec in raw.items():
        if not isinstance(user_id, str) or not user_id.strip() or len(user_id) > MAX_META_LENGTH:
            continue
        if not isinstance(spec, Mapping):
            continue
        entry: dict[str, str] = {}
        initials = spec.get("initials")
        if isinstance(initials, str) and initials.strip():
            entry["initials"] = initials.strip()[:MAX_INITIALS_LENGTH]
        color = spec.get("color")
        if isinstance(color, str) and color.strip().lower() in AVATAR_PALETTE:
            entry["color"] = color.strip().lower()
        if entry:
            out[user_id.strip()] = entry
        if len(out) >= MAX_MEMBER_DISPLAY_ENTRIES:
            break
    return out


def member_display(options: Mapping[str, Any] | None, user_id: str, name: str | None) -> dict[str, str]:
    """The resolved ``{initials, color}`` for one member: override over default."""
    overrides = sanitize_member_display((options or {}).get(CONF_MEMBER_DISPLAY))
    spec = overrides.get(user_id, {})
    return {
        "initials": spec.get("initials") or default_initials(name),
        "color": spec.get("color") or default_color(user_id),
    }
