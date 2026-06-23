"""Structural guardrail: test files are named by behaviour, not by the coverage
milestone they happened to unlock.

The family ``test_coverage_97 -> 97b -> 97c -> 98b -> final`` plus
``test_cov_*`` was the archaeology of chasing the ``--cov-fail-under=98`` gate.
Those tests were redistributed into behaviour/module-based files. This guard
fails the moment a coverage-milestone-named file reappears, so the anti-pattern
cannot recur on the next coverage push (98 -> 99 %): name the test after the
behaviour/module under test and sort it into the matching file instead.
"""

from __future__ import annotations

import pathlib
import re

# Matches the coverage-milestone naming scheme we deliberately removed:
#   test_cov_*, test_coverage_<digit>*, *_final, *_97/_98/_99
_FORBIDDEN = re.compile(r"(_cov_|coverage_\d|_final\b|_97\b|_98\b|_99\b)")


def test_no_coverage_milestone_test_files() -> None:
    tests_dir = pathlib.Path(__file__).parent
    bad = sorted(
        p.name
        for p in tests_dir.glob("test_*.py")
        if _FORBIDDEN.search(p.name)
    )
    assert not bad, (
        "Coverage-milestone test filenames are forbidden — name the test after "
        "the behaviour/module under test and add it to that file instead of "
        f"creating a milestone file: {bad}"
    )
