/**
 * #150 — the header KPI strip on phones.
 *
 * Before: `.stats-bar` used `auto-fit, minmax(84px, 1fr)` at every width, so a
 * 360–412 px phone got 3–4 columns and the last KPI(s) wrapped onto a lonely
 * second row ("Triggered" alone under the others). Now the narrow media query
 * switches to a fixed 10-track grid — KPI tiles span 2, budget tiles span 5 —
 * so the five KPIs ALWAYS share one row and the two budget tiles fill a full
 * second row. The desktop layout is untouched.
 *
 * Renders the real strip markup with the REAL sharedStyles at real viewport
 * widths (web-test-runner drives a real Chromium), then reads the layout back.
 */

import { expect, fixture, html } from "@open-wc/testing";
import { setViewport } from "@web/test-runner-commands";
import { LitElement, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { sharedStyles } from "../styles";

const KPI_LABELS = ["Objects", "Tasks", "Overdue", "Due Soon", "Triggered"];
// The longest single-word KPI label across the 22 locales (nl "overdue").
const LONGEST_LABEL = "Achterstallig";

@customElement("stats-bar-probe")
class StatsBarProbe extends LitElement {
  static styles = [sharedStyles, css`:host { display: block; }`];
  @property({ type: Boolean }) budget = false;
  @property({ type: Array }) labels = KPI_LABELS;
  render() {
    return html`
      <div class="stats-bar">
        ${this.labels.map(
          (l) => html`<div class="stat-item clickable"><span class="stat-value">12</span><span class="stat-label">${l}</span></div>`,
        )}
        ${this.budget
          ? html`
              <div class="stat-item budget-tile"><span class="stat-value">0.00 €</span><span class="stat-label">Monthly budget</span></div>
              <div class="stat-item budget-tile"><span class="stat-value">929.60 €</span><span class="stat-label">Yearly budget</span></div>
            `
          : ""}
      </div>
    `;
  }
}

type Row = { label: string; top: number; width: number; clipped: boolean };

function measure(el: StatsBarProbe): Row[] {
  const items = [...el.shadowRoot!.querySelectorAll<HTMLElement>(".stat-item")];
  return items.map((i) => {
    const lab = i.querySelector<HTMLElement>(".stat-label")!;
    const r = i.getBoundingClientRect();
    return {
      label: lab.textContent!.trim(),
      top: Math.round(r.top),
      width: Math.round(r.width),
      // A label wider than its box = clipped/overflowing text.
      clipped: lab.scrollWidth > lab.clientWidth + 1,
    };
  });
}

const rowsOf = (rows: Row[]) => new Set(rows.map((r) => r.top)).size;

describe("#150 header KPI strip on phones", () => {
  after(async () => {
    await setViewport({ width: 1280, height: 800 });
  });

  for (const width of [360, 393, 412]) {
    it(`keeps the five KPIs on ONE row at ${width} px`, async () => {
      await setViewport({ width, height: 800 });
      const el = await fixture<StatsBarProbe>(html`<stats-bar-probe></stats-bar-probe>`);
      const rows = measure(el);
      expect(rows.map((r) => r.label)).to.deep.equal(KPI_LABELS);
      expect(rowsOf(rows), `rows at ${width}px`).to.equal(1);
      for (const r of rows) expect(r.clipped, `${r.label} clipped at ${width}px`).to.be.false;
    });

    it(`puts the two budget tiles on a full second row at ${width} px`, async () => {
      await setViewport({ width, height: 800 });
      const el = await fixture<StatsBarProbe>(html`<stats-bar-probe budget></stats-bar-probe>`);
      const rows = measure(el);
      expect(rows).to.have.length(7);
      const kpiTops = new Set(rows.slice(0, 5).map((r) => r.top));
      const budgetTops = new Set(rows.slice(5).map((r) => r.top));
      expect(kpiTops.size, "KPIs share one row").to.equal(1);
      expect(budgetTops.size, "budget tiles share one row").to.equal(1);
      expect([...budgetTops][0]).to.be.greaterThan([...kpiTops][0]);
      // Each budget tile takes half the strip — noticeably wider than a KPI.
      expect(rows[5].width).to.be.greaterThan(rows[0].width * 2);
      for (const r of rows) expect(r.clipped, `${r.label} clipped at ${width}px`).to.be.false;
    });
  }

  it("never clips the longest localized KPI label (nl 'Achterstallig') at 360 px", async () => {
    await setViewport({ width: 360, height: 800 });
    const labels = [KPI_LABELS[0], KPI_LABELS[1], LONGEST_LABEL, KPI_LABELS[3], KPI_LABELS[4]];
    const el = await fixture<StatsBarProbe>(html`<stats-bar-probe .labels=${labels}></stats-bar-probe>`);
    const rows = measure(el);
    expect(rowsOf(rows)).to.equal(1);
    const long = rows.find((r) => r.label === LONGEST_LABEL)!;
    expect(long.clipped, "overlong word must wrap/hyphenate, not clip").to.be.false;
    const lab = el.shadowRoot!.querySelectorAll<HTMLElement>(".stat-label")[2];
    expect(getComputedStyle(lab).overflowWrap).to.equal("anywhere");
  });

  it("leaves the desktop layout alone (auto-fit, one row of 84px+ tiles)", async () => {
    await setViewport({ width: 1280, height: 800 });
    const el = await fixture<StatsBarProbe>(html`<stats-bar-probe budget></stats-bar-probe>`);
    const rows = measure(el);
    expect(rowsOf(rows)).to.equal(1);
    for (const r of rows) expect(r.width).to.be.at.least(84);
    const bar = el.shadowRoot!.querySelector<HTMLElement>(".stats-bar")!;
    expect(getComputedStyle(bar).gap).to.equal("16px");
  });
});
