/** Dialog titles are our own element (2026-10-03).
 *
 * Home Assistant's <ha-dialog> draws nothing for a `heading` attribute: the
 * group dialog, the seasonal factors and the new bulk edit opened without a
 * title in a real instance (the docs picture of the bulk edit came out with
 * none). Every dialog renders its title as .dialog-title in its own shadow
 * root — as the complete, task, object, QR and confirm dialogs always did.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/group-dialog.js";
import "../components/seasonal-overrides-dialog.js";
import "../components/bulk-edit-dialog.js";
import type { MaintenanceGroupDialog } from "../components/group-dialog";
import type { SeasonalOverridesDialog } from "../components/seasonal-overrides-dialog";
import type { MaintenanceBulkEditDialog } from "../components/bulk-edit-dialog";
import { createMockHass } from "./_test-utils.js";

async function sources(): Promise<Record<string, string>> {
  return (await (await fetch("/__source-manifest")).json()) as Record<string, string>;
}

const titleOf = (el: Element) => el.shadowRoot!.querySelector(".dialog-title")?.textContent?.trim();

describe("dialog titles", () => {
  it("no component hands its title to ha-dialog's heading", async () => {
    const offenders: string[] = [];
    for (const [path, text] of Object.entries(await sources())) {
      for (let at = text.indexOf("heading="); at !== -1; at = text.indexOf("heading=", at + 1)) {
        // The attribute belongs to the tag opened last before it.
        if (text.startsWith("<ha-dialog", text.lastIndexOf("<", at))) offenders.push(path);
      }
    }
    expect(offenders).to.deep.equal([]);
  });

  it("the group, seasonal and bulk dialogs draw their own title", async () => {
    const { hass } = createMockHass();
    const group = await fixture<MaintenanceGroupDialog>(html`<maintenance-group-dialog .hass=${hass} .objects=${[]}></maintenance-group-dialog>`);
    group.openCreate();
    await group.updateComplete;
    expect(titleOf(group)).to.equal("New group");

    const seasonal = await fixture<SeasonalOverridesDialog>(html`<maintenance-seasonal-overrides-dialog .hass=${hass}></maintenance-seasonal-overrides-dialog>`);
    seasonal.open("e1", "t1", null);
    await seasonal.updateComplete;
    expect(titleOf(seasonal)).to.equal("Seasonal factors (override)");

    const bulk = await fixture<MaintenanceBulkEditDialog>(html`<maintenance-bulk-edit-dialog .hass=${hass}></maintenance-bulk-edit-dialog>`);
    void bulk.open("labels", [{ entry_id: "e1", task_id: "t1", labels: [] }] as never[], []);
    await bulk.updateComplete;
    expect(titleOf(bulk)).to.equal("Labels");
  });
});
