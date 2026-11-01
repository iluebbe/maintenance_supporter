/**
 * The questions that used the browser's own `window.confirm` (delete a
 * document, delete a spare part, compact the reference numbers) ask through
 * our confirm dialog for everyone, not only with the beta UI (2026-11), and a
 * destructive question shows its button in HA's danger variant (red) with
 * the beta off too: classic was blue because HA's button no longer reads the
 * old --mdc-theme-primary override.
 *
 * Pins, with the beta UI OFF: window.confirm is never called; the dialog
 * is mounted with the question's text; its confirm button is
 * variant="danger"; yes sends the command, no sends nothing.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/documents-section.js";
import "../components/parts-section.js";
import "../components/settings-view.js";
import "../components/confirm-dialog.js";
import type { MaintenanceConfirmDialog } from "../components/confirm-dialog";
import type { MaintenancePart } from "../types";
import { betaUi, setBetaUi } from "../helpers/beta-ui";
import { t } from "../styles";
import { DEFAULT_FEATURES, createMockHass, type SentMessage } from "./_test-utils.js";

const tick = (ms = 20) => new Promise((r) => setTimeout(r, ms));

/** The singleton confirm dialog once it shows its question. */
async function openDialog(): Promise<MaintenanceConfirmDialog> {
  let dlg: MaintenanceConfirmDialog | null = null;
  for (let i = 0; i < 50 && !dlg?.shadowRoot?.querySelector("ha-dialog"); i++) {
    await tick(10);
    dlg = document.querySelector<MaintenanceConfirmDialog>("maintenance-confirm-dialog[data-ms-lovelace-confirm]");
  }
  expect(dlg?.shadowRoot?.querySelector("ha-dialog") != null, "confirm dialog shown").to.equal(true);
  return dlg!;
}

function buttons(dlg: MaintenanceConfirmDialog): HTMLElement[] {
  return [...dlg.shadowRoot!.querySelectorAll<HTMLElement>(".dialog-actions ha-button")];
}

describe("confirm dialog for everyone (beta UI off)", () => {
  const realConfirm = window.confirm;
  beforeEach(() => {
    setBetaUi(false);
    window.confirm = () => { throw new Error("native confirm used"); };
  });
  afterEach(() => {
    window.confirm = realConfirm;
    document.querySelectorAll("maintenance-confirm-dialog[data-ms-lovelace-confirm]").forEach((d) => d.remove());
  });

  it("a destructive question shows a danger button without the beta", async () => {
    expect(betaUi()).to.equal(false);
    const dlg = await fixture<MaintenanceConfirmDialog>(html`<maintenance-confirm-dialog .hass=${{ language: "en" } as never}></maintenance-confirm-dialog>`);
    const asked = dlg.confirm({ title: "Delete", message: "Really?", confirmText: "Delete", danger: true });
    await dlg.updateComplete;
    const [, ok] = buttons(dlg);
    expect(ok.getAttribute("variant")).to.equal("danger");
    ok.click();
    expect(await asked).to.equal(true);

    const plain = dlg.confirm({ title: "Pause", message: "Pause it?", confirmText: "Pause" });
    await dlg.updateComplete;
    expect(buttons(dlg)[1].getAttribute("variant")).to.equal("brand");
    buttons(dlg)[0].click();
    expect(await plain).to.equal(false);
  });

  it("deleting a document asks in the dialog; yes deletes", async () => {
    const { hass, sent } = createMockHass({
      handlers: {
        "maintenance_supporter/documents/list": () => ({ documents: [{ id: "d1", kind: "file", title: "Manual", filename: "m.pdf", mime: "application/pdf", size: 10, tags: [], added_at: "2026-01-01T00:00:00" }] }),
        "maintenance_supporter/documents/delete": () => ({ success: true, bytes_freed: 0 }),
      },
    });
    const el = await fixture(html`<maintenance-documents-section .hass=${hass} .entryId=${"e1"} .canWrite=${true}></maintenance-documents-section>`);
    await tick(30);
    el.shadowRoot!.querySelector<HTMLElement>(".icon-btn.danger")!.click();
    const dlg = await openDialog();
    expect(dlg.shadowRoot!.querySelector(".content")!.textContent).to.contain("Manual");
    expect(buttons(dlg)[1].getAttribute("variant")).to.equal("danger");
    buttons(dlg)[1].click();
    await tick();
    const msg = (sent as SentMessage[]).find((m) => m.type === "maintenance_supporter/documents/delete");
    expect(msg?.doc_id).to.equal("d1");
  });

  it("deleting a spare part asks in the dialog; no keeps it", async () => {
    const sent: Record<string, unknown>[] = [];
    const part: MaintenancePart = { id: "p1", name: "HEPA-Filter", stock: 1, is_low: false };
    const el = await fixture(html`
      <maintenance-parts-section
        .hass=${{ language: "en", connection: { sendMessagePromise: async (m: Record<string, unknown>) => { sent.push(m); return { success: true }; } } } as never}
        .entryId=${"e1"} .parts=${[part]} .canWrite=${true}
      ></maintenance-parts-section>
    `);
    const del = [...el.shadowRoot!.querySelectorAll<HTMLElement>("ha-icon-button")].find((b) => b.getAttribute("title") === t("delete", "en"))!;
    del.click();
    let dlg = await openDialog();
    expect(dlg.shadowRoot!.querySelector(".content")!.textContent).to.contain("HEPA-Filter");
    expect(buttons(dlg)[1].getAttribute("variant")).to.equal("danger");
    buttons(dlg)[0].click();
    await tick();
    expect(sent.some((m) => m.type === "maintenance_supporter/part/delete")).to.equal(false);

    del.click();
    dlg = await openDialog();
    buttons(dlg)[1].click();
    await tick();
    expect(sent.find((m) => m.type === "maintenance_supporter/part/delete")?.part_id).to.equal("p1");
  });

  it("compacting the reference numbers asks in the dialog", async () => {
    const { hass, sent } = createMockHass({
      handlers: { "maintenance_supporter/reference_numbers/compact": () => ({ objects: 1, tasks: 2, completions: 3 }) },
    });
    (hass as unknown as { user: { id: string; is_admin: boolean } }).user = { id: "u1", is_admin: true };
    const el = await fixture(html`<maintenance-settings-view .hass=${hass} .features=${DEFAULT_FEATURES}></maintenance-settings-view>`);
    await tick(50);
    el.shadowRoot!.querySelector<HTMLElement>("button.compact-refs")!.click();
    const dlg = await openDialog();
    expect(dlg.shadowRoot!.querySelector(".content")!.textContent).to.contain(t("settings_compact_refs_confirm", "en"));
    expect(buttons(dlg)[1].getAttribute("variant")).to.equal("danger");
    buttons(dlg)[1].click();
    await tick(40);
    expect((sent as SentMessage[]).some((m) => m.type === "maintenance_supporter/reference_numbers/compact")).to.equal(true);
  });
});
