/**
 * #161: the viewfinder's lens switch. Labels are empty in the Android WebView
 * until the app process holds the camera permission, so the switch cycles the
 * browser's video inputs by id, one camera per tap. A pick is remembered by
 * LABEL (the WebView salts device ids per page — a stored id never matched
 * again) and the next open asks for that camera directly. No zoom constraint
 * is sent: the WebView denies pan/tilt/zoom, so it never did anything.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/camera-capture.js";
import type { MsCameraCapture } from "../components/camera-capture";
import { LS_KEYS } from "../helpers/storage-keys.js";

const FAST = { retryMs: 5, windowMs: 40 };

function stream(deviceId: string, label = ""): MediaStream {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 24;
  canvas.getContext("2d")!.fillRect(0, 0, 32, 24);
  const s = canvas.captureStream(5);
  const track = s.getVideoTracks()[0];
  track.getSettings = () => ({ deviceId });
  if (label) Object.defineProperty(track, "label", { value: label });
  return s;
}

const unlabeled = (ids: string[]): MediaDeviceInfo[] =>
  ids.map((deviceId) => ({ kind: "videoinput", deviceId, label: "", groupId: "", toJSON() { return {}; } }) as MediaDeviceInfo);
const labeled = (cams: Array<[string, string]>): MediaDeviceInfo[] =>
  cams.map(([deviceId, label]) => ({ kind: "videoinput", deviceId, label, groupId: "", toJSON() { return {}; } }) as MediaDeviceInfo);

const idOf = (c: MediaStreamConstraints) => ((c.video as MediaTrackConstraints).deviceId as { exact?: string } | undefined)?.exact;
const settle = (ms = 30) => new Promise((r) => setTimeout(r, ms));

describe("camera lens switch (#161)", () => {
  const md = navigator.mediaDevices;
  const realGum = md.getUserMedia;
  const realEnum = md.enumerateDevices;
  beforeEach(() => localStorage.removeItem(LS_KEYS.cameraLabel));
  afterEach(() => { md.getUserMedia = realGum; md.enumerateDevices = realEnum; localStorage.removeItem(LS_KEYS.cameraLabel); });

  async function mount() {
    const el = await fixture<MsCameraCapture>(html`<ms-camera-capture .lang=${"en"}></ms-camera-capture>`);
    el.timing = FAST;
    return el;
  }
  const pos = (el: MsCameraCapture) => el.shadowRoot!.querySelector(".switch-pos")!.textContent!.trim();

  it("cycles the video inputs by id, one request per tap, and asks for no zoom", async () => {
    const calls: MediaStreamConstraints[] = [];
    const served: string[] = [];
    md.getUserMedia = async (c?: MediaStreamConstraints) => {
      calls.push(c!);
      const id = idOf(c!) ?? "a";
      served.push(id);
      return stream(id);
    };
    md.enumerateDevices = async () => unlabeled(["a", "b", "c"]);
    const el = await mount();
    await el.open();
    await el.updateComplete;
    // unlabeled: nothing to prefer — the environment request, and only that
    expect(calls.length).to.equal(1);
    const first = calls[0].video as MediaTrackConstraints & { advanced?: unknown; zoom?: unknown };
    expect(first).to.deep.equal({ facingMode: { ideal: "environment" } });
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>("button.switch")!;
    expect(btn, "switch shown with more than one input").to.exist;
    expect(btn.getAttribute("title")).to.equal("Switch camera");
    const firstStream = el.shadowRoot!.querySelector("video")!.srcObject as MediaStream;
    for (const [want, at] of [["b", "2/3"], ["c", "3/3"], ["a", "1/3"]]) {
      const before = calls.length;
      btn.click();
      await settle();
      await el.updateComplete;
      expect(calls.length - before, "one request per tap").to.equal(1);
      expect(served[served.length - 1]).to.equal(want);
      expect(pos(el)).to.equal(at);
    }
    expect(firstStream.getTracks().every((t) => t.readyState === "ended"), "previous stream released").to.equal(true);
    expect(localStorage.getItem(LS_KEYS.cameraLabel), "no label, nothing to remember").to.equal(null);
    el.close();
  });

  it("remembers the pick by label and asks for it directly next time", async () => {
    const cams: Array<[string, string]> = [["x1", "camera2 1, facing front"], ["x2", "camera2 2, facing back"], ["x0", "camera2 0, facing back"]];
    const calls: MediaStreamConstraints[] = [];
    md.getUserMedia = async (c?: MediaStreamConstraints) => {
      calls.push(c!);
      const id = idOf(c!) ?? "x2";
      return stream("", cams.find(([i]) => i === id)![1]);
    };
    md.enumerateDevices = async () => labeled(cams);
    const el = await mount();
    await el.open();
    await el.updateComplete;
    expect(calls.map(idOf), "labels readable: the main module, directly").to.deep.equal(["x0"]);
    expect(pos(el)).to.equal("3/3");
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>("button.switch")!;
    btn.click(); // → x1 (front: not remembered)
    await settle();
    btn.click(); // → x2
    await settle();
    await el.updateComplete;
    expect(pos(el)).to.equal("2/3");
    expect(localStorage.getItem(LS_KEYS.cameraLabel)).to.equal("camera2 2, facing back");
    el.close();

    calls.length = 0;
    const again = await mount();
    await again.open();
    await again.updateComplete;
    expect(calls.map(idOf)).to.deep.equal(["x2"]);
    expect(pos(again)).to.equal("2/3");
    again.close();

    // the remembered camera is not listed (another phone): the main module
    localStorage.setItem(LS_KEYS.cameraLabel, "camera2 7, facing back");
    calls.length = 0;
    const third = await mount();
    await third.open();
    expect(calls.map(idOf)).to.deep.equal(["x0"]);
    third.close();
  });

  it("falls back to the environment request when the camera asked for directly is refused", async () => {
    const calls: MediaStreamConstraints[] = [];
    md.getUserMedia = async (c?: MediaStreamConstraints) => {
      calls.push(c!);
      if (idOf(c!)) throw new DOMException("no", "OverconstrainedError");
      return stream("", "camera2 0, facing back");
    };
    md.enumerateDevices = async () => labeled([["m", "camera2 0, facing back"], ["f", "camera2 1, facing front"]]);
    const el = await mount();
    await el.open();
    await el.updateComplete;
    expect(calls.length).to.equal(2);
    expect((calls[1].video as MediaTrackConstraints).facingMode).to.deep.equal({ ideal: "environment" });
    expect(el.shadowRoot!.querySelector(".overlay")).to.exist;
    expect(el.shadowRoot!.querySelector(".switch-note"), "the camera we have IS the main one").to.equal(null);
    el.close();
  });

  it("hides the switch with a single input", async () => {
    md.getUserMedia = async () => stream("only");
    md.enumerateDevices = async () => unlabeled(["only"]);
    const el = await mount();
    await el.open();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector("button.switch")).to.equal(null);
    el.close();
  });

  it("cycles by its own index when the track reports no deviceId and no label, and shows the position", async () => {
    let served = "a";
    md.getUserMedia = async (c?: MediaStreamConstraints) => {
      served = idOf(c!) ?? "a";
      return stream("");
    };
    md.enumerateDevices = async () => unlabeled(["a", "b", "c"]);
    const el = await mount();
    await el.open();
    await el.updateComplete;
    expect(pos(el), "position unknown before the first switch").to.equal("?/3");
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>("button.switch")!;
    btn.click();
    await settle();
    await el.updateComplete;
    expect(served).to.equal("a");
    expect(pos(el)).to.equal("1/3");
    btn.click();
    await settle();
    await el.updateComplete;
    expect(served, "advances although the track never reports an id").to.equal("b");
    expect(pos(el)).to.equal("2/3");
    el.close();
  });

  it("a camera that stays busy is left alone for this tap and skipped on the next", async () => {
    const asked: string[] = [];
    md.getUserMedia = async (c?: MediaStreamConstraints) => {
      const id = idOf(c!) ?? "env";
      asked.push(id);
      if (id === "broken") throw new DOMException("Could not start video source", "NotReadableError");
      return stream(id === "env" ? "" : id);
    };
    md.enumerateDevices = async () => unlabeled(["first", "broken", "third"]);
    const el = await mount();
    await el.open();
    await el.updateComplete;
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>("button.switch")!;
    btn.click(); // → first (position unknown → the first listed)
    await settle();
    await el.updateComplete;
    expect(pos(el)).to.equal("1/3");
    btn.click(); // broken never answers → first comes back
    await settle(FAST.windowMs + 60);
    await el.updateComplete;
    expect(asked.filter((id) => id === "broken").length, "retried while the window lasted").to.be.greaterThan(1);
    expect(asked.includes("third"), "no sweep to the next camera in the same tap").to.equal(false);
    expect(asked[asked.length - 1]).to.equal("first");
    expect(pos(el)).to.equal("1/3");
    expect(el.shadowRoot!.querySelector(".switch-note")).to.exist;
    btn.click(); // skips broken
    await settle();
    await el.updateComplete;
    expect(asked[asked.length - 1]).to.equal("third");
    expect(pos(el)).to.equal("3/3");
    expect(el.shadowRoot!.querySelector(".switch-note")).to.equal(null);
    el.close();
  });
});
