/**
 * #188: the task selection bar has an overflow menu with "Move to another
 * object…" — one target prompt, then task/move per selected task; tasks that
 * already live in the target are skipped.
 */
import { expect } from "@open-wc/testing";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

type Panel = HTMLElement & { updateComplete: Promise<unknown>; _bulkMode: boolean; _bulkSelected: Set<string> };

async function openSelecting() {
  const { el, sent } = await mountPanel(
    [obj("e1", [task({ name: "Descale" }), task({ name: "Filter" })], "Boiler"), obj("e2", [task({ name: "Wax" })], "Car")],
    { "maintenance_supporter/task/move": (m: Record<string, unknown>) => ({ task_id: m.task_id, entry_id: m.target_entry_id }) },
  );
  const panel = el as unknown as Panel;
  sr(panel).querySelector<HTMLElement>(".bulk-toggle")!.click();
  await panel.updateComplete;
  sr(panel).querySelector<HTMLInputElement>(".bulk-bar .bulk-selectall input")!.click();
  await panel.updateComplete;
  return { el: panel, sent: sent as Array<Record<string, unknown>> };
}

describe("tasks: bulk move via the selection bar's menu (#188)", () => {
  beforeEach(() => resetTaskSeq());

  it("moves every selected task to the chosen object and skips the ones already there", async () => {
    const { el, sent } = await openSelecting();
    expect(el._bulkSelected.size).to.equal(3);
    sr(el).querySelector<HTMLElement>(".bulk-more")!.click();
    await el.updateComplete;
    const item = sr(el).querySelector<HTMLElement>(".popup-menu-item.bulk-move");
    expect(item, "menu entry rendered").to.exist;
    const dlg = sr(el).querySelector("maintenance-confirm-dialog") as unknown as { prompt: () => Promise<unknown> };
    dlg.prompt = async () => ({ confirmed: true, value: "e2" });
    item!.click();
    await new Promise((r) => setTimeout(r, 60));
    await el.updateComplete;
    const moves = sent.filter((m) => m.type === "maintenance_supporter/task/move");
    expect(moves.length, "only the two Boiler tasks move").to.equal(2);
    expect(moves.every((m) => m.entry_id === "e1" && m.target_entry_id === "e2")).to.equal(true);
    expect(el._bulkMode, "selection ends after the action").to.equal(false);
  });

  it("a cancelled prompt moves nothing and keeps the selection", async () => {
    const { el, sent } = await openSelecting();
    sr(el).querySelector<HTMLElement>(".bulk-more")!.click();
    await el.updateComplete;
    const dlg = sr(el).querySelector("maintenance-confirm-dialog") as unknown as { prompt: () => Promise<unknown> };
    dlg.prompt = async () => ({ confirmed: false, value: null });
    sr(el).querySelector<HTMLElement>(".popup-menu-item.bulk-move")!.click();
    await new Promise((r) => setTimeout(r, 40));
    expect(sent.some((m) => m.type === "maintenance_supporter/task/move")).to.equal(false);
    expect(el._bulkMode).to.equal(true);
  });
});
