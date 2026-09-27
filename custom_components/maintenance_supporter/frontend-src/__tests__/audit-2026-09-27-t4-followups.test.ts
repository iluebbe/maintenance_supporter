/**
 * Bug audit 2026-09-27 (tranche 4) — follow-ups found while integrating.
 */

import { expect, waitUntil } from "@open-wc/testing";
import "../maintenance-calendar-card.js";
import { invalidateSettingsCache } from "../helpers/settings-cache.js";
import { createMockHass } from "./_test-utils.js";

const tick = (ms = 30) => new Promise((r) => setTimeout(r, ms));

describe("bug audit 2026-09-27 follow-ups", () => {
  afterEach(() => invalidateSettingsCache());

  const cases: Array<[string, { id: string; is_admin: boolean }, boolean]> = [
    ["a household member without write access", { id: "u1", is_admin: false }, false],
    ["an admin", { id: "a1", is_admin: true }, true],
  ];
  for (const [label, user, editor] of cases) {
    it(`calendar card: a past event opens ${editor ? "the history editor" : "no editor"} for ${label}`, async () => {
      // Editing a history entry is write tier — a member got an editor whose
      // Save the server refused.
      const { hass, sent } = createMockHass({
        handlers: {
          "maintenance_supporter/objects": () => ({ objects: [] }),
          "maintenance_supporter/statistics": () => ({}),
          "maintenance_supporter/object": () => ({ entry_id: "e1", object: { id: "o1", name: "Pump" }, tasks: [] }),
          "maintenance_supporter/task/history": () => ({ history: [] }),
        },
      });
      (hass as unknown as { user: unknown }).user = user;
      const el = document.createElement("maintenance-supporter-calendar-card") as HTMLElement & {
        setConfig: (c: unknown) => void;
        hass: unknown;
        _onEventClick: (ev: unknown) => void;
      };
      el.setConfig({ type: "custom:maintenance-supporter-calendar-card" });
      el.hass = hass;
      document.body.appendChild(el);
      const lookups = () => sent.filter((m) => m.type === "maintenance_supporter/object" || m.type === "maintenance_supporter/task/history").length;
      try {
        await waitUntil(() => sent.some((m) => m.type === "maintenance_supporter/objects"), "card loaded", { timeout: 2000 });
        el._onEventClick({ entry_id: "e1", task_id: "t1", history_timestamp: "2026-09-01T10:00:00+00:00" });
        if (editor) {
          await waitUntil(() => lookups() > 0, "the entry is looked up for the editor", { timeout: 2000 });
        } else {
          await tick(150);
          expect(lookups(), "no history editor for a member").to.equal(0);
        }
      } finally {
        el.remove();
      }
    });
  }
});
