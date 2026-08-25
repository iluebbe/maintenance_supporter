/** MaintenanceDocumentsSection — the object-level document library: upload /
 * camera / add-link actions, category select, and the file + weblink rows.
 * The demo hass answers documents/list; auth/sign_path returns a data-URI so
 * the image document renders a real thumbnail. */
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

const DOCS = [
  {
    id: "doc_manual", kind: "file", title: "FTXM35 owner's manual",
    filename: "ftxm35-manual.pdf", mime: "application/pdf", size: 2400000,
    tags: ["manual"], task_ids: ["t_filter"],
  },
  {
    id: "doc_invoice", kind: "file", title: "Service invoice · March 2026",
    filename: "invoice-2026-03.pdf", mime: "application/pdf", size: 182000,
    tags: ["invoice"], task_ids: [],
  },
  {
    id: "doc_photo", kind: "file", title: "Filter compartment",
    filename: "filter-compartment.jpg", mime: "image/jpeg", size: 512000,
    tags: ["photo"], task_ids: [],
  },
  {
    id: "doc_link", kind: "weblink", title: "Filter cleaning guide",
    url: "https://example.com/filter-guide", task_ids: ["t_filter"],
  },
];

const docsHass = () =>
  dsDemoHass({
    handlers: {
      "maintenance_supporter/documents/list": () => ({ documents: DOCS }),
      "auth/sign_path": () => ({ path: PHOTO_URI }),
    },
  });

export const ObjectLibrary = () => (
  <maintenance-documents-section
    ref={dsProps({ hass: docsHass(), entryId: "demo_hvac", canWrite: true })}
    style={{ display: "block", width: 640 }}
  />
);

export const ReadOnly = () => (
  <maintenance-documents-section
    ref={dsProps({ hass: docsHass(), entryId: "demo_hvac", canWrite: false })}
    style={{ display: "block", width: 640 }}
  />
);
