/**
 * The Android Companion single-pick fallback on EVERY photo surface (#161
 * follow-up). The complete dialog had it first; the history edit dialog and
 * the documents section silently added nothing inside the app because their
 * `<input type="file" multiple>` came back empty. All three now share
 * <ms-photo-picker> (dialogs) / the same single-select rule (documents).
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/history-edit-dialog.js";
import type { HistoryEntryDraft, MaintenanceHistoryEditDialog } from "../components/history-edit-dialog";
import "../components/documents-section.js";
import type { MaintenanceDocumentsSection } from "../components/documents-section";
import { createMockHass } from "./_test-utils.js";

type Android = { externalApp?: unknown };

const GALLERY = '.photo-pick-gallery input[type="file"]';
const CAMERA = '.photo-pick-camera input[type="file"]';

const settle = async (el: { updateComplete: Promise<unknown> }) => {
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 20));
  await el.updateComplete;
};

function draft(partial: Partial<HistoryEntryDraft> = {}): HistoryEntryDraft {
  return {
    entry_id: "e1", task_id: "t1",
    original_timestamp: "2026-08-01T10:00:00",
    type: "completed", timestamp: "2026-08-01T10:00:00",
    notes: null, cost: null, duration: null, completed_by: null,
    ...partial,
  };
}

async function mountHistoryEdit() {
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

function stubUpload(ids: string[]) {
  const realFetch = window.fetch;
  const forms: FormData[] = [];
  let n = 0;
  window.fetch = (async (_url: RequestInfo | URL, init?: RequestInit) => {
    forms.push(init!.body as FormData);
    const id = ids[n++] ?? `up-${n}`;
    return { ok: true, status: 200, json: async () => ({ id }) } as Response;
  }) as typeof window.fetch;
  return { forms, restore: () => { window.fetch = realFetch; } };
}

function pickFiles(root: ParentNode, selector: string, names: string[]) {
  const input = root.querySelector<HTMLInputElement>(selector)!;
  const dt = new DataTransfer();
  for (const name of names) dt.items.add(new File(["png"], name, { type: "image/png" }));
  input.files = dt.files;
  input.dispatchEvent(new Event("change"));
}

describe("history-edit dialog: shared photo picker (#161 follow-up)", () => {
  afterEach(() => { delete (window as Android).externalApp; });

  it("browsers: camera + multi-select gallery, no hint", async () => {
    const { el } = await mountHistoryEdit();
    el.openEdit(draft());
    await settle(el);
    expect(el.shadowRoot!.querySelector(CAMERA), "camera picker present").to.exist;
    expect(el.shadowRoot!.querySelector<HTMLInputElement>(GALLERY)!.multiple).to.equal(true);
    expect(el.shadowRoot!.querySelector(".photo-android-hint")).to.equal(null);
  });

  it("Android app: single-select gallery, hint, camera — and each pick is added", async () => {
    (window as Android).externalApp = {};
    const { el, sent } = await mountHistoryEdit();
    const up = stubUpload(["n1", "n2"]);
    try {
      el.openEdit(draft({ photo_doc_ids: ["old"] }));
      await settle(el);
      const gallery = el.shadowRoot!.querySelector<HTMLInputElement>(GALLERY)!;
      expect(gallery.multiple, "no multi-select inside the app").to.equal(false);
      expect(el.shadowRoot!.querySelector(".photo-pick-gallery span")!.textContent!.trim()).to.equal("Choose photo");
      expect(el.shadowRoot!.querySelector(".photo-android-hint")!.textContent).to.contain("one photo per pick");
      expect(el.shadowRoot!.querySelector(CAMERA), "camera picker present").to.exist;
      expect(el.shadowRoot!.querySelector("ms-camera-capture"), "in-app camera wired").to.exist;

      pickFiles(el.shadowRoot!, GALLERY, ["a.png"]);
      await settle(el);
      pickFiles(el.shadowRoot!, GALLERY, ["b.png"]);
      await settle(el);
      expect(up.forms.length).to.equal(2);
      expect(up.forms[0].get("entry_id")).to.equal("e1");
      expect(up.forms[0].get("tags")).to.equal("photo");
      expect(el.shadowRoot!.querySelectorAll(".photo-tile").length).to.equal(3);

      // Removing the pre-existing photo only detaches it; the session's
      // upload is deleted straight away.
      const removes = el.shadowRoot!.querySelectorAll<HTMLElement>(".photo-tile .photo-remove");
      removes[0].click();
      removes[2].click();
      await el.updateComplete;
      const deletes = sent.filter((m) => m.type === "maintenance_supporter/documents/delete").map((m) => m.doc_id);
      expect(deletes).to.deep.equal(["n2"]);
      await (el as unknown as { _save: () => Promise<void> })._save();
      const update = sent.find((m) => m.type === "maintenance_supporter/task/history/update")!;
      expect(update.photo_doc_ids).to.deep.equal(["n1"]);
    } finally {
      up.restore();
    }
  });

  it("a 413 shows the too-large message and the picker stays", async () => {
    const { el } = await mountHistoryEdit();
    const realFetch = window.fetch;
    window.fetch = (async () => ({ ok: false, status: 413, json: async () => ({}) }) as Response) as typeof window.fetch;
    try {
      el.openEdit(draft());
      await settle(el);
      pickFiles(el.shadowRoot!, CAMERA, ["huge.png"]);
      await settle(el);
      expect(el.shadowRoot!.querySelector(".error")!.textContent).to.include("large");
      expect(el.shadowRoot!.querySelectorAll(".photo-tile").length).to.equal(0);
      expect(el.shadowRoot!.querySelector(CAMERA)).to.exist;
    } finally {
      window.fetch = realFetch;
    }
  });
});

describe("documents-section: Android single-select upload (#161 follow-up)", () => {
  afterEach(() => { delete (window as Android).externalApp; });

  async function mountDocs() {
    const { hass } = createMockHass({
      handlers: { "maintenance_supporter/documents/list": () => ({ documents: [] }) },
    });
    const el = await fixture<MaintenanceDocumentsSection>(html`
      <maintenance-documents-section .hass=${hass} .entryId=${"e1"} .canWrite=${true}></maintenance-documents-section>
    `);
    await settle(el);
    return el;
  }

  const uploadInput = (el: MaintenanceDocumentsSection) =>
    el.shadowRoot!.querySelector<HTMLInputElement>('label.btn.primary input[type="file"]')!;

  it("browsers: the upload input stays multi-select; the camera goes through the shared picker", async () => {
    const el = await mountDocs();
    expect(uploadInput(el).multiple).to.equal(true);
    const camera = el.shadowRoot!.querySelector("ms-photo-picker")!;
    expect(camera, "shared camera picker").to.exist;
    expect(camera.querySelector(CAMERA)).to.exist;
    expect(camera.querySelector(".photo-pick-gallery"), "camera only — the upload button is the gallery").to.equal(null);
    expect(el.shadowRoot!.querySelector("ms-camera-capture")).to.equal(null);
  });

  it("Android app: the upload input is single-select, the camera picker wires the in-app viewfinder", async () => {
    (window as Android).externalApp = {};
    const el = await mountDocs();
    expect(uploadInput(el).multiple, "one file per pick inside the app").to.equal(false);
    expect(el.shadowRoot!.querySelector("ms-camera-capture"), "in-app camera wired").to.exist;
    // No "photo" hint on a general document upload — the wording would lie.
    expect(el.shadowRoot!.querySelector(".photo-android-hint")).to.equal(null);
  });

  it("a camera pick uploads with the photo category", async () => {
    const el = await mountDocs();
    const up = stubUpload(["d1"]);
    try {
      pickFiles(el.shadowRoot!, CAMERA, ["shot.png"]);
      await settle(el);
      expect(up.forms.length).to.equal(1);
      expect(up.forms[0].get("tags")).to.equal("photo");
    } finally {
      up.restore();
    }
  });
});
