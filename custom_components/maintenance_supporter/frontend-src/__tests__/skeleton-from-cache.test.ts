/** Skeleton-from-cache (roadmap perf wave 2, item 6).
 *
 *  The panel paints the previous visit's task list from localStorage
 *  immediately on mount and reconciles when the live payload lands. The
 *  cache is version-stamped (a bundle update discards it), age-capped, and
 *  written back on every successful live load.
 */

import { expect } from "@open-wc/testing";
import { LS_KEYS } from "../helpers/storage-keys.js";
import { BUNDLE_VERSION } from "../helpers/bundle-version.js";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

function seedCache(over: Record<string, unknown> = {}) {
  localStorage.setItem(LS_KEYS.objectsCache, JSON.stringify({
    v: BUNDLE_VERSION,
    at: Date.now(),
    objects: [obj("cached-e1", [task({ name: "Cached Task" })], "Cached Pump")],
    stats: { total_objects: 1, total_tasks: 1, overdue: 0, due_soon: 0, triggered: 0, ok: 1 },
    ...over,
  }));
}

function rowNames(el: HTMLElement): string[] {
  return [...sr(el).querySelectorAll(".task-name")].map((n) => n.textContent?.trim() || "");
}

describe("skeleton from cache", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.removeItem(LS_KEYS.objectsCache);
    localStorage.setItem(LS_KEYS.overviewTab, "dashboard");
  });
  afterEach(() => localStorage.removeItem(LS_KEYS.objectsCache));

  it("paints cached rows before the live payload arrives, then reconciles", async () => {
    seedCache();
    let resolveLive!: (v: unknown) => void;
    const live = new Promise((r) => { resolveLive = r; });
    const { el } = await mountPanel([], {
      "maintenance_supporter/objects": () => live,
    });
    // Live load still pending — the cached skeleton must already be visible.
    expect(rowNames(el)).to.include("Cached Task");

    resolveLive({ objects: [obj("live-e1", [task({ name: "Live Task" })], "Live Pump")] });
    await new Promise((r) => setTimeout(r, 30));
    await el.updateComplete;
    const names = rowNames(el);
    expect(names).to.include("Live Task");
    expect(names).to.not.include("Cached Task");
  });

  it("ignores a cache written by a different bundle version", async () => {
    seedCache({ v: "0.0.0-other" });
    let resolveLive!: (v: unknown) => void;
    const live = new Promise((r) => { resolveLive = r; });
    const { el } = await mountPanel([], {
      "maintenance_supporter/objects": () => live,
    });
    expect(rowNames(el)).to.not.include("Cached Task");
    resolveLive({ objects: [] });
  });

  it("ignores a cache older than the age cap", async () => {
    seedCache({ at: Date.now() - 8 * 24 * 3600 * 1000 });
    let resolveLive!: (v: unknown) => void;
    const live = new Promise((r) => { resolveLive = r; });
    const { el } = await mountPanel([], {
      "maintenance_supporter/objects": () => live,
    });
    expect(rowNames(el)).to.not.include("Cached Task");
    resolveLive({ objects: [] });
  });

  it("writes the cache after a successful live load", async () => {
    await mountPanel([obj("e1", [task({ name: "Fresh Task" })], "Fresh Pump")]);
    const raw = localStorage.getItem(LS_KEYS.objectsCache);
    expect(raw, "cache written").to.not.equal(null);
    const entry = JSON.parse(raw!);
    expect(entry.v).to.equal(BUNDLE_VERSION);
    expect(entry.objects[0].object.name).to.equal("Fresh Pump");
  });

  it("a corrupt cache entry is ignored, not fatal", async () => {
    localStorage.setItem(LS_KEYS.objectsCache, "{not json");
    const { el } = await mountPanel([obj("e1", [task({ name: "Live Task" })])]);
    expect(rowNames(el)).to.include("Live Task");
  });
});
