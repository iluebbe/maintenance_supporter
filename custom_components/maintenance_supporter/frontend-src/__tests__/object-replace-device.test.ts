/** Replace object: the successor's device is asked for, not copied.
 *
 * The replace flow copied the old unit's HA device onto the successor, so the
 * new machine's object kept watching the retired machine's sensors and
 * pressed its reset button. The dialog now asks — keep (a controller that
 * stays), another device (the new unit; the backend moves the wiring), or
 * none — and each choice has its own WS payload. */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/object-dialog.js";
import type { MaintenanceObjectDialog } from "../components/object-dialog";
import { createMockHass } from "./_test-utils.js";

const OLD_DEVICE = "dev_old";

async function mount(obj: Record<string, unknown> = { name: "Robot", ha_device_id: OLD_DEVICE }) {
  const { hass, sent } = createMockHass({
    handlers: {
      "maintenance_supporter/object/replace": () => ({
        entry_id: "succ",
        device_swap: { moved: 2, unmatched: [] },
      }),
    },
  });
  (hass as unknown as { devices: unknown }).devices = {
    [OLD_DEVICE]: { name: "Robot Q7", name_by_user: null },
  };
  const el = await fixture<MaintenanceObjectDialog>(html`
    <maintenance-object-dialog .hass=${hass}></maintenance-object-dialog>
  `);
  el.openReplace("old_entry", obj as never);
  await el.updateComplete;
  return { el, sent };
}

const radios = (el: MaintenanceObjectDialog) =>
  [...el.shadowRoot!.querySelectorAll<HTMLInputElement>('input[name="replace-device"]')];

async function choose(el: MaintenanceObjectDialog, index: number) {
  const radio = radios(el)[index];
  radio.checked = true;
  radio.dispatchEvent(new Event("change"));
  await el.updateComplete;
}

function pickDevice(el: MaintenanceObjectDialog, deviceId: string) {
  const form = el.shadowRoot!.querySelector("ha-form")!;
  form.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { device: deviceId } } }));
}

const replaceButton = (el: MaintenanceObjectDialog) => {
  const buttons = [...el.shadowRoot!.querySelectorAll<HTMLElement & { disabled: boolean }>(".dialog-actions ha-button")];
  return buttons[buttons.length - 1];
};

async function submit(el: MaintenanceObjectDialog) {
  replaceButton(el).click();
  await new Promise((r) => setTimeout(r, 10));
  await el.updateComplete;
}

const replaceMsg = (sent: Array<{ type: string }>) =>
  sent.find((m) => m.type === "maintenance_supporter/object/replace") as Record<string, unknown> | undefined;

describe("object dialog: replace asks for the new unit's device", () => {
  it("offers keep / another / none and names the current device", async () => {
    const { el } = await mount();
    expect(radios(el)).to.have.length(3);
    expect(radios(el)[0].checked, "keep is preselected").to.equal(true);
    expect(el.shadowRoot!.querySelector(".radio-group")!.textContent).to.include("Robot Q7");
  });

  it("keep: the request carries no device (the successor stays on it)", async () => {
    const { el, sent } = await mount();
    await submit(el);
    const msg = replaceMsg(sent)!;
    expect(msg.entry_id).to.equal("old_entry");
    expect("ha_device_id" in msg).to.equal(false);
  });

  it("another device: blocked until one is picked, then sent", async () => {
    const { el, sent } = await mount();
    await choose(el, 1);
    expect(replaceButton(el).disabled, "no device picked yet").to.equal(true);
    pickDevice(el, "dev_new");
    await el.updateComplete;
    expect(replaceButton(el).disabled).to.equal(false);
    await submit(el);
    expect(replaceMsg(sent)!.ha_device_id).to.equal("dev_new");
  });

  it("none: the successor is unlinked", async () => {
    const { el, sent } = await mount();
    await choose(el, 2);
    await submit(el);
    const msg = replaceMsg(sent)!;
    expect("ha_device_id" in msg).to.equal(true);
    expect(msg.ha_device_id).to.equal(null);
  });

  it("reports the successor and what moved", async () => {
    const { el } = await mount();
    let detail: unknown = null;
    el.addEventListener("object-replaced", (e) => (detail = (e as CustomEvent).detail));
    await choose(el, 1);
    pickDevice(el, "dev_new");
    await el.updateComplete;
    await submit(el);
    expect(detail).to.deep.equal({ entry_id: "succ", device_swap: { moved: 2, unmatched: [] } });
  });

  it("an object without a device offers an optional link instead", async () => {
    const { el, sent } = await mount({ name: "Bike" });
    expect(radios(el)).to.have.length(0);
    pickDevice(el, "dev_new");
    await el.updateComplete;
    await submit(el);
    expect(replaceMsg(sent)!.ha_device_id).to.equal("dev_new");
  });
});
