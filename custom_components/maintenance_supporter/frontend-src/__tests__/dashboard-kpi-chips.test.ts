/**
 * #86 (2nd report): the dashboard KPI chips must never read "unknown" when the
 * summary sensors are absent (orphan object entries after the global entry was
 * deleted). The chips prefer the live summary sensor when its entity id
 * resolves, but fall back to the literal count from the statistics WS payload
 * otherwise.
 */
import { expect } from "@open-wc/testing";
import { kpiMarkdownCard } from "../maintenance-dashboard-strategy";

function contentOf(card: unknown): string {
  return (card as { content: string }).content;
}

describe("dashboard KPI chips (#86)", () => {
  it("uses live sensor templates when the summary entity ids resolve", () => {
    const content = contentOf(
      kpiMarkdownCard(
        {
          overdue: "sensor.maintenance_supporter_overdue",
          triggered: "sensor.maintenance_supporter_triggered",
          due_soon: "sensor.maintenance_supporter_due_soon",
          ok: "sensor.maintenance_supporter_ok",
        },
        { overdue: 2, triggered: 1, due_soon: 3, ok: 4 },
      ),
    );
    // Reactive template, not the literal number.
    expect(content).to.include("{{ states('sensor.maintenance_supporter_overdue') }}");
    expect(content).to.include("overdue");
  });

  it("falls back to the literal WS counts when no summary sensor exists", () => {
    const content = contentOf(
      kpiMarkdownCard(
        { overdue: null, triggered: null, due_soon: null, ok: null },
        { overdue: 2, triggered: 1, due_soon: 3, ok: 4 },
      ),
    );
    // No entity templates at all — the counts are baked in as real numbers.
    expect(content).to.not.include("states(");
    expect(content).to.not.include("unknown");
    expect(content).to.include("**2** overdue");
    expect(content).to.include("**1** triggered");
    expect(content).to.include("**3** due soon");
    expect(content).to.include("**4** ok");
  });

  it("shows an em dash rather than a template when neither id nor count is available", () => {
    const content = contentOf(kpiMarkdownCard({}, {}));
    expect(content).to.not.include("states(");
    expect(content).to.include("**—** overdue");
  });
});
