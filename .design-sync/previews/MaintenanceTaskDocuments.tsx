/** MaintenanceTaskDocuments — the per-task filtered view over the object's
 * document pool: linked rows (with the PDF jump-to-page hint) and the
 * link-existing-document control. */
import * as React from "react";
import { dsDemoHass, dsProps } from "maintenance-supporter-frontend";

const DOCS = [
  {
    id: "doc_manual", kind: "file", title: "FTXM35 owner's manual",
    filename: "ftxm35-manual.pdf", mime: "application/pdf", size: 2400000,
    tags: ["manual"], task_ids: ["t_filter"], task_pages: { t_filter: 12 },
  },
  {
    id: "doc_link", kind: "weblink", title: "Filter cleaning guide",
    url: "https://example.com/filter-guide", task_ids: ["t_filter"],
  },
  {
    id: "doc_warranty", kind: "file", title: "Warranty certificate",
    filename: "warranty.pdf", mime: "application/pdf", size: 96000,
    tags: ["warranty"], task_ids: [],
  },
];

const docsHass = () =>
  dsDemoHass({
    handlers: {
      "maintenance_supporter/documents/list": () => ({ documents: DOCS }),
    },
  });

export const LinkedToTask = () => (
  <maintenance-task-documents
    ref={dsProps({ hass: docsHass(), entryId: "demo_hvac", taskId: "t_filter", canWrite: true })}
    style={{ display: "block", width: 620 }}
  />
);

export const ReadOnly = () => (
  <maintenance-task-documents
    ref={dsProps({ hass: docsHass(), entryId: "demo_hvac", taskId: "t_filter", canWrite: false })}
    style={{ display: "block", width: 620 }}
  />
);
