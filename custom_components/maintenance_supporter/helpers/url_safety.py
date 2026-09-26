"""Which user-entered links are safe to store — one rule for every path.

The panel escapes links, but a stored ``documentation_url`` also reaches
automations (the task sensor's attribute, the notification payload). The
check used to live in the WS layer only; the options flow, the setup flow,
the JSON import and the CSV import (which let ``//host`` through) stored
``javascript:`` links unchecked (bug audit 2026-09-26). The sanitizers
(:mod:`.sanitize`) now drop unsafe links on every create and edit path.
"""

from __future__ import annotations

from urllib.parse import urlparse

_SAFE_URL_SCHEMES = {"http", "https"}


def is_safe_url(url: str | None) -> bool:
    """Reject javascript:, data:, protocol-relative and other dangerous URLs.

    Only http/https and genuine path-relative URLs (no host) pass. ASCII control
    characters and surrounding whitespace are stripped first, since urlparse and
    browsers ignore them and they can otherwise mask a "//host" or scheme-less
    host (e.g. ``"   //evil.com"`` or ``"\t//evil.com"``).
    """
    if not url:
        return True
    cleaned = "".join(ch for ch in url if ch.isprintable()).strip()
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
    if scheme in _SAFE_URL_SCHEMES:
        return True
    # An empty scheme is only safe for a true path-relative URL with no host.
    return scheme == "" and not parsed.netloc
