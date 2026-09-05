/**
 * #161 Phase 1 — several photos per completion.
 *
 * Pins the three frontend halves of the feature:
 *   - historyPhotoIds() reads both entry shapes (pre-#161 `photo_doc_id`
 *     scalar, new `photo_doc_ids` list), de-duplicates and caps at 10
 *   - the history timeline renders one thumbnail per photo
 *   - the history-edit dialog shows the photos, sends `photo_doc_ids` ONLY
 *     when the list changed, deletes uploads it made on remove / Cancel and
 *     merely detaches pre-existing photos (their files stay)
 */

import { expect, fixture, html } from "@open-wc/testing";
import { render } from "lit";
import { historyPhotoIds, MAX_COMPLETION_PHOTOS } from "../helpers/history-photos.js";
import { renderHistoryEntry, type HistoryContext } from "../renderers/history.js";
import "../components/history-edit-dialog.js";
import type { HistoryEntryDraft, MaintenanceHistoryEditDialog } from "../components/history-edit-dialog";
import type { HistoryEntry } from "../types";
import { type SentMessage, createMockHass } from "./_test-utils.js";

describe("historyPhotoIds (#161)", () => {
  it("reads the legacy scalar, the list, or both — legacy first, de-duplicated", () => {
    expect(historyPhotoIds({ photo_doc_id: "a" })).to.deep.equal(["a"]);
    expect(historyPhotoIds({ photo_doc_ids: ["b", "c"] })).to.deep.equal(["b", "c"]);
    expect(historyPhotoIds({ photo_doc_id: "a", photo_doc_ids: ["b", "a", " c ", "", 7 as unknown as string] }))
      .to.deep.equal(["a", "b", "c"]);
    expect(historyPhotoIds({})).to.deep.equal([]);
    expect(historyPhotoIds(null)).to.deep.equal([]);
  });

  it("caps at MAX_COMPLETION_PHOTOS", () => {
    const many = Array.from({ length: 14 }, (_, i) => `d${i}`);
    expect(historyPhotoIds({ photo_doc_ids: many }).length).to.equal(MAX_COMPLETION_PHOTOS);
    expect(MAX_COMPLETION_PHOTOS).to.equal(10);
  });
});

describe("history timeline photos (#161)", () => {
  function ctx(): HistoryContext {
    const { hass } = createMockHass({
      handlers: { "auth/sign_path": () => ({ path: "/api/maintenance_supporter/document/x?authSig=y" }) },
    });
    return {
      lang: "en", hass, filter: null, search: "", currencySymbol: "€",
      setFilter: () => undefined, setSearch: () => undefined, openEdit: () => undefined,
    };
  }
  function mountEntry(entry: Partial<HistoryEntry>): HTMLElement {
    const host = document.createElement("div");
    document.body.appendChild(host);
    render(renderHistoryEntry({ type: "completed", timestamp: "2026-08-01T10:00:00", ...entry } as HistoryEntry, ctx()), host);
    return host;
  }

  it("renders one thumbnail per photo, in a wrapping strip", () => {
    const host = mountEntry({ photo_doc_ids: ["p1", "p2", "p3"] });
    const thumbs = host.querySelectorAll(".history-photos maintenance-history-photo");
    expect(thumbs.length).to.equal(3);
    expect([...thumbs].map((n) => (n as unknown as { docId: string }).docId)).to.deep.equal(["p1", "p2", "p3"]);
  });

  it("still shows a pre-#161 single photo, and nothing without photos", () => {
    expect(mountEntry({ photo_doc_id: "old" }).querySelectorAll("maintenance-history-photo").length).to.equal(1);
    expect(mountEntry({}).querySelector(".history-photos")).to.equal(null);
  });
});

describe("history-edit dialog photos (#161)", () => {
  function draft(partial: Partial<HistoryEntryDraft> = {}): HistoryEntryDraft {
    return {
      entry_id: "e1", task_id: "t1",
      original_timestamp: "2026-08-01T10:00:00",
      type: "completed", timestamp: "2026-08-01T10:00:00",
      notes: null, cost: null, duration: null, completed_by: null,
      ...partial,
    };
  }

  async function mountDialog(): Promise<{ el: MaintenanceHistoryEditDialog; sent: SentMessage[] }> {
    const { hass, sent } = createMockHass({
      handlers: {
        "maintenance_supporter/parts/overview": () => ({ parts: [] }),
        "maintenance_supporter/task/history/update": () => ({ success: true }),
        "auth/sign_path": () => ({ path: "/api/maintenance_supporter/document/x?authSig=y" }),
      },
    });
    const el = await fixture<MaintenanceHistoryEditDialog>(html`
      <maintenance-history-edit-dialog .hass=${hass}></maintenance-history-edit-dialog>
    `);
    return { el, sent };
  }

  const settle = async (el: MaintenanceHistoryEditDialog) => {
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 20));
    await el.updateComplete;
  };

  function stubUpload(ids: string[]) {
    const realFetch = window.fetch;
    let n = 0;
    window.fetch = (async () => {
      const id = ids[n++] ?? `up-${n}`;
      return { ok: true, status: 200, json: async () => ({ id }) } as Response;
    }) as typeof window.fetch;
    return () => { window.fetch = realFetch; };
  }

  function pickFiles(el: MaintenanceHistoryEditDialog, names: string[]) {
    const input = el.shadowRoot!.querySelector<HTMLInputElement>('.photo-add input[type="file"]')!;
    const dt = new DataTransfer();
    for (const name of names) dt.items.add(new File(["png"], name, { type: "image/png" }));
    input.files = dt.files;
    input.dispatchEvent(new Event("change"));
  }

  type Internals = { _set: (k: "notes", v: string) => void; _save: () => Promise<void> };
  const internals = (el: MaintenanceHistoryEditDialog) => el as unknown as Internals;

  const deletes = (sent: SentMessage[]) =>
    sent.filter((m) => m.type === "maintenance_supporter/documents/delete").map((m) => m.doc_id);
  const update = (sent: SentMessage[]) =>
    sent.find((m) => m.type === "maintenance_supporter/task/history/update") as Record<string, unknown> | undefined;

  it("shows the entry photos; an untouched list stays out of the patch", async () => {
    const { el, sent } = await mountDialog();
    el.openEdit(draft({ photo_doc_ids: ["p1", "p2"], notes: "x" }));
    await settle(el);
    expect(el.shadowRoot!.querySelectorAll(".photo-tile maintenance-history-photo").length).to.equal(2);
    internals(el)._set("notes", "changed");
    await internals(el)._save();
    const msg = update(sent)!;
    expect(msg.notes).to.equal("changed");
    expect("photo_doc_ids" in msg, "no photo field without a change").to.equal(false);
  });

  it("detaching a pre-existing photo sends the shorter list and keeps the file", async () => {
    const { el, sent } = await mountDialog();
    el.openEdit(draft({ photo_doc_ids: ["p1", "p2"] }));
    await settle(el);
    el.shadowRoot!.querySelector<HTMLElement>(".photo-tile .photo-remove")!.click();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll(".photo-tile").length).to.equal(1);
    await internals(el)._save();
    expect(update(sent)!.photo_doc_ids).to.deep.equal(["p2"]);
    expect(deletes(sent), "existing photo is only detached").to.deep.equal([]);
  });

  it("adds uploaded photos to the patch; Cancel after uploading drops them again", async () => {
    const { el, sent } = await mountDialog();
    const restore = stubUpload(["new1", "new2"]);
    try {
      el.openEdit(draft({ photo_doc_ids: ["p1"] }));
      await settle(el);
      pickFiles(el, ["a.png", "b.png"]);
      await settle(el);
      expect(el.shadowRoot!.querySelectorAll(".photo-tile").length).to.equal(3);

      // Removing an upload made in this session deletes the file straight away.
      el.shadowRoot!.querySelectorAll<HTMLElement>(".photo-tile .photo-remove")[2].click();
      await el.updateComplete;
      expect(deletes(sent)).to.deep.equal(["new2"]);

      el.close();
      await el.updateComplete;
      expect(deletes(sent), "cancel drops the remaining upload").to.deep.equal(["new2", "new1"]);
      expect(update(sent)).to.equal(undefined);
    } finally {
      restore();
    }
  });

  it("saving keeps the uploads and links them through photo_doc_ids", async () => {
    const { el, sent } = await mountDialog();
    const restore = stubUpload(["new1"]);
    try {
      el.openEdit(draft({ photo_doc_ids: ["old"] }));
      await settle(el);
      pickFiles(el, ["a.png"]);
      await settle(el);
      await internals(el)._save();
      expect(update(sent)!.photo_doc_ids).to.deep.equal(["old", "new1"]);
      expect(deletes(sent)).to.deep.equal([]);
    } finally {
      restore();
    }
  });
});
