"""Tolerant text matching shared by every search surface (#171).

A search only helps when the user does NOT have to be exact, so the rules
are deliberately forgiving and identical on both sides of the WebSocket
(the panel mirrors this module in ``helpers/search-match.ts``):

* **Folding** — case, diacritics and a few ligatures collapse
  (``Kühlschrank`` → ``kuhlschrank``, ``Straße`` → ``strase``). The fold is
  LENGTH-PRESERVING, so an offset into the folded text is the same offset
  into the original — snippets are cut from the original.
* **Query variants** — German digraph spellings are matched as well:
  ``spuel`` also tries ``spul``, ``strasse`` also tries ``strase``. Both
  variants are tried, so ``bauer`` is never mangled into a miss.
* **Word matching** — a query token matches a word by exact / prefix /
  substring / one typo (Damerau–Levenshtein ≤ 1, tokens of five characters
  and more). Every token of the query must match SOMEWHERE in the
  candidate; the order does not matter (``spülm filt`` finds the
  dishwasher's filter task).
* **Scoring** — exact 10, prefix 7, substring 4, typo 2 — times a per-field
  weight, summed over tokens. Names outrank notes, notes outrank contents.
"""

from __future__ import annotations

import re
import unicodedata
from collections.abc import Iterable, Sequence

_LIGATURES = {
    "ß": "s",
    "ẞ": "s",
    "æ": "a",
    "œ": "o",
    "ø": "o",
    "đ": "d",
    "ð": "d",
    "þ": "t",
    "ł": "l",
    "ı": "i",
}

_WORD_RE = re.compile(r"[a-z0-9]+")
_NON_ALNUM_RE = re.compile(r"[^a-z0-9]+")

SCORE_EXACT = 10
SCORE_PREFIX = 7
SCORE_SUBSTRING = 4
SCORE_FUZZY = 2

#: Tokens shorter than this never get typo tolerance (too many false hits).
FUZZY_MIN_LEN = 5
#: Tokens shorter than this never get substring matches ("e" is in everything).
SUBSTRING_MIN_LEN = 3


def fold(text: str) -> str:
    """Lower-case, strip diacritics, map ligatures — one char in, one char out."""
    out: list[str] = []
    for ch in text.lower():
        if ch.isascii():
            out.append(ch)
            continue
        mapped = _LIGATURES.get(ch)
        if mapped is not None:
            out.append(mapped)
            continue
        decomposed = unicodedata.normalize("NFKD", ch)
        base = decomposed[0] if decomposed else ch
        # Keep the length: a decomposition that yields several base chars
        # (e.g. "ﬁ" → "fi") is reduced to its first character.
        out.append(base if base.isascii() else ch)
    return "".join(out)


def words(text: str) -> list[str]:
    """The folded alphanumeric words of ``text`` (order kept, may repeat)."""
    return _WORD_RE.findall(fold(text))


def compact(text: str) -> str:
    """Folded text with every separator removed — ``E-24`` matches ``e24``."""
    return _NON_ALNUM_RE.sub("", fold(text))


def _collapse_digraphs(token: str) -> str:
    return token.replace("ue", "u").replace("oe", "o").replace("ae", "a").replace("ss", "s")


def query_tokens(query: str) -> list[tuple[str, ...]]:
    """Split a query into tokens; each token becomes its spelling variants.

    ``Spuel-Maschine`` → ``[("spuel", "spul"), ("maschine",)]``.
    """
    tokens: list[tuple[str, ...]] = []
    for raw in _WORD_RE.findall(fold(query)):
        variants = [raw]
        collapsed = _collapse_digraphs(raw)
        if collapsed != raw and collapsed:
            variants.append(collapsed)
        tokens.append(tuple(variants))
    return tokens


def within_one_edit(a: str, b: str) -> bool:
    """True iff ``a`` and ``b`` differ by at most one edit (insert, delete,
    substitute or adjacent transposition) — optimal string alignment."""
    if a == b:
        return True
    la, lb = len(a), len(b)
    if abs(la - lb) > 1:
        return False
    if la == lb:
        diffs = [i for i in range(la) if a[i] != b[i]]
        if len(diffs) == 1:
            return True
        if len(diffs) == 2 and diffs[1] == diffs[0] + 1:
            i = diffs[0]
            return a[i] == b[i + 1] and a[i + 1] == b[i]
        return False
    # One insertion/deletion: walk both, allow a single skip on the longer one.
    longer, shorter = (a, b) if la > lb else (b, a)
    i = j = 0
    skipped = False
    while i < len(longer) and j < len(shorter):
        if longer[i] == shorter[j]:
            i += 1
            j += 1
        elif skipped:
            return False
        else:
            skipped = True
            i += 1
    return True


def word_score(variants: Sequence[str], word: str) -> int:
    """Best score of a token (any spelling variant) against one word."""
    best = 0
    for tok in variants:
        if not tok:
            continue
        if word == tok:
            return SCORE_EXACT
        if word.startswith(tok):
            best = max(best, SCORE_PREFIX)
            continue
        if len(tok) >= SUBSTRING_MIN_LEN and tok in word:
            best = max(best, SCORE_SUBSTRING)
            continue
        if len(tok) >= FUZZY_MIN_LEN and best < SCORE_FUZZY:
            # A typo in the token itself, or in a word the token is a prefix of.
            if within_one_edit(tok, word) or (len(word) > len(tok) and within_one_edit(tok, word[: len(tok)])):
                best = SCORE_FUZZY
    return best


def field_score(variants: Sequence[str], text: str) -> int:
    """Best score of a token against one text field (word-wise, plus the
    separator-free form so ``e24`` finds ``E-24``)."""
    best = 0
    for w in _WORD_RE.findall(fold(text)):
        best = max(best, word_score(variants, w))
        if best == SCORE_EXACT:
            return best
    if best < SCORE_SUBSTRING:
        flat = compact(text)
        for tok in variants:
            if len(tok) >= SUBSTRING_MIN_LEN and tok in flat:
                return SCORE_SUBSTRING
    return best


def score_fields(tokens: Sequence[Sequence[str]], fields: Iterable[tuple[str, int]]) -> int:
    """Score a candidate made of weighted fields. 0 = at least one token
    matched nothing (the AND rule); otherwise the weighted sum over tokens."""
    if not tokens:
        return 0
    field_list = [(text, weight) for text, weight in fields if text]
    total = 0
    for variants in tokens:
        best = 0
        for text, weight in field_list:
            s = field_score(variants, text) * weight
            if s > best:
                best = s
        if best == 0:
            return 0
        total += best
    return total


def snippet(text: str, needle: str, radius: int = 70) -> tuple[str, int]:
    """Cut a short window of ``text`` around the first occurrence of the
    folded ``needle``; returns ``(snippet, offset)`` — offset −1 = not found.
    Whitespace runs collapse so a PDF's line breaks do not leak into the UI."""
    folded = fold(text)
    at = folded.find(fold(needle)) if needle else -1
    if at < 0:
        return "", -1
    start = max(0, at - radius)
    end = min(len(text), at + len(needle) + radius)
    # Snap to word boundaries where possible.
    while start > 0 and text[start - 1].isalnum():
        start -= 1
    while end < len(text) and text[end].isalnum():
        end += 1
    piece = re.sub(r"\s+", " ", text[start:end]).strip()
    if start > 0:
        piece = "…" + piece
    if end < len(text):
        piece = piece + "…"
    return piece, at
