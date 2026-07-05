/**
 * Tests for <maintenance-vacation-section-card> (audit gap #10).
 *
 * An interactive, admin-gated Lovelace card that edits vacation mode from any
 * dashboard. Pins:
 *  - non-admin users get a read-only card (no switch, no date inputs, no save)
 *  - the enable toggle dispatches vacation/update {enabled}
 *  - editing dates + Save dispatches vacation/update with start/end/buffer
 *  - the status pill mirrors the server state (active / scheduled / inactive)
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/vacation-section-card.js";
import type { MaintenanceVacationSectionCard } from "../components/vacation-section-card";
import { createMockHass } from "./_test-utils.js";

const BASE_STATE = {
  enabled: false,
  is_active: false,
  start: "2026-08-01",
  end: "2026-08-14",
  buffer_days: 7,
  exempt_task_ids: [],
};

async function mount(opts: {
  isAdmin?: boolean;
  state?: Record<string, unknown>;
} = {}) {
  const state = { ...BASE_STATE, ...(opts.state ?? {}) };
  const { hass, sent } = createMockHass({
    handlers: {
      "maintenance_supporter/vacation/state": () => state,
      "maintenance_supporter/vacation/update": (msg) => ({ ...state, ...msg }),
      "maintenance_supporter/vacation/end_now": () => ({ ...state, enabled: false, is_active: false }),
    },
  });
  (hass as Record<string, unknown>).user = { id: "u1", is_admin: opts.isAdmin ?? true };

  const el = await fixture<MaintenanceVacationSectionCard>(html`
    <maintenance-vacation-section-card .hass=${hass}></maintenance-vacation-section-card>
  `);
  await new Promise((r) => setTimeout(r, 20));
  await el.updateComplete;
  return { el, sent };
}

describe("vacation-section-card", () => {
  it("hides every edit control for non-admin users", async () => {
    const { el } = await mount({ isAdmin: false });
    const root = el.shadowRoot!;
    expect(root.querySelector("ha-card"), "card rendered").to.exist;
    expect(root.querySelector("ha-switch"), "no enable switch").to.be.null;
    expect(root.querySelector('input[type="date"]'), "no date inputs").to.be.null;
    expect(root.querySelector(".actions"), "no action buttons").to.be.null;
  });

  it("admin toggle dispatches vacation/update {enabled: true}", async () => {
    const { el, sent } = await mount({ isAdmin: true });
    const sw = el.shadowRoot!.querySelector<HTMLInputElement>("ha-switch")!;
    expect(sw, "switch rendered for admin").to.exist;
    (sw as unknown as { checked: boolean }).checked = true;
    sw.dispatchEvent(new Event("change"));
    await new Promise((r) => setTimeout(r, 20));

    const upd = sent.filter((m) => m.type === "maintenance_supporter/vacation/update");
    expect(upd.length).to.equal(1);
    expect(upd[0].enabled).to.equal(true);
  });

  it("editing dates + Save dispatches start/end/buffer_days", async () => {
    const { el, sent } = await mount({ isAdmin: true });
    const root = el.shadowRoot!;
    const [start, end] = [...root.querySelectorAll<HTMLInputElement>('input[type="date"]')];
    start.value = "2026-09-01";
    start.dispatchEvent(new Event("input"));
    end.value = "2026-09-10";
    end.dispatchEvent(new Event("input"));
    const buffer = root.querySelector<HTMLInputElement>('input[type="number"]')!;
    buffer.value = "3";
    buffer.dispatchEvent(new Event("input"));
    await el.updateComplete;

    // The dirty state arms the primary Save button.
    const save = [...root.querySelectorAll<HTMLButtonElement>(".actions .btn")]
      .find((b) => b.classList.contains("primary"))!;
    expect(save, "save button armed").to.exist;
    save.click();
    await new Promise((r) => setTimeout(r, 20));

    const upd = sent.filter((m) => m.type === "maintenance_supporter/vacation/update");
    expect(upd.length).to.equal(1);
    expect(upd[0].start).to.equal("2026-09-01");
    expect(upd[0].end).to.equal("2026-09-10");
    expect(upd[0].buffer_days).to.equal(3);
  });

  it("status pill mirrors the server state", async () => {
    const { el } = await mount({ state: { enabled: true, is_active: true } });
    const pill = el.shadowRoot!.querySelector(".status-pill")!;
    expect(pill.classList.contains("active")).to.be.true;

    const { el: el2 } = await mount({ state: { enabled: true, is_active: false } });
    expect(el2.shadowRoot!.querySelector(".status-pill")!.classList.contains("scheduled"))
      .to.be.true;
  });
});
