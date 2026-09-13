"""Full-text index over uploaded documents (#171, stage 2).

What it does: for every content-addressed blob the :class:`DocumentStore`
holds, the TEXT LAYER of a PDF (born-digital manuals and invoices, scans that
a scanner app or Paperless already OCR'd) or the bytes of a ``text/*`` file
are extracted once into a sidecar
``<config>/maintenance_supporter/docs/text/<sha256>.txt`` and folded into an
in-memory inverted index (word → blob → count). A search then finds the
manual that mentions ``E24`` and hands back the page and a snippet.

What it does NOT do: OCR. There is no recognition engine in a Home
Assistant container; photos and scans without a text layer stay invisible
to the search and are counted as "without text layer" so the user can see
why. Extraction is CPU work (pypdf, pure Python — a 300-page manual takes
tens of seconds on a Pi), so it always runs in the executor, one blob at a
time, never inline with an upload, and existing blobs are backfilled a
couple of minutes after Home Assistant started.

Lifecycle: the store calls :meth:`schedule` when a blob appears (upload or
archive restore) and :meth:`async_forget` when the last reference goes; the
sidecar dies with the blob (``DocumentStore._delete_blob_sync``).
"""

from __future__ import annotations

import asyncio
import bisect
import logging
import os
from pathlib import Path
from typing import TYPE_CHECKING, Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.storage import Store

from ..const import DOMAIN
from .managed_timer import ManagedTimer
from .search_match import query_tokens, snippet, word_score, words

if TYPE_CHECKING:
    from .documents import DocumentStore

_LOGGER = logging.getLogger(__name__)

TEXT_STORE_KEY = f"{DOMAIN}.document_text"
TEXT_STORE_VERSION = 1
TEXT_SUBDIR = "text"
#: Bump when the extraction changes shape — every blob is re-extracted.
EXTRACT_VERSION = 1

#: Caps keep a single 800-page manual from eating the executor and the RAM.
MAX_PAGES = 150
MAX_CHARS = 120_000
#: Page separator inside a sidecar; the page of an offset = separators before it + 1.
PAGE_BREAK = "\f"

STATUS_TEXT = "text"  # extracted, has words
STATUS_EMPTY = "empty"  # a PDF without a text layer (scan / image-only)
STATUS_UNSUPPORTED = "unsupported"  # image or other binary — nothing to extract
STATUS_ERROR = "error"  # pypdf refused it (encrypted, corrupt)

#: The delay after Home Assistant started before the backfill begins.
BACKFILL_DELAY = 120
#: Pause between two backfilled blobs — keeps a Pi responsive.
BACKFILL_PAUSE = 0.5


def text_sidecar_path(hass: HomeAssistant, digest: str) -> Path:
    """Where the extracted text of a blob lives (validated hex digest)."""
    if not digest or not all(c in "0123456789abcdef" for c in digest):
        raise ValueError(f"invalid blob digest: {digest!r}")
    from .documents import DOCS_SUBDIR

    return Path(hass.config.path(DOMAIN, DOCS_SUBDIR, TEXT_SUBDIR)) / f"{digest}.txt"


def extract_text_sync(path: Path, mime: str) -> dict[str, Any]:
    """Extract the text layer of a blob (executor-only).

    Returns ``{status, text, pages, indexed_pages, chars}``; ``text`` uses
    :data:`PAGE_BREAK` between pages and collapsed whitespace within.
    """
    mime = (mime or "").lower()
    if mime.startswith("text/"):
        try:
            raw = path.read_bytes()[: MAX_CHARS * 4]
        except OSError:
            return {"status": STATUS_ERROR, "text": "", "pages": 0, "indexed_pages": 0, "chars": 0}
        text = " ".join(raw.decode("utf-8", errors="replace").split())[:MAX_CHARS]
        status = STATUS_TEXT if text else STATUS_EMPTY
        return {"status": status, "text": text, "pages": 1, "indexed_pages": 1, "chars": len(text)}
    if mime != "application/pdf":
        return {"status": STATUS_UNSUPPORTED, "text": "", "pages": 0, "indexed_pages": 0, "chars": 0}
    try:
        from pypdf import PdfReader

        reader = PdfReader(str(path))
        if reader.is_encrypted:
            try:
                reader.decrypt("")
            except Exception:  # noqa: BLE001 — any decrypt failure = unreadable
                return {"status": STATUS_ERROR, "text": "", "pages": 0, "indexed_pages": 0, "chars": 0}
        total = len(reader.pages)
        pages: list[str] = []
        chars = 0
        for i, page in enumerate(reader.pages):
            if i >= MAX_PAGES or chars >= MAX_CHARS:
                break
            try:
                page_text = " ".join((page.extract_text() or "").split())
            except Exception:  # noqa: BLE001 — a broken page must not sink the document
                page_text = ""
            if chars + len(page_text) > MAX_CHARS:
                page_text = page_text[: MAX_CHARS - chars]
            pages.append(page_text)
            chars += len(page_text)
        text = PAGE_BREAK.join(pages)
        has_words = sum(1 for w in words(text[:50_000]) if len(w) >= 2) >= 3
        return {
            "status": STATUS_TEXT if has_words else STATUS_EMPTY,
            "text": text if has_words else "",
            "pages": total,
            "indexed_pages": len(pages),
            "chars": chars if has_words else 0,
        }
    except Exception as err:  # noqa: BLE001 — corrupt PDFs are user data, log and move on
        _LOGGER.debug("Text extraction failed for %s: %s", path.name, err)
        return {"status": STATUS_ERROR, "text": "", "pages": 0, "indexed_pages": 0, "chars": 0}


class DocumentTextIndex:
    """Sidecars + meta store + the in-memory inverted index."""

    def __init__(self, hass: HomeAssistant, store: DocumentStore) -> None:
        self.hass = hass
        self.store = store
        self._meta_store: Store[dict[str, Any]] = Store(hass, TEXT_STORE_VERSION, TEXT_STORE_KEY)
        self._meta: dict[str, dict[str, Any]] = {}
        # word -> {digest: count}
        self._index: dict[str, dict[str, int]] = {}
        self._vocab: list[str] = []  # sorted keys of _index (prefix scans)
        self._vocab_dirty = False
        self._loaded = False
        self._load_lock = asyncio.Lock()
        self._work_lock = asyncio.Lock()
        self._pending: set[str] = set()
        # The backfill timer AND every extraction task; closed by cancel(),
        # after which a queued schedule_backfill can no longer re-arm it.
        self._timer = ManagedTimer(hass, f"{DOMAIN}_doc_text")

    # ------------------------------------------------------------------
    # Meta store
    # ------------------------------------------------------------------

    async def async_load(self) -> None:
        """Load the extraction meta (cheap; the sidecars are read lazily)."""
        raw = await self._meta_store.async_load()
        blobs = raw.get("blobs") if isinstance(raw, dict) else None
        self._meta = {k: dict(v) for k, v in blobs.items() if isinstance(v, dict)} if isinstance(blobs, dict) else {}

    async def _async_save_meta(self) -> None:
        await self._meta_store.async_save({"blobs": self._meta})

    @property
    def meta(self) -> dict[str, dict[str, Any]]:
        return self._meta

    def _needs_extraction(self, digest: str) -> bool:
        m = self._meta.get(digest)
        return m is None or m.get("v") != EXTRACT_VERSION

    # ------------------------------------------------------------------
    # Index maintenance
    # ------------------------------------------------------------------

    def _add_to_index(self, digest: str, text: str) -> None:
        counts: dict[str, int] = {}
        for w in words(text):
            if len(w) < 2:
                continue
            counts[w] = counts.get(w, 0) + 1
        for w, n in counts.items():
            bucket = self._index.get(w)
            if bucket is None:
                self._index[w] = {digest: n}
                self._vocab_dirty = True
            else:
                bucket[digest] = n

    def _drop_from_index(self, digest: str) -> None:
        empty: list[str] = []
        for w, bucket in self._index.items():
            if bucket.pop(digest, None) is not None and not bucket:
                empty.append(w)
        for w in empty:
            del self._index[w]
        if empty:
            self._vocab_dirty = True

    def _vocabulary(self) -> list[str]:
        if self._vocab_dirty:
            self._vocab = sorted(self._index)
            self._vocab_dirty = False
        return self._vocab

    def _read_sidecar_sync(self, digest: str) -> str:
        try:
            return text_sidecar_path(self.hass, digest).read_text(encoding="utf-8")
        except (OSError, ValueError):
            return ""

    def _write_sidecar_sync(self, digest: str, text: str) -> None:
        path = text_sidecar_path(self.hass, digest)
        path.parent.mkdir(parents=True, exist_ok=True)
        tmp = path.with_name(path.name + ".tmp")
        tmp.write_text(text, encoding="utf-8")
        os.replace(tmp, path)

    async def async_ensure_loaded(self) -> None:
        """Read every extracted sidecar into the index — once, on demand."""
        if self._loaded:
            return
        async with self._load_lock:
            if self._loaded:
                return
            digests = [d for d, m in self._meta.items() if m.get("status") == STATUS_TEXT and d in self.store.blobs]

            def _read_all() -> dict[str, str]:
                return {d: self._read_sidecar_sync(d) for d in digests}

            texts = await self.hass.async_add_executor_job(_read_all)
            for digest, text in texts.items():
                if text:
                    self._add_to_index(digest, text)
                else:
                    # Sidecar vanished (manual cleanup) — re-extract on the next backfill.
                    self._meta.pop(digest, None)
            self._loaded = True

    # ------------------------------------------------------------------
    # Extraction
    # ------------------------------------------------------------------

    async def async_extract(self, digest: str) -> dict[str, Any] | None:
        """Extract + index one blob (idempotent; returns the meta or None)."""
        blob = self.store.blobs.get(digest)
        if blob is None:
            return None
        async with self._work_lock:
            if not self._needs_extraction(digest):
                return self._meta.get(digest)
            path = self.store.blob_path(digest)
            result = await self.hass.async_add_executor_job(extract_text_sync, path, str(blob.get("mime") or ""))
            text = result.pop("text", "")
            if result["status"] == STATUS_TEXT:
                await self.hass.async_add_executor_job(self._write_sidecar_sync, digest, text)
                if self._loaded:
                    self._drop_from_index(digest)
                    self._add_to_index(digest, text)
            meta = {**result, "v": EXTRACT_VERSION}
            self._meta[digest] = meta
            await self._async_save_meta()
            return meta

    @callback
    def schedule(self, digest: str) -> None:
        """Extract a freshly stored blob in the background (upload / restore)."""
        if digest in self._pending or not self._needs_extraction(digest):
            return
        self._pending.add(digest)

        async def _run() -> None:
            try:
                await self.async_extract(digest)
            except Exception:
                _LOGGER.exception("Document text extraction failed for %s", digest[:12])
            finally:
                self._pending.discard(digest)

        if self._timer.track_task(_run(), name=f"{DOMAIN}_doc_text_{digest[:12]}", background=True) is None:
            self._pending.discard(digest)  # closed — nothing will run

    async def async_forget(self, digest: str) -> None:
        """The last reference to a blob went — drop its words and meta."""
        self._pending.discard(digest)
        self._drop_from_index(digest)
        if self._meta.pop(digest, None) is not None:
            await self._async_save_meta()

    async def async_backfill(self) -> dict[str, int]:
        """Extract every blob that has no (current) extraction, one at a time."""
        await self.async_ensure_loaded()
        stale = [d for d in self._meta if d not in self.store.blobs]
        for d in stale:
            self._meta.pop(d, None)
            self._drop_from_index(d)
        todo = [d for d in self.store.blobs if self._needs_extraction(d)]
        done = 0
        for digest in todo:
            if digest not in self.store.blobs:
                continue
            await self.async_extract(digest)
            done += 1
            await asyncio.sleep(BACKFILL_PAUSE)
        if stale:
            await self._async_save_meta()
        if done or stale:
            s = self.summary()
            _LOGGER.info(
                "Document search index: %d blob(s) extracted, %d stale dropped — %d indexed, %d without text layer",
                done,
                len(stale),
                s["indexed"],
                s["no_text"],
            )
        return {"extracted": done, "stale": len(stale)}

    @callback
    def schedule_backfill(self, delay: float = BACKFILL_DELAY) -> None:
        """Run the backfill ``delay`` seconds from now (called at HA start).
        Re-arming replaces the pending timer; a no-op after :meth:`cancel`."""
        self._timer.schedule(delay, self._run_backfill)

    @callback
    def _run_backfill(self, _now: Any) -> None:
        async def _go() -> None:
            try:
                await self.async_backfill()
            except Exception:
                _LOGGER.exception("Document search backfill failed")

        self._timer.track_task(_go(), name=f"{DOMAIN}_doc_text_backfill")

    @callback
    def cancel(self) -> None:
        """Teardown: drop the backfill timer, cancel running extractions and
        refuse anything scheduled afterwards."""
        self._timer.close()

    # ------------------------------------------------------------------
    # Status
    # ------------------------------------------------------------------

    def summary(self) -> dict[str, int]:
        """Counts for the storage card: how much of the library is searchable."""
        indexed = no_text = unsupported = pending = 0
        for digest in self.store.blobs:
            m = self._meta.get(digest)
            if m is None or m.get("v") != EXTRACT_VERSION:
                pending += 1
            elif m.get("status") == STATUS_TEXT:
                indexed += 1
            elif m.get("status") == STATUS_UNSUPPORTED:
                unsupported += 1
            else:
                no_text += 1
        return {
            "total": len(self.store.blobs),
            "indexed": indexed,
            "no_text": no_text,
            "unsupported": unsupported,
            "pending": pending,
        }

    # ------------------------------------------------------------------
    # Search
    # ------------------------------------------------------------------

    def _match_words(self, variants: tuple[str, ...]) -> dict[str, tuple[int, str]]:
        """All indexed words a token matches → {digest: (best score, word)}."""
        hits: dict[str, tuple[int, str]] = {}
        vocab = self._vocabulary()
        candidates: set[str] = set()
        for tok in variants:
            if not tok:
                continue
            # Prefix range via bisect (covers exact too).
            lo = bisect.bisect_left(vocab, tok)
            hi = bisect.bisect_left(vocab, tok + "￿")
            candidates.update(vocab[lo:hi])
            if len(tok) >= 3:
                # Substring + typo candidates: a linear pass over the vocabulary —
                # tens of thousands of words at most, well under a millisecond
                # per token in CPython for the length filter alone.
                n = len(tok)
                for w in vocab:
                    if tok in w or (n >= 5 and abs(len(w) - n) <= 1) or (n >= 5 and len(w) > n and w[0] == tok[0]):
                        candidates.add(w)
        for w in candidates:
            s = word_score(variants, w)
            if s <= 0:
                continue
            for digest, count in self._index[w].items():
                bonus = min(count, 5)  # a term that recurs is more "about" that term
                cur = hits.get(digest)
                total = s * 10 + bonus
                if cur is None or total > cur[0]:
                    hits[digest] = (total, w)
        return hits

    async def async_search(self, query: str, limit: int = 8) -> list[dict[str, Any]]:
        """Content hits: ``[{digest, score, page, snippet, word}]`` best first."""
        tokens = query_tokens(query)
        if not tokens:
            return []
        await self.async_ensure_loaded()
        per_digest: dict[str, tuple[int, list[str]]] = {}
        for i, variants in enumerate(tokens):
            hits = self._match_words(variants)
            if i == 0:
                per_digest = {d: (s, [w]) for d, (s, w) in hits.items()}
            else:
                merged: dict[str, tuple[int, list[str]]] = {}
                for d, (s, ws) in per_digest.items():
                    h = hits.get(d)
                    if h is not None:
                        merged[d] = (s + h[0], [*ws, h[1]])
                per_digest = merged
            if not per_digest:
                return []
        ranked = sorted(per_digest.items(), key=lambda kv: -kv[1][0])[:limit]

        def _snippets() -> list[dict[str, Any]]:
            out: list[dict[str, Any]] = []
            for digest, (score, matched) in ranked:
                text = self._read_sidecar_sync(digest)
                _piece, at = snippet(text, matched[0]) if text else ("", -1)
                if at < 0:
                    out.append({"digest": digest, "score": score, "page": None, "snippet": "", "word": matched[0]})
                    continue
                # The snippet stays inside the page the hit is on — a window
                # that straddles a page break would glue two unrelated
                # passages together.
                page_start = text.rfind(PAGE_BREAK, 0, at) + 1
                page_end = text.find(PAGE_BREAK, at)
                page_text = text[page_start : page_end if page_end >= 0 else len(text)]
                piece, _ = snippet(page_text, matched[0])
                page = text.count(PAGE_BREAK, 0, at) + 1
                out.append({"digest": digest, "score": score, "page": page, "snippet": piece, "word": matched[0]})
            return out

        return await self.hass.async_add_executor_job(_snippets)

