/** Maintenance Supporter — dashboard-strategy registration shim.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * HA serves custom frontend modules via `frontend_extra_module_url`, which the
 * frontend loads as fire-and-forget `import("<url>")` calls in index.html — no
 * ordering, no await, no completion guarantee. For a `custom:` dashboard
 * strategy, HA's renderer then only waits ~5 s via
 * `customElements.whenDefined("ll-strategy-dashboard-…")` for the element to
 * appear (unlike built-in strategies, which HA imports and awaits itself).
 *
 * On systems with many heavy HACS frontend plugins (card-mod, layout-card, …)
 * our full strategy bundle (~14 KB + a transitive graph) can lose that race:
 * the module is downloaded but its top-level `customElements.define` hasn't
 * finished executing within the 5 s window → "Timeout waiting for strategy
 * element ll-strategy-dashboard-maintenance-supporter to be registered".
 * Reproduced ~30–40 % of cold loads on a plugin-heavy live system.
 *
 * THE FIX
 * -------
 * This shim is the `extra_module_url` instead of the full bundle. It has ZERO
 * static imports and does ONE thing synchronously: define a tiny wrapper
 * element for the dashboard strategy (and push its picker entry). Parsing a
 * few hundred bytes with no import graph reaches `define()` in well under a
 * microtask, so it wins HA's 5 s race essentially every time. The heavy
 * bundle is `import()`-ed lazily on first `generate()` / `getConfigElement()`
 * — exactly how HA's own built-in strategies defer their code.
 *
 * The heavy bundle keeps registering the editor, the section strategies, the
 * `ll-custom` tap handler, and the section picker entries at its own top level
 * (all of which only matter once a dashboard is actually being generated).
 */

const STRATEGY_TYPE = "maintenance-supporter";
const STRATEGY_TAG = `ll-strategy-dashboard-${STRATEGY_TYPE}`;
const EDITOR_TAG = "hui-maintenance-supporter-strategy-editor";

// Absolute URL of the full strategy bundle (served at STRATEGY_URL by the
// integration). The shim's only dependency, loaded on demand.
const BUNDLE_URL =
  "/maintenance_supporter_strategy/maintenance-dashboard-strategy.js";

let _bundle: Promise<unknown> | null = null;
function loadBundle(): Promise<unknown> {
  if (!_bundle) _bundle = import(/* @vite-ignore */ BUNDLE_URL);
  return _bundle;
}

// The real dashboard class, exported by the heavy bundle once it loads. We
// resolve it from the registered editor's sibling export at call time.
type DashboardStrategyClass = {
  generate(config: unknown, hass: unknown): Promise<unknown>;
};

async function realDashboard(): Promise<DashboardStrategyClass> {
  const mod = (await loadBundle()) as {
    MaintenanceDashboardStrategy?: DashboardStrategyClass;
  };
  if (!mod.MaintenanceDashboardStrategy) {
    throw new Error(
      "[maintenance-supporter] strategy bundle loaded but did not export " +
        "MaintenanceDashboardStrategy",
    );
  }
  return mod.MaintenanceDashboardStrategy;
}

class MaintenanceDashboardStrategyShim extends HTMLElement {
  static getCreateSuggestions(_hass: unknown) {
    return { title: "Maintenance Supporter", icon: "mdi:wrench-clock" };
  }

  static async getConfigElement(): Promise<HTMLElement> {
    // Loading the bundle defines the editor element as a side effect.
    await loadBundle();
    return document.createElement(EDITOR_TAG);
  }

  static async generate(config: unknown, hass: unknown): Promise<unknown> {
    const real = await realDashboard();
    return real.generate(config, hass);
  }
}

if (!customElements.get(STRATEGY_TAG)) {
  customElements.define(STRATEGY_TAG, MaintenanceDashboardStrategyShim);
}

// ── Self-heal for HA's un-awaited extra-module load ─────────────────────────
//
// HA serves extra_module_url entries as fire-and-forget `import("…")` in
// index.html, in parallel with its own core/app boot — nothing awaits them.
// So on a COLD load that lands directly on a `custom:maintenance-supporter`
// strategy dashboard, HA's renderer can hit its 5 s `whenDefined` timeout
// BEFORE this shim's module finishes executing — and HA does NOT retry, it
// just shows "Timeout waiting for strategy element …" until a manual reload.
//
// Since this code runs the moment our module DOES execute, we can detect that
// late arrival and nudge HA to re-render: fire a `location-changed` event,
// which Lovelace listens for to re-resolve the current view (now that our
// element exists). Guarded to fire at most once, only when the document is
// already interactive (i.e. we lost the race) — on a normal/fast load the
// element is defined before first render and this is a no-op.
(() => {
  try {
    const alreadyBooted =
      document.readyState === "complete" || document.readyState === "interactive";
    // Only relevant if we are actually viewing a (potentially strategy)
    // dashboard — i.e. not on the login screen or a settings page.
    const onLovelace = !/^\/(auth|config|developer-tools|profile|hassio)\b/.test(
      window.location.pathname,
    );
    if (!alreadyBooted || !onLovelace) return;
    // Defer one frame so HA's own boot import()s settle first; then re-fire
    // navigation so a timed-out strategy view re-resolves with our now-defined
    // element. Harmless when nothing timed out (HA just re-renders the same view).
    requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent("location-changed"));
    });
  } catch {
    /* best-effort self-heal; never block registration */
  }
})();

// Picker discovery (HA 2026.5+ reads window.customStrategies when the
// "Add Dashboard" dialog opens). Idempotent — the heavy bundle pushes the
// same entry too once it loads; whichever runs first wins, the other skips.
const w = window as unknown as {
  customStrategies?: Array<{
    type: string;
    strategyType: string;
    name: string;
    description?: string;
    documentationURL?: string;
  }>;
};
w.customStrategies = w.customStrategies || [];
if (
  !w.customStrategies.some(
    (s) => s.type === STRATEGY_TYPE && s.strategyType === "dashboard",
  )
) {
  w.customStrategies.push({
    type: STRATEGY_TYPE,
    strategyType: "dashboard",
    name: "Maintenance Supporter",
    description:
      "Auto-generated dashboard. Group views by area, status, floor, or due date — picked from the strategy editor or YAML.",
    documentationURL:
      "https://github.com/iluebbe/maintenance_supporter#dashboard-strategy",
  });
}

export {};
