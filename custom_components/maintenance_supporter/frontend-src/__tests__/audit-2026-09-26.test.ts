/**
 * Bug audit 2026-09-26 (tranche 1) — frontend regressions.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/task-dialog.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import { uploadDocument } from "../helpers/photo-upload.js";
import type { HomeAssistant } from "../types.js";
import { createMockHass } from "./_test-utils.js";

describe("bug audit 2026-09-26", () => {
  it("renews an expired access token before an upload (tab open > 30 min)", async () => {
    const auth = {
      data: { access_token: "old" },
      expired: true,
      refreshAccessToken: async () => {
        auth.data.access_token = "fresh";
        auth.expired = false;
      },
    };
    const seen: string[] = [];
    const original = window.fetch;
    window.fetch = (async (_url: RequestInfo | URL, init?: RequestInit) => {
      seen.push((init?.headers as Record<string, string>).Authorization);
      return new Response(JSON.stringify({ id: "d1", deduped: false }), { status: 200 });
    }) as typeof fetch;
    try {
      const doc = await uploadDocument({ auth } as unknown as HomeAssistant, "e1", new File(["x"], "a.txt"), ["photo"]);
      expect(doc.id).to.equal("d1");
    } finally {
      window.fetch = original;
    }
    expect(seen).to.deep.equal(["Bearer fresh"]);
  });

  it("an edit saves last performed and the assignee only when changed in the dialog", async () => {
    // A completion elsewhere while the dialog was open (NFC, voice, another
    // user) was rolled back by Save: the loaded date and assignee went back.
    const { hass, sent } = createMockHass({ handlers: { "maintenance_supporter/task/update": () => ({}) } });
    const el = await fixture<MaintenanceTaskDialog>(html`<maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>`);
    const task = {
      id: "t1", name: "Filter", type: "custom", schedule_type: "time_based", interval_days: 30,
      warning_days: 7, enabled: true, last_performed: "2026-09-01", responsible_user_id: "u1",
    };
    await el.openEdit("e", task as never);
    await el.updateComplete;
    await (el as unknown as { _save: () => Promise<void> })._save();
    const untouched = sent.filter((m) => m.type === "maintenance_supporter/task/update").pop() as Record<string, unknown>;
    expect(untouched).to.not.have.property("last_performed");
    expect(untouched).to.not.have.property("responsible_user_id");

    await el.openEdit("e", task as never);
    (el as unknown as { _lastPerformed: string })._lastPerformed = "2026-09-20";
    (el as unknown as { _responsibleUserId: string | null })._responsibleUserId = null;
    await (el as unknown as { _save: () => Promise<void> })._save();
    const edited = sent.filter((m) => m.type === "maintenance_supporter/task/update").pop() as Record<string, unknown>;
    expect(edited.last_performed).to.equal("2026-09-20");
    expect(edited.responsible_user_id).to.equal(null);
  });
});
