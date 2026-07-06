"""Tripwire: the panel task-dialog and the HA config-flow must stay at parity.

A maintenance task can be edited in two UIs — the custom panel's
``task-dialog.ts`` and Home Assistant's options config-flow
(``config_flow_options_task.py`` + trigger/checklist sub-steps). Every
user-facing task field should be editable in both, otherwise a task created in
one UI silently can't be maintained in the other (the class of bug behind the
2.12.0 recovery-flag preserve-hack).

This test extracts the set of task storage-keys each surface writes and asserts
their symmetric difference is exactly the *known, intentional* divergences —
so **adding a new field to one UI without the other fails the build**. When a
divergence is deliberate, add it to the allowlist here with a reason.
"""

from __future__ import annotations

import re
from pathlib import Path

from custom_components.maintenance_supporter import const

ROOT = Path(__file__).resolve().parent.parent / "custom_components" / "maintenance_supporter"
DIALOG_TS = ROOT / "frontend-src" / "components" / "task-dialog.ts"
CONFIG_FLOW_SOURCES = [
    # config_flow_options_task.py was split into sibling mixin modules; scan them
    # all (the glob keeps this correct if the split grows further).
    *sorted(ROOT.glob("config_flow_options_task*.py")),
    ROOT / "config_flow.py",
    ROOT / "config_flow_trigger.py",
]

# Keys that appear in the dialog payload but are WS transport, not task fields.
_TRANSPORT_KEYS = {"type", "entry_id", "task_id"}
# Config-flow-side form-transport keys held on ``_current_task`` but parsed into
# a real storage key before persisting (the config-flow twin of _PANEL_KEY_ALIASES).
# ``labels_text`` is the free-text field parsed into the ``labels`` list.
_CONFIG_FLOW_TRANSPORT_KEYS = {"labels_text"}
# Server-managed, non-user-editable keys a surface may assign internally
# (e.g. the config-flow initializes an empty history on task creation). Not a
# parity concern — neither UI "edits" them.
_INTERNAL_KEYS = {"history"}
# The dialog sends the task's type under `task_type`; the WS handler maps it to
# the `type` storage key the config-flow writes directly. Compare at storage level.
_PANEL_KEY_ALIASES = {"task_type": "type"}
# Some task fields the dialog edits through a *sibling* WS call rather than the
# main task/update payload (same capability, different transport). Map that
# endpoint to the storage key it maintains so the field still counts as
# panel-editable — otherwise it looks like a config-flow-only divergence.
_PANEL_SIBLING_WS = {
    "task/set_environmental_entity": "adaptive_config",
}

# ─── Intentional divergences (each needs a reason) ──────────────────────────
# Panel-only: advanced completion features the legacy config-flow never grew.
PANEL_ONLY = {
    "on_complete_action",  # service call fired on completion (v1.3.0)
    "quick_complete_defaults",  # prefilled notes/cost/duration/feedback
}
# Config-flow-only: none at the top-level task-field layer. Compound triggers
# and per-entity trigger removal are *within* trigger_config and are covered by
# the separate trigger-parity roadmap item, not a top-level task field.
CONFIG_FLOW_ONLY: set[str] = set()


def _resolve_conf(name: str) -> str | None:
    """Resolve a CONF_* constant name to its storage-key string value."""
    value = getattr(const, name, None)
    return value if isinstance(value, str) else None


def _panel_fields() -> set[str]:
    src = DIALOG_TS.read_text(encoding="utf-8")
    # Isolate the _save method body (up to the WS send) so unrelated `data.`
    # uses elsewhere don't leak in.
    start = src.index("private async _save(")
    end = src.index("sendMessagePromise(data)", start)
    body = src[start:end]

    fields: set[str] = set()
    # `data.<key> = ...`
    fields.update(re.findall(r"\bdata\.([a-z_][a-z0-9_]*)\s*=", body))
    # keys in the initial `const data: ... = { key: ..., }` literal
    literal = body[body.index("= {") : body.index("};")]
    fields.update(re.findall(r"^\s*([a-z_][a-z0-9_]*)\s*:", literal, re.MULTILINE))

    fields -= _TRANSPORT_KEYS | _INTERNAL_KEYS
    result = {_PANEL_KEY_ALIASES.get(f, f) for f in fields}

    # Fields the dialog maintains via a sibling WS endpoint (whole-file scan,
    # since these calls live outside _save).
    for endpoint, storage_key in _PANEL_SIBLING_WS.items():
        if f'"maintenance_supporter/{endpoint}"' in src:
            result.add(storage_key)
    return result


def _config_flow_fields() -> set[str]:
    fields: set[str] = set()
    for path in CONFIG_FLOW_SOURCES:
        src = path.read_text(encoding="utf-8")
        # `<dict>[ "literal" ] = ...`  — the storage key is the literal
        for key in re.findall(
            r'(?:updated_task|new_task|task_data|_current_task)\[\s*"([a-z_][a-z0-9_]*)"\s*\]\s*=',
            src,
        ):
            fields.add(key)
        # `<dict>[ CONF_* ] = ...` — resolve the constant to its storage key
        for conf_name in re.findall(
            r"(?:updated_task|new_task|task_data|_current_task)\[\s*(CONF_[A-Z_]+)\s*\]\s*=",
            src,
        ):
            resolved = _resolve_conf(conf_name)
            if resolved:
                fields.add(resolved)
    return fields - _INTERNAL_KEYS - _CONFIG_FLOW_TRANSPORT_KEYS


def test_panel_and_config_flow_task_fields_are_at_parity() -> None:
    panel = _panel_fields()
    config_flow = _config_flow_fields()

    # Sanity: both extractors found a substantial, overlapping core. If a
    # refactor moves the save-site and the regex silently matches nothing,
    # this guards against a false green.
    core = {"name", "type", "interval_days", "warning_days", "enabled", "notes"}
    assert core <= panel, f"panel extractor missed core fields: {core - panel}"
    assert core <= config_flow, f"config-flow extractor missed core fields: {core - config_flow}"

    panel_only = panel - config_flow
    config_flow_only = config_flow - panel

    unexpected_panel_only = panel_only - PANEL_ONLY
    unexpected_config_flow_only = config_flow_only - CONFIG_FLOW_ONLY

    assert not unexpected_panel_only, (
        "Task field(s) editable in the panel but NOT in the config-flow "
        f"(add to config_flow_options_task.py, or allowlist as PANEL_ONLY with a "
        f"reason): {sorted(unexpected_panel_only)}"
    )
    assert not unexpected_config_flow_only, (
        "Task field(s) editable in the config-flow but NOT in the panel "
        f"(add to task-dialog.ts _save, or allowlist as CONFIG_FLOW_ONLY with a "
        f"reason): {sorted(unexpected_config_flow_only)}"
    )
