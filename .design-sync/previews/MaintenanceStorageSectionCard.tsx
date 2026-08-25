/** MaintenanceStorageSectionCard — document-storage footprint: totals with
 * dedup savings, per-object drill-down, and cross-object document search.
 *
 * The kit's documents/storage handler returns the panel quota shape
 * ({used_bytes, max_bytes}); this card reads the storage-summary shape
 * ({total_bytes, dedup_savings_bytes, file_count, link_count, by_object}),
 * so the stories override the handler. */
import * as React from "react";
import { dsDemoHass, dsProps, DS_DEMO } from "maintenance-supporter-frontend";

const SUMMARY = {
  total_bytes: 48_700_000,
  dedup_savings_bytes: 6_200_000,
  file_count: 14,
  link_count: 5,
  document_count: 19,
  by_object: {
    obj_demo_hvac: { bytes: 32_100_000, files: 8, links: 2 },
    obj_demo_vacuum: { bytes: 12_400_000, files: 4, links: 1 },
    obj_demo_pool: { bytes: 4_200_000, files: 2, links: 2 },
  },
};

const storageHass = () =>
  dsDemoHass({
    handlers: { "maintenance_supporter/documents/storage": () => SUMMARY },
  });

const base = () => ({ hass: storageHass(), objects: DS_DEMO.OBJECTS });

export const Collapsed = () => (
  <maintenance-storage-section-card
    ref={dsProps(base())}
    style={{ display: "block", width: 460 }}
  />
);

export const Expanded = () => (
  <maintenance-storage-section-card
    ref={dsProps({ ...base(), _expanded: true })}
    style={{ display: "block", width: 460 }}
  />
);

export const SearchResults = () => (
  <maintenance-storage-section-card
    ref={dsProps({
      ...base(),
      _expanded: true,
      _query: "manual",
      _results: [
        { id: "doc_manual", entry_id: "demo_hvac", object_name: "HVAC Unit", kind: "file", title: "FTXM35 owner's manual", filename: "ftxm35-manual.pdf", size: 2_400_000 },
        { id: "doc_vac_manual", entry_id: "demo_vacuum", object_name: "Robot Vacuum", kind: "file", title: "S8 Pro user manual", filename: "s8-pro-manual.pdf", size: 1_800_000 },
        { id: "doc_guide", entry_id: "demo_hvac", object_name: "HVAC Unit", kind: "weblink", title: "Manual filter cleaning guide", url: "https://example.com/filter-guide" },
      ],
    })}
    style={{ display: "block", width: 460 }}
  />
);
