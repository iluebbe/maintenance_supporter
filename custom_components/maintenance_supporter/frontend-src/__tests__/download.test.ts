/**
 * downloadTextFile must produce a Companion-app-safe download: a `target=_blank`
 * anchor with the right `download` name, appended to the DOM, and the blob URL
 * must NOT be revoked synchronously (an immediate revoke cancels the async
 * download in the HA Companion app's WebView).
 */
import { expect } from "@open-wc/testing";
import { downloadTextFile } from "../helpers/download";

describe("downloadTextFile — Companion-app safe download", () => {
  let created: number;
  let revoked: number;
  let captured: { download: string; target: string; href: string } | null;
  let origCreate: typeof URL.createObjectURL;
  let origRevoke: typeof URL.revokeObjectURL;
  let origAppend: typeof document.body.appendChild;

  beforeEach(() => {
    created = 0;
    revoked = 0;
    captured = null;
    origCreate = URL.createObjectURL;
    origRevoke = URL.revokeObjectURL;
    origAppend = document.body.appendChild.bind(document.body);
    URL.createObjectURL = () => { created++; return "blob:fake-url"; };
    URL.revokeObjectURL = () => { revoked++; };
    document.body.appendChild = ((node: Node) => {
      if (node instanceof HTMLAnchorElement) {
        captured = { download: node.download, target: node.target, href: node.href };
        node.dispatchEvent = () => true; // suppress real navigation in the test
      }
      return origAppend(node as never);
    }) as typeof document.body.appendChild;
  });

  afterEach(() => {
    URL.createObjectURL = origCreate;
    URL.revokeObjectURL = origRevoke;
    document.body.appendChild = origAppend;
  });

  it("uses a target=_blank anchor with the given filename, appended to the DOM", () => {
    downloadTextFile("a,b\n1,2", "objects.csv", "text/csv");
    expect(created).to.equal(1);
    expect(captured).to.not.equal(null);
    expect(captured!.download).to.equal("objects.csv");
    expect(captured!.target).to.equal("_blank");
    expect(captured!.href).to.equal("blob:fake-url");
  });

  it("does NOT revoke the blob URL synchronously", () => {
    downloadTextFile("x", "x.csv", "text/csv");
    expect(revoked).to.equal(0);
  });

  it("cleans up the temporary anchor", () => {
    const before = document.body.querySelectorAll("a").length;
    downloadTextFile("x", "x.csv", "text/csv");
    expect(document.body.querySelectorAll("a").length).to.equal(before);
  });
});
