/**
 * App links (#207): a documentation link, a document's web link or a link in
 * the notes may open an app (obsidian://, onenote:, mailto:). Pins:
 *   - the link rule (helpers/url.ts, twin of helpers/url_safety.py)
 *   - notes: an app link survives HA's sanitiser as a placeholder and gets
 *     its real href back; a blocked one stays dead; code is left alone
 *   - the documents list links an app web link, never a blocked one
 *
 * The stand-in <ha-markdown> below renders like HA's: later than the
 * content is set, into an inner element of its shadow root, and keeping only
 * http(s), mailto, tel and ftp hrefs (what HA's sanitiser keeps).
 */

import { expect, fixture, html } from "@open-wc/testing";
import { cleanLink, isSafeLink, linkScheme } from "../helpers/url";
import { APP_LINK_PLACEHOLDER, protectAppLinks, renderNotesMarkdown, restoreAppLinks } from "../helpers/notes-markdown";
import "../components/documents-section.js";
import type { MaintenanceDocumentsSection } from "../components/documents-section";
import { createMockHass } from "./_test-utils.js";

describe("link rule", () => {
  it("allows http(s) and app links, refuses blocked schemes and relative links", () => {
    for (const ok of ["https://x.test/a", "obsidian://open?vault=Home&file=Boiler", "onenote:https://d.docs.live.net/x/M.one", "mailto:a@b.test", "ftp://x.test/f"]) {
      expect(isSafeLink(ok), ok).to.equal(true);
    }
    for (const bad of ["javascript:alert(1)", "JavaScript:alert(1)", "java\tscript:alert(1)", " \u0001javascript:alert(1)", "data:text/html,x", "vbscript:x", "file:///etc/passwd", "blob:https://x/1", "about:blank", "ms-msdt:/id x", "search-ms:query=x", "view-source:https://x", "C:\\docs\\m.pdf", "manual.pdf", "//evil.test", "", null, undefined]) {
      expect(isSafeLink(bad), String(bad)).to.equal(false);
    }
    expect(linkScheme(" OBSIDIAN://x")).to.equal("obsidian");
    expect(cleanLink("\tob\nsidian://x \u0000")).to.equal("obsidian://x");
  });
});

describe("protectAppLinks", () => {
  it("swaps app links for numbered placeholders and leaves the rest", () => {
    const md = [
      "[Vault](obsidian://open?vault=Home&file=Boiler)",
      "[Spaced](<obsidian://open?file=My Note>)",
      '[Titled](onenote:https://d.docs.live.net/x/M.one "OneNote")',
      "<obsidian://open?vault=Auto>",
      "[ref]: obsidian://open?vault=Ref",
      "[Web](https://x.test) [Mail](mailto:a@b.test) [Bad](javascript:alert(1))",
      "![Pic](obsidian://img.png)",
      "`[Code](obsidian://code)`",
      "```\n[Fenced](obsidian://fenced)\n```",
    ].join("\n\n");
    const { content, links } = protectAppLinks(md);
    // Each swapped link reads back through its own number.
    const target = (before: string): string => {
      const at = content.indexOf(before + APP_LINK_PLACEHOLDER);
      expect(at, before).to.be.greaterThan(-1);
      const rest = content.slice(at + before.length + APP_LINK_PLACEHOLDER.length);
      return links[Number(/^\d+/.exec(rest)![0])];
    };
    expect(links.length).to.equal(5);
    expect(target("[Vault](")).to.equal("obsidian://open?vault=Home&file=Boiler");
    expect(target("[Spaced](")).to.equal("obsidian://open?file=My Note");
    expect(target("[Titled](")).to.equal("onenote:https://d.docs.live.net/x/M.one");
    expect(content).to.match(/\[Titled\]\(\S+ "OneNote"\)/);
    expect(target("[obsidian://open?vault=Auto](")).to.equal("obsidian://open?vault=Auto");
    expect(target("[ref]: ")).to.equal("obsidian://open?vault=Ref");
    expect(content).to.contain("[Web](https://x.test) [Mail](mailto:a@b.test) [Bad](javascript:alert(1))");
    expect(content).to.contain("![Pic](obsidian://img.png)");
    expect(content).to.contain("`[Code](obsidian://code)`");
    expect(content).to.contain("[Fenced](obsidian://fenced)");
  });

  it("restores only placeholder anchors, by number", async () => {
    const root = await fixture(html`<div>
      <a href="${APP_LINK_PLACEHOLDER}1">b</a><a href="https://x.test">w</a><a href="${APP_LINK_PLACEHOLDER}0">a</a><a href="${APP_LINK_PLACEHOLDER}9">gone</a>
    </div>`);
    restoreAppLinks(root, ["obsidian://a", "obsidian://b"]);
    expect([...root.querySelectorAll("a")].map((a) => a.getAttribute("href"))).to.deep.equal([
      "obsidian://b", "https://x.test", "obsidian://a", `${APP_LINK_PLACEHOLDER}9`,
    ]);
  });
});

/** Renders [text](url) like HA's ha-markdown: asynchronously, into an inner
 *  element of its shadow root, emptying hrefs its sanitiser would drop. */
class StandInHaMarkdown extends HTMLElement {
  private _content = "";
  public updateComplete: Promise<boolean> = Promise.resolve(true);
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML = "<ha-markdown-element></ha-markdown-element>";
  }
  set content(value: string) {
    this._content = value;
    setTimeout(() => {
      const inner = this.shadowRoot!.querySelector("ha-markdown-element")!;
      inner.innerHTML = value.replace(/\[([^\]]*)\]\(([^)\s]*)\)/g, (_m, text: string, url: string) => {
        const kept = /^(https?:|mailto:|tel:|ftp:)/i.test(url) ? url : "";
        return `<a href="${kept}" target="_blank">${text}</a>`;
      });
    }, 20);
  }
  get content(): string {
    return this._content;
  }
}
customElements.define("ha-markdown", StandInHaMarkdown);

describe("notes: app links through the sanitiser", () => {
  const anchors = (el: Element) =>
    [...el.querySelector("ha-markdown")!.shadowRoot!.querySelectorAll("a")].map((a) => [a.textContent, a.getAttribute("href")]);

  it("gives an app link its href back, keeps a web link, leaves a blocked one dead", async () => {
    const el = await fixture(html`<div>${renderNotesMarkdown("[Vault](obsidian://open?vault=Home) [Web](https://x.test) [Bad](javascript:alert(1))")}</div>`);
    await new Promise((r) => setTimeout(r, 80));
    expect(anchors(el)).to.deep.equal([
      ["Vault", "obsidian://open?vault=Home"],
      ["Web", "https://x.test"],
      ["Bad", ""],
    ]);
  });

  it("follows a re-render with new notes", async () => {
    const host = await fixture<HTMLElement>(html`<div></div>`);
    const { render } = await import("lit");
    render(renderNotesMarkdown("[One](obsidian://one)"), host);
    await new Promise((r) => setTimeout(r, 80));
    expect(anchors(host)).to.deep.equal([["One", "obsidian://one"]]);
    render(renderNotesMarkdown("[Two](onenote:https://x/two.one)"), host);
    await new Promise((r) => setTimeout(r, 80));
    expect(anchors(host)).to.deep.equal([["Two", "onenote:https://x/two.one"]]);
  });
});

describe("documents: an app web link", () => {
  async function mount(url: string) {
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/documents/list": () => ({
          documents: [{ id: "d", kind: "weblink", title: "Vault", url, tags: [], added_at: "2026-01-01T00:00:00" }],
        }),
      },
    });
    const el = await fixture<MaintenanceDocumentsSection>(html`
      <maintenance-documents-section .hass=${hass} .entryId=${"e1"} .canWrite=${true}></maintenance-documents-section>
    `);
    await new Promise((r) => setTimeout(r, 30));
    await el.updateComplete;
    return el.shadowRoot!.querySelector<HTMLAnchorElement>("a.icon-btn")!.getAttribute("href");
  }

  it("links an app link and never a blocked one", async () => {
    expect(await mount("obsidian://open?vault=Home")).to.equal("obsidian://open?vault=Home");
    expect(await mount("javascript:alert(1)")).to.equal("#");
  });
});
