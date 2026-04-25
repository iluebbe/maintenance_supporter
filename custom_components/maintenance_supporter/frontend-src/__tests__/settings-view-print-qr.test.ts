/**
 * Lit component tests for the Print QR section of <maintenance-settings-view>.
 *
 * Covers v1.1.0 batch-QR-print UI: load-objects flow, action chip toggles,
 * generate button enable/disable, results rendering.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/settings-view.js";
import type { MaintenanceSettingsView } from "../components/settings-view";

interface SentMessage { type: string; [key: string]: unknown }

function buildSettings() {
  return {
    features: {
      adaptive: false, predictions: false, seasonal: false,
      environmental: false, budget: false, groups: false,
      checklists: false, schedule_time: false,
    },
    admin_panel_user_ids: [],
    general: {
      default_warning_days: 7, notifications_enabled: false,
      notify_service: "", panel_enabled: false,
    },
    notifications: {
      due_soon_enabled: true, due_soon_interval_hours: 24,
      overdue_enabled: true, overdue_interval_hours: 12,
      triggered_enabled: true, triggered_interval_hours: 0,
      quiet_hours_enabled: true, quiet_hours_start: "22:00", quiet_hours_end: "08:00",
      max_per_day: 0, bundling_enabled: false, bundle_threshold: 2,
    },
    actions: {
      complete_enabled: false, skip_enabled: false,
      snooze_enabled: false, snooze_duration_hours: 4,
    },
    budget: {
      monthly: 0, yearly: 0, alerts_enabled: false,
      alert_threshold_pct: 80, currency: "EUR", currency_symbol: "€",
    },
    vacation: {
      enabled: false, start: null, end: null, buffer_days: 3,
      exempt_task_ids: [], is_active: false, window_end: null,
    },
  };
}

function mockHass(opts: {
  objects?: Array<{ entry_id: string; name: string; task_count: number }>;
  batchResult?: Array<{ task_id: string; entry_id: string; object_name: string; task_name: string; action: string; svg: string }>;
} = {}) {
  const sent: SentMessage[] = [];
  const objects = opts.objects ?? [
    { entry_id: "e1", name: "Pool Pump", task_count: 3 },
    { entry_id: "e2", name: "HVAC", task_count: 2 },
  ];
  const sendMessagePromise = async (msg: SentMessage): Promise<unknown> => {
    sent.push(msg);
    if (msg.type === "maintenance_supporter/settings") return buildSettings();
    if (msg.type === "maintenance_supporter/users/list") return { users: [] };
    if (msg.type === "maintenance_supporter/objects") {
      return {
        objects: objects.map(o => ({
          entry_id: o.entry_id,
          object: { name: o.name },
          tasks: Array.from({ length: o.task_count }, (_, i) => ({
            id: `${o.entry_id}_t${i}`, name: `Task ${i}`,
          })),
        })),
      };
    }
    if (msg.type === "maintenance_supporter/qr/batch_generate") {
      return {
        qrs: opts.batchResult ?? [
          {
            entry_id: "e1", task_id: "e1_t0",
            object_name: "Pool Pump", task_name: "Task 0",
            action: "view", svg: "<svg><rect/></svg>",
          },
        ],
        total: 1,
      };
    }
    return {};
  };
  return { hass: { language: "en", connection: { sendMessagePromise } }, sent };
}

async function mount(opts = {}) {
  const { hass, sent } = mockHass(opts);
  const features = {
    adaptive: false, predictions: false, seasonal: false,
    environmental: false, budget: false, groups: false,
    checklists: false, schedule_time: false,
  };
  const el = await fixture<MaintenanceSettingsView>(html`
    <maintenance-settings-view .hass=${hass} .features=${features}></maintenance-settings-view>
  `);
  await new Promise(r => setTimeout(r, 50));
  await el.updateComplete;
  return { el, sent };
}

function qrSection(el: MaintenanceSettingsView): HTMLElement | null {
  return el.shadowRoot?.querySelector(".qr-print-section") || null;
}

describe("settings-view print QR section", () => {
  it("renders the section with a Load objects button by default", async () => {
    const { el } = await mount();
    const section = qrSection(el);
    expect(section, "section exists").to.exist;
    const buttons = section!.querySelectorAll("button");
    const loadBtn = [...buttons].find(b => /load/i.test(b.textContent || ""));
    expect(loadBtn, "Load objects button present").to.exist;
  });

  it("loads objects on click and renders the filter panel", async () => {
    const { el, sent } = await mount();
    const loadBtn = [...qrSection(el)!.querySelectorAll("button")]
      .find(b => /load/i.test(b.textContent || ""))!;
    loadBtn.click();
    await new Promise(r => setTimeout(r, 30));
    await el.updateComplete;

    const objCalled = sent.some(m => m.type === "maintenance_supporter/objects");
    expect(objCalled, "objects WS called").to.be.true;

    const filterPanel = qrSection(el)!.querySelector(".qr-filter-panel");
    expect(filterPanel, "filter panel rendered after load").to.exist;
    const objectRows = qrSection(el)!.querySelectorAll(".qr-object-row");
    expect(objectRows.length, "object rows match mock count").to.equal(2);
  });

  it("toggles an action chip and updates active class", async () => {
    const { el } = await mount();
    // Trigger load to render the chips
    const loadBtn = [...qrSection(el)!.querySelectorAll("button")]
      .find(b => /load/i.test(b.textContent || ""))!;
    loadBtn.click();
    await new Promise(r => setTimeout(r, 30));
    await el.updateComplete;

    const chips = qrSection(el)!.querySelectorAll<HTMLElement>(".qr-action-chip");
    expect(chips.length, "three action chips rendered").to.equal(3);
    // Default: only "view" active
    const viewChip = [...chips].find(c => /view|anzeigen/i.test(c.textContent || ""))!;
    expect(viewChip.classList.contains("active"), "view chip active by default").to.be.true;

    // Toggle "complete" on
    const completeChip = [...chips].find(c => /complete|erledigen/i.test(c.textContent || ""))!;
    const completeInput = completeChip.querySelector<HTMLInputElement>("input")!;
    completeInput.checked = true;
    completeInput.dispatchEvent(new Event("change"));
    await el.updateComplete;
    expect(completeChip.classList.contains("active"), "complete chip flipped active").to.be.true;
  });

  it("disables Generate button when no actions selected", async () => {
    const { el } = await mount();
    const loadBtn = [...qrSection(el)!.querySelectorAll("button")]
      .find(b => /load/i.test(b.textContent || ""))!;
    loadBtn.click();
    await new Promise(r => setTimeout(r, 30));
    await el.updateComplete;

    // Toggle the default "view" off
    const viewChipInput = [...qrSection(el)!.querySelectorAll<HTMLInputElement>(".qr-action-chip input")]
      .find(i => i.checked)!;
    viewChipInput.checked = false;
    viewChipInput.dispatchEvent(new Event("change"));
    await el.updateComplete;

    const genBtn = [...qrSection(el)!.querySelectorAll<HTMLButtonElement>("button")]
      .find(b => /generate|generieren/i.test(b.textContent || ""))!;
    expect(genBtn.disabled, "Generate disabled when 0 actions").to.be.true;
  });

  it("renders a batch result row after Generate", async () => {
    const { el, sent } = await mount();
    const loadBtn = [...qrSection(el)!.querySelectorAll("button")]
      .find(b => /load/i.test(b.textContent || ""))!;
    loadBtn.click();
    await new Promise(r => setTimeout(r, 30));
    await el.updateComplete;

    const genBtn = [...qrSection(el)!.querySelectorAll<HTMLButtonElement>("button")]
      .find(b => /generate|generieren/i.test(b.textContent || ""))!;
    genBtn.click();
    await new Promise(r => setTimeout(r, 50));
    await el.updateComplete;

    const batchCalled = sent.some(m => m.type === "maintenance_supporter/qr/batch_generate");
    expect(batchCalled, "batch_generate WS called").to.be.true;

    const cells = qrSection(el)!.querySelectorAll(".qr-print-cell");
    expect(cells.length, "one result cell rendered").to.equal(1);
    const labelObj = cells[0].querySelector(".qr-label-obj");
    expect(labelObj?.textContent).to.equal("Pool Pump");
  });

  it("warns over-limit when filter would produce > 200 QRs", async () => {
    // 100 objects with 3 actions = 300 QRs → over the 200 cap.
    const manyObjects = Array.from({ length: 101 }, (_, i) => ({
      entry_id: `e${i}`, name: `Obj ${i}`, task_count: 1,
    }));
    const { el } = await mount({ objects: manyObjects });
    const loadBtn = [...qrSection(el)!.querySelectorAll("button")]
      .find(b => /load/i.test(b.textContent || ""))!;
    loadBtn.click();
    await new Promise(r => setTimeout(r, 30));
    await el.updateComplete;

    // Toggle on all 3 actions
    const chips = qrSection(el)!.querySelectorAll<HTMLInputElement>(".qr-action-chip input");
    for (const chip of chips) {
      if (!chip.checked) {
        chip.checked = true;
        chip.dispatchEvent(new Event("change"));
      }
    }
    await el.updateComplete;

    const estimate = qrSection(el)!.querySelector(".qr-estimate");
    expect(estimate?.classList.contains("error"), "estimate shows error class").to.be.true;
    const genBtn = [...qrSection(el)!.querySelectorAll<HTMLButtonElement>("button")]
      .find(b => /generate|generieren/i.test(b.textContent || ""))!;
    expect(genBtn.disabled, "Generate disabled at over-limit").to.be.true;
  });
});
