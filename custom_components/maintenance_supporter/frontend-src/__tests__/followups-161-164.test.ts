/**
 * #161 follow-up: the in-app viewfinder prefers the MAIN back camera over the
 * ultra-wide module (Android hands the wide one out for "environment" on some
 * phones — the viewfinder opened at 0.5×) and asks for 1× zoom when the track
 * exposes a zoom range starting below 1.
 *
 * #164 follow-up: a document's description shows under its title in the
 * task's document list and, behind the "Document descriptions" print switch,
 * next to the task's linked documents in the service booklet.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/camera-capture.js";
import type { MsCameraCapture } from "../components/camera-capture";
import "../components/task-documents.js";
import { buildServiceRecordHtml, DEFAULT_INCLUDE, type ServiceRecordData, type ServiceRecordLabels } from "../helpers/service-record.js";
import { mergeObjectHistory } from "../helpers/object-history.js";
import { createMockHass } from "./_test-utils.js";

function stream(deviceId: string, zoomMin?: number): MediaStream {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 24;
  canvas.getContext("2d")!.fillRect(0, 0, 32, 24);
  const s = canvas.captureStream(5);
  const track = s.getVideoTracks()[0];
  track.getSettings = () => ({ deviceId });
  if (zoomMin !== undefined) {
    (track as unknown as { getCapabilities: () => unknown }).getCapabilities = () => ({ zoom: { min: zoomMin, max: 8 } });
  }
  return s;
}

describe("camera-capture prefers the main back camera (#161)", () => {
  const md = navigator.mediaDevices;
  const realGum = md.getUserMedia;
  const realEnum = md.enumerateDevices;
  afterEach(() => { md.getUserMedia = realGum; md.enumerateDevices = realEnum; });

  it("re-acquires the first back-facing device when the environment stream came from a wide module", async () => {
    const calls: MediaStreamConstraints[] = [];
    const wide = stream("wide", 0.5);
    const main = stream("main", 1);
    const applied: MediaTrackConstraints[] = [];
    main.getVideoTracks()[0].applyConstraints = async (c?: MediaTrackConstraints) => { applied.push(c!); };
    md.getUserMedia = async (c?: MediaStreamConstraints) => {
      calls.push(c!);
      const v = c!.video as MediaTrackConstraints;
      return v.deviceId ? main : wide;
    };
    md.enumerateDevices = async () => [
      { kind: "videoinput", deviceId: "wide", label: "camera2 2, facing back", groupId: "", toJSON() { return {}; } },
      { kind: "videoinput", deviceId: "main", label: "camera2 0, facing back", groupId: "", toJSON() { return {}; } },
      { kind: "videoinput", deviceId: "front", label: "camera2 1, facing front", groupId: "", toJSON() { return {}; } },
    ] as MediaDeviceInfo[];
    const el = await fixture<MsCameraCapture>(html`<ms-camera-capture></ms-camera-capture>`);
    await el.open();
    await el.updateComplete;
    expect(calls.length).to.equal(2);
    expect((calls[1].video as MediaTrackConstraints).deviceId).to.deep.equal({ exact: "main" });
    expect(el.shadowRoot!.querySelector("video")!.srcObject).to.equal(main);
    expect(wide.getTracks().every((t) => t.readyState === "ended"), "wide stream released").to.equal(true);
    expect(applied, "no zoom change needed on the main module (min 1)").to.deep.equal([]);
    el.close();
  });

  it("keeps the stream when there is only one back camera, and asks for 1x when zoom starts below 1", async () => {
    const calls: MediaStreamConstraints[] = [];
    const only = stream("only", 0.5);
    const applied: MediaTrackConstraints[] = [];
    only.getVideoTracks()[0].applyConstraints = async (c?: MediaTrackConstraints) => { applied.push(c!); };
    md.getUserMedia = async (c?: MediaStreamConstraints) => { calls.push(c!); return only; };
    md.enumerateDevices = async () => [
      { kind: "videoinput", deviceId: "only", label: "camera2 0, facing back", groupId: "", toJSON() { return {}; } },
    ] as MediaDeviceInfo[];
    const el = await fixture<MsCameraCapture>(html`<ms-camera-capture></ms-camera-capture>`);
    await el.open();
    expect(calls.length).to.equal(1);
    expect(applied[0], "1x asked for (required spelling first)").to.deep.equal({ zoom: 1 });
    el.close();
  });

  it("survives an enumerateDevices failure", async () => {
    const only = stream("only");
    md.getUserMedia = async () => only;
    md.enumerateDevices = async () => { throw new Error("nope"); };
    const el = await fixture<MsCameraCapture>(html`<ms-camera-capture></ms-camera-capture>`);
    await el.open();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".overlay")).to.exist;
    el.close();
  });
});

describe("document descriptions in the task list and the booklet (#164)", () => {
  it("task document list shows the description under the title", async () => {
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/documents/list": () => ({ documents: [
          { id: "d1", kind: "file", title: "Manual", filename: "manual.pdf", size: 1200, tags: ["manual"], task_ids: ["t1"], task_pages: {}, description: "Chapter 4: descaling" },
          { id: "d2", kind: "file", title: "Receipt", filename: "r.pdf", size: 100, tags: ["receipt"], task_ids: ["t1"], task_pages: {} },
        ] }),
      },
    });
    const el = await fixture<HTMLElement & { updateComplete: Promise<unknown> }>(html`
      <maintenance-task-documents .hass=${hass} .entryId=${"e1"} .taskId=${"t1"}></maintenance-task-documents>
    `);
    await new Promise((r) => setTimeout(r, 30));
    await el.updateComplete;
    const descs = [...el.shadowRoot!.querySelectorAll(".tdoc-desc")].map((n) => n.textContent?.trim());
    expect(descs).to.deep.equal(["Chapter 4: descaling"]);
  });

  it("booklet prints the description behind the switch", () => {
    const labels = new Proxy({} as ServiceRecordLabels, {
      get: (_t, key) => {
        if (key === "entriesLabel") return (n: number) => `${n} entries`;
        if (key === "page") return (n: number) => `Page ${n}`;
        return typeof key === "string" ? key : "";
      },
    });
    const data: ServiceRecordData = {
      objectRef: "8",
      tasks: [{ id: "t1", name: "Descale", ref: "8.1", schedule: null, documents: [{ title: "Manual", page: 12, description: "Chapter 4: descaling" }], qrDataUri: null }],
      photos: {},
      fmtNumber: (n) => String(n),
    };
    const entries = mergeObjectHistory([{ id: "t1", name: "Descale", ref_no: 1, history: [{ timestamp: "2026-02-05T09:00:00+00:00", type: "completed", ref_no: 1, notes: "done" }] }] as never);
    const booklet = (docDescriptions: boolean) => buildServiceRecordHtml(
      { name: "House", manufacturer: null, model: null, serial_number: null, installation_date: null } as never,
      entries, labels, (iso) => iso.slice(0, 10), (m) => `${m} min`, (a) => `${a} €`, "2026-09-13T12:00:00Z",
      { options: { layout: "by_task", include: { ...DEFAULT_INCLUDE, docDescriptions } }, data },
    );
    expect(DEFAULT_INCLUDE.docDescriptions).to.equal(true);
    expect(booklet(true)).to.contain("Chapter 4: descaling");
    expect(booklet(true)).to.contain("Manual (Page 12)");
    expect(booklet(false)).to.not.contain("Chapter 4: descaling");
    expect(booklet(false)).to.contain("Manual (Page 12)");
  });
});
