# Test-Coverage Audit — Maintenance Supporter

**Snapshot:** 2026-07-09 · integration **v2.22.3** · commit `42bb38c`
**Supersedes:** the 2026-07-05 audit (PR #84, closed — 81 commits stale).

> This is a point-in-time snapshot. The suite moves fast; treat the counts and
> "closed gap" claims as true only at the commit above.

## Scope

| Layer | Location | Size |
|---|---|---|
| Backend (pytest) | `tests/` | 150 `test_*.py` files, ~2,647 test functions |
| Frontend (web-test-runner, real Chromium) | `frontend-src/__tests__/` | 35 `*.test.ts` files |
| User-journey suite (cross-boundary sequences) | `tests/test_journey_*.py` + `tests/journey.py` | 27 files (categories A–R) |
| E2E (Playwright, real HA panel) | `e2e/specs/` | 2 specs (`lifecycle` non-blocking in CI, `onboarding` local) |
| Live e2e (Node-WS / browser against a real instance) | `e2e/live-*.mjs` | 15 scripts |

**Verdict.** Backend coverage of the core domain (scheduling, triggers,
notifications, documents, import/export, archive/retention, adaptive math,
pause/replace, seasonal/finite scheduling, postpone) is deep and asserts real
outcomes — persisted store state, history-entry contents, WS error codes,
`Unauthorized` rejections, and TS↔Python↔locale parity tripwires. The frontend
suite exercises the panel shell and dialogs in real Chromium. The journey suite
adds cross-boundary sequences (edit → restart → assert) that unit tests can't
see. This is a well-tested integration.

## The 2026-07-05 top gaps are closed

Every top-10 gap the previous audit listed has since been addressed:

| Prior gap | Status now |
|---|---|
| Permission enforcement sampled (~4 of ~41 WS commands) | **Closed** — `test_ws_permission_matrix.py` inventories every gated command |
| Panel shell: complete dialog, virtualized table, today view, deep-link | **Closed** — `complete-dialog`, `virtual-window`, `panel-shell`, `panel-deeplink` tests |
| Weekly-digest Monday gate / dispatch pipeline | **Closed** — `test_daily_tick.py`, `test_defensive_branches.py` |
| Cross-boundary sequences (persistence across restart) | **Closed** — 27-file journey suite + `simulate_restart` / `simulate_full_restart` |

## New dimension: payload fidelity at the integration boundary

The #88 regression exposed a blind-spot **class**, not a one-off: a test can send
a WS handler a payload shaped the way the *handler* expects, pass, and still miss
a bug because the *client* (panel) sends a different shape. #88 was exactly this
— the panel sends a **bare** recurrence carrier (`schedule:{kind:"interval"}`,
no `every`) *alongside* the flat `interval_days`, and `ws_create_task` /
`ws_update_task` mistook the bare carrier for a complete schedule and dropped the
interval. Every pre-existing schedule test built the nested schedule *with*
`every` (a complete schedule) or used pure-flat fields — none replicated the
panel's split payload through the real handler.

Audit of every schedule-carrying write path against "is there a test that sends
the **client's actual** payload shape?":

| Write path | Client payload shape | Keeps flat + merges? | Client-shape test |
|---|---|---|---|
| `ws_create_task` (panel) | bare `{kind:interval}` + flat interval | **fixed** (was the #88 bug) | `test_repro_bugs.py::test_issue88_create_…` |
| `ws_update_task` (panel) | bare `{kind:interval}` + flat interval | **fixed** (was the #88 bug) | `test_repro_bugs.py::test_issue88_update_…` |
| config-flow edit_task | flat interval + bare nested only for season/ends | ✓ correct (keeps flat) | `test_options_task.py::test_edit_task_sets_season_and_finite_series` (asserts `every==14`) |
| config-flow add_task | flat only | ✓ (no bare nested) | `test_config_flow*.py` |
| service `add_task` (`async_create_task_simple`) | flat + optional schedule, both kept | ✓ correct | `test_services_crud.py` |
| `object/create` (template) | flat template fields | ✓ (no bare nested) | `test_ws_objects.py` |

**Result:** all six schedule-carrying write paths now either keep the flat
fields (letting `normalize_task_storage` merge) or send flat only, and the two
that regressed carry client-shape tripwires. No further instances of the class
were found (audited 2026-07-09).

### Generalizable rule

For any WS write handler that accepts more than one representation of the same
data, at least one test must send the **client's literal payload** (copy it from
the frontend builder), not a hand-shaped one. Candidates to keep honest as they
evolve: `task/create`, `task/update`, `object/create`, `object/update`,
`task/complete` (checklist/reading/photo/cost split), `documents/update`.

## Residual gaps (small, verified)

- **Data loss is unrecoverable after the fact.** A time-based task saved on
  2.22.0–2.22.2 persisted `every:null`; the interval isn't in the export either,
  so it can't be migrated back — only re-saving restores it. Consider a one-time
  repair/migration that flags interval tasks with `every is None` so users don't
  have to notice per-task. (Product decision, not a test gap.)
- **Loop-safety is asserted by unit test, not by CI's runtime detector.** The
  #87 (workday) and #88 (babel) blocking-call fixes are proven by executor-thread
  assertions; HA's `block_async_io` detector is unreliable as a gate (skips
  already-cached modules). New blocking I/O on the loop can still land silently.
  A periodic "import under the real detector" smoke over the shipped image would
  catch the next one.
- **The E2E `lifecycle.spec` is non-blocking** and flakes on a slow runner
  (90 s `beforeEach`). It has caught real render regressions; once stable it
  should graduate to a blocking gate.

## Method

Generated from source + test inspection at `42bb38c`. Counts from
`ls tests/test_*.py` (150), the last full backend run (2,647 passed), and the
WS-handler inventory (`grep` of `websocket/*.py`). The payload-fidelity section
traces each schedule-carrying write path from its frontend builder through the
handler to the persisted store shape.
