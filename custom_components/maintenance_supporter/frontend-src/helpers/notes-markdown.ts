import { html, nothing } from "lit";
import type { TemplateResult } from "lit";
import { ref } from "lit/directives/ref.js";
import { cleanLink, isSafeLink, linkScheme } from "./url";

/**
 * Render free-text notes as markdown via HA's own `<ha-markdown>` element
 * (registered by the HA frontend in the panel context; it sanitises and
 * opens links with target=_blank rel=noreferrer). When the element is not
 * available — test runners, exotic hosts — fall back to the plain pre-wrap
 * text these sites always rendered.
 *
 * Deliberately used ONLY on block-shaped notes (task detail, object detail,
 * object quick-actions). One-line ellipsized sites (table cells, history
 * rows) keep plain text: markdown would break their layout and their
 * `title` tooltips would still show raw source. Printables stay plain too.
 *
 * App links (#207): HA's sanitiser keeps only http(s), mailto, tel and ftp
 * links and empties every other href, so `[Manual](obsidian://…)` rendered
 * as a dead link. Such a link goes in as a numbered https placeholder the
 * sanitiser keeps, and the real link is put back on the rendered anchor.
 * Blocked schemes (javascript:, data:, …) are left alone for HA to drop.
 */
export function renderNotesMarkdown(
  notes: string | null | undefined,
): TemplateResult | typeof nothing {
  if (!notes) return nothing;
  if (customElements.get("ha-markdown")) {
    const { content, links } = protectAppLinks(notes);
    return html`<ha-markdown
      class="notes-md"
      .content=${content}
      breaks
      ${ref((el) => watchAppLinks(el, links))}
    ></ha-markdown>`;
  }
  return html`${notes}`;
}

/** The placeholder an app link travels as (".invalid" never resolves). */
export const APP_LINK_PLACEHOLDER = "https://app-link.invalid/";

/** Schemes HA's sanitiser keeps on its own. */
const KEPT_BY_HA = new Set(["http", "https", "mailto", "tel", "ftp"]);

/** Code is shown as written, so links inside it are left alone. */
const CODE_RE = /(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]*`)/;

const SCHEME_URL = "[a-zA-Z][a-zA-Z0-9+.-]+:";

/** Swap every app link in the markdown for a numbered placeholder. */
export function protectAppLinks(markdown: string): { content: string; links: string[] } {
  const links: string[] = [];
  const swap = (url: string): string | null => {
    const scheme = linkScheme(url);
    if (!scheme || KEPT_BY_HA.has(scheme) || !isSafeLink(url)) return null;
    links.push(cleanLink(url));
    return `${APP_LINK_PLACEHOLDER}${links.length - 1}`;
  };
  const prose = (part: string): string =>
    part
      // [text](<url with spaces>) and [text](url "title") — images keep theirs
      .replace(new RegExp(`(!?)(\\[[^\\]\\n]*\\]\\(\\s*)<(${SCHEME_URL}[^>\\n]*)>`, "g"), (all, bang, open, url) => {
        const placeholder = bang ? null : swap(url);
        return placeholder ? `${open}${placeholder}` : all;
      })
      .replace(new RegExp(`(!?)(\\[[^\\]\\n]*\\]\\(\\s*)(${SCHEME_URL}[^\\s)]*)`, "g"), (all, bang, open, url) => {
        const placeholder = bang ? null : swap(url);
        return placeholder ? `${open}${placeholder}` : all;
      })
      // <scheme:…> autolinks keep showing the link itself (not the <url> of
      // a link or an image, which the patterns above own)
      .replace(new RegExp(`(^|[^(])<(${SCHEME_URL}[^\\s<>]*)>`, "gm"), (all, before, url) => {
        const placeholder = swap(url);
        return placeholder ? `${before}[${url.replace(/([\\[\]])/g, "\\$1")}](${placeholder})` : all;
      })
      // [label]: url reference definitions
      .replace(new RegExp(`^( {0,3}\\[[^\\]\\n]+\\]:[ \\t]*)<?(${SCHEME_URL}[^\\s>]*)>?`, "gm"), (all, open, url) => {
        const placeholder = swap(url);
        return placeholder ? `${open}${placeholder}` : all;
      });
  const content = markdown
    .split(CODE_RE)
    .map((part, i) => (i % 2 ? part : prose(part)))
    .join("");
  return { content, links };
}

/** Put the real links back on the anchors HA rendered from placeholders. */
export function restoreAppLinks(root: ParentNode, links: readonly string[]): void {
  for (const a of root.querySelectorAll<HTMLAnchorElement>(`a[href^="${APP_LINK_PLACEHOLDER}"]`)) {
    const url = links[Number(a.getAttribute("href")!.slice(APP_LINK_PLACEHOLDER.length))];
    if (url) a.setAttribute("href", url);
  }
}

/** One watcher per rendered notes element: HA renders the markdown later
 *  (in a worker), and again whenever the notes change. */
const watched = new WeakMap<Element, { links: readonly string[] }>();

function watchAppLinks(el: Element | undefined, links: readonly string[]): void {
  if (!el) return;
  const known = watched.get(el);
  if (!known && links.length === 0) return;
  if (known) {
    known.links = links;
    if (el.shadowRoot) restoreAppLinks(el.shadowRoot, links);
    return;
  }
  const state = { links };
  watched.set(el, state);
  void (async () => {
    await (el as Element & { updateComplete?: Promise<unknown> }).updateComplete;
    const root = el.shadowRoot;
    if (!root) return;
    new MutationObserver(() => restoreAppLinks(root, state.links)).observe(root, { childList: true, subtree: true });
    restoreAppLinks(root, state.links);
  })();
}
