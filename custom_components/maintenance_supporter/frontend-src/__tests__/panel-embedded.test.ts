/**
 * Panel in embedded mode (#174, mounted by the panel card): no hamburger in
 * the narrow header, the card's presets open a tab / saved view once WITHOUT
 * persisting the choice (the sidebar panel keeps its remembered tab), a URL
 * `?tab=` still wins over the preset, and an in-app deep link on the
 * dashboard's own path is honoured (the sidebar panel would ignore a path
 * that is not its own).
 */
import { expect } from "@open-wc/testing";
import { LS_KEYS } from "../helpers/storage-keys.js";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

type PanelState = HTMLElement & {
  updateComplete: Promise<unknown>;
  embedded: boolean;
  narrow: boolean;
  presets: { tab?: string; view?: string };
  _overviewTab: string;
  _activeViewId: string;
  _view: string;
};

const VIEWS = [{ id: "vgarden", name: "Garden Chores", filters: { status: "", user_id: null, label: "garden", archived: false, sort_mode: "object", group_by: "none" } }];

async function mount(presets: { tab?: string; view?: string }, query = "") {
  history.replaceState(null, "", window.location.pathname + (query ? `?${query}` : ""));
  const { el } = await mountPanel(
    [obj("e1", [task({ name: "Mow lawn", labels: ["garden"] }), task({ name: "Descale" })])],
    { "maintenance_supporter/views/list": () => ({ views: VIEWS }) },
    { embedded: true, presets },
  );
  await el.updateComplete;
  return el as unknown as PanelState;
}

describe("panel embedded in a card (#174)", () => {
  beforeEach(() => {
    resetTaskSeq();
    try { localStorage.removeItem(LS_KEYS.overviewTab); } catch { /* private mode */ }
  });
  afterEach(() => history.replaceState(null, "", window.location.pathname));

  it("opens on the preset tab without persisting it and hides the hamburger", async () => {
    const el = await mount({ tab: "today" });
    expect(el._overviewTab).to.equal("today");
    expect(localStorage.getItem(LS_KEYS.overviewTab), "preset must not rewrite the remembered tab").to.equal(null);
    el.narrow = true;
    await el.updateComplete;
    expect(sr(el).querySelector("ha-menu-button"), "dashboard header has its own menu button").to.equal(null);
    expect(el.hasAttribute("embedded")).to.equal(true);
  });

  it("opens on the preset saved view (by name) on the dashboard tab", async () => {
    const el = await mount({ view: "garden chores" });
    expect(el._overviewTab).to.equal("dashboard");
    expect(el._activeViewId).to.equal("vgarden");
  });

  it("lets a URL ?tab= win over the preset, and ignores unknown presets", async () => {
    const el = await mount({ tab: "calendar" }, "tab=settings");
    expect(el._overviewTab).to.equal("settings");
    const el2 = await mount({ tab: "bogus", view: "no such view" });
    expect(el2._overviewTab).to.equal("dashboard");
    expect(el2._activeViewId).to.equal("");
  });

  it("honours an in-app deep link on the dashboard's own path", async () => {
    const el = await mount({});
    expect(el._overviewTab).to.equal("dashboard");
    // HA's navigate() for a query-only change: pushState + location-changed on
    // a path that is NOT /maintenance-supporter.
    history.pushState(null, "", `${window.location.pathname}?tab=today`);
    window.dispatchEvent(new CustomEvent("location-changed"));
    await el.updateComplete;
    expect(el._overviewTab).to.equal("today");
    expect(window.location.search, "params are consumed once").to.equal("");
  });
});
