/**
 * Phone width (reported 2026-09-27): the collapsed "Document storage" header
 * let "141.1 MB −5.9 MB" slide under its refresh button — the title and the
 * summary were flex children that could not shrink, so the toggle's content
 * spilled out of its own box. Nothing measured the section cards at phone
 * width, so no test noticed.
 *
 * `spilled()` is the generic check: an element whose content is wider than
 * its box while it does not clip (overflow visible) draws over its
 * neighbours. Deliberate clipping (hidden / auto / ellipsis) is fine.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/storage-section-card.js";
import "../components/budget-section-card.js";
import "../components/vacation-section-card.js";
import { createMockHass } from "./_test-utils.js";

/** Elements (shadow roots included) whose content overflows their box unclipped. */
function spilled(root: ParentNode): string[] {
  const out: string[] = [];
  const walk = (node: ParentNode) => {
    for (const el of Array.from(node.querySelectorAll<HTMLElement>("*"))) {
      if (el.shadowRoot) walk(el.shadowRoot);
      const style = getComputedStyle(el);
      if (style.display === "none" || style.display === "contents" || style.overflowX !== "visible") continue;
      if (el.clientWidth === 0) continue;
      if (el.scrollWidth > el.clientWidth + 1) out.push(`${el.tagName.toLowerCase()}.${el.className} (${el.scrollWidth} > ${el.clientWidth})`);
    }
  };
  walk(root);
  return out;
}

/** Whether two boxes overlap horizontally on the same line. */
function overlaps(a: DOMRect, b: DOMRect): boolean {
  return a.right > b.left + 0.5 && b.right > a.left + 0.5 && a.bottom > b.top && b.bottom > a.top;
}

const MB = 1024 * 1024;

describe("section cards at phone width", () => {
  for (const width of [280, 320, 360]) {
    it(`storage header keeps its size and saving clear of the refresh button (${width}px)`, async () => {
      const { hass } = createMockHass({
        handlers: {
          "maintenance_supporter/documents/storage": () => ({
            total_bytes: 141.1 * MB,
            dedup_savings_bytes: 5.9 * MB,
            file_count: 120,
            link_count: 4,
            document_count: 124,
            by_object: { a: { bytes: 141.1 * MB, files: 120, links: 4 } },
          }),
        },
      });
      const wrap = await fixture<HTMLDivElement>(html`
        <div style="width:${width}px">
          <maintenance-storage-section-card .hass=${hass} .objects=${[{ entry_id: "e1", object: { id: "a", name: "Kitchen" } }]}></maintenance-storage-section-card>
        </div>
      `);
      const card = wrap.querySelector("maintenance-storage-section-card")!;
      await new Promise((r) => setTimeout(r, 30));
      await (card as unknown as { updateComplete: Promise<unknown> }).updateComplete;
      const sr = card.shadowRoot!;
      const summary = sr.querySelector<HTMLElement>(".header-summary")!;
      const refresh = sr.querySelector<HTMLElement>(".icon-btn")!;
      expect(summary, "summary rendered").to.exist;
      expect(overlaps(summary.getBoundingClientRect(), refresh.getBoundingClientRect()), "summary under the refresh button").to.equal(false);
      const found = spilled(sr);
      expect(found, `content spilling out of its box: ${found.join(" | ")}`).to.deep.equal([]);
      // the size itself is never cut off — only the title may shorten
      expect(summary.scrollWidth).to.be.at.most(summary.clientWidth + 1);
    });
  }

  it("budget and vacation cards do not spill at 320px", async () => {
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/budget_status": () => ({
          monthly_budget: 1250, monthly_spent: 987.65, yearly_budget: 15000, yearly_spent: 12345.67,
          alert_threshold_pct: 80, currency_symbol: "CHF",
        }),
        "maintenance_supporter/vacation/state": () => ({
          enabled: true, is_active: true, start: "2026-08-01", end: "2026-08-14", buffer_days: 7, exempt_task_ids: [],
        }),
      },
    });
    (hass as Record<string, unknown>).user = { id: "u1", is_admin: true };
    const wrap = await fixture<HTMLDivElement>(html`
      <div style="width:320px">
        <maintenance-budget-section-card></maintenance-budget-section-card>
        <maintenance-vacation-section-card .hass=${hass}></maintenance-vacation-section-card>
      </div>
    `);
    const budget = wrap.querySelector("maintenance-budget-section-card") as unknown as { setConfig(c: unknown): void; hass: unknown };
    budget.setConfig({ type: "custom:maintenance-budget-section-card" });
    budget.hass = hass;
    await new Promise((r) => setTimeout(r, 60));
    const found = spilled(wrap);
    expect(found, `content spilling out of its box: ${found.join(" | ")}`).to.deep.equal([]);
  });
});
