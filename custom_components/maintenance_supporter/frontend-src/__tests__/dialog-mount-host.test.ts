/**
 * dialog-mount: dialogs mount inside <home-assistant>'s shadow root (#129).
 *
 * HA's modern pickers resolve data via Lit context events that bubble up to
 * providers on the <home-assistant> element — a dialog on document.body is a
 * sibling tree and its pickers upgrade to empty shadow roots. Pins: the
 * helper mounts into the HA shadow root when present, adopts a stray
 * body-mounted dialog from an older bundle, and still falls back to
 * document.body when no <home-assistant> element exists.
 */

import { expect } from "@open-wc/testing";
import { openCreateTaskDialog } from "../dialog-mount";
import { formatDate, setDateTimePrefs } from "../styles";

const TAG = "maintenance-task-dialog";

function makeHaRoot(locale?: object): HTMLElement {
  const root = document.createElement("home-assistant");
  root.attachShadow({ mode: "open" });
  (root as HTMLElement & { hass?: object }).hass = {
    language: "en",
    locale,
    connection: { sendMessagePromise: () => new Promise(() => undefined) },
  };
  document.body.appendChild(root);
  return root;
}

describe("dialog-mount host selection (#129)", () => {
  afterEach(() => {
    document.querySelector("home-assistant")?.remove();
    document.body.querySelector(TAG)?.remove();
  });

  it("mounts the task dialog inside <home-assistant>'s shadow root", () => {
    const ha = makeHaRoot();
    const opened = openCreateTaskDialog();
    expect(opened).to.equal(true);
    expect(ha.shadowRoot!.querySelector(TAG), "dialog inside HA shadow root").to.exist;
    expect(document.body.querySelector(TAG), "no dialog on body").to.equal(null);
    ha.shadowRoot!.querySelector(TAG)!.remove();
  });

  it("adopts a stray body-mounted dialog into the HA shadow root", () => {
    const ha = makeHaRoot();
    const stray = document.createElement(TAG);
    document.body.appendChild(stray);
    openCreateTaskDialog();
    expect(stray.parentNode, "stray reparented").to.equal(ha.shadowRoot);
    expect(document.body.querySelector(TAG)).to.equal(null);
    stray.remove();
  });

  it("feeds the HA profile date format into the prefs singleton on open (#163)", () => {
    // A strategy dashboard may never have rendered a panel or card, so the
    // dialog itself is the first (only) surface that can pick up hass.locale.
    setDateTimePrefs({ date_format: "language", time_format: "language" }, null);
    expect(formatDate("2026-08-10", "en")).to.equal("08/10/2026");
    const ha = makeHaRoot({ date_format: "DMY", time_format: "24" });
    try {
      expect(openCreateTaskDialog()).to.equal(true);
      expect(formatDate("2026-08-10", "en")).to.equal("10/08/2026");
    } finally {
      setDateTimePrefs({ date_format: undefined, time_format: undefined }, null);
      ha.shadowRoot!.querySelector(TAG)?.remove();
    }
  });

  it("falls back to document.body without a <home-assistant> element", () => {
    // No HA root at all -> no hass -> openCreateTaskDialog returns false, but
    // the element must still be created on body by getOrCreate.
    const opened = openCreateTaskDialog();
    expect(opened).to.equal(false); // no hass available
    expect(document.body.querySelector(TAG), "dialog on body as last resort").to.exist;
  });
});
