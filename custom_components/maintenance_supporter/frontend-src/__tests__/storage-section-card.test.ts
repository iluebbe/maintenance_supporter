/** Lit component tests for <maintenance-storage-section-card>. */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/storage-section-card.js";
import type { MaintenanceStorageSectionCard } from "../components/storage-section-card";
import { createMockHass } from "./_test-utils.js";

const SUMMARY = {
  total_bytes: 13, dedup_savings_bytes: 10, file_count: 3, link_count: 1, document_count: 4,
  by_object: {
    objA: { bytes: 10, files: 2, links: 0 },
    objB: { bytes: 3, files: 1, links: 1 },
  },
};
const OBJECTS = [
  { entry_id: "e1", object: { id: "objA", name: "Pool Pump" } },
  { entry_id: "e2", object: { id: "objB", name: "HVAC" } },
];

async function mount(summary: unknown = SUMMARY, objects: unknown = OBJECTS) {
  const { hass } = createMockHass({
    handlers: { "maintenance_supporter/documents/storage": () => summary },
  });
  const el = await fixture<MaintenanceStorageSectionCard>(html`
    <maintenance-storage-section-card .hass=${hass} .objects=${objects}></maintenance-storage-section-card>
  `);
  await new Promise((r) => setTimeout(r, 30));
  await el.updateComplete;
  return el;
}

describe("storage-section-card", () => {
  it("renders total, dedup saving and per-object rows sorted by size", async () => {
    const el = await mount();
    expect(el.shadowRoot!.querySelector("ha-card"), "card rendered").to.exist;
    const rows = el.shadowRoot!.querySelectorAll(".obj-row");
    expect(rows.length).to.equal(2);
    expect(rows[0].querySelector(".obj-name")!.textContent).to.contain("Pool Pump"); // 10 B first
    expect(rows[1].querySelector(".obj-name")!.textContent).to.contain("HVAC");
    expect(el.shadowRoot!.querySelector(".stat-value.saved"), "dedup saving shown").to.exist;
  });

  it("self-hides when there are no documents", async () => {
    const el = await mount({ ...SUMMARY, document_count: 0, by_object: {} });
    expect(el.shadowRoot!.querySelector("ha-card"), "hidden when empty").to.not.exist;
  });

  it("searches documents and renders results with the object name", async () => {
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/documents/storage": () => SUMMARY,
        "maintenance_supporter/documents/search": () => ({
          results: [
            { id: "d1", entry_id: "e1", object_name: "Pool Pump", kind: "file", title: "Manual", filename: "m.pdf", size: 100, tags: ["manual"] },
          ],
        }),
      },
    });
    const el = await fixture<MaintenanceStorageSectionCard>(html`
      <maintenance-storage-section-card .hass=${hass} .objects=${OBJECTS}></maintenance-storage-section-card>
    `);
    await new Promise((r) => setTimeout(r, 30));
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector<HTMLInputElement>(".doc-search input")!;
    input.value = "manual";
    input.dispatchEvent(new Event("input"));
    await new Promise((r) => setTimeout(r, 320)); // debounce (250 ms)
    await el.updateComplete;

    const results = el.shadowRoot!.querySelectorAll(".result-row");
    expect(results.length).to.equal(1);
    expect(results[0].querySelector(".result-title")!.textContent).to.contain("Manual");
    expect(results[0].querySelector(".result-obj")!.textContent).to.contain("Pool Pump");
  });

  it("falls back to a short id when the object name is unknown", async () => {
    const el = await mount(
      {
        ...SUMMARY, document_count: 1, file_count: 1, link_count: 0,
        by_object: { "0123456789abcdef": { bytes: 5, files: 1, links: 0 } },
      },
      [],
    );
    expect(el.shadowRoot!.querySelector(".obj-name")!.textContent!.trim()).to.equal("01234567");
  });
});
