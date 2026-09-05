/**
 * Overview deep links (Discussion #160, @maisun): a URL can land the panel on
 * a tab with the task list pre-filtered / pre-sorted, or on a saved view —
 * `?tab=today`, `?status=overdue&sort=object`, `?view=<id or name>` — so a
 * dashboard button or a notification tap opens e.g. the Today list directly.
 *
 * Pins: each param lands in the right state, tab/sort persist like a tap,
 * unknown values are ignored, the params are consumed once, and an in-app
 * navigation to the panel while it is already mounted (HA's navigate() =
 * pushState + `location-changed`, no remount) re-reads the URL instead of
 * ignoring it.
 */

import { expect } from "@open-wc/testing";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

const PAGE_PATH = window.location.pathname;

type PanelState = HTMLElement & {
  updateComplete: Promise<unknown>;
  panel: Record<string, unknown>;
  _overviewTab: string;
  _filterStatus: string;
  _sortMode: string;
  _activeViewId: string;
  _filterLabel: string | null;
  _view: string;
};

const VIEWS = [
  { id: "vgarden", name: "Garden Chores", filters: { status: "", user_id: null, label: "garden", archived: false, sort_mode: "object", group_by: "none" } },
  { id: "voverdue", name: "Overdue only", filters: { status: "overdue", user_id: null, label: null, archived: false, sort_mode: "due_date", group_by: "none" } },
];

function setDeepLink(query: string) {
  history.replaceState(null, "", `${window.location.pathname}?${query}`);
}

async function mount(query: string) {
  setDeepLink(query);
  const { el, sent } = await mountPanel(
    [obj("e1", [task({ name: "Mow lawn", labels: ["garden"] }), task({ name: "Descale", status: "overdue", days_until_due: -3 })])],
    { "maintenance_supporter/views/list": () => ({ views: VIEWS }) },
  );
  await el.updateComplete;
  return { el: el as unknown as PanelState, sent };
}

/** What HA's navigate() does for a dashboard button / notification tap
 *  while the panel is already open: pushState + `location-changed`. */
function navigate(url: string) {
  history.pushState(null, "", url);
  window.dispatchEvent(new CustomEvent("location-changed"));
}

/** Browser Back, resolved once the popstate has fired. Only ever called
 *  after a navigate() in the same test, so the previous entry is this
 *  document's own — never the runner's page. */
function back(): Promise<void> {
  return new Promise((resolve) => {
    window.addEventListener("popstate", () => resolve(), { once: true });
    history.back();
  });
}

async function settle(el: PanelState) {
  await new Promise((r) => setTimeout(r, 20));
  await el.updateComplete;
}

describe("overview deep links (#160)", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
    localStorage.setItem("msp-overview-tab", "dashboard");
  });
  afterEach(() => {
    localStorage.clear();
    history.replaceState(null, "", PAGE_PATH);
  });

  it("?tab=today lands on the Today tab, remembers it and cleans the URL", async () => {
    const { el } = await mount("tab=today");
    expect(el._overviewTab).to.equal("today");
    expect(sr(el).querySelector(".today-view"), "today view rendered").to.exist;
    expect(localStorage.getItem("msp-overview-tab")).to.equal("today");
    expect(window.location.search).to.equal("");
  });

  it("?tab=calendar / settings switch the overview tab too", async () => {
    const { el } = await mount("tab=settings");
    expect(el._overviewTab).to.equal("settings");
    expect(localStorage.getItem("msp-overview-tab")).to.equal("settings");
  });

  // Bug review 2026-09-04: the Settings tab is admin-only (the tab bar hides
  // it), but the deep links only validated the value against OVERVIEW_TABS —
  // a non-admin landed on a tab-less settings view, and `?tab=` persisted
  // the choice across reloads.
  describe("non-admin", () => {
    const USER = { id: "u-viewer", is_admin: false };

    async function mountAs(query: string) {
      setDeepLink(query);
      const { el } = await mountPanel([obj("e1", [task({ name: "Mow lawn" })])], {}, { user: USER });
      await el.updateComplete;
      return el as unknown as PanelState;
    }

    it("?tab=settings is ignored and nothing is persisted", async () => {
      const el = await mountAs("tab=settings");
      await settle(el);
      expect(el._overviewTab).to.equal("dashboard");
      expect(localStorage.getItem("msp-overview-tab")).to.equal("dashboard");
      expect(window.location.search, "consumed").to.equal("");
      expect(sr(el).querySelector("maintenance-settings-view"), "no settings view").to.equal(null);
    });

    it("?ms_action=open_settings is consumed without opening the tab", async () => {
      const el = await mountAs("ms_action=open_settings");
      await settle(el);
      expect(el._overviewTab).to.equal("dashboard");
      expect(window.location.search, "consumed").to.equal("");
      expect(sr(el).querySelector("maintenance-settings-view"), "no settings view").to.equal(null);
    });

    it("the other tabs still work for them", async () => {
      const el = await mountAs("tab=today");
      expect(el._overviewTab).to.equal("today");
    });
  });

  it("?status=overdue&sort=object filters + sorts the dashboard list (sort persists like the select)", async () => {
    const { el } = await mount("tab=today&status=overdue&sort=object");
    // status implies the Dashboard tab — a filter on the Today tab is pointless
    expect(el._overviewTab).to.equal("dashboard");
    expect(el._filterStatus).to.equal("overdue");
    expect(el._sortMode).to.equal("object");
    expect(localStorage.getItem("maintenance_supporter_sort")).to.equal("object");
    const rows = [...sr(el).querySelectorAll(".task-table .task-name")].map((n) => n.textContent?.trim());
    expect(rows, "only the overdue row remains").to.deep.equal(["Descale"]);
    expect(window.location.search).to.equal("");
  });

  it("?view=<id> applies the saved view and lands on the Dashboard tab", async () => {
    const { el } = await mount("tab=today&view=vgarden");
    expect(el._activeViewId).to.equal("vgarden");
    expect(el._filterLabel).to.equal("garden");
    expect(el._sortMode).to.equal("object");
    expect(el._overviewTab).to.equal("dashboard");
    expect(localStorage.getItem("msp-overview-tab"), "implied tab persisted").to.equal("dashboard");
    const option = sr(el).querySelector<HTMLOptionElement>("option[value='vgarden']");
    expect(option?.selected, "view picked in the toolbar's view select").to.equal(true);
  });

  it("?view=<name> matches the saved view by name, case-insensitively", async () => {
    const { el } = await mount("view=overdue%20ONLY");
    expect(el._activeViewId).to.equal("voverdue");
    expect(el._filterStatus).to.equal("overdue");
  });

  it("explicit status overrides the saved view's filter", async () => {
    const { el } = await mount("view=vgarden&status=ok");
    expect(el._filterStatus).to.equal("ok");
    // a manual filter change deselects the view, exactly like the toolbar does
    expect(el._activeViewId).to.equal("");
  });

  it("unknown values are ignored (nothing persisted, URL still cleaned)", async () => {
    const { el } = await mount("tab=bogus&status=nope&sort=xyz&view=no-such-view");
    expect(el._overviewTab).to.equal("dashboard");
    expect(el._filterStatus).to.equal("");
    expect(el._sortMode).to.equal("due_date");
    expect(el._activeViewId).to.equal("");
    expect(localStorage.getItem("msp-overview-tab")).to.equal("dashboard");
    expect(localStorage.getItem("maintenance_supporter_sort")).to.be.null;
    expect(window.location.search).to.equal("");
  });

  it("an entry_id link still routes to the object even when a tab param rides along", async () => {
    const { el } = await mount("tab=today&entry_id=e1");
    expect(el._view).to.equal("object");
    expect(localStorage.getItem("msp-overview-tab")).to.equal("today");
    expect(window.location.search).to.equal("");
  });

  it("an in-app navigation while mounted (location-changed, no remount) re-reads the URL", async () => {
    const { el } = await mount("");
    expect(el._overviewTab).to.equal("dashboard");
    // The panel only owns navigations to its own url_path (HA passes it in
    // the panel config); here that is the test page's path.
    el.panel = { url_path: PAGE_PATH.replace(/^\//, "") };
    await el.updateComplete;
    // A dashboard button whose navigation_path is
    // "/maintenance-supporter?tab=today" while the panel is already open.
    navigate(`${window.location.pathname}?tab=today`);
    await settle(el);
    expect(el._overviewTab).to.equal("today");
    expect(window.location.search).to.equal("");
    // From a task view, a later navigation lands back on the overview.
    navigate(`${window.location.pathname}?entry_id=e1&task_id=t1`);
    await settle(el);
    expect(el._view).to.equal("task");
    // Bug review 2026-09-04: HA's navigate() already pushed the entry for
    // the overview — the panel must not push a second one (Back needed two
    // presses to get back to the task page).
    const entriesBefore = history.length;
    navigate(`${window.location.pathname}?status=overdue`);
    await settle(el);
    expect(el._view).to.equal("overview");
    expect(el._overviewTab).to.equal("dashboard");
    expect(el._filterStatus).to.equal("overdue");
    expect(history.length, "only HA's own entry").to.equal(entriesBefore + 1);
  });

  // Bug review 2026-09-04 follow-up: the ?entry_id&task_id branch had the
  // same two-press Back as the overview branch — _showTask pushed its own
  // entry on top of the one HA's navigate() had just pushed (state null,
  // which _onPopState ignores). The link now takes HA's entry over.
  it("an in-app task link takes over HA's entry: one Back returns to the list", async () => {
    const { el } = await mount("");
    el.panel = { url_path: PAGE_PATH.replace(/^\//, "") };
    await el.updateComplete;
    const entriesBefore = history.length;
    navigate(`${window.location.pathname}?entry_id=e1&task_id=t1`);
    await settle(el);
    expect(el._view).to.equal("task");
    expect(window.location.search).to.equal("");
    expect(history.length, "only HA's own entry").to.equal(entriesBefore + 1);
    const state = history.state as { msp_view?: string; msp_task?: string } | null;
    expect(state?.msp_view, "HA's entry carries the task page").to.equal("task");
    expect(state?.msp_task).to.equal("t1");
    await back();
    await settle(el);
    expect(el._view, "one Back press").to.equal("overview");
  });

  it("an in-app tab link stamps HA's entry so Back from a task opened later restores the list", async () => {
    const { el } = await mount("");
    el.panel = { url_path: PAGE_PATH.replace(/^\//, "") };
    await el.updateComplete;
    navigate(`${window.location.pathname}?tab=today`);
    await settle(el);
    expect(el._overviewTab).to.equal("today");
    expect((history.state as { msp_view?: string } | null)?.msp_view, "HA's entry describes the overview").to.equal("overview");
    // A task opened the normal way pushes on top of HA's entry…
    (el as unknown as { _showTask(entryId: string, taskId: string): void })._showTask("e1", "t1");
    await settle(el);
    expect(el._view).to.equal("task");
    // …and Back lands on that entry, which must restore the overview instead
    // of leaving the task page up (a state-less entry did nothing).
    await back();
    await settle(el);
    expect(el._view).to.equal("overview");
  });

  it("a navigation to another panel is not ours (params untouched)", async () => {
    const { el } = await mount("");
    el.panel = { url_path: PAGE_PATH.replace(/^\//, "") };
    await el.updateComplete;
    history.pushState(null, "", "/lovelace/0?tab=today");
    window.dispatchEvent(new CustomEvent("location-changed"));
    await settle(el);
    expect(el._overviewTab).to.equal("dashboard");
    expect(window.location.search).to.equal("?tab=today");
  });
});
