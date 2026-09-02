/**
 * A TIGHT panel (< 880 px of its own width, e.g. an iPad in portrait with
 * HA's sidebar docked: 1024 px viewport, ~768 px panel) is not `narrow`, yet
 * the wide row grid cannot hold labelled action buttons — the panel measures
 * itself, reflects `tight`, and renders the compact icon-only pair (#145).
 */

import { expect, waitUntil } from "@open-wc/testing";
import { DEFAULT_SETTINGS_RESPONSE } from "./_test-utils.js";
import { mountPanel, obj, resetTaskSeq, task } from "./_panel-utils.js";

type PanelEl = HTMLElement & { updateComplete: Promise<unknown>; tight: boolean; narrow: boolean };

async function mountAt(width: number) {
  const objects = [obj("e1", [task({ status: "overdue", days_until_due: -2 })])];
  const { el } = await mountPanel(objects, {
    "maintenance_supporter/settings": () => ({
      ...DEFAULT_SETTINGS_RESPONSE,
      general: { ...DEFAULT_SETTINGS_RESPONSE.general, row_action_style: "buttons_compact" },
    }),
  });
  el.style.width = `${width}px`;
  await new Promise((r) => setTimeout(r, 80));
  await (el as PanelEl).updateComplete;
  return el as PanelEl;
}

describe("panel tight width (#145)", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
    localStorage.setItem("msp-overview-tab", "dashboard");
  });

  it("reflects tight below 880 px and renders the compact pair", async () => {
    const el = await mountAt(760);
    await waitUntil(() => el.hasAttribute("tight"), "tight attribute reflected");
    expect(el.narrow).to.equal(false);
    const sr = el.shadowRoot!;
    await waitUntil(() => sr.querySelectorAll(".row-actions.as-buttons.compact").length > 0, "compact row actions");
    // #150 round (2026-09-02): the pair is two icon-only <ha-button>s — a
    // filled green Complete and an outlined orange Skip (colour is the only
    // cue once the label is gone).
    const pair = [...sr.querySelectorAll(".row-actions.compact ha-button")];
    expect(pair.length).to.equal(2);
    expect(pair.map((b) => b.getAttribute("variant"))).to.deep.equal(["success", "warning"]);
    expect(pair.map((b) => b.getAttribute("appearance"))).to.deep.equal(["accent", "outlined"]);
    expect(pair.every((b) => (b.getAttribute("aria-label") || "").length > 0), "icon-only buttons keep an aria-label").to.equal(true);
    expect(sr.querySelectorAll(".row-actions.compact ha-icon-button").length).to.equal(0);
  });

  it("stays labelled at 1000 px", async () => {
    const el = await mountAt(1000);
    await new Promise((r) => setTimeout(r, 80));
    expect(el.hasAttribute("tight")).to.equal(false);
    const sr = el.shadowRoot!;
    await waitUntil(() => sr.querySelectorAll(".row-actions.as-buttons ha-button").length > 0, "labelled buttons");
    expect(sr.querySelectorAll(".row-actions.as-buttons.compact").length).to.equal(0);
    // Skip keeps the same colour with or without its label (#150 follow-up):
    // outlined warning on the labelled pair too, never the neutral grey.
    const pair = [...sr.querySelectorAll(".row-actions.as-buttons ha-button")].slice(0, 2);
    expect(pair.map((b) => b.getAttribute("variant"))).to.deep.equal(["success", "warning"]);
    expect(pair.map((b) => b.getAttribute("appearance"))).to.deep.equal(["accent", "outlined"]);
  });
});
