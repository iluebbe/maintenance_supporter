/** MaintenanceHistoryPhoto — completion-photo thumbnail in the history
 * timeline. The component mints a signed path via auth/sign_path and points
 * an <img> at it; the demo hass answers with a data-URI so the thumbnail
 * actually renders. The second cell shows the pre-signature placeholder. */
import * as React from "react";
import { dsDemoHass, dsProps } from "maintenance-supporter-frontend";

const PHOTO_SVG =
  "<svg xmlns='http://www.w3.org/2000/svg' width='320' height='240'>" +
  "<rect width='320' height='240' fill='#eceff1'/>" +
  "<rect x='24' y='20' width='272' height='200' rx='10' fill='#fafafa' stroke='#b0bec5' stroke-width='3'/>" +
  "<rect x='44' y='48' width='232' height='132' rx='4' fill='#cfd8dc'/>" +
  Array.from({ length: 9 }, (_, i) => `<line x1='${56 + i * 26}' y1='48' x2='${56 + i * 26}' y2='180' stroke='#90a4ae' stroke-width='4'/>`).join("") +
  "<rect x='44' y='190' width='120' height='10' rx='5' fill='#b0bec5'/>" +
  "</svg>";
const PHOTO_URI = "data:image/svg+xml;utf8," + encodeURIComponent(PHOTO_SVG);

export const Thumbnail = () => (
  <maintenance-history-photo
    ref={dsProps({
      hass: dsDemoHass({ handlers: { "auth/sign_path": () => ({ path: PHOTO_URI }) } }),
      docId: "doc_photo",
    })}
  />
);

/** Signature still pending (or unavailable backend): the gray placeholder
 * box the timeline shows until the signed URL arrives. */
export const LoadingPlaceholder = () => (
  <maintenance-history-photo
    ref={dsProps({
      // The default demo hass answers auth/sign_path with no path — the
      // component stays on its placeholder rather than a broken image.
      hass: dsDemoHass({ handlers: { "auth/sign_path": () => new Promise(() => undefined) } }),
      docId: "doc_photo",
    })}
  />
);
