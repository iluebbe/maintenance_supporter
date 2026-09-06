/**
 * Household member avatars (#169 follow-up): initials in the member's colour.
 *
 * Pins the person helper (defaults + the backend-resolved override winning),
 * the task-detail badge, and the Settings → Household members editor: the
 * avatar preview per member, typing initials / picking a swatch writes the
 * `member_display` map (merging, clearing an emptied initials field), and
 * Reset drops the member's override.
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import { render } from "lit";
import { AVATAR_PALETTE, defaultColor, defaultInitials, personOf, renderPersonChip } from "../helpers/person.js";
import { renderUserBadge } from "../renderers/task-detail.js";
import "../components/settings-view.js";
import type { MaintenanceSettingsView } from "../components/settings-view";
import type { MaintenanceTask } from "../types";
import { createMockHass, DEFAULT_FEATURES, DEFAULT_SETTINGS_RESPONSE, type SentMessage } from "./_test-utils.js";

describe("person helper (#169 follow-up)", () => {
  it("derives initials and a palette colour, and lets the backend's values win", () => {
    expect(defaultInitials("Maximiliane Schneider-Hoffmann")).to.equal("MS");
    expect(defaultInitials("Dev")).to.equal("D");
    expect(defaultInitials("")).to.equal("?");
    expect(AVATAR_PALETTE).to.include(defaultColor("u-1"));
    expect(defaultColor("u-1")).to.equal(defaultColor("u-1"));
    expect(personOf({ id: "u-1", name: "Eva Klein" })).to.deep.equal({ id: "u-1", name: "Eva Klein", initials: "EK", color: defaultColor("u-1") });
    expect(personOf({ id: "u-1", name: "Eva Klein", initials: "EVA", color: "#1565c0" })!.initials).to.equal("EVA");
    expect(personOf(null)).to.equal(null);
  });

  it("renders the chip with the avatar in the member's colour and the full name as title", () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    render(renderPersonChip({ id: "u", name: "Eva Klein", initials: "EK", color: "#1565c0" }, "extra"), host);
    const chip = host.querySelector<HTMLElement>(".person-chip")!;
    expect(chip.classList.contains("extra")).to.equal(true);
    expect(chip.title).to.equal("Eva Klein");
    const avatar = host.querySelector<HTMLElement>(".person-avatar")!;
    expect(avatar.textContent!.trim()).to.equal("EK");
    expect(avatar.style.getPropertyValue("--person-color")).to.equal("#1565c0");
    expect(host.querySelector(".person-name")!.textContent).to.equal("Eva Klein");
  });

  it("task-detail badge shows the avatar when a person resolves, the icon fallback otherwise", () => {
    const task = { id: "t1", name: "x", responsible_user_id: "u-1" } as unknown as MaintenanceTask;
    const host = document.createElement("div");
    document.body.appendChild(host);
    render(renderUserBadge(task, () => "Eva Klein", () => ({ id: "u-1", name: "Eva Klein", initials: "EK", color: "#2e7d32" })), host);
    expect(host.querySelector(".user-badge .person-avatar")!.textContent!.trim()).to.equal("EK");
    expect(host.querySelector(".user-badge")!.textContent).to.include("Eva Klein");
    render(renderUserBadge(task, () => "Eva Klein"), host);
    expect(host.querySelector(".user-badge ha-icon")).to.exist;
  });
});

describe("settings-view member avatars (#169 follow-up)", () => {
  const USERS = [
    { id: "u-alice", name: "Alice Adams", initials: "AA", color: AVATAR_PALETTE[0] },
    { id: "u-bob", name: "Bob", initials: "B", color: AVATAR_PALETTE[1] },
  ];

  async function mount(memberDisplay: Record<string, { initials?: string; color?: string }> = {}) {
    let stored = { ...memberDisplay };
    const { hass, sent } = createMockHass({
      settingsResponse: { ...DEFAULT_SETTINGS_RESPONSE, member_display: memberDisplay } as never,
      handlers: {
        "maintenance_supporter/users/list": () => ({
          users: USERS.map((u) => {
            const o = stored[u.id] || {};
            return { ...u, initials: o.initials || u.initials, color: o.color || u.color };
          }),
        }),
        "maintenance_supporter/notify/user_targets": () => ({ targets: [] }),
        "maintenance_supporter/global/update": (msg: SentMessage) => {
          stored = { ...((msg.settings as Record<string, unknown>).member_display as Record<string, { initials?: string; color?: string }>) };
          return { ...DEFAULT_SETTINGS_RESPONSE, member_display: stored };
        },
      },
    });
    const el = await fixture<MaintenanceSettingsView>(html`<maintenance-settings-view .hass=${hass} .features=${DEFAULT_FEATURES}></maintenance-settings-view>`);
    await waitUntil(() => el.shadowRoot?.querySelector(".member-avatar-row") != null, "member rows never rendered");
    return { el, sent, stored: () => stored };
  }
  const rows = (el: MaintenanceSettingsView) => [...el.shadowRoot!.querySelectorAll<HTMLElement>(".member-avatar-row")];
  const updates = (sent: SentMessage[]) => sent.filter((m) => m.type === "maintenance_supporter/global/update").map((m) => (m.settings as Record<string, unknown>).member_display);
  const settle = async (el: MaintenanceSettingsView) => { await new Promise((r) => setTimeout(r, 20)); await el.updateComplete; };

  it("lists every member with their resolved avatar and a placeholder of the default initials", async () => {
    const { el } = await mount();
    const r = rows(el);
    expect(r.length).to.equal(2);
    expect(r[0].querySelector(".person-avatar")!.textContent!.trim()).to.equal("AA");
    expect(r[0].querySelector<HTMLInputElement>(".member-initials")!.placeholder).to.equal("AA");
    expect(r[0].querySelectorAll(".member-swatch").length).to.equal(12);
    expect(r[0].querySelector(".member-swatch.selected")!.getAttribute("title")).to.equal(AVATAR_PALETTE[0]);
    expect(r[0].querySelector(".member-reset")).to.equal(null);
  });

  it("typing initials and picking a colour write a merged override; Reset drops it", async () => {
    const { el, sent, stored } = await mount();
    const input = rows(el)[1].querySelector<HTMLInputElement>(".member-initials")!;
    input.value = "bo";
    input.dispatchEvent(new Event("change"));
    await settle(el);
    expect(updates(sent).at(-1)).to.deep.equal({ "u-bob": { initials: "bo" } });

    rows(el)[1].querySelectorAll<HTMLElement>(".member-swatch")[5].click();
    await settle(el);
    expect(updates(sent).at(-1)).to.deep.equal({ "u-bob": { initials: "bo", color: AVATAR_PALETTE[5] } });
    // The refreshed users/list drives the preview.
    expect(rows(el)[1].querySelector(".person-avatar")!.textContent!.trim()).to.equal("bo");
    expect(rows(el)[1].querySelector(".member-swatch.selected")!.getAttribute("title")).to.equal(AVATAR_PALETTE[5]);

    rows(el)[1].querySelector<HTMLElement>(".member-reset")!.click();
    await settle(el);
    expect(updates(sent).at(-1)).to.deep.equal({});
    expect(stored()).to.deep.equal({});
  });

  it("clearing the initials field keeps the colour override", async () => {
    const { el, sent } = await mount({ "u-alice": { initials: "AL", color: AVATAR_PALETTE[3] } });
    const input = rows(el)[0].querySelector<HTMLInputElement>(".member-initials")!;
    expect(input.value).to.equal("AL");
    input.value = "  ";
    input.dispatchEvent(new Event("change"));
    await settle(el);
    expect(updates(sent).at(-1)).to.deep.equal({ "u-alice": { color: AVATAR_PALETTE[3] } });
  });
});
