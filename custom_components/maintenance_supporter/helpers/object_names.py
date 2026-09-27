"""Object-name uniqueness — one rule for every way an object is created.

An object's config-entry ``unique_id`` is the slug of its name *at creation*
and is never updated on a rename. Deriving the duplicate check from that id
(the old ``_abort_if_unique_id_configured`` rule) therefore went wrong both
ways (bug audit 2026-09-26):

* replacing an object under its own name — the panel pre-fills it — hit the
  predecessor's id and failed with ``already_configured``;
* after renaming "Washer" to "Dryer", a new "Washer" passed the name check of
  the setup form but was refused at the last step, losing the tasks just
  entered.

Names are compared by a Unicode-aware key (:func:`name_key`) against the
objects' CURRENT names; the unique id is then any free one. The ASCII slug
(``slugify_object_name``) stays what the unique ids are built from — it is
only the NAME rule that must not use it: every non-Latin letter vanishes from
the slug, so "Кухня 2" and "Ванная 2" both slugged to "2" and the second
object was refused as a duplicate (bug audit 2026-09-27).
"""

from __future__ import annotations

import unicodedata

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from ..const import CONF_OBJECT, CONF_OBJECT_NAME, DOMAIN, GLOBAL_UNIQUE_ID, slugify_object_name

_UNIQUE_ID_PREFIX = "maintenance_supporter_"


def name_key(name: str) -> str:
    """The comparison key of an object name.

    Case-folded and NFKD-decomposed; letters and digits of ANY script are
    kept (``str.isalnum``), accents (combining marks) fold away and every run
    of other characters becomes one separator. So "Pool Pump", "pool-pump"
    and "POOL  PUMP" are one name, "Küche" and "Kuche" too (like the entity
    ids HA derives), while "Кухня 2" and "Ванная 2" stay two. For an ASCII
    name this is exactly the old slug. A name of symbols only (emoji) keeps
    its folded text so two such names still differ.
    """
    folded = unicodedata.normalize("NFKD", name.casefold())
    chars = [ch if ch.isalnum() else " " for ch in folded if not unicodedata.combining(ch)]
    key = "_".join("".join(chars).split())
    return key or f"~{' '.join(folded.split())}"


def name_taken(hass: HomeAssistant, name: str, *, exclude_entry_id: str | None = None) -> bool:
    """Whether another object already carries ``name`` (compared by
    :func:`name_key`, so "Pool Pump" and "pool-pump" are the same name)."""
    key = name_key(name)
    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.unique_id == GLOBAL_UNIQUE_ID or entry.entry_id == exclude_entry_id:
            continue
        current = str((entry.data.get(CONF_OBJECT) or {}).get(CONF_OBJECT_NAME) or "")
        if current and name_key(current) == key:
            return True
    return False


def name_changed_onto_taken(hass: HomeAssistant, entry: ConfigEntry, new_name: str) -> bool:
    """A RENAME of ``entry`` onto a name another object already carries.

    The rule for the rename paths (``object/update``, the options flow's
    object settings, the reconfigure step): an unchanged name (same key) is
    always fine — the successor of a replace shares its archived
    predecessor's name, and the forms re-send the name on every save.
    """
    current = str((entry.data.get(CONF_OBJECT) or {}).get(CONF_OBJECT_NAME) or "")
    if name_key(new_name) == name_key(current):
        return False
    return name_taken(hass, new_name, exclude_entry_id=entry.entry_id)


def object_unique_id(hass: HomeAssistant, name: str, *, exclude_entry_id: str | None = None) -> str | None:
    """A free config-entry unique id for a new object named ``name``, or
    ``None`` when another object has that name. ``exclude_entry_id``: the
    object a replacement retires may share the name."""
    if name_taken(hass, name, exclude_entry_id=exclude_entry_id):
        return None
    taken = {entry.unique_id for entry in hass.config_entries.async_entries(DOMAIN)}
    base = f"{_UNIQUE_ID_PREFIX}{slugify_object_name(name)}"
    if base not in taken:
        return base
    n = 2
    while f"{base}_{n}" in taken:
        n += 1
    return f"{base}_{n}"
