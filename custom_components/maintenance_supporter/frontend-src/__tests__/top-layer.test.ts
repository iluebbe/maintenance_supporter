/** The panel's own overlays sit in the browser's top layer (2026-10-31).
 *
 *  HA 2026.11 isolates the panel (`partial-panel-resolver { isolation:
 *  isolate }`), and its docked sidebar was drawn over the search, the
 *  template gallery and the hand-built dialogs between 871 and ~1230 px: a
 *  tap on their left side went to the sidebar. Each test rebuilds that page
 *  in small (the overlay inside an isolated box, a fixed sidebar with a
 *  z-index next to it) and taps over the sidebar's strip. */

import { expect, fixture, html } from "@open-wc/testing";
import { setViewport } from "@web/test-runner-commands";
import { LitElement } from "lit";
import { modalShellStyles, renderModalShell } from "../helpers/modal-shell";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

const SIDEBAR_WIDTH = 256;

/** HA's page around the panel: the panel's box isolated, the sidebar fixed
 *  at the left with a z-index. Returns the fake sidebar. */
function haChrome(panelBox: HTMLElement): HTMLElement {
  panelBox.style.isolation = "isolate";
  const bar = document.createElement("div");
  bar.className = "fake-ha-sidebar";
  bar.style.cssText = `position: fixed; left: 0; top: 0; bottom: 0; width: ${SIDEBAR_WIDTH}px; z-index: 5; background: #eee;`;
  document.body.appendChild(bar);
  return bar;
}

class ShellProbe extends LitElement {
  static styles = modalShellStyles;
  render() {
    return renderModalShell(() => {}, html`<p style="margin: 0; height: 120px">A hand-built dialog</p>`);
  }
}
customElements.define("top-layer-shell-probe", ShellProbe);

/** What a tap at (x, y) reaches, as a name: a failed element comparison
 *  makes chai format the whole panel, which hangs the test page. */
function hitName(x: number, y: number): string {
  const hit = document.elementFromPoint(x, y);
  return hit ? `${hit.localName}${hit.classList.length ? "." + hit.classList[0] : ""}` : "nothing";
}

describe("overlays in the top layer (HA 2026.11 sidebar)", () => {
  beforeEach(async () => {
    resetTaskSeq();
    localStorage.clear();
    localStorage.setItem("msp-overview-tab", "dashboard");
    await setViewport({ width: 880, height: 900 });
  });
  afterEach(async () => {
    document.querySelectorAll(".fake-ha-sidebar").forEach((n) => n.remove());
    localStorage.clear();
    await setViewport({ width: 1200, height: 800 });
  });

  it("a hand-built dialog takes a tap over the sidebar and keeps its centred size", async () => {
    const box = await fixture<HTMLElement>(html`<div><top-layer-shell-probe></top-layer-shell-probe></div>`);
    const probe = box.querySelector("top-layer-shell-probe") as ShellProbe;
    await probe.updateComplete;
    haChrome(box);
    const root = probe.shadowRoot!;
    expect(root.querySelector(".modal-layer")!.matches(":popover-open"), "shown as a popover").to.equal(true);
    const frame = root.querySelector(".dialog")!.getBoundingClientRect();
    expect(frame.left, "the frame reaches into the sidebar's strip at 880 px").to.be.below(SIDEBAR_WIDTH);
    expect(hitName(frame.left + 10, frame.top + frame.height / 2), "tap on the frame").to.equal("top-layer-shell-probe");
    expect(hitName(20, 20), "tap on the backdrop over the sidebar").to.equal("top-layer-shell-probe");
    // The popover box around it must not stretch or shift the frame.
    expect(Math.abs(frame.top + frame.height / 2 - 450), "still centred").to.be.below(2);
    expect(frame.height, "as tall as its content").to.be.below(300);
  });

  it("the search and the template gallery take a tap over the sidebar", async () => {
    const templates = {
      categories: { home: { icon: "mdi:home", name_en: "Home & HVAC" } },
      profile: {},
      templates: [
        { id: "home_heating", name: "Heating System", category: "home", tasks: [1, 2, 3], recommended: false, reasons: [], dwelling_mismatch: false },
        { id: "home_smoke", name: "Smoke Detectors", category: "home", tasks: [1], recommended: false, reasons: [], dwelling_mismatch: false },
        { id: "home_gutter", name: "Gutters", category: "home", tasks: [1], recommended: false, reasons: [], dwelling_mismatch: false },
      ],
    };
    const { el } = await mountPanel([obj("e1", [task()])], { "maintenance_supporter/templates": () => templates });
    haChrome(el.parentElement!);

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "/" }));
    await el.updateComplete;
    const backdrop = sr(el).querySelector(".palette-backdrop")!;
    expect(backdrop.matches(":popover-open"), "search shown as a popover").to.equal(true);
    const palette = sr(el).querySelector(".palette")!.getBoundingClientRect();
    // Centred from the first frame: the toast's keyframes (translateX(-50%))
    // once slid it in from half a screen left.
    expect(Math.round(palette.left + palette.width / 2), "centred while it fades in").to.equal(440);
    expect(palette.left).to.be.below(SIDEBAR_WIDTH);
    expect(hitName(palette.left + 10, palette.top + 20), "tap on the search box").to.equal("maintenance-supporter-panel");
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await el.updateComplete;
    expect(!!sr(el).querySelector(".palette-backdrop"), "Escape still closes it").to.equal(false);

    await (el as unknown as { _openTemplateGallery(): Promise<void> })._openTemplateGallery();
    await el.updateComplete;
    const card = sr(el).querySelector(".template-card")!.getBoundingClientRect();
    expect(card.left, "the first card lies in the sidebar's strip").to.be.below(SIDEBAR_WIDTH);
    expect(hitName(card.left + 10, card.top + card.height / 2), "tap on the first card").to.equal("maintenance-supporter-panel");
  });
});
