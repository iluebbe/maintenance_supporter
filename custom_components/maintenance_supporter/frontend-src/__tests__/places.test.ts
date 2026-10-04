/** 2026-10 places: an object's place is an HA zone ("" = home), and its
 *  reminders can wait until somebody is there. The dialog shows the fields
 *  only with the "Places" feature on; switched off, it leaves a stored place
 *  alone (the payload carries no place at all). */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/object-dialog.js";
import type { MaintenanceObjectDialog } from "../components/object-dialog";
import { createMockHass } from "./_test-utils.js";

const ZONE = "zone.allotment";

async function mount(placesEnabled: boolean, obj?: Record<string, unknown>) {
  const { hass, sent } = createMockHass({
    handlers: {
      "maintenance_supporter/object/update": () => ({ success: true }),
      "maintenance_supporter/object/create": () => ({ entry_id: "new" }),
    },
    states: { [ZONE]: { entity_id: ZONE, state: "0", attributes: { friendly_name: "Allotment" } } },
  });
  const el = await fixture<MaintenanceObjectDialog>(html`
    <maintenance-object-dialog .hass=${hass} .placesEnabled=${placesEnabled}></maintenance-object-dialog>
  `);
  if (obj) el.openEdit("e1", obj as never);
  else el.openCreate();
  await el.updateComplete;
  return { el, sent };
}

const placeForm = (el: MaintenanceObjectDialog) =>
  [...el.shadowRoot!.querySelectorAll<HTMLElement & { schema?: Array<{ name: string }> }>("ha-form")].find(
    (f) => f.schema?.[0]?.name === "place",
  );

async function pickPlace(el: MaintenanceObjectDialog, place: string | undefined) {
  placeForm(el)!.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { place } } }));
  await el.updateComplete;
}

async function tickOnSite(el: MaintenanceObjectDialog) {
  const box = el.shadowRoot!.querySelector<HTMLInputElement>(".place-on-site input")!;
  box.checked = true;
  box.dispatchEvent(new Event("change"));
  await el.updateComplete;
}

async function save(el: MaintenanceObjectDialog) {
  const buttons = [...el.shadowRoot!.querySelectorAll<HTMLElement>(".dialog-actions ha-button")];
  buttons[buttons.length - 1].click();
  await new Promise((r) => setTimeout(r, 10));
  await el.updateComplete;
}

const sentOf = (sent: Array<{ type: string }>, type: string) =>
  sent.find((m) => m.type === `maintenance_supporter/object/${type}`) as Record<string, unknown> | undefined;

describe("object dialog: places", () => {
  it("shows the place fields only with the feature on", async () => {
    const off = await mount(false);
    expect(placeForm(off.el)).to.equal(undefined);
    expect(off.el.shadowRoot!.querySelector(".place-on-site")).to.equal(null);
    const on = await mount(true);
    expect(placeForm(on.el)).to.not.equal(undefined);
    const box = on.el.shadowRoot!.querySelector<HTMLInputElement>(".place-on-site input")!;
    expect(box.disabled, "no place yet: nothing to wait for").to.equal(true);
  });

  it("a picked zone and 'only on site' go out with the object", async () => {
    const { el, sent } = await mount(true);
    (el as unknown as { _name: string })._name = "Shed";
    await pickPlace(el, ZONE);
    expect(el.shadowRoot!.querySelector(".place-hint"), "the hint explains the arrival message").to.not.equal(null);
    await tickOnSite(el);
    await save(el);
    const msg = sentOf(sent, "create")!;
    expect(msg.place).to.equal(ZONE);
    expect(msg.remind_on_site).to.equal(true);
  });

  it("clearing the place clears 'only on site' too", async () => {
    const { el, sent } = await mount(true, { name: "Shed", place: ZONE, remind_on_site: true });
    await pickPlace(el, undefined);
    await save(el);
    const msg = sentOf(sent, "update")!;
    expect(msg.place).to.equal(null);
    expect(msg.remind_on_site).to.equal(false);
  });

  it("with the feature off, a stored place is left alone", async () => {
    const { el, sent } = await mount(false, { name: "Shed", place: ZONE, remind_on_site: true });
    await save(el);
    const msg = sentOf(sent, "update")!;
    expect("place" in msg).to.equal(false);
    expect("remind_on_site" in msg).to.equal(false);
  });

  it("names a zone that is gone", async () => {
    const { el } = await mount(true, { name: "Boat", place: "zone.marina" });
    expect(el.shadowRoot!.querySelector(".place-missing")).to.not.equal(null);
  });
});
