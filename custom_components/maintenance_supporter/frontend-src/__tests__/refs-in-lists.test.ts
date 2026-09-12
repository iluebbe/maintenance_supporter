/**
 * Reference numbers in lists (#170 round 2).
 *
 * Pins: Settings → General carries the "Reference numbers in lists"
 * checkbox writing `ref_numbers_in_lists` through global/update; with the
 * setting on the panel puts the #8 / #8.3 chips in front of task names in
 * the task table and of object names on the object cards; off (the
 * default) renders no chips there — the detail pages keep theirs.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/settings-view.js";
import type { MaintenanceSettingsView } from "../components/settings-view";
import { DEFAULT_FEATURES, DEFAULT_SETTINGS_RESPONSE, createMockHass } from "./_test-utils.js";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

describe("settings: reference numbers in lists (#170)", () => {
  async function mount(general: Record<string, unknown> = {}) {
    const updates: Record<string, unknown>[] = [];
    const settings = { ...DEFAULT_SETTINGS_RESPONSE, general: { ...DEFAULT_SETTINGS_RESPONSE.general, ...general } };
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/settings": () => settings,
        "maintenance_supporter/global/update": (msg) => { updates.push(msg.settings as Record<string, unknown>); return settings; },
      },
    });
    const el = await fixture<MaintenanceSettingsView>(html`
      <maintenance-settings-view .hass=${hass} .features=${DEFAULT_FEATURES}></maintenance-settings-view>
    `);
    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;
    return { el, updates };
  }

  const box = (el: MaintenanceSettingsView) => el.shadowRoot!.querySelector<HTMLInputElement>("input.refs-in-lists")!;

  it("defaults to off and writes the boolean", async () => {
    const { el, updates } = await mount();
    expect(box(el), "checkbox rendered").to.exist;
    expect(box(el).checked).to.equal(false);
    box(el).click();
    await new Promise((r) => setTimeout(r, 20));
    expect(updates.at(-1)).to.deep.equal({ ref_numbers_in_lists: true });
  });

  it("shows the stored value", async () => {
    const { el } = await mount({ ref_numbers_in_lists: true });
    expect(box(el).checked).to.equal(true);
  });
});

describe("panel lists carry the reference chips when the setting is on (#170)", () => {
  beforeEach(() => resetTaskSeq());

  async function mount(on: boolean) {
    const objects = [obj("e1", [task({ name: "Descale", ref_no: 3 })])];
    (objects[0].object as Record<string, unknown>).ref_no = 8;
    const settings = { ...DEFAULT_SETTINGS_RESPONSE, general: { ...DEFAULT_SETTINGS_RESPONSE.general, ref_numbers_in_lists: on } };
    const { el } = await mountPanel(objects, { "maintenance_supporter/settings": () => settings });
    await el.updateComplete;
    return el;
  }

  it("on: #8.3 before the task name in the table, #8 before the object name on its card", async () => {
    const el = await mount(true);
    const taskCell = sr(el).querySelector(".cell.task-name")!;
    expect(taskCell, "task row").to.exist;
    expect(taskCell.querySelector(".ref-chip")?.textContent).to.equal("#8.3");
    expect(taskCell.textContent).to.contain("Descale");
    const card = sr(el).querySelector(".object-card-name");
    if (card) expect(card.querySelector(".ref-chip")?.textContent).to.equal("#8");
  });

  it("off (default): no chips in the lists", async () => {
    const el = await mount(false);
    expect(sr(el).querySelector(".cell.task-name .ref-chip")).to.equal(null);
    expect(sr(el).querySelector(".object-card-name .ref-chip")).to.equal(null);
  });
});
