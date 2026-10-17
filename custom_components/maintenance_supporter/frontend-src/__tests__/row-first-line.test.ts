/**
 * Wide task rows line up on their first text line (prod report 2026-10-13).
 * Every cell used to be centred on its own, and the due cell is a stack -
 * date, then bar, sensor value and sparkline - so in sensor rows the date sat
 * 11 to 24 px above the type next to it ("replacement" and the dates were not
 * level). Pins: in every kind of row the status label, the task name, the
 * type and the date share one baseline, and the action buttons centre on that
 * line in both styles (labelled and icon-only). The two-line layouts keep
 * their own centring, and a date that wraps in the phone's narrow column ends
 * flush right like the bar under it.
 */

import { expect, waitUntil } from "@open-wc/testing";
import { setViewport } from "@web/test-runner-commands";
import type { StatisticsPoint } from "../types";
import { miniSeriesKey } from "../helpers/trigger-entities.js";
import { DEFAULT_SETTINGS_RESPONSE } from "./_test-utils.js";
import { mountPanel, obj, resetTaskSeq, task } from "./_panel-utils.js";

const DAY = 86400e3;

type PanelEl = HTMLElement & {
  updateComplete: Promise<unknown>;
  requestUpdate: () => void;
  narrow: boolean;
  _rowActionStyle: string;
  _miniStatsData: Map<string, StatisticsPoint[]>;
};

/** The y of the first text line's baseline inside `el`: a zero-size inline
 *  box placed first in the flow sits exactly on it. */
function baseline(el: Element): number {
  const probe = document.createElement("i");
  probe.style.cssText = "display:inline-block;width:0;height:0;vertical-align:baseline";
  el.insertBefore(probe, el.firstChild);
  const y = probe.getBoundingClientRect().top;
  probe.remove();
  return y;
}

const sensor = (over: Record<string, unknown>) =>
  task({
    type: "replacement",
    schedule_type: "sensor_based",
    status: "triggered",
    days_until_due: null,
    interval_days: null,
    trigger_active: true,
    trigger_current_value: 54.2,
    trigger_config: { type: "threshold", entity_id: "sensor.filter", trigger_above: 60 },
    ...over,
  });

function rowsOfEveryKind() {
  return [
    task({ name: "Days bar", type: "cleaning", status: "overdue", days_until_due: -63 }),
    sensor({ name: "Sensor value" }),
    sensor({ name: "Sensor value and sparkline", trigger_config: { type: "threshold", entity_id: "sensor.spark", trigger_above: 60 } }),
    task({ name: "Only a date", type: "inspection", interval_days: 0, days_until_due: 12 }),
    task({ name: "Last done, no due date", type: "service", days_until_due: null, interval_days: null, last_performed: "2026-08-22T10:00:00" }),
    task({ name: "A long task name that wraps onto a second line in its column, so its first line is what counts here", type: "replacement", days_until_due: 5 }),
  ];
}

async function mountWide(): Promise<{ el: PanelEl; sr: ShadowRoot }> {
  const r = await mountPanel([obj("e1", rowsOfEveryKind())], {
    "maintenance_supporter/settings": () => DEFAULT_SETTINGS_RESPONSE,
  });
  const el = r.el as PanelEl;
  const now = Date.now();
  el._miniStatsData = new Map([
    [miniSeriesKey("sensor.spark", false), [30, 45, 54].map((val, i) => ({ ts: now - (3 - i) * DAY, val })) as StatisticsPoint[]],
  ]);
  el.requestUpdate();
  await new Promise((res) => setTimeout(res, 80));
  await el.updateComplete;
  const sr = el.shadowRoot!;
  await waitUntil(() => sr.querySelectorAll(".task-row:not(.virt-sizer) .cell.type").length >= 6, "six rows rendered");
  return { el, sr };
}

function rowByName(sr: ShadowRoot, name: string): HTMLElement {
  const row = [...sr.querySelectorAll<HTMLElement>(".task-row:not(.virt-sizer)")].find((r) =>
    (r.querySelector(".cell.task-name")?.textContent || "").includes(name),
  );
  if (!row) throw new Error(`no row ${name}`);
  return row;
}

const NAMES = ["Days bar", "Sensor value", "Sensor value and sparkline", "Only a date", "Last done, no due date", "A long task name"];

describe("wide task rows line up on their first text line", () => {
  beforeEach(async () => {
    resetTaskSeq();
    localStorage.clear();
    localStorage.setItem("msp-overview-tab", "dashboard");
    await setViewport({ width: 1400, height: 900 });
  });
  afterEach(async () => {
    await setViewport({ width: 800, height: 600 });
  });

  it("status, task name, type and date share one baseline in every kind of row", async () => {
    const { el, sr } = await mountWide();
    expect(el.narrow, "wide layout").to.equal(false);
    expect(el.hasAttribute("tight"), "not the tight layout").to.equal(false);
    const spark = rowByName(sr, "Sensor value and sparkline").querySelector(".mini-sparkline");
    expect(spark, "the sparkline row really carries a sparkline").to.exist;
    expect(rowByName(sr, "Sensor value").querySelector(".trigger-progress"), "the sensor row carries its value").to.exist;
    expect(rowByName(sr, "Last done").querySelector(".due-text.last-done"), "the last-done row").to.exist;
    for (const name of NAMES) {
      const row = rowByName(sr, name);
      const type = baseline(row.querySelector(".cell.type")!);
      const due = baseline(row.querySelector(".due-text")!);
      const taskName = baseline(row.querySelector(".cell.task-name")!);
      const status = baseline(row.querySelector(".status-label")!);
      expect(Math.abs(due - type), `${name}: date vs type (${due} / ${type})`).to.be.at.most(1);
      expect(Math.abs(taskName - type), `${name}: task name vs type`).to.be.at.most(1);
      expect(Math.abs(status - type), `${name}: status label vs type`).to.be.at.most(1);
      const pill = row.querySelector(".status-badge")!.getBoundingClientRect();
      const label = row.querySelector(".status-label")!.getBoundingClientRect();
      const off = (label.top + label.bottom) / 2 - (pill.top + pill.bottom) / 2;
      expect(Math.abs(off), `${name}: the label stays in the middle of its pill`).to.be.at.most(1);
    }
  });

  for (const style of ["buttons_compact", "icons"]) {
    it(`the action buttons centre on the text line (${style})`, async () => {
      const { el, sr } = await mountWide();
      el._rowActionStyle = style;
      await el.updateComplete;
      for (const name of NAMES) {
        const row = rowByName(sr, name);
        const actions = row.querySelector(".row-actions")!;
        expect(actions.classList.contains("as-buttons"), `${style}: rendered in that style`).to.equal(style !== "icons");
        const btn = actions.firstElementChild!.getBoundingClientRect();
        const line = baseline(row.querySelector(".cell.type")!) - 5; // the middle of a 14 px line sits ~5 px above its baseline
        const mid = (btn.top + btn.bottom) / 2;
        expect(Math.abs(mid - line), `${name}: button middle ${mid} vs text line ${line}`).to.be.at.most(4);
      }
    });
  }

  it("the two-line layouts keep centring their rows", async () => {
    const { el, sr } = await mountWide();
    el.narrow = true;
    await el.updateComplete;
    const row = rowByName(sr, "Sensor value");
    expect(getComputedStyle(row).alignItems).to.equal("center");
    el.narrow = false;
    el.setAttribute("tight", "");
    (el as unknown as { tight: boolean }).tight = true;
    await el.updateComplete;
    expect(getComputedStyle(rowByName(sr, "Sensor value")).alignItems).to.equal("center");
  });
});

describe("a wrapped date on a phone", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
    localStorage.setItem("msp-overview-tab", "dashboard");
  });

  it("ends flush right in its column like the bar under it", async () => {
    const r = await mountPanel([obj("e1", [task({ status: "overdue", days_until_due: -63 })])], {
      "maintenance_supporter/settings": () => DEFAULT_SETTINGS_RESPONSE,
    });
    const el = r.el as PanelEl;
    el.style.width = "390px";
    el.narrow = true;
    await new Promise((res) => setTimeout(res, 80));
    await el.updateComplete;
    const sr = el.shadowRoot!;
    await waitUntil(() => !!sr.querySelector(".task-row .due-text"), "row rendered");
    const due = sr.querySelector<HTMLElement>(".task-row .due-text")!;
    // Long enough to wrap in the 100 px column, the way "63 T überfällig" does.
    const text = [...due.childNodes].find((n) => n.nodeType === Node.TEXT_NODE && (n.textContent || "").trim()) as Text;
    text.data = "63 days overdue since";
    const range = document.createRange();
    range.selectNodeContents(due);
    const lines = [...range.getClientRects()].filter((rc) => rc.width > 0);
    const tops = new Set(lines.map((rc) => Math.round(rc.top)));
    expect(tops.size, "the date wraps").to.be.at.least(2);
    const cell = due.closest(".due-cell")!.getBoundingClientRect();
    for (const rc of lines) {
      expect(Math.abs(rc.right - cell.right), `line ends at ${rc.right}, cell at ${cell.right}`).to.be.at.most(1.5);
    }
  });
});

// Found while checking the above live (2026-10-13): the virtual table probed
// the FIRST rendered row's height after every render. With rows of different
// heights the estimate flipped between two windows forever and the page froze
// on the third scroll step of a 125-task install.
describe("the virtual table with rows of different heights", () => {
  beforeEach(async () => {
    resetTaskSeq();
    localStorage.clear();
    localStorage.setItem("msp-overview-tab", "dashboard");
    await setViewport({ width: 1400, height: 900 });
  });
  afterEach(async () => {
    await setViewport({ width: 800, height: 600 });
  });

  it("scrolls from top to bottom without freezing and keeps the viewport filled", async () => {
    // Due dates keep the list in index order. Windows start at multiples
    // of 6, so with a sensor row every 4th the FIRST row of the window
    // alternates between a tall and a short one - what froze the live page.
    const many = Array.from({ length: 150 }, (_, i) =>
      i % 4 === 0
        ? sensor({ name: `Sensor ${String(i).padStart(3, "0")}`, status: "ok", trigger_active: false, days_until_due: i + 1, trigger_config: { type: "threshold", entity_id: "sensor.spark", trigger_above: 60 } })
        : task({ name: `Plain ${String(i).padStart(3, "0")}`, days_until_due: i + 1 }),
    );
    const r = await mountPanel([obj("e1", many)], {
      "maintenance_supporter/settings": () => DEFAULT_SETTINGS_RESPONSE,
    });
    const el = r.el as PanelEl;
    const now = Date.now();
    el._miniStatsData = new Map([
      [miniSeriesKey("sensor.spark", false), [30, 45, 54].map((val, i) => ({ ts: now - (3 - i) * DAY, val })) as StatisticsPoint[]],
    ]);
    el.requestUpdate();
    await el.updateComplete;
    const sr = el.shadowRoot!;
    await waitUntil(() => !!sr.querySelector(".task-table.virtual .task-row .mini-sparkline"), "virtual table with sparkline rows");
    const content = sr.querySelector<HTMLElement>(".content")!;
    const heights = new Set([...sr.querySelectorAll<HTMLElement>(".task-row:not(.virt-sizer)")].map((row) => row.offsetHeight));
    expect(heights.size, `rows of different heights, got ${[...heights]}`).to.be.at.least(2);

    let steps = 0;
    for (let top = 0; top < content.scrollHeight - content.clientHeight; top += 450) {
      content.scrollTop = top;
      content.dispatchEvent(new Event("scroll"));
      // A render loop starves the timers: this await would never return.
      await new Promise((res) => requestAnimationFrame(() => res(null)));
      await new Promise((res) => setTimeout(res, 30));
      await el.updateComplete;
      steps++;
      // The part of the viewport the table covers shows rows at both
      // edges, not a spacer: the estimate keeps the window where we look.
      const box = content.getBoundingClientRect();
      const table = sr.querySelector(".task-table.virtual")!.getBoundingClientRect();
      const vTop = Math.max(box.top, table.top), vBottom = Math.min(box.bottom, table.bottom);
      const rows = [...sr.querySelectorAll<HTMLElement>(".task-table .task-row:not(.virt-sizer)")].map((row) => row.getBoundingClientRect());
      expect(rows.some((rc) => rc.top <= vTop + 1 && rc.bottom >= vTop), `step ${steps}: a row at the top edge`).to.equal(true);
      expect(rows.some((rc) => rc.top <= vBottom && rc.bottom >= vBottom - 1), `step ${steps}: a row at the bottom edge`).to.equal(true);
    }
    expect(steps, "scrolled through the list").to.be.at.least(10);
  });
});
