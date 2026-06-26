# End-to-end tests

User-story E2E tests that drive a **real Home Assistant** with the integration
installed, in a **real browser**, via [`@playwright/test`]. They exist to catch
the class of bug that unit tests can't — frontend ↔ HA contract bugs and
rendering/interaction regressions (e.g. issue #69, where the empty-state "Add
object" button silently did nothing and the page reloaded itself).

## User stories covered

| Spec | Story |
|------|-------|
| `specs/onboarding.spec.ts` | A new user installs the integration and opens the dashboard with **zero objects**: the empty state renders, **"Add object" opens the create dialog**, the page **does not self-heal-bounce**, and **"Open Maintenance panel"** navigates. (#69) |
| `specs/lifecycle.spec.ts` | The **full life of an object**: create it via the Add-object dialog → an overdue task surfaces on the dashboard → completing it records history and drops it off the due view → archiving hides it → deleting removes it. |

## How it works

- `global-setup.ts` onboards the fresh HA (or logs in), ensures the integration
  is set up, creates one shared strategy dashboard (`ms-e2e`), and saves an
  authenticated `storageState` every spec reuses.
- `helpers.ts` provides a `ws()` call through the page's live `hass` connection
  (seed/inspect objects + tasks), dashboard helpers, and
  `gotoStrategyDashboard()` — which waits generously for the strategy to render
  and lets the shim's self-heal recover HA's one-shot `whenDefined` race
  (manually reloading races it and crashes the renderer).
- Tests seed/mutate state over WebSocket and assert the **rendered UI** (object
  / task names appearing and disappearing through the lifecycle), plus drive the
  real **Add-object dialog** through the DOM.

## Running

**Locally** (uses the docker `playwright-server` for a stable browser):

```bash
./e2e/run-local.sh                       # full suite
./e2e/run-local.sh specs/onboarding.spec.ts
```

It builds the bundle, boots a throwaway HA, and runs the suite. Reports/traces
land in `e2e/playwright-report/` and `e2e/test-results/` on failure
(`npm run report` to open).

**In CI**: the `e2e` job in `.github/workflows/tests.yaml` boots HA via
`docker run`, installs Chromium (`npx playwright install --with-deps chromium`),
and runs against `localhost` with `retries: 3`.

> **Status: non-blocking (`continue-on-error`), onboarding spec only.** CI runs
> `specs/onboarding.spec.ts` — the #69 guards (empty-state renders, "Add object"
> opens, no self-heal reload), the most stable part — and uploads traces on
> failure. The **lifecycle spec is local-only** (`run-local.sh`): it is
> strategy-navigation-heavy and flakes on HA's cold-start `whenDefined` /
> scoped-registry race — the exact condition the shim's self-heal recovers in
> production — which is non-deterministic in tight-window automation (an empty
> run took 25 min and still failed on flaky navigations). The hard gate stays
> the unit suite (`npm test`).
>
> **To promote E2E to a blocking gate**, remove the dependence on the racy
> strategy-dashboard navigation: drive the lifecycle through the **panel**
> (`/maintenance-supporter`) — a registered custom panel with no strategy race —
> and/or warm the strategy element registration deterministically before
> asserting. The harness, fixtures, and WS helpers here are built to support
> that rework.

## Environment knobs

| Var | Meaning | Default |
|-----|---------|---------|
| `E2E_HA_URL` | URL the **browser** uses (and storageState origin) | `http://localhost:8123` |
| `E2E_HA_REST_URL` | URL the **setup process** uses for onboarding REST | = `E2E_HA_URL` |
| `E2E_PW_WS` | `ws://` endpoint of a playwright server; connect instead of launching | _(launch)_ |

## Adding a spec

Drop a `specs/<story>.spec.ts` in, navigate via `gotoStrategyDashboard`, seed
with `seedObject` / `seedTask`, and assert on rendered text + `getObject`. Keep
each test self-cleaning (`deleteAllObjects`) so order doesn't matter.

[`@playwright/test`]: https://playwright.dev/docs/test-intro
