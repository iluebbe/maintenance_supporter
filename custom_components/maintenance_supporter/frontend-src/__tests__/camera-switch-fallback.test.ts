/**
 * #161 follow-up: the WebView lists two cameras but refuses every deviceId.
 * The switch then asks by facing mode (the id-less request phones honour),
 * and when nothing else answers the previous camera comes back with a note
 * and the details a bug report needs (copyable — the reporter's phone is the
 * only place the real refusal can be seen).
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/camera-capture.js";
import type { MsCameraCapture } from "../components/camera-capture";
import { LS_KEYS } from "../helpers/storage-keys.js";

const FAST = { retryMs: 5, windowMs: 40 };

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

const settle = (ms = 30) => new Promise((r) => setTimeout(r, ms));

describe("camera lens switch fallback (#161)", () => {
  const md = navigator.mediaDevices;
  const realGum = md.getUserMedia;
  const realEnum = md.enumerateDevices;
  beforeEach(() => localStorage.removeItem(LS_KEYS.cameraLabel));
  afterEach(() => { md.getUserMedia = realGum; md.enumerateDevices = realEnum; localStorage.removeItem(LS_KEYS.cameraLabel); });

  async function mount(gum: (c: MediaStreamConstraints) => Promise<MediaStream>) {
    md.getUserMedia = async (c?: MediaStreamConstraints) => gum(c!);
    md.enumerateDevices = async () => unlabeled(["a", "b"]);
    const el = await fixture<MsCameraCapture>(html`<ms-camera-capture .lang=${"en"}></ms-camera-capture>`);
    el.timing = FAST;
    await el.open();
    await el.updateComplete;
    return el;
  }
  const tap = async (el: MsCameraCapture, ms = 30) => {
    el.shadowRoot!.querySelector<HTMLButtonElement>("button.switch")!.click();
    await settle(ms);
    await el.updateComplete;
  };

  it("falls back to the opposite facing mode when every id is refused outright", async () => {
    const back = stream("", "environment"), front = stream("", "user");
    const asked: MediaTrackConstraints[] = [];
    const el = await mount(async (c) => {
      const v = c.video as MediaTrackConstraints;
      asked.push(v);
      if (v.deviceId) throw new DOMException("OverconstrainedError", "OverconstrainedError");
      const fm = v.facingMode as { exact?: string; ideal?: string } | undefined;
      if (fm?.exact === "user" || fm?.ideal === "user") return front;
      return fm?.exact === "environment" || fm?.ideal === "environment" ? stream("", "environment") : back;
    });
    await tap(el);
    expect(el.shadowRoot!.querySelector("video")!.srcObject).to.equal(front);
    expect(asked.some((v) => (v.facingMode as { exact?: string })?.exact === "user"), "asked by facing").to.equal(true);
    expect(el.shadowRoot!.querySelector(".switch-note")).to.equal(null);
    // a second tap goes back the other way
    await tap(el);
    const now = el.shadowRoot!.querySelector("video")!.srcObject as MediaStream;
    expect(now.getVideoTracks()[0].getSettings().facingMode).to.equal("environment");
    expect(front.getTracks().every((t) => t.readyState === "ended"), "front stream released").to.equal(true);
    el.close();
  });

  it("says so on screen, with the details, when nothing else answers — and the previous camera comes back", async () => {
    const back = stream("", "environment");
    const reopened = stream("", "environment");
    let opened = false;
    const el = await mount(async (c) => {
      if (!opened) { opened = true; return back; }
      const fm = (c.video as MediaTrackConstraints).facingMode as { ideal?: string } | undefined;
      if (fm?.ideal === "environment") return reopened; // the restore request
      throw new DOMException("Could not start video source", "NotReadableError");
    });
    await tap(el, FAST.windowMs + 60);
    const note = el.shadowRoot!.querySelector(".switch-note");
    expect(note, "hint rendered").to.exist;
    expect(note!.textContent).to.contain("This camera did not answer");
    expect(el.shadowRoot!.querySelector("video")!.srcObject, "previous camera reopened").to.equal(reopened);
    const details = el.shadowRoot!.querySelector<HTMLTextAreaElement>(".details textarea")!.value;
    expect(details).to.contain("NotReadableError: Could not start video source");
    expect(details).to.contain("facing environment (back again) → ok");
    expect(details.split("\n")[0], "first line: the browser").to.contain(navigator.userAgent);
    expect(el.shadowRoot!.querySelector(".details summary")!.textContent).to.contain("Details for a bug report");
    el.close();
  });

  it("an 'ideal' answer that is the same camera again counts as not switched", async () => {
    const back = stream("", "environment");
    const same = stream("", "environment");
    let opened = false;
    const el = await mount(async (c) => {
      if (!opened) { opened = true; return back; }
      const v = c.video as MediaTrackConstraints;
      const fm = v.facingMode as { exact?: string; ideal?: string } | undefined;
      if (fm?.ideal) return same; // the phone ignores the hint and serves the back camera
      throw new DOMException("OverconstrainedError", "OverconstrainedError");
    });
    await tap(el);
    expect(el.shadowRoot!.querySelector(".switch-note"), "no pretend success").to.exist;
    expect(el.shadowRoot!.querySelector("video")!.srcObject).to.equal(same);
    el.close();
  });

  it("gives up visibly (capture-unavailable) when even the previous camera does not come back", async () => {
    const back = stream("", "environment");
    let opened = false;
    const el = await mount(async () => {
      if (!opened) { opened = true; return back; }
      throw new DOMException("Could not start video source", "NotReadableError");
    });
    let reason = "";
    el.addEventListener("capture-unavailable", (e) => { reason = (e as CustomEvent<{ reason: string }>).detail.reason; });
    await tap(el, 2 * FAST.windowMs + 80);
    expect(reason).to.equal("camera_lost");
    expect(el.shadowRoot!.querySelector(".overlay"), "viewfinder closed — the caller falls back to the native input").to.equal(null);
  });

  it("Copy puts the details on the clipboard", async () => {
    let opened = false;
    const el = await mount(async (c) => {
      if (!opened) { opened = true; return stream("", "environment"); }
      const fm = (c.video as MediaTrackConstraints).facingMode as { ideal?: string } | undefined;
      if (fm?.ideal === "environment") return stream("", "environment");
      throw new DOMException("Could not start video source", "NotReadableError");
    });
    await tap(el, FAST.windowMs + 60);
    const clip = navigator.clipboard as Clipboard & { writeText: (s: string) => Promise<void> };
    const real = clip.writeText;
    let copied = "";
    clip.writeText = async (s: string) => { copied = s; };
    try {
      const btn = el.shadowRoot!.querySelector<HTMLButtonElement>(".details .copy")!;
      expect(btn.textContent!.trim()).to.equal("Copy");
      btn.click();
      await settle(10);
      await el.updateComplete;
      expect(copied).to.equal(el.shadowRoot!.querySelector<HTMLTextAreaElement>(".details textarea")!.value);
      expect(copied).to.contain("NotReadableError");
      expect(btn.textContent!.trim()).to.equal("Copied");
    } finally {
      clip.writeText = real;
    }
    el.close();
  });
});

/**
 * #161, reported 2026-09-20 on a phone with four cameras: the counter stayed
 * at 3/4, a tap only flickered and the picture stayed at 0.5×. Such phones
 * open ONE camera at a time — every request made while the current stream
 * still ran failed. The camera is released before the next one is asked for
 * (the longer story, and the phone that also HOLDS a released camera for a
 * moment, is camera-hal-busy.test.ts).
 */
describe("camera switch on a one-camera-at-a-time phone (#161)", () => {
  const md = navigator.mediaDevices;
  const realGum = md.getUserMedia;
  const realEnum = md.enumerateDevices;
  beforeEach(() => localStorage.removeItem(LS_KEYS.cameraLabel));
  afterEach(() => { md.getUserMedia = realGum; md.enumerateDevices = realEnum; localStorage.removeItem(LS_KEYS.cameraLabel); });

  const labeled = (labels: Array<[string, string]>): MediaDeviceInfo[] =>
    labels.map(([deviceId, label]) => ({ kind: "videoinput", deviceId, label, groupId: "", toJSON() { return {}; } }) as MediaDeviceInfo);

  it("opens on the main back module and every tap moves to the next camera", async () => {
    const live: MediaStream[] = [];
    const served: string[] = [];
    md.getUserMedia = async (c?: MediaStreamConstraints) => {
      if (live.some((s) => s.getTracks().some((t) => t.readyState === "live"))) {
        throw new DOMException("Could not start video source", "NotReadableError");
      }
      const v = c!.video as MediaTrackConstraints;
      const id = (v.deviceId as { exact?: string } | undefined)?.exact ?? "c2"; // "environment" → the ultra-wide
      const s = stream(id, id === "c1" ? "user" : "environment");
      live.push(s);
      served.push(id);
      return s;
    };
    md.enumerateDevices = async () =>
      labeled([
        ["c0", "camera2 0, facing back"],
        ["c1", "camera2 1, facing front"],
        ["c2", "camera2 2, facing back"],
        ["c3", "camera2 3, facing back"],
      ]);
    const el = await fixture<MsCameraCapture>(html`<ms-camera-capture .lang=${"en"}></ms-camera-capture>`);
    el.timing = FAST;
    await el.open();
    await el.updateComplete;
    const pos = () => el.shadowRoot!.querySelector(".switch-pos")!.textContent!.trim();
    expect(served, "labels readable: the main module directly, the ultra-wide never opened").to.deep.equal(["c0"]);
    expect(pos()).to.equal("1/4");
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>("button.switch")!;
    for (const [want, at] of [["c1", "2/4"], ["c2", "3/4"], ["c3", "4/4"], ["c0", "1/4"]]) {
      btn.click();
      await settle();
      await el.updateComplete;
      expect(served[served.length - 1]).to.equal(want);
      expect(pos()).to.equal(at);
      expect(el.shadowRoot!.querySelector(".switch-note"), "no failure note").to.equal(null);
    }
    expect(live.filter((s) => s.getTracks().some((t) => t.readyState === "live")).length, "one camera open at a time").to.equal(1);
    el.close();
  });
});
