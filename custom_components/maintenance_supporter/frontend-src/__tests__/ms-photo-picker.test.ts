/**
 * <ms-photo-picker> (#161): the shared "Take photo" / "Choose photos" pair.
 *
 * Pins: browsers get a multi-select gallery input and "Choose photos"; the
 * Android Companion app (window.externalApp) gets a single-select input,
 * "Choose photo" and the one-per-pick hint; a native pick and an in-app
 * shot both arrive as `files-picked`; inside the app the camera label opens
 * <ms-camera-capture> and falls back to the native input when the camera
 * is refused; compact mode keeps the text in aria-label/title only.
 */

import { expect, fixture, html, oneEvent } from "@open-wc/testing";
import "../components/ms-photo-picker.js";
import type { MsPhotoPicker } from "../components/ms-photo-picker";
import type { MsCameraCapture } from "../components/camera-capture";

type Android = { externalApp?: unknown };

const CAMERA = '.photo-pick-camera input[type="file"]';
const GALLERY = '.photo-pick-gallery input[type="file"]';

const settle = (ms = 30) => new Promise((r) => setTimeout(r, ms));

function refusedCamera(): () => void {
  const md = navigator.mediaDevices;
  const real = md.getUserMedia;
  md.getUserMedia = async () => { throw new DOMException("denied", "NotAllowedError"); };
  return () => { md.getUserMedia = real; };
}

function fakeCamera(): { stream: MediaStream; restore: () => void } {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 24;
  canvas.getContext("2d")!.fillRect(0, 0, 32, 24);
  const stream = canvas.captureStream(10);
  const md = navigator.mediaDevices;
  const real = md.getUserMedia;
  md.getUserMedia = async () => stream;
  return { stream, restore: () => { md.getUserMedia = real; } };
}

async function mount(attrs: Partial<MsPhotoPicker> = {}) {
  const el = await fixture<MsPhotoPicker>(html`<ms-photo-picker .lang=${"en"}></ms-photo-picker>`);
  Object.assign(el, attrs);
  await el.updateComplete;
  return el;
}

function pick(el: MsPhotoPicker, selector: string, names: string[]) {
  const input = el.querySelector<HTMLInputElement>(selector)!;
  const dt = new DataTransfer();
  for (const name of names) dt.items.add(new File(["png"], name, { type: "image/png" }));
  input.files = dt.files;
  input.dispatchEvent(new Event("change"));
}

describe("ms-photo-picker (#161)", () => {
  afterEach(() => { delete (window as Android).externalApp; });

  it("renders into the light DOM: camera + multi-select gallery in a browser, no hint", async () => {
    const el = await mount();
    expect(el.shadowRoot, "no shadow root — the host styles the markup").to.equal(null);
    expect(el.querySelector(CAMERA), "camera input").to.exist;
    expect(el.querySelector<HTMLInputElement>(CAMERA)!.getAttribute("capture")).to.equal("environment");
    expect(el.querySelector<HTMLInputElement>(GALLERY)!.multiple, "browsers keep multi-select").to.equal(true);
    expect(el.querySelector(".photo-pick-gallery span")!.textContent!.trim()).to.equal("Choose photos");
    expect(el.querySelector(".photo-pick-camera span")!.textContent!.trim()).to.equal("Take photo");
    expect(el.querySelector(".photo-android-hint")).to.equal(null);
    expect(el.querySelector("ms-camera-capture"), "no in-app camera outside the app").to.equal(null);
  });

  it("Android app: single-select gallery, 'Choose photo' and the one-per-pick hint", async () => {
    (window as Android).externalApp = {};
    const el = await mount();
    expect(el.querySelector<HTMLInputElement>(GALLERY)!.multiple).to.equal(false);
    expect(el.querySelector(".photo-pick-gallery span")!.textContent!.trim()).to.equal("Choose photo");
    expect(el.querySelector(".photo-android-hint")!.textContent).to.contain("one photo per pick");
    expect(el.querySelector("ms-camera-capture"), "in-app camera wired inside the app").to.exist;
  });

  it("emits files-picked for a native pick and clears the input for a re-pick", async () => {
    const el = await mount();
    const picked = oneEvent(el, "files-picked");
    pick(el, GALLERY, ["a.png", "b.png"]);
    const files = (await picked).detail.files as File[];
    expect(files.map((f) => f.name)).to.deep.equal(["a.png", "b.png"]);
    expect(el.querySelector<HTMLInputElement>(GALLERY)!.value).to.equal("");
    const again = oneEvent(el, "files-picked");
    pick(el, CAMERA, ["shot.png"]);
    expect(((await again).detail.files as File[]).length).to.equal(1);
  });

  it("busy: inputs locked, the camera label says Uploading; remaining 0 renders nothing", async () => {
    const el = await mount({ busy: true });
    expect(el.querySelector<HTMLInputElement>(CAMERA)!.disabled).to.equal(true);
    expect(el.querySelector<HTMLInputElement>(GALLERY)!.disabled).to.equal(true);
    expect(el.querySelector(".photo-pick-camera span")!.textContent).to.contain("Uploading");
    expect(el.querySelector(".photo-pick-camera")!.classList.contains("disabled")).to.equal(true);
    el.busy = false;
    el.remaining = 0;
    await el.updateComplete;
    expect(el.querySelector(".photo-pick"), "nothing to pick with at the cap").to.equal(null);
  });

  it("compact + camera only: icon label with aria-label/title, no gallery", async () => {
    const el = await mount({ compact: true, showGallery: false });
    const label = el.querySelector<HTMLLabelElement>(".photo-pick-camera")!;
    expect(label.querySelector("span"), "no visible text").to.equal(null);
    expect(label.getAttribute("aria-label")).to.equal("Take photo");
    expect(label.getAttribute("title")).to.equal("Take photo");
    expect(el.querySelector(".photo-pick-gallery")).to.equal(null);
    expect(el.querySelector(".photo-android-hint")).to.equal(null);
  });

  it("Enter on a label opens its file input (keyboard a11y)", async () => {
    const el = await mount();
    const input = el.querySelector<HTMLInputElement>(GALLERY)!;
    let clicks = 0;
    input.addEventListener("click", (e) => { clicks++; e.preventDefault(); });
    el.querySelector<HTMLLabelElement>(".photo-pick-gallery")!
      .dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(clicks).to.equal(1);
  });

  it("Android app: the camera label opens the in-app viewfinder and a shot becomes files-picked", async () => {
    (window as Android).externalApp = {};
    const cam = fakeCamera();
    try {
      const el = await mount();
      const overlay = el.querySelector<MsCameraCapture>("ms-camera-capture")!;
      const ev = new MouseEvent("click", { bubbles: true, cancelable: true });
      el.querySelector<HTMLLabelElement>(".photo-pick-camera")!.dispatchEvent(ev);
      expect(ev.defaultPrevented, "native picker suppressed").to.equal(true);
      await settle(150);
      await overlay.updateComplete;
      expect(overlay.shadowRoot!.querySelector("video")!.srcObject).to.equal(cam.stream);
      const picked = oneEvent(el, "files-picked");
      overlay.shadowRoot!.querySelector<HTMLButtonElement>(".shoot")!.click();
      const files = (await picked).detail.files as File[];
      expect(files.length).to.equal(1);
      expect(files[0].type).to.equal("image/jpeg");
    } finally {
      cam.restore();
    }
  });

  it("Android app without a camera: falls back to the native input and stays there", async () => {
    (window as Android).externalApp = {};
    const restore = refusedCamera();
    try {
      const el = await mount();
      const input = el.querySelector<HTMLInputElement>(CAMERA)!;
      let nativeClicks = 0;
      input.addEventListener("click", (e) => { nativeClicks++; e.preventDefault(); });
      const label = el.querySelector<HTMLLabelElement>(".photo-pick-camera")!;
      label.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
      await settle(50);
      await el.updateComplete;
      expect(nativeClicks, "native input opened instead").to.equal(1);
      expect(el.querySelector("ms-camera-capture"), "overlay retired").to.equal(null);
      const again = new MouseEvent("click", { bubbles: true, cancelable: true });
      label.dispatchEvent(again);
      expect(again.defaultPrevented, "label now behaves natively").to.equal(false);
    } finally {
      restore();
    }
  });
});
