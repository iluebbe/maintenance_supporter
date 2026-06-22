/**
 * Objects-table column catalog + sanitiser (#67). Mirrors the backend
 * sanitise so the panel and Settings UI agree on what's valid.
 */
import { expect } from "@open-wc/testing";
import {
  sanitizeColumns,
  DEFAULT_OBJECTS_TABLE_COLUMNS,
  KNOWN_OBJECT_COLUMNS,
  OBJECT_COLUMNS,
} from "../helpers/object-columns";

describe("sanitizeColumns (#67)", () => {
  it("non-array → defaults", () => {
    expect(sanitizeColumns(undefined)).to.deep.equal(DEFAULT_OBJECTS_TABLE_COLUMNS);
    expect(sanitizeColumns(null)).to.deep.equal(DEFAULT_OBJECTS_TABLE_COLUMNS);
    expect(sanitizeColumns("name")).to.deep.equal(DEFAULT_OBJECTS_TABLE_COLUMNS);
  });

  it("empty / all-unknown → defaults", () => {
    expect(sanitizeColumns([])).to.deep.equal(DEFAULT_OBJECTS_TABLE_COLUMNS);
    expect(sanitizeColumns(["nope", 7, null])).to.deep.equal(DEFAULT_OBJECTS_TABLE_COLUMNS);
  });

  it("drops unknown keys, preserves caller order", () => {
    expect(sanitizeColumns(["name", "bogus", "warranty_expiry"]))
      .to.deep.equal(["name", "warranty_expiry"]);
  });

  it("dedupes", () => {
    expect(sanitizeColumns(["name", "name", "model"]))
      .to.deep.equal(["name", "model"]);
  });

  it("prepends the required name column when missing", () => {
    expect(sanitizeColumns(["warranty_expiry", "model"]))
      .to.deep.equal(["name", "warranty_expiry", "model"]);
  });

  it("accepts a full custom subset unchanged", () => {
    const cols = ["name", "warranty_expiry", "actions"];
    expect(sanitizeColumns(cols)).to.deep.equal(cols);
  });

  it("catalog is internally consistent", () => {
    expect(KNOWN_OBJECT_COLUMNS.length).to.equal(OBJECT_COLUMNS.length);
    for (const c of OBJECT_COLUMNS) {
      expect(c.labelKey, c.key).to.be.a("string").and.not.equal("");
    }
    for (const k of DEFAULT_OBJECTS_TABLE_COLUMNS) {
      expect(KNOWN_OBJECT_COLUMNS, k).to.include(k);
    }
  });
});
