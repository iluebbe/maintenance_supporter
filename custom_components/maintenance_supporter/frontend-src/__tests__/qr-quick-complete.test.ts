/**
 * #192: the lightning-bolt quick-complete QR was implemented since 1.3.0
 * (backend + scan deep link) but no dialog ever offered it. The task QR dialog
 * now shows it as a third code when the task has quick-complete defaults.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/qr-dialog.js";
import type { MaintenanceQrDialog } from "../components/qr-dialog";
import { type SentMessage, createMockHass } from "./_test-utils.js";

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
  async function chips(completionActions: boolean): Promise<string[]> {
    const { DEFAULT_FEATURES } = await import("./_test-utils.js");
    await import("../components/settings-view.js");
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/objects": () => ({ objects: [{ entry_id: "e1", object: { name: "Pump" }, tasks: [{ id: "t1", name: "Filter" }] }] }),
      },
    });
    const features = { ...DEFAULT_FEATURES, completion_actions: completionActions };
    const el = await fixture<HTMLElement>(html`<maintenance-settings-view .hass=${hass} .features=${features}></maintenance-settings-view>`);
    await new Promise((r) => setTimeout(r, 50));
    const section = el.shadowRoot!.querySelector(".qr-print-section")!;
    [...section.querySelectorAll("button")].find((b) => /load/i.test(b.textContent || ""))!.click();
    await new Promise((r) => setTimeout(r, 30));
    await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    return [...section.querySelectorAll(".qr-action-chip")].map((c) => (c.textContent || "").trim());
  }

  it("offers quick-complete only with completion actions on", async () => {
    expect(await chips(false)).to.have.length(3);
    const on = await chips(true);
    expect(on).to.have.length(4);
    expect(on[3]).to.match(/quick-complete/i);
  });
});
