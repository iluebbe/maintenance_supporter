# End-to-end tests

User-story E2E tests that drive a **real Home Assistant** with the integration
installed, in a **real browser**, via [`@playwright/test`]. They catch the class
of bug unit tests can't — frontend ↔ HA contract and rendering/interaction
regressions (e.g. issue #69).

## User stories covered

| Spec | Story | CI |
|------|-------|----|
| `specs/lifecycle.spec.ts` | **The full life of an object**, driven through the **Maintenance panel** (`/maintenance-supporter`): create it via the dialog → a seeded overdue task surfaces → completing it records history and resets the cycle → archiving hides it → deleting removes it. | ✅ `e2e-lifecycle` job |
| `specs/onboarding.spec.ts` | A new user opens the auto-dashboard with **zero objects** (#69): empty-state renders, **"Add object" opens the dialog**, the page **does not self-heal-bounce**, "Open Maintenance panel" navigates. | ⚠️ local-only (see below) |

## Why the lifecycle drives the panel

The **panel** is a registered custom panel — no lovelace **strategy**
`whenDefined` / scoped-registry race — so its navigation and rendering are
deterministic. (The dashboard *strategy* loses that race on cold loads — the
condition the shim's self-heal recovers in production — which makes tight-window
navigation assertions non-deterministic in automation; that's why the
onboarding spec, which must use the strategy empty-state, stays local-only. The
#69 *handler* bug is already gated reliably by the unit tripwire,
`__tests__/ll-custom-payload.test.ts`, run by `npm test` in CI.)

The panel is **off by default** (`panel_enabled`); `global-setup` flips it on
via the `global/update` WS so the lifecycle spec can reach it.

## How it works

- `global-setup.ts` onboards the fresh HA (or logs in), ensures the integration
  is set up, **enables the panel**, creates a shared strategy dashboard, and
  saves an authenticated `storageState` every spec reuses.
- `helpers.ts` provides `ws()` (seed/inspect over the live `hass` connection),
  `gotoPanel()` (reliable panel nav), and `seedObject`/`seedTask` (which wait
  until the object/task is actually queryable, so the panel's first fetch
  doesn't miss it).
- The lifecycle spec loads the panel **once per test** and seeds/mutates over
  WebSocket, asserting the panel renders/re-renders **live**.

## Running

**Locally** — two ways:

```bash
./e2e/run-local.sh                          # docker playwright-server (full Chromium)
# or, mirroring CI (fresh local Chromium against a host-mapped HA):
E2E_HA_URL=http://localhost:8129 npx playwright test specs/lifecycle.spec.ts
```

Validated green in Docker across repeated runs (retries=0, ~20s/run) before
wiring to CI.

**In CI** — the `e2e-lifecycle` job boots HA via `docker run`, installs Chromium
(`npx playwright install --with-deps chromium`), and runs the lifecycle spec
with `retries: 2`. It is **non-blocking (`continue-on-error`) for now** so a few
CI-Linux runs confirm stability before it's promoted to a hard gate; it uploads
traces on failure. The hard gate stays the unit suite (`npm test`).

## Environment knobs

| Var | Meaning | Default |
|-----|---------|---------|
| `E2E_HA_URL` | URL the **browser** uses (and storageState origin) | `http://localhost:8123` |
| `E2E_HA_REST_URL` | URL the **setup process** uses for onboarding REST | = `E2E_HA_URL` |
| `E2E_PW_WS` | `ws://` endpoint of a playwright server; connect instead of launching | _(launch)_ |

## Adding a spec

Drop a `specs/<story>.spec.ts` in, `gotoPanel`, seed with `seedObject` /
`seedTask`, and assert on rendered text + `getObject`. Keep each test
self-cleaning (`deleteAllObjects`) so order doesn't matter.

[`@playwright/test`]: https://playwright.dev/docs/test-intro
