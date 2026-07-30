"""The Home Assistant pin in CI must expire, not quietly become permanent.

CI installs `pytest-homeassistant-custom-component` and therefore whatever
Home Assistant it depends on. Unpinned it takes the newest — on 2026-07-30
that was the **beta** 2026.8.0b0, whose device registry (storage 1.12 → 3.2)
splits a device shared by several config entries into one device per entry.
Object↔device linking (2.19) relies on exactly that sharing, so our entities
land on our own split instead of the appliance's device, and every push went
red against a version no user runs. A gate that is always red is not a gate.

Pinning restores the signal, but a pin with no end date is how an integration
silently stops supporting current Home Assistant. So the workflow carries an
`HA-PIN-EXPIRES:` marker and this test fails once that date has passed — the
pin cannot outlive its reason without someone deciding to extend it.

To resolve: adapt to the new device registry, then raise or remove the pin and
the marker together.
"""

from __future__ import annotations

import re
from datetime import date
from pathlib import Path

import pytest

_WORKFLOW = Path(__file__).resolve().parent.parent / ".github" / "workflows" / "tests.yaml"

_PIN = re.compile(r'pytest-homeassistant-custom-component==([0-9][0-9.]*)')
_EXPIRY = re.compile(r"HA-PIN-EXPIRES:\s*(\d{4})-(\d{2})-(\d{2})")


def _workflow_text() -> str:
    if not _WORKFLOW.exists():
        pytest.skip(".github/ not mounted in this environment (enforced in CI)")
    return _WORKFLOW.read_text(encoding="utf-8")


def test_a_pinned_home_assistant_carries_an_expiry_date() -> None:
    """A pin without a deadline is a permanent one that nobody chose."""
    text = _workflow_text()
    pin = _PIN.search(text)
    if pin is None:
        # Unpinned again — the adaptation landed, nothing left to guard.
        assert _EXPIRY.search(text) is None, (
            "the HA pin is gone but its HA-PIN-EXPIRES marker was left behind; "
            "remove the marker so the next reader is not told to chase a pin "
            "that no longer exists"
        )
        return

    assert _EXPIRY.search(text), (
        f"pytest-homeassistant-custom-component is pinned to {pin.group(1)} with no "
        f"HA-PIN-EXPIRES: YYYY-MM-DD marker above it. Pin deliberately or not at all."
    )


def test_the_pin_has_not_outlived_its_deadline() -> None:
    """Fail loudly once the date passes, so the pin gets a decision.

    Extending is a legitimate outcome — moving the date IS the decision. What
    this prevents is the pin staying put because nothing ever asked about it.
    """
    text = _workflow_text()
    if _PIN.search(text) is None:
        return  # no pin, nothing to expire

    match = _EXPIRY.search(text)
    assert match is not None  # covered by the test above
    expires = date(int(match.group(1)), int(match.group(2)), int(match.group(3)))
    today = date.today()

    assert today <= expires, (
        f"The Home Assistant pin in .github/workflows/tests.yaml expired on "
        f"{expires.isoformat()} (today is {today.isoformat()}). It was added because "
        f"HA 2026.8 splits devices shared by several config entries, which breaks "
        f"object-to-device linking. Either finish that adaptation and remove the pin, "
        f"or move HA-PIN-EXPIRES to a new date and say why in the comment."
    )
