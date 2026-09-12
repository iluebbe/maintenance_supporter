/**
 * In-app camera (#161 follow-up): the Android Companion app's file chooser
 * ignores `capture=`, so inside the app "Take photo" opens
 * <ms-camera-capture> instead of the native input.
 *
 * Pins: the element opens a viewfinder on getUserMedia (back camera), a
 * shot becomes a JPEG File in `photo-captured` and the stream stops; a
 * refused camera fires `capture-unavailable` and renders nothing; the
 * complete dialog wires the label click to the overlay only inside the
 * Android app, uploads the captured file through the normal path and
 * falls back to the native input when the camera is unavailable; browsers
 * keep the native input untouched.
 */

import { expect, fixture, html, oneEvent } from "@open-wc/testing";
import "../components/camera-capture.js";
import { inAppCameraPreferred, type MsCameraCapture } from "../components/camera-capture";
import "../components/complete-dialog.js";
import type { MaintenanceCompleteDialog } from "../components/complete-dialog";
import { createMockHass } from "./_test-utils.js";

type Android = { externalApp?: unknown };

/** A live MediaStream from a painted canvas — what a camera would deliver. */
function fakeCamera(): { stream: MediaStream; calls: MediaStreamConstraints[]; restore: () => void } {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 48;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#3a7";
  ctx.fillRect(0, 0, 64, 48);
  const stream = canvas.captureStream(10);
  const calls: MediaStreamConstraints[] = [];
  const md = navigator.mediaDevices;
  const real = md.getUserMedia;
  md.getUserMedia = async (c?: MediaStreamConstraints) => { calls.push(c!); return stream; };
  return { stream, calls, restore: () => { md.getUserMedia = real; } };
}

function refusedCamera(): () => void {
  const md = navigator.mediaDevices;
  const real = md.getUserMedia;
  md.getUserMedia = async () => { throw new DOMException("denied", "NotAllowedError"); };
  return () => { md.getUserMedia = real; };
}

const settle = (ms = 30) => new Promise((r) => setTimeout(r, ms));

describe("ms-camera-capture (#161)", () => {
  it("asks for the back camera, captures a JPEG file and stops the stream", async () => {
    const cam = fakeCamera();
    try {
      const el = await fixture<MsCameraCapture>(html`<ms-camera-capture .lang=${"en"}></ms-camera-capture>`);
      expect(el.shadowRoot!.querySelector(".overlay"), "closed until opened").to.equal(null);
      await el.open();
      await el.updateComplete;
      expect((cam.calls[0].video as MediaTrackConstraints).facingMode).to.deep.equal({ ideal: "environment" });
      const video = el.shadowRoot!.querySelector("video")!;
      expect(video.srcObject).to.equal(cam.stream);
      expect(el.shadowRoot!.querySelector(".shoot")!.textContent).to.contain("Capture");
      await settle(150); // let a frame arrive
      const captured = oneEvent(el, "photo-captured");
      el.shadowRoot!.querySelector<HTMLButtonElement>(".shoot")!.click();
      const file = (await captured).detail.file as File;
      expect(file).to.be.instanceOf(File);
      expect(file.type).to.equal("image/jpeg");
      expect(file.name).to.match(/^photo-\d{8}T\d{6}\.jpg$/);
      expect(file.size).to.be.greaterThan(0);
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector(".overlay"), "closed after the shot").to.equal(null);
      expect(cam.stream.getTracks().every((t) => t.readyState === "ended"), "tracks stopped").to.equal(true);
    } finally {
      cam.restore();
    }
  });

  it("cancel closes and stops the stream without a photo", async () => {
    const cam = fakeCamera();
    try {
      const el = await fixture<MsCameraCapture>(html`<ms-camera-capture></ms-camera-capture>`);
      let shots = 0;
      el.addEventListener("photo-captured", () => shots++);
      await el.open();
      await el.updateComplete;
      el.shadowRoot!.querySelector<HTMLButtonElement>(".cancel")!.click();
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector(".overlay")).to.equal(null);
      expect(shots).to.equal(0);
      expect(cam.stream.getTracks().every((t) => t.readyState === "ended")).to.equal(true);
    } finally {
      cam.restore();
    }
  });

  it("a refused camera fires capture-unavailable and shows nothing", async () => {
    const restore = refusedCamera();
    try {
      const el = await fixture<MsCameraCapture>(html`<ms-camera-capture></ms-camera-capture>`);
      const unavailable = oneEvent(el, "capture-unavailable");
      void el.open();
      expect((await unavailable).detail.reason).to.equal("NotAllowedError");
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector(".overlay")).to.equal(null);
    } finally {
      restore();
    }
  });

  it("inAppCameraPreferred: only inside the Android app", () => {
    expect(inAppCameraPreferred(), "a browser keeps the native input").to.equal(false);
    (window as Android).externalApp = {};
    try {
      expect(inAppCameraPreferred()).to.equal(true);
    } finally {
      delete (window as Android).externalApp;
    }
  });
});

describe("complete dialog: in-app camera inside the Android app (#161)", () => {
  async function mountDialog() {
    const { hass } = createMockHass({ handlers: { "maintenance_supporter/task/complete": () => ({ success: true }) } });
    const el = await fixture<MaintenanceCompleteDialog>(html`
      <maintenance-complete-dialog .hass=${hass} .entryId=${"entry1"} .taskId=${"task1"} .taskName=${"Filter"} .lang=${"en"}></maintenance-complete-dialog>
    `);
    el.open();
    await el.updateComplete;
    return el;
  }

  function stubUpload() {
    const realFetch = window.fetch;
    const uploads: File[] = [];
    window.fetch = (async (_url: RequestInfo | URL, init?: RequestInit) => {
      uploads.push((init!.body as FormData).get("file") as File);
      return { ok: true, status: 200, json: async () => ({ id: `doc-${uploads.length}`, deduped: false }) } as Response;
    }) as typeof window.fetch;
    return { uploads, restore: () => { window.fetch = realFetch; } };
  }

  afterEach(() => { delete (window as Android).externalApp; });

  it("browsers: no overlay element, the label keeps its native input behaviour", async () => {
    const el = await mountDialog();
    expect(el.shadowRoot!.querySelector("ms-camera-capture")).to.equal(null);
    const label = el.shadowRoot!.querySelector<HTMLLabelElement>(".photo-pick-camera")!;
    const ev = new MouseEvent("click", { bubbles: true, cancelable: true });
    label.dispatchEvent(ev);
    expect(ev.defaultPrevented, "native input click not intercepted").to.equal(false);
  });

  it("Android app: the label opens the viewfinder and a shot uploads through the photo path", async () => {
    (window as Android).externalApp = {};
    const cam = fakeCamera();
    const up = stubUpload();
    try {
      const el = await mountDialog();
      const overlay = el.shadowRoot!.querySelector<MsCameraCapture>("ms-camera-capture")!;
      expect(overlay, "overlay element rendered inside the app").to.exist;
      const label = el.shadowRoot!.querySelector<HTMLLabelElement>(".photo-pick-camera")!;
      const ev = new MouseEvent("click", { bubbles: true, cancelable: true });
      label.dispatchEvent(ev);
      expect(ev.defaultPrevented, "native picker suppressed").to.equal(true);
      await settle(150);
      await overlay.updateComplete;
      expect(overlay.shadowRoot!.querySelector("video")!.srcObject).to.equal(cam.stream);
      overlay.shadowRoot!.querySelector<HTMLButtonElement>(".shoot")!.click();
      await settle(150);
      await el.updateComplete;
      expect(up.uploads.length).to.equal(1);
      expect(up.uploads[0].type).to.equal("image/jpeg");
      expect(el.shadowRoot!.querySelectorAll(".photo-preview img").length, "tile shown").to.equal(1);
    } finally {
      up.restore();
      cam.restore();
    }
  });

  it("Android app without a camera: falls back to the native input and stays there", async () => {
    (window as Android).externalApp = {};
    const restore = refusedCamera();
    try {
      const el = await mountDialog();
      const input = el.shadowRoot!.querySelector<HTMLInputElement>(".photo-pick-camera input")!;
      let nativeClicks = 0;
      input.addEventListener("click", (e) => { nativeClicks++; e.preventDefault(); });
      const label = el.shadowRoot!.querySelector<HTMLLabelElement>(".photo-pick-camera")!;
      label.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
      await settle(50);
      await el.updateComplete;
      expect(nativeClicks, "native input opened instead").to.equal(1);
      expect(el.shadowRoot!.querySelector("ms-camera-capture"), "overlay retired for this dialog").to.equal(null);
      const again = new MouseEvent("click", { bubbles: true, cancelable: true });
      label.dispatchEvent(again);
      expect(again.defaultPrevented, "label now behaves natively").to.equal(false);
    } finally {
      restore();
    }
  });
});
