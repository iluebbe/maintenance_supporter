"""Ordinary least-squares line fit — the one used by the analysers.

The sensor-degradation predictor (value over time) and the adaptive
interval's Weibull fit (log-log probability plot) each carried their own
copy of the normal equations (DRY audit 2026-09-26 B). Pure Python, no numpy.
"""

from __future__ import annotations

from collections.abc import Sequence


def linear_fit(xs: Sequence[float], ys: Sequence[float], *, min_denom: float) -> tuple[float, float] | None:
    """``(slope, intercept)`` of ``y = slope·x + intercept``, or None for
    fewer than two points, mismatched lengths, or x values that (nearly)
    coincide — ``|n·Σx² − (Σx)²| < min_denom``.

    X is shifted by its first value before summing: translation leaves the
    slope and that denominator unchanged, and keeps large x (Unix timestamps
    ~1.7e9, whose squares exceed float precision) from cancelling
    catastrophically. The intercept is shifted back.
    """
    n = len(xs)
    if n < 2 or n != len(ys):
        return None
    x0 = xs[0]
    sum_x = sum(x - x0 for x in xs)
    sum_y = sum(ys)
    sum_xy = sum((x - x0) * y for x, y in zip(xs, ys, strict=True))
    sum_x2 = sum((x - x0) ** 2 for x in xs)
    denom = n * sum_x2 - sum_x**2
    if abs(denom) < min_denom:
        return None
    slope = (n * sum_xy - sum_x * sum_y) / denom
    intercept = (sum_y - slope * sum_x) / n - slope * x0
    return slope, intercept
