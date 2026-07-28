/**
 * Per-person notification self-test in Settings → Notifications.
 *
 * Tasks assigned to a person notify that person's own Companion device, not
 * the household service — so the household "Send test" button could always
 * report success while a housemate received nothing. These rows answer the
 * real question ("will Bob get his reminders?") and must:
 *
 *  1. send to the NAMED person (user_id on the wire), not the household;
 *  2. name a member who has no device rather than hiding them, and refuse to
 *     send for them — a send would go to the household service and land on
 *     the admin's own phone, which looks exactly like success.
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import "../components/settings-view.js";
import type { MaintenanceSettingsView } from "../components/settings-view";
import { createMockHass, DEFAULT_FEATURES, DEFAULT_SETTINGS_RESPONSE, type SentMessage } from "./_test-utils.js";

const TARGETS = {
  targets: [
    { user_id: "u-alice", name: "Alice", services: ["notify.mobile_app_alice_phone"] },
    { user_id: "u-bob", name: "Bob", services: [] },
  ],
};

const NOTIFY_ON = {
  ...DEFAULT_SETTINGS_RESPONSE,
  general: {
    ...DEFAULT_SETTINGS_RESPONSE.general,
    notifications_enabled: true,
    notify_service: "notify.household",
  },
};

async function mount(overrides: Record<string, (msg: SentMessage) => unknown> = {}) {
  const { hass, sent } = createMockHass({
    settingsResponse: NOTIFY_ON,
    handlers: {
      "maintenance_supporter/users/list": () => ({
        users: [
          { id: "u-alice", name: "Alice" },
          { id: "u-bob", name: "Bob" },
        ],
      }),
      "maintenance_supporter/notify/user_targets": () => TARGETS,
      "maintenance_supporter/global/test_notification": () => ({ success: true, result: "success", message: "sent" }),
      ...overrides,
    },
  });
  const el = await fixture<MaintenanceSettingsView>(html`<maintenance-settings-view .hass=${hass} .features=${DEFAULT_FEATURES}></maintenance-settings-view>`);
  await waitUntil(() => el.shadowRoot?.querySelector(".notify-person-row") != null, "per-person rows never rendered");
  return { el, sent };
}

function rows(el: MaintenanceSettingsView): HTMLElement[] {
  return Array.from(el.shadowRoot!.querySelectorAll<HTMLElement>(".notify-person-row"));
}

describe("settings-view per-person notification test", () => {
  it("lists each member with the services they actually resolve to", async () => {
    const { el } = await mount();
    const r = rows(el);
    expect(r.length).to.equal(2);
    expect(r[0].textContent).to.contain("Alice");
    expect(r[0].textContent).to.contain("notify.mobile_app_alice_phone");
  });

  it("names a member without a device instead of hiding them", async () => {
    const { el } = await mount();
    const bob = rows(el)[1];
    expect(bob.textContent).to.contain("Bob");
    // The localized "no own device" line, not an empty cell.
    expect(bob.querySelector(".notify-person-target.muted")).to.exist;
    expect(bob.querySelector(".notify-person-target")!.textContent!.trim()).to.not.equal("");
  });

  it("sends the test to the named person, not the household", async () => {
    const { el, sent } = await mount();
    (rows(el)[0].querySelector("button") as HTMLButtonElement).click();
    await waitUntil(
      () => sent.some((m) => m.type === "maintenance_supporter/global/test_notification"),
      "no test notification was sent",
    );
    const msg = sent.find((m) => m.type === "maintenance_supporter/global/test_notification")!;
    expect(msg.user_id).to.equal("u-alice");
  });

  it("refuses to send for a member with no device", async () => {
    const { el, sent } = await mount();
    const button = rows(el)[1].querySelector("button") as HTMLButtonElement;
    expect(button.disabled).to.be.true;
    button.click();
    await new Promise((r) => setTimeout(r, 20));
    expect(sent.some((m) => m.type === "maintenance_supporter/global/test_notification")).to.be.false;
  });

  it("leaves the household button sending no user_id", async () => {
    const { el, sent } = await mount();
    // The household test button is the one outside the per-person block.
    const household = Array.from(el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".setting-row button")).find(
      (b) => !b.closest(".notify-per-person"),
    )!;
    expect(household, "household test button missing").to.exist;
    household.click();
    await waitUntil(
      () => sent.some((m) => m.type === "maintenance_supporter/global/test_notification"),
      "household test never sent",
    );
    const msg = sent.find((m) => m.type === "maintenance_supporter/global/test_notification")!;
    expect(msg.user_id).to.be.undefined;
  });

  it("survives a backend that does not know the command yet", async () => {
    const { hass } = createMockHass({
      settingsResponse: NOTIFY_ON,
      handlers: {
        "maintenance_supporter/notify/user_targets": () => {
          throw new Error("unknown_command");
        },
      },
    });
    const el = await fixture<MaintenanceSettingsView>(
      html`<maintenance-settings-view .hass=${hass} .features=${DEFAULT_FEATURES}></maintenance-settings-view>`,
    );
    await new Promise((r) => setTimeout(r, 50));
    expect(el.shadowRoot!.querySelector(".notify-per-person")).to.not.exist;
  });
});
