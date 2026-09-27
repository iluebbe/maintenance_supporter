/**
 * #161, Galaxy S26 Ultra (reported again on v2.92): the counter stayed at
 * 3/4 and the switch said no other camera answered. Android's camera service
 * keeps a released camera registered for a moment after close on such
 * phones: a DIFFERENT camera asked for in that time is refused
 * (ERROR_MAX_CAMERAS_IN_USE — Chromium: NotReadableError "Could not start
 * video source"), while the SAME camera reopens at once (the newest client of
 * the same process wins). v2.92 swept every other camera back to back and
 * then reopened the previous one, never giving the phone that moment.
 *
 * `phone()` below models that camera service; the viewfinder must get
 * through it, and a phone without the delay (Pixel: front + back) must stay
 * at one request per tap with no waiting.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/camera-capture.js";
import type { MsCameraCapture } from "../components/camera-capture";
import { LS_KEYS } from "../helpers/storage-keys.js";

type Cam = [id: string, label: string];

/** What Chromium lists on a Samsung: the front camera, then the back
 *  modules index-descending — the MAIN one (camera2 0) comes last, and
 *  "environment" hands out the ultra-wide one (camera2 2). */
const S26: Cam[] = [
  ["c1", "camera2 1, facing front"],
  ["c3", "camera2 3, facing back"],
  ["c2", "camera2 2, facing back"],
  ["c0", "camera2 0, facing back"],
];
const PIXEL: Cam[] = [
  ["p1", "camera2 1, facing front"],
  ["p0", "camera2 0, facing back"],
];

interface PhoneOpts {
  envId: string;
  frontId: string;
  /** How long a released camera still blocks every OTHER camera. */
  holdMs: number;
  /** Cameras that never open (always "in use"). */
  broken?: string[];
}

function phone(cams: Cam[], opts: PhoneOpts) {
  const md = navigator.mediaDevices;
  const live = new Set<string>();
  const heldUntil = new Map<string, number>();
  const requests: string[] = [];
  let granted = false;
  // Before the first grant the WebView lists no ids and no labels.
  md.enumerateDevices = async () =>
    cams.map(([id, label]) => ({ kind: "videoinput", deviceId: granted ? id : "", label: granted ? label : "", groupId: "", toJSON() { return {}; } }) as MediaDeviceInfo);
  md.getUserMedia = async (c?: MediaStreamConstraints) => {
    const v = c!.video as MediaTrackConstraints;
    const exact = (v.deviceId as { exact?: string } | undefined)?.exact;
    const fm = v.facingMode as { exact?: string; ideal?: string } | undefined;
    const want = exact ?? ((fm?.exact ?? fm?.ideal) === "user" ? opts.frontId : opts.envId);
    requests.push(want);
    const cam = cams.find(([id]) => id === want);
    if (!cam) throw new DOMException("no such camera", "OverconstrainedError");
    const now = performance.now();
    const blocked =
      opts.broken?.includes(want) ||
      [...live].some((id) => id !== want) ||
      [...heldUntil].some(([id, until]) => id !== want && until > now);
    if (blocked) throw new DOMException("Could not start video source", "NotReadableError");
    heldUntil.delete(want);
    granted = true;
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 24;
    canvas.getContext("2d")!.fillRect(0, 0, 32, 24);
    const s = canvas.captureStream(5);
    const track = s.getVideoTracks()[0];
    // Chromium names the track after the camera; the WebView reports no deviceId.
    Object.defineProperty(track, "label", { value: cam[1] });
    track.getSettings = () => ({ deviceId: "", facingMode: cam[1].includes("front") ? "user" : "environment", width: 32, height: 24 });
    const stop = track.stop.bind(track);
    track.stop = () => {
      if (live.delete(want) && opts.holdMs > 0) heldUntil.set(want, performance.now() + opts.holdMs);
      stop();
    };
    live.add(want);
    return s;
  };
  return { requests, live };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function waitFor(cond: () => boolean, ms = 3000): Promise<void> {
  const until = performance.now() + ms;
  while (!cond()) {
    if (performance.now() > until) throw new Error("timed out");
    await sleep(5);
  }
}

describe("camera switch on a phone that holds a released camera (#161, S26 Ultra)", () => {
  const md = navigator.mediaDevices;
  const realGum = md.getUserMedia;
  const realEnum = md.enumerateDevices;
  beforeEach(() => localStorage.removeItem(LS_KEYS.cameraLabel));
  afterEach(() => { md.getUserMedia = realGum; md.enumerateDevices = realEnum; localStorage.removeItem(LS_KEYS.cameraLabel); });

  async function mount(timing: { retryMs: number; windowMs: number }) {
    const el = await fixture<MsCameraCapture>(html`<ms-camera-capture .lang=${"en"}></ms-camera-capture>`);
    el.timing = timing;
    return el;
  }
  const sr = (el: MsCameraCapture) => el.shadowRoot!;
  const pos = (el: MsCameraCapture) => sr(el).querySelector(".switch-pos")!.textContent!.trim();
  /** Until the tap is done: `_busy` flips synchronously in the click handler,
   *  the DOM only on the next render. */
  const settled = (el: MsCameraCapture) => async () => {
    const s = el as unknown as { _busy: boolean; _switching: boolean };
    await waitFor(() => !s._busy && !s._switching);
    await el.updateComplete;
  };

  it("opens on the main camera and every tap reaches the next one", async function () {
    this.timeout(8000);
    const p = phone(S26, { envId: "c2", frontId: "c1", holdMs: 120 });
    const el = await mount({ retryMs: 20, windowMs: 1500 });
    await el.open();
    await el.updateComplete;
    expect(p.requests[0], "first open: environment hands out the ultra-wide").to.equal("c2");
    expect(p.requests.filter((id) => id === "c0").length, "the main camera was waited for, not given up on").to.be.greaterThan(1);
    expect([...p.live]).to.deep.equal(["c0"]);
    expect(pos(el), "main module, last in Chromium's list").to.equal("4/4");
    expect(sr(el).querySelector(".switch-note")).to.equal(null);

    const btn = sr(el).querySelector<HTMLButtonElement>("button.switch")!;
    for (const [want, at] of [["c1", "1/4"], ["c3", "2/4"], ["c2", "3/4"], ["c0", "4/4"]]) {
      btn.click();
      await sleep(40);
      await el.updateComplete;
      expect(sr(el).querySelector(".switching"), `waiting for ${want} is visible`).to.exist;
      await settled(el)();
      expect([...p.live], `one camera open: ${want}`).to.deep.equal([want]);
      expect(pos(el)).to.equal(at);
      expect(sr(el).querySelector(".switch-note"), `no failure note for ${want}`).to.equal(null);
      expect(sr(el).querySelector("video")!.srcObject).to.not.equal(null);
    }
    expect(localStorage.getItem(LS_KEYS.cameraLabel)).to.equal("camera2 0, facing back");
    el.close();
    expect(p.live.size, "closed = released").to.equal(0);

    // Next open in the same app process: labels are readable up front — the
    // remembered camera is asked for directly, the ultra-wide stays asleep.
    const before = p.requests.length;
    const again = await mount({ retryMs: 20, windowMs: 1500 });
    await again.open();
    await again.updateComplete;
    expect(p.requests.slice(before)).to.deep.equal(["c0"]);
    expect(pos(again)).to.equal("4/4");
    again.close();
  });

  it("Pixel (front + back, no delay): one request per tap, no waiting", async function () {
    this.timeout(5000);
    const p = phone(PIXEL, { envId: "p0", frontId: "p1", holdMs: 0 });
    const el = await mount({ retryMs: 500, windowMs: 5000 });
    await el.open();
    await el.updateComplete;
    expect(p.requests, "environment is already the main camera — no second request").to.deep.equal(["p0"]);
    expect(pos(el)).to.equal("2/2");
    const btn = sr(el).querySelector<HTMLButtonElement>("button.switch")!;
    for (const [want, at] of [["p1", "1/2"], ["p0", "2/2"]]) {
      const count = p.requests.length;
      const t0 = performance.now();
      btn.click();
      await settled(el)();
      expect(performance.now() - t0, "no retry pause").to.be.lessThan(400);
      expect(p.requests.slice(count)).to.deep.equal([want]);
      expect(pos(el)).to.equal(at);
    }
    el.close();
    const count = p.requests.length;
    const again = await mount({ retryMs: 500, windowMs: 5000 });
    await again.open();
    expect(p.requests.slice(count)).to.deep.equal(["p0"]);
    again.close();
  });

  it("a camera still busy after the window: the previous one comes back, the details say why, the next tap moves on", async function () {
    this.timeout(5000);
    const p = phone(S26, { envId: "c2", frontId: "c1", holdMs: 30, broken: ["c3"] });
    const el = await mount({ retryMs: 10, windowMs: 120 });
    await el.open();
    await el.updateComplete;
    const btn = sr(el).querySelector<HTMLButtonElement>("button.switch")!;
    btn.click(); // → c1 (front)
    await settled(el)();
    expect(pos(el)).to.equal("1/4");
    btn.click(); // → c3 never answers
    await settled(el)();
    expect([...p.live], "the front camera is back").to.deep.equal(["c1"]);
    expect(pos(el)).to.equal("1/4");
    const note = sr(el).querySelector(".switch-note");
    expect(note, "note shown").to.exist;
    expect(note!.textContent).to.contain("This camera did not answer");
    const details = sr(el).querySelector<HTMLTextAreaElement>(".details textarea")!.value;
    expect(details).to.contain("camera2 3, facing back → NotReadableError: Could not start video source");
    expect(details).to.contain("cameras: camera2 1, facing front | camera2 3, facing back | camera2 2, facing back | camera2 0, facing back");
    btn.click(); // skips c3 → c2
    await settled(el)();
    expect([...p.live]).to.deep.equal(["c2"]);
    expect(pos(el)).to.equal("3/4");
    expect(sr(el).querySelector(".switch-note")).to.equal(null);
    el.close();
  });

  it("Cancel while a switch is waiting releases the camera for good", async function () {
    this.timeout(5000);
    const p = phone(S26, { envId: "c2", frontId: "c1", holdMs: 250 });
    const el = await mount({ retryMs: 20, windowMs: 3000 });
    await el.open();
    await el.updateComplete;
    sr(el).querySelector<HTMLButtonElement>("button.switch")!.click(); // → c1, held back by c0
    await sleep(60);
    sr(el).querySelector<HTMLButtonElement>(".cancel")!.click();
    await sleep(400); // past the hold: a still-running retry would now succeed
    expect(p.live.size, "no camera left running").to.equal(0);
    expect(sr(el).querySelector(".overlay")).to.equal(null);
  });

  it("picking a front camera is not remembered as the default", async () => {
    const p = phone(PIXEL, { envId: "p0", frontId: "p1", holdMs: 0 });
    const el = await mount({ retryMs: 20, windowMs: 200 });
    await el.open();
    sr(el).querySelector<HTMLButtonElement>("button.switch")!.click();
    await settled(el)();
    expect([...p.live]).to.deep.equal(["p1"]);
    expect(localStorage.getItem(LS_KEYS.cameraLabel) || "").to.equal("");
    el.close();
  });
});
