/**
 * Bug audit 2026-09-12, finding 3: when the server-side search failed, the
 * palette's catch swallowed the error without recording an answer for the
 * query, and the "Searching…" placeholder / footer stayed up forever. The
 * catch now records an empty answer, so the footer shows the local results
 * or "No matches" instead of a permanent spinner.
 */
import { expect } from "@open-wc/testing";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

async function open(el: HTMLElement & { updateComplete: Promise<unknown> }, query: string) {
  window.dispatchEvent(new KeyboardEvent("keydown", { key: "/" }));
  await el.updateComplete;
  const input = sr(el).querySelector<HTMLInputElement>(".palette-input")!;
  input.value = query;
  input.dispatchEvent(new Event("input"));
  await el.updateComplete;
  return input;
}

describe("global search: a failing server search does not spin forever (bug audit 2026-09-12)", () => {
  beforeEach(() => { resetTaskSeq(); localStorage.clear(); localStorage.setItem("msp-overview-tab", "dashboard"); });
  afterEach(() => localStorage.clear());

  it("shows 'No matches' after the WS error when nothing local matches", async () => {
    let calls = 0;
    const { el } = await mountPanel(
      [obj("e1", [task({ name: "Filter reinigen" })], "Spülmaschine")],
      { "maintenance_supporter/search": () => { calls++; throw new Error("boom"); } },
    );
    await open(el, "e24");
    expect(sr(el).querySelector(".palette-empty")!.textContent).to.contain("Searching");
    await new Promise((r) => setTimeout(r, 320));
    await el.updateComplete;
    expect(calls).to.equal(1);
    expect(sr(el).querySelector(".palette-waiting"), "no spinner footer").to.be.null;
    expect(sr(el).querySelector(".palette-empty")!.textContent).to.contain("No matches");
    expect(sr(el).querySelector(".palette-empty")!.textContent).to.not.contain("Searching");
  });

  it("keeps the local results and drops the 'Searching…' footer after the WS error", async () => {
    const { el } = await mountPanel(
      [obj("e1", [task({ name: "Filter reinigen" })], "Spülmaschine")],
      { "maintenance_supporter/search": () => Promise.reject(new Error("boom")) },
    );
    await open(el, "filter");
    expect(sr(el).querySelector(".palette-waiting"), "footer while the server is asked").to.exist;
    await new Promise((r) => setTimeout(r, 320));
    await el.updateComplete;
    expect(sr(el).querySelector(".palette-waiting")).to.be.null;
    const labels = [...sr(el).querySelectorAll(".palette-results .palette-label")].map((n) => n.textContent!.trim());
    expect(labels).to.include("Filter reinigen");
  });
});
