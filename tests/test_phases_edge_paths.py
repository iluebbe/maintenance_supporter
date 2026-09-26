"""Task phases (#139) — the sanitizer caps and the flow-text parser's corners.

The phase helpers are pure; these pin the defensive branches that the
end-to-end phase tests never reach: the definition cap, malformed
definitions, cursors of the wrong type, a sequence pointing at a missing
definition, and the options-flow textarea's slug generation.
"""

from __future__ import annotations

from custom_components.maintenance_supporter.helpers.phases import (
    MAX_PHASE_DEFS,
    clamp_phase_cursor,
    current_phase,
    effective_field,
    parse_phases_text,
    sanitize_phase_defs,
)


def test_definitions_are_capped_and_malformed_ones_skipped() -> None:
    raw: dict[str, object] = {"broken": "not-a-definition", "BadId!": {"name": "x"}}
    raw.update({f"p{i}": {"name": f"Step {i}", "notes": f"  note {i}  "} for i in range(MAX_PHASE_DEFS + 3)})

    defs = sanitize_phase_defs(raw)

    assert len(defs) == MAX_PHASE_DEFS
    assert "broken" not in defs and "BadId!" not in defs
    assert defs["p0"] == {"name": "Step 0", "notes": "note 0"}


def test_blank_notes_are_not_stored() -> None:
    assert sanitize_phase_defs({"a": {"name": "A", "notes": "   "}}) == {"a": {"name": "A"}}


def test_cursor_of_the_wrong_type_or_empty_sequence_resets_to_zero() -> None:
    assert clamp_phase_cursor(3, 0) == 0
    assert clamp_phase_cursor(True, 4) == 0  # a bool is not a position
    assert clamp_phase_cursor(None, 4) == 0
    assert clamp_phase_cursor([1], 4) == 0
    assert clamp_phase_cursor("nope", 4) == 0
    assert clamp_phase_cursor("5", 4) == 1  # numeric strings wrap like ints


def test_a_sequence_pointing_at_a_deleted_definition_has_no_current_phase() -> None:
    task = {
        "checklist": ["task-level"],
        "phases": {"a": {"name": "A", "checklist": ["phase-level"]}},
        "phase_sequence": ["ghost", "a"],
        "phase_cursor": 0,
    }

    assert current_phase(task) is None
    # With no resolvable phase, every field falls through to the task.
    assert effective_field(task, "checklist") == ["task-level"]


def test_flow_text_slugs_are_unique_and_valid() -> None:
    defs, seq = parse_phases_text("Swap\nSWAP disks\nSwap-\n_hidden\n: orphan checklist\nSwap disks", None)

    # "Swap" and "Swap-" collide on the slug "swap" → numbered; a name whose
    # slug cannot start an id falls back to "phase"; a line with no name
    # before the colon is ignored; a repeated name reuses its id.
    assert seq == ["swap", "swap-disks", "swap-2", "phase", "swap-disks"]
    assert defs["swap"]["name"] == "Swap"
    assert defs["swap-2"]["name"] == "Swap-"
    assert defs["phase"]["name"] == "_hidden"
    assert all(d.get("checklist") is None for d in defs.values())
