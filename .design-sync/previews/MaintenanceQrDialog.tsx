/** MaintenanceQrDialog — QR label sheet for a task (Info + Complete pair)
 * or an object (single Info code).
 * The kit has no handler for `maintenance_supporter/qr/generate`, so this
 * preview provides one returning the backend's shape:
 *   { svg_data_uri, url, label: { object_name, manufacturer, model, task_name } }
 * The SVG is a plausible placeholder QR (three finder patterns + seeded
 * noise), data-URI-encoded exactly like the backend emits it. */
import * as React from "react";
import { dsDemoHass, dsProps } from "maintenance-supporter-frontend";

const qrDataUri = (seed: number): string => {
  const n = 25;
  const c = 8;
  const q = 2 * c; // quiet zone
  const size = n * c + 2 * q;
  let s = seed >>> 0;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  const m: boolean[][] = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => rnd() > 0.55),
  );
  const clear = (ox: number, oy: number) => {
    for (let y = -1; y < 8; y++)
      for (let x = -1; x < 8; x++) {
        const yy = oy + y;
        const xx = ox + x;
        if (yy >= 0 && yy < n && xx >= 0 && xx < n) m[yy][xx] = false;
      }
  };
  const finder = (ox: number, oy: number) => {
    for (let y = 0; y < 7; y++)
      for (let x = 0; x < 7; x++) {
        const ring = x === 0 || y === 0 || x === 6 || y === 6;
        const core = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        m[oy + y][ox + x] = ring || core;
      }
  };
  for (const [ox, oy] of [[0, 0], [n - 7, 0], [0, n - 7]] as const) {
    clear(ox, oy);
    finder(ox, oy);
  }
  const cells = m
    .flatMap((row, y) =>
      row.map((v, x) =>
        v ? `<rect x="${q + x * c}" y="${q + y * c}" width="${c}" height="${c}"/>` : "",
      ),
    )
    .join("");
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">` +
    `<rect width="${size}" height="${size}" fill="#fff"/><g fill="#000">${cells}</g></svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
};

const qrHass = () =>
  dsDemoHass({
    handlers: {
      "maintenance_supporter/qr/generate": (msg) => {
        const complete = msg.action === "complete";
        const forTask = Boolean(msg.task_id);
        const path = forTask
          ? `maintenance-supporter/task/demo_hvac/t_filter${complete ? "?action=complete" : ""}`
          : "maintenance-supporter/object/demo_hvac";
        return {
          svg_data_uri: qrDataUri(forTask ? (complete ? 77 : 41) : 13),
          url: `https://home.example.net/${path}`,
          label: {
            object_name: "HVAC Unit",
            manufacturer: "Daikin",
            model: "FTXM35",
            task_name: forTask ? "Clean air filter" : null,
          },
        };
      },
    },
  });

type QrDialogEl = {
  openForTask: (entryId: string, taskId: string, objectName: string, taskName: string) => void;
  openForObject: (entryId: string, objectName: string) => void;
};

const openWith = (call: (el: QrDialogEl) => void) => (el: unknown) => {
  if (!el) return;
  dsProps({ hass: qrHass(), lang: "en" })(el);
  call(el as QrDialogEl);
};

/** Task view: Info + Complete pair with download buttons and URL-mode toggle. */
export const TaskCodes = () => (
  <maintenance-qr-dialog
    ref={openWith((el) => el.openForTask("demo_hvac", "t_filter", "HVAC Unit", "Clean air filter"))}
  />
);

/** Object view: a single larger Info code. */
export const ObjectCode = () => (
  <maintenance-qr-dialog
    ref={openWith((el) => el.openForObject("demo_hvac", "HVAC Unit"))}
  />
);
