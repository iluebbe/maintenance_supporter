# Mutation testing over the pure-logic helpers

Line coverage says a test *executed* a line; a mutation run asks whether any
test would *notice* if the line were wrong. The runner flips one operator or
constant at a time (`>` ↔ `>=`, `and` ↔ `or`, `+` ↔ `-`, `True` ↔ `False`,
`n` → `n+1`, drop `not`) and re-runs the tests mapped to that module — a
mutant that exits green is a **survivor**: a behaviour the suite cannot see.

## Running it

```bash
./scripts/mutation-run.sh                    # all targets
./scripts/mutation-run.sh trigger_fallback   # one module (substring match)
```

The script runs inside the `ha-maint` dev container on a **work copy** under
`/tmp/mutwork` — the bind-mounted repo is never mutated, so an aborted run
cannot leave a mutant in the working tree. JSON reports land in
`.mutation/` (gitignored). This is a **periodic audit, not a CI gate**: run
it when a pure-logic helper changes substantially, or once a release cycle.

## Scope

Targets live in `scripts/mutation_targets.json`: each entry maps one
pure-logic helper to the test files that own it. Only fast, logic-dense
modules are listed (schedule math, status ladder, trigger fallback,
retention, saved-view matching, …) — mutating coordinator/WS plumbing would
mostly measure the HA harness, not our logic. When adding a helper, map the
narrowest test set that covers it; the runner verifies the mapping is green
on the ORIGINAL code before trusting any verdict.

## Equivalent mutants

Some mutations change nothing observable (e.g. `@dataclass(slots=True)`, a
1-second clamp shift that vanishes in 2-decimal rounding). Mark the line with
`# pragma: no mutate (<reason>)` — the reason is mandatory by convention, the
pragma is the documented equivalent of the parity contracts' EXEMPT lists.

## Why a ~200-line in-house runner instead of an established tool

Evaluated 2026-08-20 in the dev container (Python 3.14, pytest-ha-cc):

* **mutmut 2.5.1** crashes on Python 3.14 (`Globber.glob() got an unexpected
  keyword argument 'recursive'`).
* **mutmut 3.x** aborts in its whole-suite stats collection against the
  Home Assistant test harness (`BadTestExecutionCommandsException`) and its
  trampoline design drops the per-module test mapping that keeps a run in
  the minutes instead of hours.
* **cosmic-ray 8.7.0 WORKS** on this stack (free-form `test-command`, ran
  clean over a work copy) — head-to-head on trigger_fallback.py, a module
  this runner scores at 100%: cosmic-ray generated 260 mutants (vs 58) and
  reported **82 survivors, of which ~80% were noise** — mostly mutations of
  the `|` in `float | None` type annotations (never evaluated under
  `from __future__ import annotations`, guaranteed-equivalent) plus
  `==`→`is` on interned strings. The audit's product is a short actionable
  survivor list, so signal-to-noise beats operator count. cosmic-ray DID
  find one class this runner lacked — `continue`→`break` surviving in the
  per-entity loops — which was adopted as a runner operator and pinned with
  loop-order tests the same day.

**cosmic-ray remains the documented deep-scan option** for an occasional
second opinion on a single module (expect annotation-mutation noise):

```toml
# /tmp/crtest/cr.toml — run on a work copy, never the bind mount
[cosmic-ray]
module-path = "custom_components/maintenance_supporter/helpers/<module>.py"
timeout = 60.0
excluded-modules = []
test-command = "python -m pytest tests/<mapped tests> -x -q -p no:cacheprovider"
[cosmic-ray.distributor]
name = "local"
```
```bash
cosmic-ray init cr.toml session.sqlite && cosmic-ray exec cr.toml session.sqlite
cr-report session.sqlite
```

The valuable artifacts — `scripts/mutation_targets.json`, the
`# pragma: no mutate` markers and the boundary-pin tests — are
tool-agnostic; switching engines later stays cheap.

`scripts/mutation_check.py` implements the classic operator set with a
single depth-first enumeration shared between collect and apply (an early
draft used `ast.walk` for collection — breadth-first — which scrambled every
survivor's line number; the collect pass now IS a dry-run of the mutator).

## Pilot results (2026-08-20, trigger_fallback.py)

58 mutants: initial score **81%** — 11 survivors, of which 9 were real test
gaps (almost all boundary cases: `value == limit` on every trigger type, the
all-vs-any aggregation divergence, the future-`on_since` clamp, rounding) and
2 were equivalent (pragma'd). After adding the boundary pins the module
scores **98%** with the one quasi-equivalent survivor pragma'd → 100%.

## First full run (2026-08-20) — scores and backlog

| module | mutants | initial score | action |
|---|---|---|---|
| trigger_fallback.py | 54 | **100%** | pilot pins, done |
| completion_requirements.py | 8 | **100%** | done |
| saved_views.py | 39 | 92% | cap boundaries pinned same day |
| status.py | 17 | 71% | dict-twin boundaries pinned same day |
| schedule.py | 191 | 72% (54 survivors) | **backlog** — calendar-math boundaries (month lengths, nth-weekday, business days) deserve their own round |
| retention.py | 40 | 50% (20 survivors) | **backlog** — auto-archive/delete day thresholds barely pinned |
| dates.py | 68 | 35% (44 survivors) | mapping widened to include the schedule tests (they exercise the month/weekday math); re-score with the next run, then pin the rest |
| threshold_calculator.py | 39 | **0%** (39 survivors) | **backlog** — the module has ONE smoke test (empty-suggestions path); the suggestion math itself is unpinned |

The survivor lists live in the `.mutation/` reports. The status-ladder pin
run also surfaced one behaviour worth stating: with the `all` combinator a
latched trigger one day before the interval matures reads DUE_SOON — the
time ladder keeps warning, only TRIGGERED waits for both legs.
