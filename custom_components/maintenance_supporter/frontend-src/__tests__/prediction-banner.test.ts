/**
 * The sensor prediction: "~1 day", not "~1 days", in the banner and the
 * value, in each language's plural form; and both readable (4.5:1) on a light
 * card. The banner was warning orange on light orange (1.75:1) and the bold
 * urgent value orange on white (1.96:1), measured live 2026-11-01.
 */

import { expect, fixture, html } from "@open-wc/testing";
import { LitElement, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { sharedStyles, pluralKey } from "../styles";
import { renderPredictionSection } from "../renderers/prediction";
import type { MaintenanceTask } from "../types";

@customElement("prediction-probe")
class PredictionProbe extends LitElement {
  @property({ attribute: false }) task!: MaintenanceTask;
  static styles = [
    sharedStyles,
    css`:host { display: block; --primary-text-color: #212121; --warning-color: #ff9800; --error-color: #f44336; background: #fff; }`,
  ];
  render() {
    return renderPredictionSection(this.task, "en", { environmental: false } as never);
  }
}

function toRgb(v: string): [number, number, number] {
  const rgb = v.match(/rgba?\(([^)]+)\)/);
  if (rgb) return rgb[1].split(",").map((x) => parseFloat(x)).slice(0, 3) as [number, number, number];
  const srgb = v.match(/color\(srgb ([^)]+)\)/);
  if (srgb) return srgb[1].trim().split(/\s+/).slice(0, 3).map((x) => parseFloat(x) * 255) as [number, number, number];
  throw new Error("not a colour: " + v);
}
const lum = ([r, g, b]: [number, number, number]) => {
  const lin = (c: number) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
const contrast = (a: [number, number, number], b: [number, number, number]) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

function task(days: number): MaintenanceTask {
  return { days_until_threshold: days, sensor_prediction_urgency: true, degradation_trend: "rising" } as unknown as MaintenanceTask;
}

describe("sensor prediction banner", () => {
  it("one day reads as one day, in the banner and the value", async () => {
    const el = await fixture<PredictionProbe>(html`<prediction-probe .task=${task(1.2)}></prediction-probe>`);
    const banner = el.shadowRoot!.querySelector(".prediction-urgency-banner")!.textContent!.replace(/\s+/g, " ").trim();
    expect(banner).to.equal("Sensor predicts threshold in ~1 day");
    expect(el.shadowRoot!.querySelector(".prediction-days")!.textContent!.trim()).to.equal("~1 day");
    const three = await fixture<PredictionProbe>(html`<prediction-probe .task=${task(3)}></prediction-probe>`);
    expect(three.shadowRoot!.querySelector(".prediction-days")!.textContent!.trim()).to.equal("~3 days");
  });

  it("pluralKey picks the language's form", () => {
    const keys = { one: "sensor_prediction_urgency_one", few: "sensor_prediction_urgency_few", other: "sensor_prediction_urgency" };
    expect(pluralKey(1, "en", keys)).to.equal(keys.one);
    expect(pluralKey(3, "en", keys)).to.equal(keys.other);
    expect(pluralKey(3, "ru", keys)).to.equal(keys.few);
    expect(pluralKey(21, "ru", keys)).to.equal(keys.one);
    expect(pluralKey(5, "ru", keys)).to.equal(keys.other);
    expect(pluralKey(2, "cs", keys)).to.equal(keys.few);
  });

  it("banner text and the urgent value are readable on a light card", async () => {
    const el = await fixture<PredictionProbe>(html`<prediction-probe .task=${task(2)}></prediction-probe>`);
    const banner = el.shadowRoot!.querySelector<HTMLElement>(".prediction-urgency-banner")!;
    // The banner's 15 % orange laid over the white card.
    const tint = toRgb(getComputedStyle(banner).backgroundColor);
    const alpha = parseFloat(getComputedStyle(banner).backgroundColor.split(",")[3] ?? "1");
    const behind = tint.map((c) => c * alpha + 255 * (1 - alpha)) as [number, number, number];
    expect(contrast(toRgb(getComputedStyle(banner).color), behind), "banner text").to.be.greaterThan(4.5);
    const value = el.shadowRoot!.querySelector<HTMLElement>(".prediction-days.urgent")!;
    expect(contrast(toRgb(getComputedStyle(value).color), [255, 255, 255]), "urgent value").to.be.greaterThan(4.5);
  });
});
