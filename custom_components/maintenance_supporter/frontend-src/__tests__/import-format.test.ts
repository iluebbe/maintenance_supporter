/**
 * Settings → Import routes a paste to the CSV or the JSON/YAML importer.
 * Bug audit 2026-10-16: the check was startsWith("object_name"), but the CSV
 * export has started with object_entry_id since 2.100.0, so the panel could
 * not re-import its own CSV ("not valid JSON or YAML").
 */
import { expect } from "@open-wc/testing";
import { isCsvExport } from "../helpers/import-format";

// The head of the header export_objects_csv writes (helpers/csv_handler.py _COLUMNS).
const EXPORT_HEADER =
  "object_entry_id,object_archived_at,object_predecessor_entry_id,object_name,object_manufacturer,task_name";

describe("isCsvExport", () => {
  it("recognises the panel's own CSV export", () => {
    expect(isCsvExport(`${EXPORT_HEADER}\r\nabc,,,Pump,,Filter\r\n`)).to.be.true;
  });

  it("recognises a hand-written CSV that starts with object_name", () => {
    expect(isCsvExport("object_name,task_name\nPump,Filter\n")).to.be.true;
  });

  it("tolerates a spreadsheet's byte-order mark and quoted header cells", () => {
    expect(isCsvExport(`\uFEFF"object_entry_id","object_name","task_name"\nx,Pump,Filter`)).to.be.true;
  });

  it("sends JSON and YAML exports to the structured importer", () => {
    expect(isCsvExport('{"version": 1, "objects": [{"object_name": "Pump"}]}')).to.be.false;
    expect(isCsvExport("[]")).to.be.false;
    expect(isCsvExport("version: 1\nobjects:\n  - object_name: Pump\n")).to.be.false;
  });

  it("does not take a later line's object_name for a header", () => {
    expect(isCsvExport("name,notes\nobject_name,x\n")).to.be.false;
  });
});
