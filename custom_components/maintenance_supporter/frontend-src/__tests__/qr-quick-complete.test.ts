/**
 * #192: the lightning-bolt quick-complete QR was implemented since 1.3.0
 * (backend + scan deep link) but no dialog ever offered it. The task QR dialog
 * now shows it as a third code when the task has quick-complete defaults.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/qr-dialog.js";
import type { MaintenanceQrDialog } from "../components/qr-dialog";
import { type SentMessage, createMockHass } from "./_test-utils.js";
import { setLocale } from "../styles";
import de from "../locales/de.json";

function mount(defaults: Record<string, unknown> | null) {
  const { hass, sent } = createMockHass({
    handlers: {
      "maintenance_supporter/object": () => ({
        tasks: [{ id: "t1", name: "Filter", quick_complete_defaults: defaults }],
      }),
      "maintenance_supporter/qr/generate": (msg) => {
        const action = (msg as unknown as { action: string }).action;
        return {
          svg_data_uri: `data:image/svg+xml,<svg data-action="${action}"/>`,
          url: `https://ha.test/maintenance-supporter?entry_id=e1&task_id=t1&action=${action}`,
          label: { object_name: "Pump", manufacturer: "", model: "", task_name: "Filter" },
        };
      },
    },
  });
  return { hass, sent: sent as SentMessage[] };
}

async function openFor(defaults: Record<string, unknown> | null) {
  const { hass, sent } = mount(defaults);
  const el = await fixture<MaintenanceQrDialog>(html`<maintenance-qr-dialog .hass=${hass}></maintenance-qr-dialog>`);
  el.openForTask("e1", "t1", "Pump", "Filter");
  await new Promise((r) => setTimeout(r, 20));
  await el.updateComplete;
  return { el, sent };
}

const actions = (sent: SentMessage[]) =>
  sent.filter((m) => m.type === "maintenance_supporter/qr/generate").map((m) => (m as unknown as { action: string }).action);

describe("QR dialog: quick-complete code (#192)", () => {
  it("offers the lightning-bolt code when the task has quick-complete defaults", async () => {
    const { el, sent } = await openFor({ notes: "Filter swapped", cost: 12 });
    expect(actions(sent)).to.deep.equal(["view", "complete", "quick_complete"]);
    const items = el.shadowRoot!.querySelectorAll(".qr-item");
    expect(items).to.have.length(3);
    expect(el.shadowRoot!.querySelector(".qr-item.quick .qr-item-label")!.textContent).to.match(/quick-complete/i);
  });

  it("does not offer it without defaults (it would only open the dialog)", async () => {
    for (const defaults of [null, {}]) {
      const { el, sent } = await openFor(defaults);
      expect(actions(sent)).to.deep.equal(["view", "complete"]);
      expect(el.shadowRoot!.querySelector(".qr-item.quick")).to.equal(null);
    }
  });
});

describe("Settings → QR print: quick-complete choice (#192)", () => {
  async function mountSettings(tasksPerObject: Array<Array<Record<string, unknown> | null>>) {
    const { DEFAULT_FEATURES } = await import("./_test-utils.js");
    await import("../components/settings-view.js");
    const { hass, sent } = createMockHass({
      handlers: {
        "maintenance_supporter/objects": () => ({
          objects: tasksPerObject.map((defaults, i) => ({
            entry_id: `e${i}`,
            object: { name: `Object ${i}` },
            tasks: defaults.map((d, j) => ({ id: `e${i}_t${j}`, name: `Task ${j}`, quick_complete_defaults: d })),
          })),
        }),
        "maintenance_supporter/qr/batch_generate": () => ({ qrs: [], total: 0 }),
      },
    });
    // completion actions OFF: the choice follows the data, not the switch
    const el = await fixture<HTMLElement>(html`<maintenance-settings-view .hass=${hass} .features=${{ ...DEFAULT_FEATURES }}></maintenance-settings-view>`);
    await new Promise((r) => setTimeout(r, 50));
    const section = () => el.shadowRoot!.querySelector(".qr-print-section")!;
    [...section().querySelectorAll("button")].find((b) => /load/i.test(b.textContent || ""))!.click();
    await new Promise((r) => setTimeout(r, 30));
    await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    return { el, sent: sent as SentMessage[], section };
  }

  it("is offered with the number of tasks that have defaults — also with completion actions off", async () => {
    const { section } = await mountSettings([[{ notes: "x" }, null], [{ cost: 3 }]]);
    const quick = [...section().querySelectorAll<HTMLElement>(".qr-action-chip")][3];
    expect(quick.classList.contains("disabled")).to.be.false;
    expect(quick.textContent).to.match(/quick-complete.*\(2\)/i);
    expect(section().querySelector(".qr-quick-hint")).to.equal(null);
  });

  it("is shown disabled with a hint when no task has defaults", async () => {
    const { section } = await mountSettings([[null, {}]]);
    const quick = [...section().querySelectorAll<HTMLElement>(".qr-action-chip")][3];
    expect(quick.classList.contains("disabled")).to.be.true;
    expect(quick.querySelector("input")!.disabled).to.be.true;
    expect(section().querySelector(".qr-quick-hint")!.textContent).to.match(/quick-complete defaults/i);
  });

  it("estimates one code per task and action, quick-complete only for tasks with defaults", async () => {
    const { el, section } = await mountSettings([[{ notes: "x" }, null, null], [null, null]]);
    const inputs = [...section().querySelectorAll<HTMLInputElement>(".qr-action-chip input")];
    inputs[3].checked = true;
    inputs[3].dispatchEvent(new Event("change"));
    await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    // view (5 tasks) + quick-complete (1 task) — not objects × actions (2 × 2)
    expect(section().querySelector(".qr-estimate strong")!.textContent).to.equal("6");
  });
});

describe("QR dialog: language on dashboards", () => {
  it("speaks the user's language when nothing sets `lang` (the dashboard path)", async () => {
    setLocale("de", de as Record<string, string>);
    const { hass } = createMockHass({
      language: "de",
      handlers: {
        "maintenance_supporter/object": () => ({ tasks: [{ id: "t1", name: "Filter", quick_complete_defaults: null }] }),
        "maintenance_supporter/qr/generate": () => ({ svg_data_uri: "data:image/svg+xml,<svg/>", url: "https://ha.test/x", label: {} }),
      },
    });
    const el = await fixture<MaintenanceQrDialog>(html`<maintenance-qr-dialog .hass=${hass}></maintenance-qr-dialog>`);
    el.openForTask("e1", "t1", "Pump", "Filter");
    await new Promise((r) => setTimeout(r, 20));
    await el.updateComplete;
    const label = el.shadowRoot!.querySelector(".qr-item-label")!.textContent!.trim();
    expect(label).to.equal((de as Record<string, string>).qr_action_view);
    expect(label).to.not.equal("View maintenance info");
  });
});
