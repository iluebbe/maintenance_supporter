/**
 * Phone-width sweep of the panel (2026-09-27, after the storage-card header
 * clipped on a phone): every tab rendered at 360 px with long names and every
 * status; no element may spill content out of its box without clipping it.
 */

import { expect } from "@open-wc/testing";
import "../maintenance-panel.js";
import { mountPanel, obj, resetTaskSeq, task } from "./_panel-utils.js";

function spilled(root: ParentNode): string[] {
  const out: string[] = [];
  const walk = (node: ParentNode) => {
    for (const el of Array.from(node.querySelectorAll<HTMLElement>("*"))) {
      if (el.shadowRoot) walk(el.shadowRoot);
      const style = getComputedStyle(el);
      if (style.display === "none" || style.display === "contents" || style.overflowX !== "visible") continue;
      if (el.clientWidth === 0) continue;
      if (el.scrollWidth > el.clientWidth + 1) out.push(`${el.tagName.toLowerCase()}.${String(el.className).trim().replace(/\s+/g, ".")} (${el.scrollWidth} > ${el.clientWidth})`);
    }
  };
  walk(root);
  return out;
}

const LONG = "Wärmepumpe Außeneinheit Nordseite Garage";

function objects() {
  resetTaskSeq();
  return [
    obj("e1", [
      task({ name: "Filter der Lüftungsanlage reinigen und prüfen", status: "overdue", days_until_due: -12 }),
      task({ name: "Jahreswartung durch Fachbetrieb", status: "due_soon", days_until_due: 3 }),
      task({ name: "Kältemittel-Dichtheitsprüfung (F-Gase)", status: "triggered", trigger_active: true }),
      task({ status: "ok" }),
    ], LONG),
    obj("e2", [task({ status: "ok", name: "Rasen mähen" })], "Garten"),
  ];
}

describe("panel at phone width", () => {
  for (const tab of ["today", "dashboard", "calendar", "settings"]) {
    it(`${tab}: nothing spills out of its box at 360px`, async () => {
      // presets only apply to the embedded panel — switch the tab directly
      const { el } = await mountPanel(objects());
      const panel = el as unknown as { narrow: boolean; _setOverviewTab(t: string): void; _overviewTab: string };
      panel.narrow = true;
      el.style.width = "360px";
      panel._setOverviewTab(tab);
      await el.updateComplete;
      if (tab === "settings") await customElements.whenDefined("maintenance-settings-view");
      await new Promise((r) => setTimeout(r, 120));
      await el.updateComplete;
      expect(panel._overviewTab, "the tab under test is showing").to.equal(tab);
      if (tab === "settings") {
        const sv = el.shadowRoot!.querySelector("maintenance-settings-view") as (HTMLElement & { updateComplete: Promise<unknown> }) | null;
        expect(sv, "settings view rendered").to.exist;
        await sv!.updateComplete;
        await new Promise((r) => setTimeout(r, 60));
      }
      const found = spilled(el.shadowRoot!);
      expect(found, found.join("\n")).to.deep.equal([]);
      if (tab === "settings") {
        // English labels are short, the long ones come in other languages
        // (the live sweep's job): the rule that makes them fit is pinned here.
        const sv = el.shadowRoot!.querySelector("maintenance-settings-view")!;
        const selects = [...sv.shadowRoot!.querySelectorAll<HTMLSelectElement>(".setting-row select")];
        expect(selects.length, "settings rows with a select").to.be.greaterThan(0);
        for (const s of selects) {
          const cs = getComputedStyle(s);
          expect(cs.flexShrink, "a select in a settings row may shrink").to.not.equal("0");
          expect(cs.maxWidth, "and has a cap").to.not.equal("none");
        }
      }
    });
  }
});

describe("area pages at phone width (#191)", () => {
  for (const view of ["all_areas", "area"]) {
    it(`${view}: nothing spills out of its box at 360px`, async () => {
      const objs = objects();
      // A long area name and a year of costs, so the chart and the tables render.
      (objs[0].object as Record<string, unknown>).area_id = "keller";
      const now = new Date();
      (objs[0].tasks[0] as Record<string, unknown>).history = [1, 4, 9].map((m) => ({
        timestamp: new Date(now.getFullYear(), now.getMonth() - m, 12, 12).toISOString(),
        type: "completed", cost: 120 * m, duration: 45, notes: "Filter getauscht, Dichtung geprüft und Kondensat abgelassen",
      }));
      (objs[0].tasks[0] as Record<string, unknown>).history_count = 3;
      const { el } = await mountPanel(objs);
      const panel = el as unknown as {
        narrow: boolean; hass: { areas: Record<string, unknown> }; updateComplete: Promise<unknown>;
        _showAllAreas(): void; _showArea(id: string): void;
      };
      panel.hass.areas = { keller: { area_id: "keller", name: LONG, icon: null } };
      panel.narrow = true;
      el.style.width = "360px";
      if (view === "area") panel._showArea("keller");
      else panel._showAllAreas();
      await customElements.whenDefined(view === "area" ? "maintenance-area-view" : "maintenance-areas-view");
      for (let i = 0; i < 3; i++) {
        await new Promise((r) => setTimeout(r, 60));
        await panel.updateComplete;
      }
      const host = el.shadowRoot!.querySelector(view === "area" ? "maintenance-area-view" : "maintenance-areas-view");
      expect(host, "view rendered").to.exist;
      if (view === "area") expect(host!.querySelectorAll(".area-bar").length, "chart drawn").to.equal(12);
      const found = spilled(el.shadowRoot!);
      expect(found, found.join("\n")).to.deep.equal([]);
    });
  }
});

describe("task page at phone width", () => {
  it("the header wraps its badges instead of widening the page", async () => {
    // Found live (2026-10-03): a postponed, assigned, muted task without an
    // NFC tag drew its header row 505 px wide on a 360 px phone.
    const objs = objects();
    const first = objs[0].tasks[0] as Record<string, unknown>;
    Object.assign(first, {
      due_override: "2026-12-24",
      responsible_user_id: "u1",
      notify_enabled: false,
      mirror_todo_entities: ["todo.shopping"],
      history: [
        { timestamp: "2026-03-10T10:00:00", type: "completed", cost: 200, duration: 30 },
        { timestamp: "2026-06-10T10:00:00", type: "completed", cost: -150, duration: 20, notes: "Altgerät verkauft" },
      ],
      history_count: 2,
    });
    const { el } = await mountPanel(objs, {
      "maintenance_supporter/users/list": () => ({ users: [{ id: "u1", name: "Maximilian Mustermann" }] }),
    });
    const panel = el as unknown as { narrow: boolean; updateComplete: Promise<unknown>; _showTask(e: string, t: string): void };
    panel.narrow = true;
    el.style.width = "360px";
    panel._showTask("e1", String(first.id));
    await customElements.whenDefined("maintenance-task-detail-view");
    for (let i = 0; i < 3; i++) {
      await new Promise((r) => setTimeout(r, 60));
      await panel.updateComplete;
    }
    const header = el.shadowRoot!.querySelector(".task-header");
    expect(header, "task header rendered").to.exist;
    expect(header!.querySelectorAll(".postponed-badge, .user-badge, .nfc-badge").length, "the badges under test").to.be.at.least(4);
    expect(el.shadowRoot!.querySelector(".history-credit"), "the credit row (#200)").to.exist;
    const found = spilled(el.shadowRoot!);
    expect(found, found.join("\n")).to.deep.equal([]);
  });

  it("the header path shrinks instead of pushing the search button off screen", async () => {
    // Found live (2026-10-03): "Maintenance / HVAC System / Filter
    // Replacement" broke only at its spaces, so the words alone were wider
    // than the header and the search button sat outside a 360 px screen.
    resetTaskSeq();
    const objs = [obj("e1", [task({ name: "Kältemitteldichtheitsprüfungsprotokoll" })], "Wärmepumpenaußeneinheitsgehäuse")];
    const { el } = await mountPanel(objs);
    const panel = el as unknown as { narrow: boolean; updateComplete: Promise<unknown>; _showTask(e: string, t: string): void };
    panel.narrow = true;
    el.style.width = "360px";
    panel._showTask("e1", "t1");
    for (let i = 0; i < 3; i++) {
      await new Promise((r) => setTimeout(r, 60));
      await panel.updateComplete;
    }
    const header = el.shadowRoot!.querySelector<HTMLElement>(".header")!;
    expect(header.querySelector(".breadcrumbs .current")!.textContent).to.include("Kältemittel");
    const search = header.querySelector<HTMLElement>(".header-search")!;
    expect(search.getBoundingClientRect().right, "the search button stays on screen").to.be.at.most(header.getBoundingClientRect().right + 1);
    const found = spilled(el.shadowRoot!);
    expect(found, found.join("\n")).to.deep.equal([]);
  });
});
