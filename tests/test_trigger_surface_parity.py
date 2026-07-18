"""Drift tripwires between the trigger-config surfaces (#103 class).

`trigger_config` is built/edited on FOUR surfaces: the WS API (whose
`_TRIGGER_ALLOWED_KEYS` is the authoritative key set), the panel task dialog,
the HA options flow, and the suggested-setups adopt path. History shows they
drift apart silently:

* #7  (2026-03): `trigger_on_states` added to the options flow only.
* #103 (2026-07): the panel dialog neither offered nor roundtripped
  `trigger_on_states` — any panel edit of an adopted mower task silently
  reset it to ["on"] and stopped the runtime accumulation.
* Same audit: the panel compound editor dropped per-condition
  attribute/baseline/entity_logic, and the options-flow rebuild dropped
  `trigger_baseline_value`.

These tests pin the closure: every allowlisted key must be KNOWN to both
UIs (rendered, roundtripped, or explicitly carried), and the adopt path may
only emit allowlisted keys (anything else would be stripped by the WS
sanitiser on the next UI edit).
"""

from __future__ import annotations

import re
from pathlib import Path

from homeassistant.core import HomeAssistant

from custom_components.maintenance_supporter.websocket.tasks_validation import (
    _TRIGGER_ALLOWED_KEYS,
)

COMPONENT = Path("custom_components/maintenance_supporter")

# Keys that are meta/structural rather than editable fields.
_STRUCTURAL = {"type", "entity_id", "entity_ids", "conditions"}


def _const_names_for(key: str) -> set[str]:
    """All CONF_* constant names in const.py whose value is `key`."""
    src = (COMPONENT / "const.py").read_text(encoding="utf-8")
    return set(re.findall(rf'^(\w+)\s*(?::[^=]+)?=\s*"{re.escape(key)}"', src, re.M))


def _source_knows_key(src: str, key: str) -> bool:
    """The surface references the key — as a string, a property access
    (`tc.trigger_on_states` in TypeScript), an object-literal key, or via
    its CONF_ constant. Word-bounded so partial names don't count."""
    if re.search(rf"\b{re.escape(key)}\b", src):
        return True
    return any(name in src for name in _const_names_for(key))


def test_panel_dialog_knows_every_allowlisted_key() -> None:
    """The panel task dialog must reference every WS-allowlisted trigger key.

    A key the dialog has never heard of is a key it DROPS on save (the
    dialog rebuilds trigger_config from scratch) — the #103 silent-loss
    class. A new engine/adopt field must land in task-dialog.ts (field,
    hydration or carry) in the same change that allowlists it.
    """
    src = (COMPONENT / "frontend-src" / "components" / "task-dialog.ts").read_text(encoding="utf-8")
    missing = sorted(k for k in _TRIGGER_ALLOWED_KEYS if not _source_knows_key(src, k))
    assert not missing, (
        f"task-dialog.ts does not reference allowlisted trigger keys {missing} — "
        "a panel save would silently drop them (see #103). Add a form field, "
        "hydrate+re-emit, or route them through the compound `carry` passthrough."
    )


# Keys the options flow deliberately has NO form field for. Each entry needs
# a reason AND the flow must still PRESERVE the key across its rebuild (the
# carry-over block in config_flow_trigger's attribute step).
_FLOW_FIELDLESS_OK = {
    # Panel-managed: recovery auto-complete (#53) and the counting start
    # value (#102) — both carried over verbatim by the rebuild.
    "auto_complete_on_recovery",
    "trigger_baseline_value",
}


def test_options_flow_knows_every_allowlisted_key() -> None:
    """The options flow must reference (or explicitly carry) every key.

    Its attribute step rebuilds trigger_config from scratch; a key it
    neither re-writes nor carries is lost on every options-flow edit.
    """
    src = (COMPONENT / "config_flow_trigger.py").read_text(encoding="utf-8")
    missing = sorted(
        k
        for k in _TRIGGER_ALLOWED_KEYS
        if not _source_knows_key(src, k) and k not in _FLOW_FIELDLESS_OK
    )
    assert not missing, (
        f"config_flow_trigger.py does not reference allowlisted trigger keys {missing} — "
        "an options-flow edit would silently drop them. Add a form field or add the "
        "key to the rebuild carry-over (and to _FLOW_FIELDLESS_OK with a reason)."
    )
    # The fieldless keys must at least be carried across the rebuild.
    for key in _FLOW_FIELDLESS_OK:
        assert f'"{key}"' in src, (
            f"'{key}' is exempt from having a flow field but is no longer carried "
            "across the trigger rebuild — an options-flow edit now drops it."
        )


async def test_adopt_path_emits_only_allowlisted_keys(hass: HomeAssistant) -> None:
    """Every trigger key build_setup_trigger can emit must be WS-allowlisted.

    Adopted configs bypass the WS schema; a non-allowlisted key would work
    until the first UI edit, then be stripped by the sanitiser — the same
    silent-loss shape from the other direction. Executed over the FULL
    catalog so new directions are covered automatically.
    """
    from custom_components.maintenance_supporter.helpers.integration_signatures import (
        SIGNATURES,
        build_setup_trigger,
    )

    emitted: dict[str, set[str]] = {}
    for domain, sig in SIGNATURES.items():
        for task_sig in sig.tasks:
            trigger = build_setup_trigger(task_sig, hass, ["sensor.parity_probe"])
            extra = set(trigger) - _TRIGGER_ALLOWED_KEYS
            if extra:
                emitted[f"{domain}/{task_sig.task_name}"] = extra
    assert not emitted, (
        f"adopt path emits non-allowlisted trigger keys (stripped on next UI edit): {emitted}"
    )


def test_allowlist_is_the_superset_reference() -> None:
    """Sanity: the structural keys this file assumes still exist."""
    assert _STRUCTURAL <= _TRIGGER_ALLOWED_KEYS
