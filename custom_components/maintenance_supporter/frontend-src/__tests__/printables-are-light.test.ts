/**
 * Every printable document must carry its own light colour scheme.
 *
 * These sheets are handed to the OS as a blob and opened outside the app —
 * in the Companion app that means a WebView, and a WebView on a dark-themed
 * phone paints a DARK default canvas. The object report set a dark text
 * colour and no background, so on a dark phone it rendered as a black page
 * with black text: the reader saw nothing but the pale row borders as
 * stripes. A printed sheet has no theme, so the fix is for the document to
 * state its own.
 *
 * Asserting on the generated markup keeps the guarantee without a browser;
 * e2e/report-darkmode-check.mjs measures the actual rendered contrast.
 */

import { expect } from "@open-wc/testing";
import { buildObjectReportHtml, type ReportLabels } from "../helpers/report.js";
import { buildTaskWorksheetHtml } from "../helpers/worksheet.js";

const labels = new Proxy({} as ReportLabels, {
  // Every label is a string; the wording is irrelevant to colour handling.
  get: (_t, key) => (typeof key === "string" ? key : ""),
});

function reportHtml(): string {
  return buildObjectReportHtml(
    { name: "Pool Pump", notes: "" } as never,
    [
      {
        name: "Filter change", type: "time_based", status: "overdue",
        last_performed: "2026-06-01", next_due: "2026-07-01",
        times_performed: 3, total_cost: 42,
      } as never,
    ],
    { ...labels, scheduleLabel: () => "every 30 days", statusLabel: (s: string) => s, typeLabel: (t: string) => t } as never,
    (iso: string) => iso,
    (amount: number) => `${amount.toFixed(2)} €`,
    "2026-07-29T12:00:00Z",
  );
}

/** A document that only sets `color` inherits the viewer's background. */
function assertPaintsItsOwnColours(html: string, what: string): void {
  expect(html, `${what}: no color-scheme meta`).to.match(
    /<meta\s+name="color-scheme"\s+content="light"\s*\/?>/,
  );
  expect(html, `${what}: no color-scheme declaration`).to.match(/color-scheme:\s*light/);

  const body = /body\s*\{([^}]*)\}/.exec(html);
  expect(body, `${what}: no body rule at all`).to.not.equal(null);
  const rule = body![1];
  expect(rule, `${what}: body sets a text colour but no background`).to.match(
    /background(-color)?:\s*(#fff|#ffffff|white)/i,
  );
  expect(rule, `${what}: body has no explicit text colour`).to.match(/(^|;)\s*color:\s*#/);
}

describe("printable documents state their own colour scheme", () => {
  it("the object report does", () => {
    assertPaintsItsOwnColours(reportHtml(), "object report");
  });

  it("the work sheet does", () => {
    const L = new Proxy({} as never, {
      get: (_t, k) => {
        if (k === "typeLabel" || k === "statusLabel") return (v: string) => v;
        return typeof k === "string" ? k : "";
      },
    });
    const html = buildTaskWorksheetHtml(
      { name: "Filter change", type: "time_based", notes: "", checklist: [] } as never,
      "Pool Pump",
      L,
      (iso: string) => iso,
      () => "every 30 days",
      null,
      null,
      null,
      "2026-07-29T12:00:00Z",
    );
    assertPaintsItsOwnColours(html, "work sheet");
  });

  it("the report never leaves the background to the viewer", () => {
    // The regression itself: a dark text colour with a transparent page is
    // exactly what produced black-on-black. Guard the pairing, not just the
    // presence of a background.
    const html = reportHtml();
    const body = /body\s*\{([^}]*)\}/.exec(html)![1];
    const hasDarkText = /color:\s*#(0|1|2|3)/i.test(body);
    const hasBackground = /background(-color)?:\s*#?\w+/i.test(body);
    expect(hasDarkText && !hasBackground, "dark text on an unpainted page").to.equal(false);
  });
});
