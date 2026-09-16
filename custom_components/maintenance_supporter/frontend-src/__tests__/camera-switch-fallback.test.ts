/**
 * #161 follow-up: the WebView lists two cameras but refuses every deviceId.
 * The switch then asks by facing mode (the id-less request phones honour),
 * and when that fails too it says so on screen instead of doing nothing.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/camera-capture.js";
import type { MsCameraCapture } from "../components/camera-capture";
import { LS_KEYS } from "../helpers/storage-keys.js";

function stream(deviceId: string, facingMode?: string): MediaStream {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 24;
  canvas.getContext("2d")!.fillRect(0, 0, 32, 24);
  const s = canvas.captureStream(5);
  s.getVideoTracks()[0].getSettings = () => ({ deviceId, facingMode });
  return s;
}

const unlabeled = (ids: string[]): MediaDeviceInfo[] =>
  ids.map((deviceId) => ({ kind: "videoinput", deviceId, label: "", groupId: "", toJSON() { return {}; } }) as MediaDeviceInfo);

describe("camera lens switch fallback (#161)", () => {
  const md = navigator.mediaDevices;
  const realGum = md.getUserMedia;
  const realEnum = md.enumerateDevices;
  beforeEach(() => localStorage.removeItem(LS_KEYS.cameraDevice));
  afterEach(() => { md.getUserMedia = realGum; md.enumerateDevices = realEnum; localStorage.removeItem(LS_KEYS.cameraDevice); });

  async function mount(gum: (c: MediaStreamConstraints) => Promise<MediaStream>) {
    md.getUserMedia = async (c?: MediaStreamConstraints) => gum(c!);
    md.enumerateDevices = async () => unlabeled(["a", "b"]);
    const el = await fixture<MsCameraCapture>(html`<ms-camera-capture .lang=${"en"}></ms-camera-capture>`);
    await el.open();
    await el.updateComplete;
    return el;
  }

  it("falls back to the opposite facing mode when every id refuses", async () => {
    const back = stream("", "environment"), front = stream("", "user");
    const asked: MediaTrackConstraints[] = [];
    const el = await mount(async (c) => {
      const v = c.video as MediaTrackConstraints;
      asked.push(v);
      if (v.deviceId) throw new DOMException("OverconstrainedError", "OverconstrainedError");
      const fm = v.facingMode as { exact?: string; ideal?: string } | undefined;
      if (fm?.exact === "user" || fm?.ideal === "user") return front;
      return back;
    });
    el.shadowRoot!.querySelector<HTMLButtonElement>("button.switch")!.click();
    await new Promise((r) => setTimeout(r, 30));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector("video")!.srcObject).to.equal(front);
    expect(asked.some((v) => (v.facingMode as { exact?: string })?.exact === "user"), "asked by facing").to.equal(true);
    expect(el.shadowRoot!.querySelector(".switch-note")).to.equal(null);
    expect(back.getTracks().every((t) => t.readyState === "ended"), "previous stream released").to.equal(true);
    // a second tap goes back the other way
    el.shadowRoot!.querySelector<HTMLButtonElement>("button.switch")!.click();
    await new Promise((r) => setTimeout(r, 30));
    expect(el.shadowRoot!.querySelector("video")!.srcObject).to.equal(back);
    el.close();
  });

  it("says so on screen when nothing could be switched", async () => {
    const back = stream("", "environment");
    let opened = false;
    const el = await mount(async () => {
      if (!opened) { opened = true; return back; }
      throw new DOMException("NotReadableError", "NotReadableError");
    });
    el.shadowRoot!.querySelector<HTMLButtonElement>("button.switch")!.click();
    await new Promise((r) => setTimeout(r, 30));
    await el.updateComplete;
    const note = el.shadowRoot!.querySelector(".switch-note");
    expect(note, "hint rendered").to.exist;
    expect(note!.textContent).to.contain("No other camera answered");
    expect(el.shadowRoot!.querySelector("video")!.srcObject, "stream kept").to.equal(back);
    el.close();
  });
});
