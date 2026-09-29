/**
 * A refusal the caller can explain reaches it by its code (bug audit
 * 2026-09-29): a documents ZIP zipped again without its manifest.json used to
 * end in the generic "something went wrong", while the server said exactly
 * what was missing.
 */
import { expect } from "@open-wc/testing";
import { postMultipart } from "../helpers/photo-upload.js";

const hass = { auth: { data: { access_token: "t" } } } as never;

async function refusal(status: number, body: unknown, codes: string[] = []): Promise<string> {
  const original = window.fetch;
  window.fetch = async () => new Response(JSON.stringify(body), { status });
  try {
    await postMultipart(hass, "/x", new FormData(), "too_large", codes);
    return "resolved";
  } catch (e) {
    return (e as Error).message;
  } finally {
    window.fetch = original;
  }
}

describe("postMultipart refusals", () => {
  it("names a code the caller knows", async () => {
    expect(await refusal(400, { code: "docs_archive_no_manifest" }, ["docs_archive_no_manifest"])).to.equal("docs_archive_no_manifest");
  });

  it("keeps the generic failure for any other refusal", async () => {
    expect(await refusal(400, { code: "something_else" }, ["docs_archive_no_manifest"])).to.equal("doc_upload_failed");
    expect(await refusal(500, "not json at all")).to.equal("doc_upload_failed");
    expect(await refusal(413, {})).to.equal("too_large");
  });
});
