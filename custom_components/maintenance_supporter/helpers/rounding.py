"""Two decimals the way the panel rounds them.

The panel rounds money and part quantities with ``Math.round(v * 100) / 100``:
a half goes up. Python's ``round`` sends it to the even neighbour, so a
total of 4.50 for four showed 1.13 each in the purchase dialog and was
stored as 1.12 (DRY audit 2026-10-30, X6-A1). Both sides now compute it one
way, and ``frontend-src/__tests__/fixtures/rounding-vectors.json`` pins it
for both test suites.
"""

from __future__ import annotations

import math


def round2(value: float) -> float:
    """``value`` to two decimals, exactly as JavaScript's
    ``Math.round(value * 100) / 100``: the same double arithmetic, and a
    half rounds towards +∞ (``Math.round(-112.5)`` is -112). Not
    ``floor(x + 0.5)``, which tips 0.49999999999999994 over to 1. An
    infinity or NaN comes back as it is, as from ``Math.round``."""
    scaled = value * 100
    if not math.isfinite(scaled):
        return value
    low = math.floor(scaled)
    return (low + 1 if scaled - low >= 0.5 else low) / 100
