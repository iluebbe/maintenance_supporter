"""Which user-entered links are safe to store — one rule for every path.

The panel escapes links, but a stored ``documentation_url`` also reaches
automations (the task sensor's attribute, the notification payload). The
check used to live in the WS layer only; the options flow, the setup flow,
the JSON import and the CSV import (which let ``//host`` through) stored
``javascript:`` links unchecked (bug audit 2026-09-26). The sanitizers
(:mod:`.sanitize`) now drop unsafe links on every create and edit path.

Since #207 a link may also open an app (``obsidian://``, ``onenote:``,
``mailto:``): every scheme is allowed except the blocked ones below. The
browser asks before it hands such a link to an app.
"""

from __future__ import annotations

import re
from urllib.parse import urlparse

# Schemes a stored link may never use: they run code in the page (javascript,
# vbscript, livescript, data, blob), open the device's own files or the
# browser's internals (file, filesystem, about, view-source), or start the
# Windows handlers attackers have abused (ms-msdt "Follina", search-ms, ...).
# frontend-src/helpers/url.ts carries the same list (a tripwire pins the two).
BLOCKED_LINK_SCHEMES = frozenset(
    {
        "about",
        "blob",
        "data",
        "file",
        "filesystem",
        "javascript",
        "livescript",
        "ms-appinstaller",
        "ms-cxh",
        "ms-cxh-full",
        "ms-msdt",
        "ms-officecmd",
        "search",
        "search-ms",
        "view-source",
        "vbscript",
    }
)

# Two characters at least: "C:\manual.pdf" is a path on one computer, and a
# browser would read its drive letter as a scheme.
_SCHEME_RE = re.compile(r"[a-z][a-z0-9+.\-]+")


def _clean(url: str) -> str:
    """The link as a browser reads it: control characters (tabs and newlines
    inside included) dropped, surrounding whitespace trimmed."""
    return "".join(ch for ch in url if ch.isprintable()).strip()


def link_scheme(url: str | None) -> str | None:
    """The lower-cased scheme of an absolute link, else None."""
    if not url:
        return None
    try:
        scheme = urlparse(_clean(url)).scheme.lower()
    except Exception:  # noqa: BLE001 - a malformed URL has no scheme to name
        return None
    return scheme or None


def is_safe_url(url: str | None) -> bool:
    """Reject javascript:, data:, protocol-relative and other dangerous URLs.

    http(s), app links (any other scheme not in :data:`BLOCKED_LINK_SCHEMES`)
    and genuine path-relative URLs (no host) pass. ASCII control characters
    and surrounding whitespace are stripped first, since urlparse and browsers
    ignore them and they can otherwise mask a "//host", a scheme-less host
    (e.g. ``"   //evil.com"`` or ``"\t//evil.com"``) or a blocked scheme
    (``"java\tscript:"``).
    """
    if not url:
        return True
    cleaned = _clean(url)
    if not cleaned:
        return True
    # Block protocol-relative URLs like //evil.com
    if cleaned.startswith("//"):
        return False
    try:
        parsed = urlparse(cleaned)
    except Exception:  # noqa: BLE001 - any malformed URL is rejected as unsafe
        return False
    scheme = parsed.scheme.lower()
    if not scheme:
        # An empty scheme is only safe for a true path-relative URL with no host.
        return not parsed.netloc
    return bool(_SCHEME_RE.fullmatch(scheme)) and scheme not in BLOCKED_LINK_SCHEMES


def is_safe_link(url: str | None) -> bool:
    """An absolute link that is safe to store as an external reference: a
    scheme (http(s) or an app) and :func:`is_safe_url`. A document's web link
    must point somewhere; a path-relative URL means nothing there."""
    return link_scheme(url) is not None and is_safe_url(url)
