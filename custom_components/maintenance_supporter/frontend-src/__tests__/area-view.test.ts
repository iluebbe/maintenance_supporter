/** The areas page and the area detail (#191) as components:
 *
 *  <maintenance-areas-view>: one row per area with the counts and costs,
 *  text filter, sortable (remembered) columns, `open-area` on a row.
 *  <maintenance-area-view>: fetches only the truncated task histories,
 *  filters (range chips, object, task) drive the KPIs, the chart and the
 *  cost-per-object table, rows open the task / the object, and Print opens
 *  the area report in the tab preopened inside the click.
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import "../components/areas-view.js";
import "../components/area-view.js";
import type { MaintenanceAreasView } from "../components/areas-view";
import type { MaintenanceAreaView } from "../components/area-view";
import { createMockHass, type SentMessage } from "./_test-utils.js";

const hist = (timestamp: string, type: string, cost?: number, extra: Record<string, unknown> = {}) =>
  ({ timestamp, type, ...(cost != null ? { cost } : {}), ...extra });

/** The window the list payload carries vs the full history the server
 *  holds: t1 is truncated (history_count > window), the rest are whole. */
const FULL_T1 = [
  hist("2024-05-10T12:00:00", "completed", 40, { duration: 30 }),
  hist("2025-12-15T12:00:00", "completed", 30, { duration: 20 }),
  hist("2026-02-10T12:00:00", "completed", 50, { notes: "<b>dust</b>", completed_by: "u1" }),
];

function objects() {
  return [
    {
      entry_id: "e1",
      object: { name: "Fridge", area_id: "kitchen" },
      tasks: [
        { id: "t1", name: "Clean coils", status: "overdue", history: FULL_T1.slice(1), history_count: 3 },
        { id: "t2", name: "Replace filter", status: "ok", history: [hist("2026-01-05T12:00:00", "completed", 20)], history_count: 1 },
      ],
    },
    {
      entry_id: "e2",
      object: { name: "Dishwasher", area_id: "kitchen" },
      tasks: [
        { id: "t3", name: "Descale", status: "due_soon", history: [hist("2026-01-20T12:00:00", "completed", 15), hist("2026-03-01T12:00:00", "skipped")], history_count: 2 },
      ],
    },
    { entry_id: "e3", object: { name: "Car", area_id: null }, tasks: [{ id: "t4", name: "Oil change", status: "ok", history: [hist("2025-06-01T12:00:00", "completed", 90)], history_count: 1 }] },
    { entry_id: "e4", object: { name: "Old boiler", area_id: "kitchen", archived: true }, tasks: [] },
  ];
}

/** The first update starts the full-history fetch; wait for it to land
 *  and for the re-render it triggers. */
async function settle(el: HTMLElement & { updateComplete: Promise<unknown> }): Promise<void> {
  await (el as unknown as { _histories: { settled(): Promise<void> } })._histories.settled();
  await el.updateComplete;
}

function makeHass() {
  const { hass, sent } = createMockHass({
    handlers: {
      "maintenance_supporter/task/history": (msg: SentMessage) => ({ history: msg.task_id === "t1" ? FULL_T1 : [] }),
    },
  });
  (hass as Record<string, unknown>).areas = { kitchen: { area_id: "kitchen", name: "Kitchen", icon: "mdi:stove" } };
  return { hass, sent };
}

describe("<maintenance-areas-view> (#191)", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  async function mountList() {
    const { hass, sent } = makeHass();
    const el = await fixture<MaintenanceAreasView>(html`
      <maintenance-areas-view .hass=${hass as never} .objects=${objects() as never} .currencySymbol=${"€"}></maintenance-areas-view>
    `);
    await settle(el);
    return { el, sent };
  }
  const rowNames = (el: HTMLElement) => [...el.querySelectorAll("tbody tr")].map((r) => r.querySelector(".objects-table-name")!.textContent!.trim());

  it("lists areas with objects plus the No area bucket; costs include the fetched full history", async () => {
    const { el, sent } = await mountList();
    expect(sent.filter((m) => m.type === "maintenance_supporter/task/history").map((m) => m.task_id)).to.deep.equal(["t1"]);
    expect(rowNames(el)).to.deep.equal(["Kitchen", "No area"]);
    const kitchen = el.querySelector("tbody tr")!;
    const cells = [...kitchen.querySelectorAll("td")].map((td) => td.textContent!.replace(/\s+/g, " ").trim());
    expect(cells[1], "objects (archived hidden)").to.equal("2");
    expect(cells[2], "tasks").to.equal("3");
    expect(cells[3], "overdue").to.equal("1");
    expect(cells[4], "due soon").to.equal("1");
    // All time = the 2024 completion only the FULL history carries.
    expect(cells[6]).to.contain(String(40 + 30 + 50 + 20 + 15));
    expect(el.querySelector(".archived-toggle"), "an archived object exists").to.exist;
  });

  it("sorts on a header click, remembers it, and filters by name", async () => {
    const { el } = await mountList();
    const header = (label: string) => [...el.querySelectorAll<HTMLButtonElement>("th .area-sort")].find((b) => b.textContent!.includes(label))!;
    header("Total cost").click();
    await el.updateComplete;
    expect(localStorage.getItem("msp-area-sort")).to.equal("cost_total:desc");
    expect(rowNames(el)).to.deep.equal(["Kitchen", "No area"]);
    header("Total cost").click();
    await el.updateComplete;
    expect(rowNames(el)).to.deep.equal(["No area", "Kitchen"]);
    const input = el.querySelector<HTMLInputElement>(".area-filter-bar input[type=search]")!;
    input.value = "kitch";
    input.dispatchEvent(new Event("input"));
    await el.updateComplete;
    expect(rowNames(el)).to.deep.equal(["Kitchen"]);
    input.value = "zzz";
    input.dispatchEvent(new Event("input"));
    await el.updateComplete;
    expect(el.querySelector(".empty-state")!.textContent).to.contain("No area matches");
  });

  it("a row click asks to open the area; the archived chip asks to toggle", async () => {
    const { el } = await mountList();
    let opened = "";
    let toggled = 0;
    el.addEventListener("open-area", (e) => { opened = (e as CustomEvent<{ areaKey: string }>).detail.areaKey; });
    el.addEventListener("archived-toggle", () => { toggled++; });
    (el.querySelectorAll("tbody tr")[1] as HTMLElement).click();
    expect(opened).to.equal("__none__");
    (el.querySelector(".archived-toggle") as HTMLElement).click();
    expect(toggled).to.equal(1);
  });
});

describe("<maintenance-area-view> (#191)", () => {
  async function mountArea() {
    const { hass, sent } = makeHass();
    const el = await fixture<MaintenanceAreaView>(html`
      <maintenance-area-view
        .hass=${hass as never}
        .areaKey=${"kitchen"}
        .objects=${objects() as never}
        .currencySymbol=${"€"}
        .userName=${(id: string) => (id === "u1" ? "Anna" : null)}
      ></maintenance-area-view>
    `);
    await settle(el);
    // Wall-clock independent: every test starts from "all time".
    [...el.querySelectorAll<HTMLButtonElement>(".area-range-chips .filter-chip")].at(-1)!.click();
    await el.updateComplete;
    return { el, sent };
  }
  const kpi = (el: HTMLElement, cls: string) => el.querySelector(`.${cls}`)!.textContent!.trim();
  const priv = (el: MaintenanceAreaView) => el as unknown as { _from: string; _to: string; _entryFilter: string; _taskQuery: string };

  it("fetches only the truncated history and merges every object, archived ones hidden", async () => {
    const { el, sent } = await mountArea();
    expect(sent.filter((m) => m.type === "maintenance_supporter/task/history").map((m) => m.task_id)).to.deep.equal(["t1"]);
    expect(el.querySelector(".area-title")!.textContent).to.contain("Kitchen");
    expect(el.querySelector("p.meta")!.textContent).to.contain("2 objects");
    const rows = [...el.querySelectorAll(".area-history-row")];
    expect(rows.length).to.equal(6);
    expect(rows[0].textContent).to.contain("Dishwasher");
    expect(rows[0].textContent).to.contain("Skipped");
    expect(kpi(el, "area-kpi-completions")).to.equal("5");
    expect(kpi(el, "area-kpi-cost")).to.contain("155");
  });

  it("the object, task and date filters drive the KPIs and the per-object table", async () => {
    const { el } = await mountArea();
    const select = el.querySelector<HTMLSelectElement>(".area-object-filter")!;
    select.value = "e2";
    select.dispatchEvent(new Event("change"));
    await el.updateComplete;
    expect(kpi(el, "area-kpi-completions")).to.equal("1");
    expect(kpi(el, "area-kpi-cost")).to.contain("15");
    expect(el.querySelectorAll(".area-object-table tbody tr").length).to.equal(1);

    priv(el)._entryFilter = "";
    priv(el)._taskQuery = "coils";
    await el.updateComplete;
    expect(kpi(el, "area-kpi-completions")).to.equal("3");

    priv(el)._taskQuery = "";
    priv(el)._from = "2026-01-01";
    priv(el)._to = "2026-12-31";
    await el.updateComplete;
    expect(kpi(el, "area-kpi-completions")).to.equal("3");
    expect(kpi(el, "area-kpi-cost")).to.contain("85");
    const chip2026 = [...el.querySelectorAll<HTMLButtonElement>(".area-range-chips .filter-chip")].find((c) => c.textContent!.trim() === "2026")!;
    expect(chip2026.classList.contains("active"), "the year chip reflects the range").to.equal(true);
    // Twelve month bars for the calendar year, the cost-per-object shares.
    expect(el.querySelectorAll(".area-bar").length).to.equal(12);
    const first = el.querySelector(".area-object-table tbody tr")!;
    expect(first.textContent).to.contain("Fridge");
    expect(first.textContent).to.contain("82 %");
  });

  it("an empty period says so instead of drawing bars", async () => {
    const { el } = await mountArea();
    priv(el)._from = "2023-01-01";
    priv(el)._to = "2023-12-31";
    await el.updateComplete;
    expect(el.querySelector(".area-bar")).to.equal(null);
    expect(el.querySelector(".area-empty")!.textContent).to.contain("No costs");
    expect(kpi(el, "area-kpi-completions")).to.equal("0");
  });

  it("a row opens its task; the object name opens the object", async () => {
    const { el } = await mountArea();
    const events: string[] = [];
    el.addEventListener("open-task", (e) => events.push(`task:${(e as CustomEvent).detail.entryId}/${(e as CustomEvent).detail.taskId}`));
    el.addEventListener("open-object", (e) => events.push(`object:${(e as CustomEvent).detail.entryId}`));
    const row = el.querySelectorAll<HTMLElement>(".area-history-row")[1];
    row.click();
    row.querySelector<HTMLElement>(".area-object-link")!.click();
    el.querySelector<HTMLElement>(".area-object-table tbody tr")!.click();
    expect(events).to.deep.equal(["task:e1/t1", "object:e1", "object:e1"]);
  });

  it("Print opens the area report in the tab preopened inside the click", async () => {
    const { el } = await mountArea();
    const opened: string[] = [];
    const tab = { closed: false, location: { href: "" }, close() { this.closed = true; } };
    const orig = window.open;
    (window as unknown as { open: unknown }).open = (url?: string) => { opened.push(url || ""); return tab; };
    let inClick: string[] = [];
    try {
      el.querySelector<HTMLElement>(".area-print")!.click();
      inClick = [...opened];
      await waitUntil(() => tab.location.href !== "", "report opened");
    } finally {
      (window as unknown as { open: unknown }).open = orig;
    }
    expect(inClick).to.deep.equal(["about:blank"]);
    const doc = await (await fetch(tab.location.href)).text();
    expect(doc).to.match(/color-scheme:\s*light/);
    expect(doc).to.contain("Area report — Kitchen");
    expect(doc).to.contain("&lt;b&gt;dust&lt;/b&gt;");
    expect(doc).to.contain("Completed by: Anna");
    expect(doc).to.contain("Descale");
    expect(doc, "the full-history completion is in the report").to.contain("Clean coils");
  });
});
