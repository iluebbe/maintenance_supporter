/**
 * #161: the viewfinder's lens switch. Labels may be empty in the Android
 * WebView, so the switch cycles the browser's video inputs by id, remembers
 * the pick per browser, and the next open starts on that camera (falling
 * back to the environment camera when the remembered id is gone). The
 * first request already asks for 1× zoom.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/camera-capture.js";
import type { MsCameraCapture } from "../components/camera-capture";
import { LS_KEYS } from "../helpers/storage-keys.js";

function stream(deviceId: string): MediaStream {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 24;
  canvas.getContext("2d")!.fillRect(0, 0, 32, 24);
  const s = canvas.captureStream(5);
  s.getVideoTracks()[0].getSettings = () => ({ deviceId });
  return s;
}

const unlabeled = (ids: string[]): MediaDeviceInfo[] =>
  ids.map((deviceId) => ({ kind: "videoinput", deviceId, label: "", groupId: "", toJSON() { return {}; } }) as MediaDeviceInfo);

describe("camera lens switch (#161)", () => {
  const md = navigator.mediaDevices;
  const realGum = md.getUserMedia;
  const realEnum = md.enumerateDevices;
  beforeEach(() => localStorage.removeItem(LS_KEYS.cameraDevice));
  afterEach(() => { md.getUserMedia = realGum; md.enumerateDevices = realEnum; localStorage.removeItem(LS_KEYS.cameraDevice); });

  it("cycles the video inputs by id and remembers the pick", async () => {
    const calls: MediaStreamConstraints[] = [];
    const streams: Record<string, MediaStream> = { a: stream("a"), b: stream("b"), c: stream("c") };
    md.getUserMedia = async (c?: MediaStreamConstraints) => {
      calls.push(c!);
      const v = c!.video as MediaTrackConstraints;
      const id = (v.deviceId as { exact?: string } | undefined)?.exact;
      return id ? streams[id] : streams.a;
    };
    md.enumerateDevices = async () => unlabeled(["a", "b", "c"]);
    const el = await fixture<MsCameraCapture>(html`<ms-camera-capture .lang=${"en"}></ms-camera-capture>`);
    await el.open();
    await el.updateComplete;
    // first request: environment + 1x zoom hint; unlabeled devices → no heuristic re-acquire
    expect(calls.length).to.equal(1);
    const first = calls[0].video as MediaTrackConstraints & { advanced?: Array<Record<string, unknown>> };
    expect(first.facingMode).to.deep.equal({ ideal: "environment" });
    expect(first.advanced).to.deep.equal([{ zoom: 1 }]);
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>("button.switch")!;
    expect(btn, "switch shown with more than one input").to.exist;
    expect(btn.getAttribute("title")).to.equal("Switch camera");
    btn.click();
    await new Promise((r) => setTimeout(r, 20));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector("video")!.srcObject).to.equal(streams.b);
    expect(localStorage.getItem(LS_KEYS.cameraDevice)).to.equal("b");
    expect(streams.a.getTracks().every((t) => t.readyState === "ended"), "previous stream released").to.equal(true);
    btn.click();
    await new Promise((r) => setTimeout(r, 20));
    expect(localStorage.getItem(LS_KEYS.cameraDevice)).to.equal("c");
    btn.click();
    await new Promise((r) => setTimeout(r, 20));
    expect(localStorage.getItem(LS_KEYS.cameraDevice), "wraps around").to.equal("a");
    el.close();
  });

  it("opens on the remembered camera next time, and falls back when it is gone", async () => {
    localStorage.setItem(LS_KEYS.cameraDevice, "b");
    const calls: MediaStreamConstraints[] = [];
    const b = stream("b");
    md.getUserMedia = async (c?: MediaStreamConstraints) => { calls.push(c!); return b; };
    md.enumerateDevices = async () => unlabeled(["a", "b"]);
    const el = await fixture<MsCameraCapture>(html`<ms-camera-capture></ms-camera-capture>`);
    await el.open();
    await el.updateComplete;
    expect(calls.length).to.equal(1);
    expect((calls[0].video as MediaTrackConstraints).deviceId).to.deep.equal({ exact: "b" });
    expect(el.shadowRoot!.querySelector("video")!.srcObject).to.equal(b);
    el.close();

    // the remembered id refuses (another phone, revoked id) → environment request
    localStorage.setItem(LS_KEYS.cameraDevice, "gone");
    const calls2: MediaStreamConstraints[] = [];
    const env = stream("a");
    md.getUserMedia = async (c?: MediaStreamConstraints) => {
      calls2.push(c!);
      const v = c!.video as MediaTrackConstraints;
      if ((v.deviceId as { exact?: string } | undefined)?.exact === "gone") throw new DOMException("no", "OverconstrainedError");
      return env;
    };
    const el2 = await fixture<MsCameraCapture>(html`<ms-camera-capture></ms-camera-capture>`);
    await el2.open();
    await el2.updateComplete;
    expect(calls2.length).to.equal(2);
    expect((calls2[1].video as MediaTrackConstraints).facingMode).to.deep.equal({ ideal: "environment" });
    expect(el2.shadowRoot!.querySelector(".overlay")).to.exist;
    el2.close();
  });

  it("hides the switch with a single input", async () => {
    md.getUserMedia = async () => stream("only");
    md.enumerateDevices = async () => unlabeled(["only"]);
    const el = await fixture<MsCameraCapture>(html`<ms-camera-capture></ms-camera-capture>`);
    await el.open();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector("button.switch")).to.equal(null);
    el.close();
  });
});
