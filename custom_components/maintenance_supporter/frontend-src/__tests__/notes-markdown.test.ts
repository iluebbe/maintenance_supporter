/**
 * Markdown notes: renderNotesMarkdown uses HA's <ha-markdown> when the HA
 * frontend has registered it, and falls back to plain text otherwise (this
 * test runner has no HA frontend, so the fallback is the natural first
 * state). ms-textfield's multiline mode carries the same `input` contract.
 *
 * Order matters: the fallback cases run BEFORE we register a stand-in
 * ha-markdown — custom elements cannot be unregistered.
 */

import { expect, fixture, html } from "@open-wc/testing";
import { renderNotesMarkdown } from "../helpers/notes-markdown.js";
import "../components/ms-textfield.js";
import type { MsTextfield } from "../components/ms-textfield";

describe("renderNotesMarkdown", () => {
  it("falls back to plain text when ha-markdown is not registered", async () => {
    expect(customElements.get("ha-markdown")).to.equal(undefined);
    const el = await fixture(html`<div>${renderNotesMarkdown("**raw** text")}</div>`);
    expect(el.querySelector("ha-markdown")).to.equal(null);
    expect(el.textContent).to.contain("**raw** text");
  });

  it("renders nothing for empty notes", async () => {
    const el = await fixture(html`<div>${renderNotesMarkdown("")}${renderNotesMarkdown(null)}</div>`);
    expect(el.textContent!.trim()).to.equal("");
  });

  it("hands the raw source to <ha-markdown> once the element exists", async () => {
    class FakeHaMarkdown extends HTMLElement {
      public content = "";
    }
    customElements.define("ha-markdown", FakeHaMarkdown);
    const el = await fixture(html`<div>${renderNotesMarkdown("**bold** [x](https://x)")}</div>`);
    const md = el.querySelector("ha-markdown") as FakeHaMarkdown | null;
    expect(md).to.exist;
    expect(md!.content).to.equal("**bold** [x](https://x)");
    expect(md!.hasAttribute("breaks")).to.equal(true);
  });
});

describe("ms-textfield multiline", () => {
  it("renders a textarea that fires the standard input contract", async () => {
    const el = await fixture<MsTextfield>(html`
      <ms-textfield multiline .rows=${4} .value=${"line1\nline2"}></ms-textfield>
    `);
    const ta = el.shadowRoot!.querySelector("textarea")!;
    expect(ta).to.exist;
    expect(el.shadowRoot!.querySelector("input")).to.equal(null);
    expect(ta.rows).to.equal(4);
    expect(ta.value).to.equal("line1\nline2");

    let seen = "";
    el.addEventListener("input", (e) => { seen = (e.target as MsTextfield).value; });
    ta.value = "- a markdown list";
    ta.dispatchEvent(new Event("input"));
    expect(seen).to.equal("- a markdown list");
  });
});
