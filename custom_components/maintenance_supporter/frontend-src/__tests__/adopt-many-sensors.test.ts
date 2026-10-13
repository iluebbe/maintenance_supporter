/**
 * The adopt dialogs with a long list, on a phone (#211).
 *
 * 54 problem sensors of 18 Matter devices: the summary grew a line per
 * object, and the list of sensors, the only part of the dialog allowed to
 * shrink, was squeezed to nothing, so no row could be ticked. Pins, at 390 px:
 *   - the dialog fits the screen, its title and its buttons stay visible,
 *     and the part between them scrolls as one (list, summary, fields)
 *   - the first rows are visible when the dialog opens
 *   - "Selected n / m" stays at the top while the list scrolls
 *   - the summary shows its totals and folds its lines beyond three
 *     objects; opening it is the user's choice from then on
 *   - the suggested-setups dialog (offers + devices) scrolls the same way
 *   - Escape closes both, like every other dialog
 */

import { expect, fixture, html, oneEvent } from "@open-wc/testing";
import { setViewport } from "@web/test-runner-commands";
import "../components/adopt-problem-sensors-dialog.js";
import "../components/suggested-setups-dialog.js";
import type { MaintenanceAdoptProblemSensorsDialog } from "../components/adopt-problem-sensors-dialog";
import type { MaintenanceSuggestedSetupsDialog } from "../components/suggested-setups-dialog";
import { t } from "../styles.js";
import { createMockHass } from "./_test-utils.js";

const DEVICES = 18;
const LINKED = 4; // devices an object is already linked to
const PROBLEMS = ["Battery low", "Device problem", "Filter needs cleaning, replace the cartridge soon"];

const deviceName = (d: number) => `Matter Thermostat Living Room North Wall ${d + 1}`;

function sensors() {
  const out = [];
  for (let d = 0; d < DEVICES; d++) {
    // 56 in all: two devices report a fourth problem.
    const kinds = d < 2 ? [...PROBLEMS, "Window open detected"] : PROBLEMS;
    for (const [k, kind] of kinds.entries()) {
      out.push({
        entity_id: `binary_sensor.matter_device_${d}_${k}`,
        name: `${kind} (${deviceName(d)})`,
        state: k === 0 ? "on" : "off",
        device_id: `dev_${d}`,
        device_name: deviceName(d),
        area_name: "Living room",
        suggested_entry_id: d < LINKED ? `obj_${d}` : null,
        suggested_object_name: deviceName(d),
        suggested_part_id: null,
        suggested_part_name: null,
        candidate: null,
        target_entry_id: d < LINKED ? `obj_${d}` : null,
        covered_by: null,
      });
    }
  }
  return out;
}

const rect = (el: Element) => el.getBoundingClientRect();

async function openAdopt(list = sensors()) {
  const { hass } = createMockHass({
    handlers: {
      "maintenance_supporter/problem_sensors/discover": () => ({ sensors: list }),
      "maintenance_supporter/objects": () => ({
        objects: Array.from({ length: LINKED }, (_, d) => ({ entry_id: `obj_${d}`, object: { name: deviceName(d) }, tasks: [{}] })),
      }),
      "maintenance_supporter/problem_sensors/preview": () => ({ covered: {} }),
    },
  });
  const el = await fixture<MaintenanceAdoptProblemSensorsDialog>(html`
    <maintenance-adopt-problem-sensors-dialog .hass=${hass}></maintenance-adopt-problem-sensors-dialog>
  `);
  await el.open();
  await el.updateComplete;
  return el;
}

/** The frame fits the screen, only its middle scrolls, the buttons show. */
function expectFrameFits(sr: ShadowRoot, label: string) {
  const dialog = sr.querySelector<HTMLElement>(".dialog")!;
  const scroll = sr.querySelector<HTMLElement>(".dialog-scroll")!;
  const actions = sr.querySelector<HTMLElement>(".actions")!;
  const d = rect(dialog);
  expect(d.top, `${label}: dialog top on screen`).to.be.at.least(0);
  expect(d.bottom, `${label}: dialog bottom on screen`).to.be.at.most(window.innerHeight);
  expect(dialog.scrollHeight, `${label}: the frame itself does not scroll`).to.be.at.most(dialog.clientHeight + 1);
  expect(scroll.scrollHeight, `${label}: the middle scrolls`).to.be.above(scroll.clientHeight);
  expect(scroll.clientHeight, `${label}: the middle keeps a usable height`).to.be.above(300);
  const a = rect(actions);
  expect(a.top, `${label}: buttons below the middle`).to.be.at.least(rect(scroll).bottom - 1);
  expect(a.bottom, `${label}: buttons inside the dialog`).to.be.at.most(d.bottom);
  return { scroll };
}

describe("#211: the adopt dialog with 56 problem sensors at 390 px", () => {
  beforeEach(async () => { await setViewport({ width: 390, height: 844 }); });
  afterEach(async () => { await setViewport({ width: 800, height: 600 }); });

  it("fits the screen, shows the first rows and keeps its buttons", async () => {
    const el = await openAdopt();
    const sr = el.shadowRoot!;
    const { scroll } = expectFrameFits(sr, "adopt");
    const rows = sr.querySelectorAll<HTMLElement>(".list .row");
    expect(rows.length).to.equal(56);
    const s = rect(scroll);
    expect(rect(rows[0]).top, "first row visible").to.be.below(s.bottom);
    expect(rect(rows[0]).bottom, "first row whole").to.be.at.most(s.bottom);
  });

  it("keeps 'Selected n / m' at the top while the list scrolls", async () => {
    const el = await openAdopt();
    const sr = el.shadowRoot!;
    const scroll = sr.querySelector<HTMLElement>(".dialog-scroll")!;
    scroll.scrollTop = Math.floor(scroll.scrollHeight / 2);
    await new Promise((r) => requestAnimationFrame(r));
    const bar = sr.querySelector<HTMLElement>(".select-all")!;
    expect(Math.abs(rect(bar).top - rect(scroll).top), "stuck to the top").to.be.below(2);
    expect(bar.textContent).to.contain("56 / 56");
  });

  it("folds the summary to its totals beyond three objects, then leaves it to the user", async () => {
    const el = await openAdopt();
    const sr = el.shadowRoot!;
    const details = sr.querySelector<HTMLDetailsElement>("details.summary")!;
    expect(details.open, "18 objects: folded").to.equal(false);
    expect(sr.querySelector(".summary-totals")!.textContent!.trim()).to.equal(
      t("adopt_summary_totals_new", "en").replace("{tasks}", "56").replace("{objects}", "18").replace("{new}", String(DEVICES - LINKED)),
    );
    expect(sr.querySelectorAll(".summary-line").length, "the lines are still there to open").to.equal(DEVICES);

    const toggled = oneEvent(details, "toggle");
    details.querySelector("summary")!.click();
    await toggled;
    await el.updateComplete;
    expect(details.open).to.equal(true);
    // Unticking a row re-renders the summary; the user's choice stays.
    sr.querySelector<HTMLInputElement>(".list .row input[type=checkbox]")!.click();
    await el.updateComplete;
    expect(details.open, "still open after a change").to.equal(true);
    expect(sr.querySelector(".summary-totals")!.textContent).to.contain("55");
    // Nothing ticked: no summary. Ticked again: it comes back as the user left it.
    const all = sr.querySelector<HTMLInputElement>(".select-all input")!;
    all.click(); // 55 → 56
    await el.updateComplete;
    all.click(); // 56 → 0
    await el.updateComplete;
    expect(sr.querySelector("details.summary"), "no summary with nothing ticked").to.equal(null);
    all.click(); // 0 → 56
    await el.updateComplete;
    expect(sr.querySelector<HTMLDetailsElement>("details.summary")!.open, "back as the user left it").to.equal(true);
  });

  it("opens the summary for up to three objects, without the 'new' part when nothing is new", async () => {
    const el = await openAdopt(sensors().filter((s) => s.device_id === "dev_0"));
    const sr = el.shadowRoot!;
    expect(sr.querySelector<HTMLDetailsElement>("details.summary")!.open).to.equal(true);
    expect(sr.querySelector(".summary-totals")!.textContent!.trim()).to.equal(
      t("adopt_summary_totals", "en").replace("{tasks}", "4").replace("{objects}", "1"),
    );
  });

  it("closes on Escape", async () => {
    const el = await openAdopt();
    const dialog = el.shadowRoot!.querySelector<HTMLElement>(".dialog")!;
    expect(el.shadowRoot!.activeElement, "focused on open").to.equal(dialog);
    dialog.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, composed: true, cancelable: true }));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".dialog")).to.equal(null);
  });
});

describe("#211: the suggested-setups dialog with many devices at 390 px", () => {
  beforeEach(async () => { await setViewport({ width: 390, height: 844 }); });
  afterEach(async () => { await setViewport({ width: 800, height: 600 }); });

  it("scrolls the offers and the devices as one, buttons on screen", async () => {
    const setups = Array.from({ length: 20 }, (_, d) => ({
      device_id: `dev_${d}`, device_name: `Robot Vacuum Upstairs Hallway ${d + 1}`, area_name: "Hallway",
      integration: "roborock", integration_name: "Roborock",
      suggested_entry_id: null, suggested_object_name: `Robot Vacuum ${d + 1}`, candidate: null,
      target_entry_id: null, target_task_count: 0,
      tasks: ["Main brush", "Side brush", "Filter"].map((name) => ({
        task_name: name, task_name_localized: name, entity_ids: [`sensor.vac_${d}_${name.replace(" ", "_")}`],
        threshold: 10, direction: "below", covered_by: null,
      })),
    }));
    const offers = Array.from({ length: 8 }, (_, i) => ({
      entry_id: `e${i}`, object_name: `Robot Vacuum Upstairs Hallway ${i + 1}`, task_id: `t${i}`, task_name: "Main brush",
      integration_name: "Roborock", button_entity_id: `button.vac_${i}_reset`, button_name: "Reset main brush consumable",
      button_disabled: false,
    }));
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/integration_setups/discover": () => ({ setups }),
        "maintenance_supporter/integration_setups/reset_offers": () => ({ offers }),
      },
    });
    const el = await fixture<MaintenanceSuggestedSetupsDialog>(html`
      <maintenance-suggested-setups-dialog .hass=${hass}></maintenance-suggested-setups-dialog>
    `);
    await el.open();
    await el.updateComplete;
    const sr = el.shadowRoot!;
    expect(sr.querySelectorAll(".offer").length).to.equal(8);
    expect(sr.querySelectorAll(".list .row").length).to.equal(20);
    expectFrameFits(sr, "setups");
    const box = sr.querySelector<HTMLElement>(".offers")!;
    expect(box.scrollHeight, "the offers are not a scroll box of their own").to.be.at.most(box.clientHeight + 1);

    const dialog = sr.querySelector<HTMLElement>(".dialog")!;
    dialog.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, composed: true, cancelable: true }));
    await el.updateComplete;
    expect(sr.querySelector(".dialog"), "Escape closed it").to.equal(null);
  });
});
