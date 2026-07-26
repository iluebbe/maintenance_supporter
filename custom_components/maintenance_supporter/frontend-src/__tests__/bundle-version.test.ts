/** Stale-bundle handshake logic (roadmap guard 2). */

import { expect } from "@open-wc/testing";
import { BUNDLE_VERSION, isStaleBundle } from "../helpers/bundle-version.js";

describe("bundle-version handshake", () => {
  it("falls back to 'dev' outside the esbuild pipeline (no define here)", () => {
    expect(BUNDLE_VERSION).to.equal("dev");
  });

  it("dev builds never flag stale (comparison disabled)", () => {
    expect(isStaleBundle("2.40.0", "dev")).to.be.false;
  });

  it("missing server version never flags stale", () => {
    expect(isStaleBundle(null, "2.40.0")).to.be.false;
    expect(isStaleBundle(undefined, "2.40.0")).to.be.false;
    expect(isStaleBundle("", "2.40.0")).to.be.false;
  });

  it("matching versions are not stale; differing versions are", () => {
    expect(isStaleBundle("2.40.0", "2.40.0")).to.be.false;
    expect(isStaleBundle("2.41.0", "2.40.0")).to.be.true;
    // Downgrades count too — the bundle still doesn't match the backend.
    expect(isStaleBundle("2.39.0", "2.40.0")).to.be.true;
  });
});
