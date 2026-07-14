/**
 * Spare-parts section: rows render the stock badge / identifiers / storage
 * location, the low state is flagged, and the add form only appears for
 * writers.
 */
import { expect, fixture, html } from "@open-wc/testing";
import "../components/parts-section";
import type { MaintenancePartsSection } from "../components/parts-section";
import type { MaintenancePart } from "../types";

const PARTS: MaintenancePart[] = [
  {
    id: "p1",
    name: "HEPA-Filter",
    mpn: "00754869",
    vendor: "Bosch",
    storage_location: "Keller Regal B",
    stock: 1,
    reorder_threshold: 1,
    is_low: true,
    unit: "pcs",
    shopping_url: "https://example.com/buy",
  },
  { id: "p2", name: "Brush", stock: null, is_low: false },
];

async function mount(canWrite: boolean): Promise<MaintenancePartsSection> {
  const el = await fixture<MaintenancePartsSection>(html`
    <maintenance-parts-section
      .hass=${{ language: "en", connection: { sendMessagePromise: async () => ({}) } } as never}
      .entryId=${"e1"}
      .parts=${PARTS}
      .canWrite=${canWrite}
    ></maintenance-parts-section>
  `);
  await el.updateComplete;
  return el;
}

describe("parts-section", () => {
  it("renders a row per part with stock badge, identifiers and location", async () => {
    const el = await mount(false);
    const rows = el.shadowRoot!.querySelectorAll(".part-row");
    expect(rows.length).to.equal(2);
    const first = rows[0] as HTMLElement;
    expect(first.classList.contains("low")).to.be.true;
    expect(first.querySelector(".stock-badge")!.textContent).to.include("1");
    expect(first.querySelector(".part-meta")!.textContent).to.include("MPN: 00754869");
    expect(first.querySelector(".part-meta")!.textContent).to.include("Keller Regal B");
    // Catalog-only part (untracked stock) shows no badge.
    expect((rows[1] as HTMLElement).querySelector(".stock-badge")).to.equal(null);
    // Shopping link resolves on the name.
    const link = first.querySelector(".part-name a") as HTMLAnchorElement;
    expect(link.href).to.equal("https://example.com/buy");
  });

  it("gates editing on canWrite", async () => {
    const reader = await mount(false);
    // Read-only users keep the (read-action) documents paperclip — one per
    // part — but no edit/delete/restock buttons.
    const readerBtns = [...reader.shadowRoot!.querySelectorAll("ha-icon-button")];
    expect(readerBtns.length).to.equal(reader.shadowRoot!.querySelectorAll(".part-row").length);
    expect(readerBtns.every((b) => b.querySelector('ha-icon[icon="mdi:paperclip"]'))).to.be.true;
    const writer = await mount(true);
    expect(writer.shadowRoot!.querySelectorAll("ha-icon-button").length).to.be.greaterThan(0);
    // Add button opens the inline form with native inputs (dialog-input trap).
    (writer.shadowRoot!.querySelector(".section-head ha-button") as HTMLElement).click();
    await writer.updateComplete;
    expect(writer.shadowRoot!.querySelector(".part-form")).to.not.equal(null);
    expect(writer.shadowRoot!.querySelectorAll(".part-form input").length).to.be.greaterThan(5);
  });

  it("does not render a non-http(s) shopping_url as a link (XSS guard)", async () => {
    const el = await fixture<MaintenancePartsSection>(html`
      <maintenance-parts-section
        .hass=${{ language: "en", connection: { sendMessagePromise: async () => ({}) } } as never}
        .entryId=${"e1"}
        .parts=${[
          { id: "p1", name: "Evil", stock: null, is_low: false, shopping_url: "javascript:alert(1)" },
          { id: "p2", name: "Good", stock: null, is_low: false, shopping_url: "https://ok.example/x" },
        ] as MaintenancePart[]}
        .canWrite=${false}
      ></maintenance-parts-section>
    `);
    await el.updateComplete;
    const rows = el.shadowRoot!.querySelectorAll(".part-row");
    // Row 0 (javascript:) → plain text, NO anchor. Row 1 (https) → anchor.
    expect(rows[0].querySelector(".part-name a"), "javascript: url must not become a link").to.equal(null);
    expect(rows[0].querySelector(".part-name")!.textContent!.trim()).to.equal("Evil");
    expect(rows[1].querySelector(".part-name a"), "https url stays a link").to.not.equal(null);
  });
});
