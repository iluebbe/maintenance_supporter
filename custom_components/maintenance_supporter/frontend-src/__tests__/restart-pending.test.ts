/**
 * An update installed on disk that Home Assistant does not run yet
 * (helpers/update_state.py). 2026-10-12: after HACS installed an update and
 * nobody restarted, the complete dialog said only "Unknown error". Pins:
 *   - pendingRestartVersion reads the version answer (an older backend
 *     answers `version` only)
 *   - the panel asks for a restart, and checks again after the reconnect
 *     that follows the restart
 *   - a call failing the way such a backend fails says so too (runWs)
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import { pendingRestartVersion } from "../helpers/bundle-version.js";
import { runWs } from "../helpers/ws-run.js";
import { describeWsError } from "../ws-errors.js";
import { t } from "../styles.js";
import { createMockHass } from "./_test-utils.js";
import "../maintenance-panel.js";

const PENDING = { version: "2.103.0", installed_version: "2.104.0", restart_pending: true };
const RESTARTED = { version: "2.104.0", installed_version: "2.104.0", restart_pending: false };

describe("pendingRestartVersion", () => {
  it("is the installed version only while a restart is pending", () => {
    expect(pendingRestartVersion(PENDING)).to.equal("2.104.0");
    expect(pendingRestartVersion(RESTARTED)).to.equal(null);
    expect(pendingRestartVersion({ version: "2.103.0" })).to.equal(null);
    expect(pendingRestartVersion({ restart_pending: true, installed_version: null })).to.equal(null);
    expect(pendingRestartVersion(null)).to.equal(null);
  });
});

describe("panel: an update waiting for the restart", () => {
  it("asks for a restart and checks again after the reconnect", async () => {
    let answer: Record<string, unknown> = PENDING;
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/version": () => answer,
        "maintenance_supporter/statistics": () => ({ total_objects: 0, total_tasks: 0, overdue: 0, due_soon: 0, triggered: 0, ok: 0 }),
        "maintenance_supporter/groups": () => ({ groups: {} }),
      },
    });
    const ready = new Set<() => void>();
    Object.assign(hass.connection, {
      addEventListener: (event: string, cb: () => void) => { if (event === "ready") ready.add(cb); },
      removeEventListener: (event: string, cb: () => void) => { if (event === "ready") ready.delete(cb); },
    });
    Object.assign(hass, { user: { id: "admin-1", is_admin: true }, areas: {} });
    const el = await fixture<HTMLElement>(html`
      <maintenance-supporter-panel .hass=${hass} style="display:block; height: 600px;"></maintenance-supporter-panel>
    `);
    const banner = () => el.shadowRoot!.querySelector(".restart-pending-banner");
    await waitUntil(() => banner(), "restart banner shown", { timeout: 2000 });
    expect(banner()!.textContent!.trim()).to.equal(t("restart_pending_banner", "en").replace("{version}", "2.104.0"));
    expect(banner()!.textContent).to.contain("Restart Home Assistant");
    expect(ready.size).to.equal(1);

    // Home Assistant restarts: the connection comes back with the new code.
    answer = RESTARTED;
    ready.forEach((cb) => cb());
    await waitUntil(() => !banner(), "restart banner gone after the reconnect", { timeout: 2000 });

    el.remove();
    expect(ready.size).to.equal(0);
  });
});

describe("runWs: a call failing because the update waits for the restart", () => {
  type Host = Parameters<typeof runWs>[0];
  const host = (version: unknown, failure: Record<string, unknown>) => {
    const sent: string[] = [];
    const h = {
      hass: {
        language: "en",
        connection: {
          sendMessagePromise: async (msg: { type: string }) => {
            sent.push(msg.type);
            if (msg.type === "maintenance_supporter/version") return version;
            throw failure;
          },
        },
      },
    } as unknown as Host;
    return { h, sent };
  };
  const run = async (version: unknown, failure: Record<string, unknown>) => {
    const { h, sent } = host(version, failure);
    let message = "";
    const res = await runWs(h, { type: "maintenance_supporter/task/complete" }, { onError: (m) => { message = m; } });
    return { res, message, sent };
  };
  const UNKNOWN = { code: "unknown_error", message: "Unknown error" };

  it("says to restart Home Assistant instead of 'Unknown error'", async () => {
    const { res, message } = await run(PENDING, UNKNOWN);
    expect(res).to.equal(undefined);
    expect(message).to.equal(t("restart_pending_error", "en").replace("{version}", "2.104.0"));
    // A field or a command the running backend does not know yet, too.
    expect((await run(PENDING, { code: "invalid_format", message: "extra keys not allowed @ data['x']" })).message).to.contain("2.104.0");
    expect((await run(PENDING, { code: "unknown_command", message: "Unknown command." })).message).to.contain("2.104.0");
  });

  it("keeps the server's reason when no restart is pending or the backend cannot tell", async () => {
    const expected = describeWsError(UNKNOWN, "en");
    expect((await run(RESTARTED, UNKNOWN)).message).to.equal(expected);
    expect((await run({ version: "2.103.0" }, UNKNOWN)).message).to.equal(expected);
  });

  it("does not ask for the version on an ordinary refusal", async () => {
    const { message, sent } = await run(PENDING, { code: "not_found", message: "Task not found" });
    expect(sent).to.deep.equal(["maintenance_supporter/task/complete"]);
    expect(message).to.not.contain("2.104.0");
  });
});
