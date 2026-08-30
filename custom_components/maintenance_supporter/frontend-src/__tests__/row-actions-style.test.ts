/**
 * Panel: task-row actions follow the global "Task row actions" setting (#145).
 *
 *   - default (buttons_compact) renders HA buttons in .row-actions.as-buttons
 *   - "icons" renders the classic mwc-icon-button pair
 *   - the one-time notice shows a banner for admins; "Back to icons" sends
 *     style=icons + notice=false in ONE global/update and the rows flip.
 */

import { expect, waitUntil } from "@open-wc/testing";
import { DEFAULT_SETTINGS_RESPONSE, type WsHandler } from "./_test-utils.js";
import { mountPanel, obj, resetTaskSeq, task } from "./_panel-utils.js";

type PanelPriv = HTMLElement & { updateComplete: Promise<unknown> };

function settingsWith(general: Record<string, unknown>): WsHandler {
  return () => ({
    ...DEFAULT_SETTINGS_RESPONSE,
    general: { ...DEFAULT_SETTINGS_RESPONSE.general, ...general },
  });
}

async function mount(general: Record<string, unknown>, extra: Record<string, WsHandler> = {}) {
  const objects = [obj("e1", [task({ status: "overdue", days_until_due: -2 }), task()])];
  const r = await mountPanel(objects, { "maintenance_supporter/settings": settingsWith(general), ...extra });
  await new Promise((res) => setTimeout(res, 60));
  await (r.el as PanelPriv).updateComplete;
  return r;
}

describe("row actions style (#145)", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
    localStorage.setItem("msp-overview-tab", "dashboard");
  });

  it("renders HA buttons by default and no banner", async () => {
    const { el } = await mount({ row_action_style: "buttons_compact", row_action_notice_pending: false });
    const sr = el.shadowRoot!;
    await waitUntil(() => sr.querySelectorAll(".row-actions.as-buttons ha-button").length > 0, "buttons rendered");
    expect(sr.querySelectorAll(".row-actions mwc-icon-button.btn-complete").length).to.equal(0);
    expect(sr.querySelector(".row-actions-banner")).to.not.exist;
  });

  it("renders the classic icon pair when the household chose icons", async () => {
    const { el } = await mount({ row_action_style: "icons" });
    const sr = el.shadowRoot!;
    await waitUntil(() => sr.querySelectorAll(".row-actions mwc-icon-button.btn-complete").length > 0, "icons rendered");
    expect(sr.querySelectorAll(".row-actions.as-buttons").length).to.equal(0);
  });

  it("banner: 'Back to icons' writes style + clears the notice in one update", async () => {
    const updates: Record<string, unknown>[] = [];
    const { el } = await mount(
      { row_action_style: "buttons_compact", row_action_notice_pending: true },
      {
        "maintenance_supporter/global/update": (msg) => {
          updates.push(msg.settings as Record<string, unknown>);
          return { general: { row_action_style: "icons", row_action_notice_pending: false } };
        },
      },
    );
    const sr = el.shadowRoot!;
    await waitUntil(() => !!sr.querySelector(".row-actions-banner"), "banner shown");
    const buttons = [...sr.querySelectorAll(".row-actions-banner ha-button")];
    expect(buttons.length).to.equal(2);
    (buttons[1] as HTMLElement).click(); // filled = "Back to icons"
    await waitUntil(() => updates.length === 1, "one global/update sent");
    expect(updates[0]).to.deep.equal({ row_action_notice_pending: false, row_action_style: "icons" });
    await waitUntil(() => !sr.querySelector(".row-actions-banner"), "banner dismissed");
    await waitUntil(() => sr.querySelectorAll(".row-actions mwc-icon-button.btn-complete").length > 0, "rows flipped to icons");
  });

  it("banner: 'Keep buttons' only clears the notice", async () => {
    const updates: Record<string, unknown>[] = [];
    const { el } = await mount(
      { row_action_style: "buttons_compact", row_action_notice_pending: true },
      {
        "maintenance_supporter/global/update": (msg) => {
          updates.push(msg.settings as Record<string, unknown>);
          return { general: { row_action_style: "buttons_compact", row_action_notice_pending: false } };
        },
      },
    );
    const sr = el.shadowRoot!;
    await waitUntil(() => !!sr.querySelector(".row-actions-banner"), "banner shown");
    (sr.querySelector(".row-actions-banner ha-button") as HTMLElement).click();
    await waitUntil(() => updates.length === 1, "one global/update sent");
    expect(updates[0]).to.deep.equal({ row_action_notice_pending: false });
    await waitUntil(() => !sr.querySelector(".row-actions-banner"), "banner dismissed");
    expect(sr.querySelectorAll(".row-actions.as-buttons ha-button").length).to.be.greaterThan(0);
  });
});
