/**
 * #170 follow-up: Settings → General → "Compact reference numbers" — admin
 * only, behind a confirm, calls reference_numbers/compact and reports the
 * counts; a declined confirm sends nothing.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/settings-view.js";
import type { MaintenanceSettingsView } from "../components/settings-view";
import { DEFAULT_FEATURES, createMockHass, type SentMessage } from "./_test-utils.js";
import type { MaintenanceConfirmDialog } from "../components/confirm-dialog";

/** Answer the confirm dialog (helpers/confirm): the question asks there
 *  since 2026-11, no longer through window.confirm. */
async function answerConfirm(yes: boolean): Promise<void> {
  let dlg: MaintenanceConfirmDialog | null = null;
  for (let i = 0; i < 50 && !dlg?.shadowRoot?.querySelector("ha-dialog"); i++) {
    await new Promise((r) => setTimeout(r, 10));
    dlg = document.querySelector<MaintenanceConfirmDialog>("maintenance-confirm-dialog[data-ms-lovelace-confirm]");
  }
  const buttons = dlg!.shadowRoot!.querySelectorAll<HTMLElement>(".dialog-actions ha-button");
  buttons[yes ? buttons.length - 1 : 0].click();
  await new Promise((r) => setTimeout(r, 10));
}

describe("settings: compact reference numbers (#170)", () => {
  afterEach(() => {
    document.querySelectorAll("maintenance-confirm-dialog[data-ms-lovelace-confirm]").forEach((d) => d.remove());
  });

  async function mount(isAdmin = true) {
    const { hass, sent } = createMockHass({
      handlers: { "maintenance_supporter/reference_numbers/compact": () => ({ objects: 3, tasks: 7, completions: 12 }) },
    });
    (hass as unknown as { user: { id: string; is_admin: boolean } }).user = { id: "u1", is_admin: isAdmin };
    const el = await fixture<MaintenanceSettingsView>(html`
      <maintenance-settings-view .hass=${hass} .features=${DEFAULT_FEATURES}></maintenance-settings-view>
    `);
    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;
    return { el, sent: sent as SentMessage[] };
  }

  it("is hidden for non-admins", async () => {
    const { el } = await mount(false);
    expect(el.shadowRoot!.querySelector("button.compact-refs")).to.equal(null);
  });

  it("confirms, calls the command and reports the counts", async () => {
    const { el, sent } = await mount();
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>("button.compact-refs")!;
    expect(btn).to.exist;
    btn.click();
    await answerConfirm(true);
    await new Promise((r) => setTimeout(r, 30));
    await el.updateComplete;
    expect(sent.some((m) => m.type === "maintenance_supporter/reference_numbers/compact")).to.equal(true);
    const toast = el.shadowRoot!.querySelector(".toast")?.textContent ?? el.shadowRoot!.textContent ?? "";
    expect(toast).to.contain("3 objects");
  });

  it("sends nothing when the confirm is declined", async () => {
    const { el, sent } = await mount();
    el.shadowRoot!.querySelector<HTMLButtonElement>("button.compact-refs")!.click();
    await answerConfirm(false);
    await new Promise((r) => setTimeout(r, 20));
    expect(sent.some((m) => m.type === "maintenance_supporter/reference_numbers/compact")).to.equal(false);
  });
});
