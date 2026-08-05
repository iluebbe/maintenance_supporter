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

import { BUNDLE_VERSION } from "./helpers/bundle-version";

const STRATEGY_TYPE = "maintenance-supporter";
const STRATEGY_TAG = `ll-strategy-dashboard-${STRATEGY_TYPE}`;
const EDITOR_TAG = "hui-maintenance-supporter-strategy-editor";

// Absolute URL of the full strategy bundle (served at STRATEGY_URL by the
// integration). The shim's only dependency, loaded on demand.
//
// Version-busted (issue #124): the bundle's chunk names are content-hashed
// and change every release, but browsers heuristically cache this entry
// (static serving sends no Cache-Control). A stale cached entry then imports
// chunk names the update deleted → 404 → the strategy dashboard dies until
// a hard refresh. The `?v=` makes the URL change with the release, so a
// fresh entry always pulls its matching chunks. BUNDLE_VERSION is inlined
// by esbuild — the built shim keeps its zero-import guarantee.
const BUNDLE_URL =
  "/maintenance_supporter_strategy/maintenance-dashboard-strategy.js" +
  `?v=${BUNDLE_VERSION}`;

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

function defineShim(): void {
  // Attempt unconditionally: customElements.get() is unreliable across HA's
  // scoped registries (it can read true while the active dashboard registry has
  // no registration), so we always try and swallow the "already defined" throw.
  // On a fresh (cache-busted) re-import this re-registers on the now-active
  // registry, which is what the self-heal relies on.
  try {
    customElements.define(STRATEGY_TAG, MaintenanceDashboardStrategyShim);
  } catch {
    /* already defined in this registry — fine */
  }
}
defineShim();

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

// ── Self-heal ───────────────────────────────────────────────────────────────
// Root cause (diagnosed live): HA's frontend uses a SCOPED custom-element
// registry that is swapped in during boot. Our element, defined at module load,
// can end up registered on a registry that the dashboard renderer no longer
// uses — so `customElements.get(STRATEGY_TAG)` reads false in the active
// registry and HA's 5 s whenDefined times out (console-only error, empty view).
//
// Verified recovery (9/9 on a live plugin-heavy system): RE-DEFINE on the
// now-current registry, then bounce the view (navigate away + back) so HA's
// <hui-panel-lovelace> reconnects and re-runs _fetchConfig — generate() then
// finds the element and the real dashboard renders.
//
// Fully defensive: only acts on a Lovelace path when our element is missing
// from the active registry; on a healthy load it never fires.
(() => {
  const heal = window as unknown as { __msStrategyHealActive?: boolean };
  if (heal.__msStrategyHealActive) return; // one heal loop per page session
  heal.__msStrategyHealActive = true;

  const NON_LOVELACE =
    /^\/(auth|config|developer-tools|profile|hassio|history|logbook|map|media-browser|energy|todo|calendar)\b/;

  // NOTE: customElements.get(STRATEGY_TAG) is NOT a reliable health signal —
  // HA's scoped registry makes it read `true` here even when the dashboard's
  // renderer (a different registry) failed. So we gate on the RENDERED OUTCOME:
  // a strategy dashboard that failed shows an essentially empty view.
  const ERROR_RE =
    /Timeout waiting for strategy element ll-strategy-(dashboard-)?maintenance-supporter/i;

  // The dashboard/view strategy type our generated dashboards carry.
  const OUR_STRATEGY = `custom:${STRATEGY_TYPE}`;

  // Deep querySelector through open shadow roots (HA nests the panel deeply).
  function findDeep(tag: string): Element | null {
    const stack: Array<Element | ShadowRoot> = [document.documentElement];
    let scanned = 0;
    while (stack.length && scanned < 9000) {
      const node = stack.pop();
      scanned++;
      if (!node) continue;
      const el = node as Element & { shadowRoot?: ShadowRoot | null };
      if (el.nodeType === 1 && el.tagName && el.tagName.toLowerCase() === tag) {
        return el;
      }
      if (el.shadowRoot) stack.push(el.shadowRoot);
      const kids = (node as ParentNode).children;
      if (kids) for (const k of Array.from(kids)) stack.push(k);
    }
    return null;
  }

  // The view config for the path we are on (by view `path`, else numeric index,
  // else the first view).
  function currentViewCfg(
    cfg: { views?: Array<Record<string, unknown>> },
  ): Record<string, unknown> | null {
    const views = cfg?.views;
    if (!Array.isArray(views) || !views.length) return null;
    const seg = window.location.pathname.split("/").filter(Boolean).pop() || "";
    const byPath = views.find((v) => (v as { path?: string })?.path === seg);
    if (byPath) return byPath;
    const idx = Number(seg);
    if (Number.isInteger(idx) && views[idx]) return views[idx];
    return views[0];
  }

  // True ONLY when the active dashboard/view is generated by our strategy.
  // Reads the Lovelace config off <ha-panel-lovelace> (both the processed
  // `config` and the original `rawConfig`, at dashboard level and current-view
  // level). This scopes the self-heal so it never touches a dashboard that is
  // not ours — the fix for issue #68, where the blank-view heuristic bounced
  // unrelated dashboards that happened to have < 3 cards. Defensive: any read
  // failure → false (never heal a view we cannot confirm is ours).
  function isOurStrategyView(): boolean {
    try {
      const panel = findDeep("ha-panel-lovelace") as unknown as {
        lovelace?: {
          config?: Record<string, unknown>;
          rawConfig?: Record<string, unknown>;
        };
      } | null;
      const lov = panel?.lovelace;
      if (!lov) return false;
      const stratType = (s: unknown): string | undefined =>
        (s as { type?: string } | undefined)?.type;
      for (const cfg of [lov.config, lov.rawConfig]) {
        if (!cfg) continue;
        if (stratType((cfg as { strategy?: unknown }).strategy) === OUR_STRATEGY) {
          return true;
        }
        const v = currentViewCfg(
          cfg as { views?: Array<Record<string, unknown>> },
        );
        if (v && stratType((v as { strategy?: unknown }).strategy) === OUR_STRATEGY) {
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  }

  // Heuristic for "we are on a broken strategy view": the lovelace view exists
  // but is essentially empty (HA rendered the failed strategy as a blank view),
  // OR HA surfaced our strategy error card. Walks light + shadow DOM.
  function viewIsBroken(): boolean {
    let hasView = false;
    let cards = 0;
    let ourError = false;
    let hasEmptyState = false;
    const stack: Array<Element | ShadowRoot> = [document.documentElement];
    let scanned = 0;
    while (stack.length && scanned < 9000) {
      const node = stack.pop();
      scanned++;
      if (!node) continue;
      const el = node as Element & { shadowRoot?: ShadowRoot | null };
      if (el.nodeType === 1 && el.tagName) {
        const tag = el.tagName.toLowerCase();
        if (tag === "hui-view" || tag === "hui-sections-view") hasView = true;
        if (tag === "ha-card" || tag === "hui-card") cards++;
        // The zero-objects onboarding view renders exactly ONE hui-empty-state-
        // card. That is a SUCCESSFUL strategy render, but it trips the "< 3
        // cards" blank-view heuristic below — issue #69, where the empty state
        // was mistaken for a broken render and the page reloaded every ~5 s.
        if (tag === "hui-empty-state-card") hasEmptyState = true;
        if (tag === "hui-error-card" && ERROR_RE.test(el.textContent || "")) {
          ourError = true;
        }
      }
      if (el.shadowRoot) stack.push(el.shadowRoot);
      const kids = (node as ParentNode).children;
      if (kids) for (const k of Array.from(kids)) stack.push(k);
    }
    // ourError (HA's error card naming OUR strategy element) is unambiguous —
    // act on it directly. The "blank view" signal (< 3 cards) is ambiguous on
    // its own (a small or still-loading dashboard looks identical), so gate it
    // on the active dashboard actually being our strategy. Without that gate the
    // self-heal bounced unrelated dashboards with few cards (issue #68).
    if (ourError) return true;
    // A rendered empty-state card means generate() ran and produced our
    // onboarding view — that is healthy by definition, so never bounce it. A
    // genuine strategy timeout shows hui-error-card or zero cards, never this
    // card (issue #69).
    if (hasEmptyState) return false;
    return hasView && cards < 3 && isOurStrategyView();
  }

  // URL of THIS module, so recovery can force a fresh re-import (a cache-busted
  // import re-evaluates the module and re-runs customElements.define against the
  // registry that is active NOW — the boot-time define may have landed on a
  // scoped registry HA has since discarded, and a plain defineShim() call is a
  // no-op because customElements.get() reads stale-true across scoped registries).
  const SHIM_URL = "/maintenance_supporter_strategy_shim.js";

  let bounces = 0;
  let lastBounce = 0;
  function recover(): void {
    const now = Date.now();
    if (now - lastBounce < 5000 || bounces >= 3) return; // never thrash / loop
    lastBounce = now;
    bounces += 1;
    // 1) Force a fresh re-import so define() re-runs on the now-active registry.
    //    (Verified live: this is what makes the element resolvable to HA's
    //    dashboard renderer; a guarded re-define is not enough.)
    void import(/* @vite-ignore */ `${SHIM_URL}?heal=${now}`)
      .catch(() => undefined)
      .finally(() => {
        // 2) Bounce so HA re-fetches the strategy config; generate() now
        //    resolves the element and the real dashboard renders.
        const back = window.location.pathname + window.location.search;
        history.pushState(null, "", "/lovelace");
        window.dispatchEvent(new CustomEvent("location-changed"));
        window.setTimeout(() => {
          history.pushState(null, "", back);
          window.dispatchEvent(new CustomEvent("location-changed"));
        }, 200);
      });
  }

  function watch(): void {
    if (NON_LOVELACE.test(window.location.pathname)) return;
    let ticks = 0;
    const startedAt = Date.now();
    const id = window.setInterval(() => {
      ticks++;
      try {
        // Give HA past its ~5 s strategy timeout before judging the outcome.
        if (Date.now() - startedAt < 6000) return;
        if (NON_LOVELACE.test(window.location.pathname)) {
          window.clearInterval(id);
          return;
        }
        if (viewIsBroken()) {
          recover();
        } else {
          window.clearInterval(id); // healthy / recovered
        }
        if (ticks >= 30) window.clearInterval(id); // ~15 s safety cap
      } catch {
        window.clearInterval(id);
      }
    }, 500);
  }

  try {
    if (document.readyState === "loading") {
      window.addEventListener("DOMContentLoaded", watch);
    } else {
      watch();
    }
    window.addEventListener("location-changed", () => {
      if (!NON_LOVELACE.test(window.location.pathname)) watch();
    });
  } catch {
    /* best-effort; never block registration */
  }
})();

export {};
