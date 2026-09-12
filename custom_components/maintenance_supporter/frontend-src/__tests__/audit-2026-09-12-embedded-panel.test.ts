/**
 * Bug audit 2026-09-12, findings 4–6 on the embedded panel (#174):
 *  4. deep-link params are only consumed while the page is still on the
 *     path the panel was mounted on — a navigation to ANOTHER view carrying
 *     `?tab=` fires `location-changed` while the card is still attached;
 *  5. the card's presets are applied once per element — HA re-attaches the
 *     card on edit-mode toggles / view switches, and the reset on disconnect
 *     flipped a user who had moved off the preset tab back onto it;
 *  6. the search debounce and the toast timer are cleared on disconnect.
 */
import { expect } from "@open-wc/testing";
import { LS_KEYS } from "../helpers/storage-keys.js";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

type PanelState = HTMLElement & {
  updateComplete: Promise<unknown>;
  hass: Record<string, unknown>;
  _overviewTab: string;
  _searchTimer: unknown;
  _toastTimer: unknown;
  _toastMessage: string;
  _showToast(msg: string): void;
};

const ORIGINAL_PATH = window.location.pathname;

async function mount(presets: { tab?: string; view?: string } = {}) {
  history.replaceState(null, "", ORIGINAL_PATH);
  const { el } = await mountPanel(
    [obj("e1", [task({ name: "Mow lawn" }), task({ name: "Descale" })])],
    {},
    { embedded: true, presets },
  );
  await el.updateComplete;
  return el as unknown as PanelState;
}

describe("embedded panel (#174) — bug audit 2026-09-12", () => {
  beforeEach(() => {
    resetTaskSeq();
    try { localStorage.removeItem(LS_KEYS.overviewTab); } catch { /* private mode */ }
  });
  afterEach(() => history.replaceState(null, "", ORIGINAL_PATH));

  it("ignores a deep link on a path other than the one it was mounted on", async () => {
    const el = await mount();
    expect(el._overviewTab).to.equal("dashboard");
    history.pushState(null, "", `${ORIGINAL_PATH}-other-view?tab=today`);
    window.dispatchEvent(new CustomEvent("location-changed"));
    await el.updateComplete;
    expect(el._overviewTab, "another view's link is not ours").to.equal("dashboard");
    expect(window.location.search, "query string left for that view").to.equal("?tab=today");
    // Back on the mount path the same link is honoured (existing behaviour).
    history.pushState(null, "", `${ORIGINAL_PATH}?tab=today`);
    window.dispatchEvent(new CustomEvent("location-changed"));
    await el.updateComplete;
    expect(el._overviewTab).to.equal("today");
    expect(window.location.search).to.equal("");
  });

  it("does not re-apply the preset tab when HA re-attaches the same element", async () => {
    const el = await mount({ tab: "today" });
    expect(el._overviewTab).to.equal("today");
    el._overviewTab = "dashboard";
    await el.updateComplete;
    const parent = el.parentElement!;
    parent.removeChild(el);
    parent.appendChild(el);
    // HA hands the re-attached card a fresh hass → the panel reloads its data
    // and re-runs the deep-link / preset pass.
    el.hass = { ...el.hass };
    await new Promise((r) => setTimeout(r, 60));
    await el.updateComplete;
    expect(el._overviewTab, "user's tab choice survives the re-attach").to.equal("dashboard");
  });

  it("clears the search debounce and the toast timer on disconnect", async () => {
    const el = await mount();
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "/" }));
    await el.updateComplete;
    const input = sr(el).querySelector<HTMLInputElement>(".palette-input")!;
    input.value = "filter";
    input.dispatchEvent(new Event("input"));
    el._showToast("hello");
    expect(el._searchTimer, "debounce pending").to.not.equal(null);
    expect(el._toastTimer, "toast pending").to.not.equal(null);
    el.remove();
    expect(el._searchTimer).to.equal(null);
    expect(el._toastTimer).to.equal(null);
    expect(el._toastMessage).to.equal("");
  });
});
