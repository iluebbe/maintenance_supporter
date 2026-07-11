/**
 * Contrast tripwire for status badges (dark-mode & a11y QA, v2.24).
 *
 * The roadmap claimed status colours were "routed through theme tokens with a
 * tripwire blocking bare colours" — but no such test existed, and the badges
 * used white text on light backgrounds (green/orange/grey) at 2.2–2.8:1, below
 * the 3:1 WCAG floor for UI components. This renders each badge with the REAL
 * sharedStyles (fallback hex applies with no HA theme loaded) and asserts the
 * computed text-on-background contrast clears 3:1 — so reverting a light badge
 * to white text fails the build.
 */

import { expect, fixture, html } from "@open-wc/testing";
import { LitElement, css } from "lit";
import { customElement } from "lit/decorators.js";
import { sharedStyles } from "../styles";

const STATUSES = ["ok", "due_soon", "overdue", "triggered", "done", "archived", "paused"];

@customElement("badge-contrast-probe")
class BadgeContrastProbe extends LitElement {
  static styles = [sharedStyles, css`:host { display: block; }`];
  render() {
    return html`${STATUSES.map(
      (s) => html`<span class="status-badge ${s}" data-s=${s}>${s}</span>`,
    )}`;
  }
}

function parseRgb(v: string): [number, number, number] {
  const m = v.match(/rgba?\(([^)]+)\)/);
  if (!m) throw new Error("not rgb: " + v);
  const [r, g, b] = m[1].split(",").map((x) => parseFloat(x));
  return [r, g, b];
}
function relLum([r, g, b]: [number, number, number]): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
function contrast(fg: string, bg: string): number {
  const a = relLum(parseRgb(fg));
  const b = relLum(parseRgb(bg));
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

describe("status badge contrast (WCAG UI 3:1)", () => {
  it("every status badge clears 3:1 text-on-background", async () => {
    const el = await fixture<BadgeContrastProbe>(html`<badge-contrast-probe></badge-contrast-probe>`);
    await el.updateComplete;
    for (const s of STATUSES) {
      const badge = el.shadowRoot!.querySelector<HTMLElement>(`.status-badge[data-s="${s}"]`)!;
      const cs = getComputedStyle(badge);
      const ratio = contrast(cs.color, cs.backgroundColor);
      expect(ratio, `${s}: ${cs.color} on ${cs.backgroundColor} = ${ratio.toFixed(2)}:1`).to.be.greaterThan(3.0);
    }
  });
});
