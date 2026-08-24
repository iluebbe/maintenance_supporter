/** Tests for <maintenance-trigger-chart> + the shared chart utils. */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/trigger-chart.js";
import type { MaintenanceTriggerChart } from "../components/trigger-chart";
import { niceTicks, fmtNum } from "../renderers/chart-utils.js";

const DAY = 86400000;
const NOW = Date.now();
const POINTS = Array.from({ length: 10 }, (_, i) => ({
  ts: NOW - (9 - i) * DAY,
  val: 50 + i * 3, // 50 … 77
}));

async function mount(props: Partial<MaintenanceTriggerChart> = {}) {
  const el = await fixture<MaintenanceTriggerChart>(html`
    <maintenance-trigger-chart
      .points=${props.points ?? POINTS}
      .events=${props.events ?? []}
      .unit=${"%"}
      .lang=${"en"}
      .thresholdBelow=${props.thresholdBelow ?? null}
      .thresholdAbove=${props.thresholdAbove ?? null}
      .targetValue=${props.targetValue ?? null}
      .forceZero=${props.forceZero ?? false}
      .rangeDays=${props.rangeDays ?? 30}
    ></maintenance-trigger-chart>
  `);
  await new Promise((r) => setTimeout(r, 40)); // let the ResizeObserver fire
  await el.updateComplete;
  return el;
}

describe("trigger-chart", () => {
  it("renders round y-ticks with gridlines at full width", async () => {
    const el = await mount();
    const svg = el.shadowRoot!.querySelector("svg")!;
    expect(svg, "svg rendered").to.exist;
    // width follows the host container, not a fixed 300
    expect(Number(svg.getAttribute("width"))).to.be.greaterThan(300);
    const labels = [...el.shadowRoot!.querySelectorAll("text.tick-label")].map((t) => t.textContent);
    // nice ticks over ~[48,79] land on round steps (50/60/70/80-ish)
    expect(labels.some((l) => /^(50|60|70|80)$/.test(l || "")), `round tick in ${labels}`).to.be.true;
  });

  it("shades the danger zone and recolors in-zone line segments", async () => {
    const el = await mount({ thresholdBelow: 60 });
    const rects = el.shadowRoot!.querySelectorAll('rect[fill="var(--error-color, #f44336)"]');
    expect(rects.length, "zone shading rect").to.be.greaterThan(0);
    const redLine = el.shadowRoot!.querySelector('polyline[stroke="var(--error-color, #f44336)"]');
    expect(redLine, "in-zone line overlay (clip-path)").to.exist;
    const label = [...el.shadowRoot!.querySelectorAll("text.zone-label")].map((t) => t.textContent).join(" ");
    expect(label).to.contain("60");
  });

  it("draws a target line for counter progress", async () => {
    const el = await mount({ targetValue: 100, forceZero: true });
    const label = [...el.shadowRoot!.querySelectorAll("text.zone-label")].map((t) => t.textContent).join(" ");
    expect(label).to.contain("100");
    // forceZero pulls the domain floor to 0
    const ticks = [...el.shadowRoot!.querySelectorAll("text.tick-label")].map((t) => t.textContent);
    expect(ticks).to.include("0");
  });

  it("emits range-change from the range chips", async () => {
    const el = await mount({ rangeDays: 30 });
    let got = 0;
    el.addEventListener("range-change", (e) => { got = (e as CustomEvent).detail.days; });
    const chips = [...el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".range-chip:not(.outlier-chip)")];
    expect(chips.length).to.equal(4);
    chips.find((c) => c.textContent!.trim() === "90d")!.click();
    expect(got).to.equal(90);
  });

  it("emits outlier-toggle from the filter chip", async () => {
    const el = await mount({ rangeDays: 30 });
    let hide: boolean | null = null;
    el.addEventListener("outlier-toggle", (e) => { hide = (e as CustomEvent).detail.hide; });
    const chip = el.shadowRoot!.querySelector<HTMLButtonElement>(".outlier-chip");
    expect(chip, "outlier chip present").to.exist;
    chip!.click();
    expect(hide).to.equal(true);
  });

  it("shows a crosshair value chip on pointer move", async () => {
    const el = await mount();
    const svg = el.shadowRoot!.querySelector("svg")!;
    const r = svg.getBoundingClientRect();
    svg.dispatchEvent(new PointerEvent("pointermove", { clientX: r.left + r.width / 2, clientY: r.top + 40, bubbles: true }));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".hover-chip"), "crosshair chip").to.exist;
    svg.dispatchEvent(new PointerEvent("pointerleave", { bubbles: true }));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".hover-chip"), "chip clears on leave").to.not.exist;
  });

  it("renders completion markers in the bottom lane", async () => {
    const el = await mount({ events: [{ ts: NOW - 4 * DAY, type: "completed" }] });
    const marks = el.shadowRoot!.querySelectorAll('rect[fill="var(--success-color, #4caf50)"]');
    expect(marks.length).to.equal(1);
  });

  it("renders the production-shaped projection with real horizontal extent", async () => {
    // sparkline.ts builds the projection as [last sample, last sample + 30d].
    // Before the domain fix (2026-08-24) the data-only time domain put that
    // start on the right plot edge and the x2 clamp collapsed the dashed
    // line to zero width — the degradation projection never rendered.
    const el = await mount();
    const last = POINTS[POINTS.length - 1];
    el.projection = [last, { ts: last.ts + 30 * DAY, val: last.val + 15 }];
    await el.updateComplete;
    const line = el.shadowRoot!.querySelector('line[stroke-dasharray="4,3"]');
    expect(line, "projection line rendered").to.exist;
    const x1 = Number(line!.getAttribute("x1"));
    const x2 = Number(line!.getAttribute("x2"));
    expect(x2 - x1, `projection width (${x1} -> ${x2})`).to.be.greaterThan(50);
    // still clamped inside the plot
    const svgW = Number(el.shadowRoot!.querySelector("svg")!.getAttribute("width"));
    expect(x2).to.be.at.most(svgW);
  });
});

describe("chart-utils", () => {
  it("niceTicks produces round inclusive bounds", () => {
    const { ticks, niceMin, niceMax } = niceTicks(53, 77, 4);
    expect(niceMin).to.be.at.most(53);
    expect(niceMax).to.be.at.least(77);
    for (const t of ticks) expect(t % 10 === 0 || t % 5 === 0, `tick ${t} round`).to.be.true;
  });

  it("fmtNum is compact and consistent", () => {
    expect(fmtNum(88000)).to.equal("88k");
    expect(fmtNum(1500)).to.equal("1.5k");
    expect(fmtNum(-8007.1)).to.equal("-8k");
    expect(fmtNum(730)).to.equal("730");
    expect(fmtNum(7.53)).to.equal("7.5");
    expect(fmtNum(0)).to.equal("0");
  });
});
