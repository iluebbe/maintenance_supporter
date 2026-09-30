"""Matching a spoken name to a task or a spare part.

People do not say a task's name the way it is stored. They say "the oil
change on the car", "den Wasserfilter", "les filtres", "l'huile" — with
articles, a preposition joining task and object, a plural, an elided article,
or accents a speech-to-text engine may or may not keep. The first matcher
required every word of the phrase to appear literally in "task name + object
name", so each of those phrasings found nothing (voice audit 2026-09-30,
including the example the documentation itself gave).

The rules here stay deliberately simple and predictable, because a voice
completion writes real history:

* both sides are folded the same way (case, accents, ligatures);
* filler words — articles, possessives and the prepositions that join a task
  to its object — are dropped from the spoken phrase only, never from names;
* a word also matches through a plain plural/inflection ending ("filters",
  "Filtern", "filtri" → "filter");
* one exact name wins outright; among several candidates, the ones whose
  whole name was spoken win over those that merely contain the words.

Anything still ambiguous is returned as such — the caller asks, it never
guesses.
"""

from __future__ import annotations

import re
import unicodedata
from collections.abc import Iterable
from typing import Any

from .i18n import normalize_language_code


def fold(text: str) -> str:
    """Lower-case, strip accents and unify apostrophes — both sides alike."""
    decomposed = unicodedata.normalize("NFKD", str(text).replace("’", "'").replace("`", "'"))
    stripped = "".join(ch for ch in decomposed if not unicodedata.combining(ch))
    return " ".join(stripped.casefold().split())


def _words(*groups: Iterable[str]) -> frozenset[str]:
    return frozenset(fold(word) for group in groups for word in group)


# English applies everywhere: task names are often English in a home that
# speaks another language, and none of these words identifies anything.
_EN = ("the", "a", "an", "my", "our", "this", "that", "on", "of", "for", "at", "in", "from", "with", "to")

_FILLER: dict[str, frozenset[str]] = {
    "en": _words(_EN),
    "de": _words(
        _EN,
        ("der", "die", "das", "den", "dem", "des", "ein", "eine", "einen", "einem", "einer", "eines"),
        ("mein", "meine", "meinen", "meinem", "meiner", "unser", "unsere", "unseren", "unserem", "unserer"),
        ("an", "am", "auf", "bei", "beim", "im", "vom", "von", "zum", "zur", "fur", "vom"),
    ),
    "fr": _words(
        _EN,
        ("le", "la", "les", "l", "un", "une", "des", "du", "de", "d", "mon", "ma", "mes", "notre", "nos"),
        ("sur", "au", "aux", "pour", "dans", "a"),
    ),
    "es": _words(
        _EN,
        ("el", "la", "los", "las", "un", "una", "unos", "unas", "mi", "mis", "nuestro", "nuestra"),
        ("de", "del", "en", "para", "al"),
    ),
    "it": _words(
        _EN,
        ("il", "lo", "la", "i", "gli", "le", "l", "un", "uno", "una", "mio", "mia", "nostro", "nostra"),
        ("di", "del", "della", "dello", "dei", "degli", "delle", "dell", "su", "sul", "sulla", "per"),
        ("nel", "nella", "al", "alla"),
    ),
    "nl": _words(
        _EN,
        ("de", "het", "een", "mijn", "onze", "ons"),
        ("van", "op", "bij", "voor", "aan", "met"),
    ),
    # No sentence files for these (an LLM agent passes the name), but the
    # ambiguity answer teaches "task <connector> object" in every language,
    # so the connector it uses must not count as part of a name.
    "da": _words(_EN, ("pa", "til", "min", "vores")),
    "nb": _words(_EN, ("pa", "til", "min", "var")),
    "sv": _words(_EN, ("pa", "till", "min", "var")),
    "fi": _words(_EN, ("kohteessa",)),
    "pt": _words(_EN, ("o", "os", "as", "um", "uma", "em", "no", "na", "do", "da", "de", "meu", "minha")),
    "pt-br": _words(_EN, ("o", "os", "as", "um", "uma", "em", "no", "na", "do", "da", "de", "meu", "minha")),
    "tr": _words(_EN, ("icin",)),
}

# Inflection endings tried when a word is not found as it was spoken. Folded,
# so "filtri"/"filtros"/"Filtern" all reach "filtr"/"filtro"/"filter"; the
# stem must keep four letters so short words never turn into wildcards.
_ENDINGS = ("es", "en", "er", "s", "e", "n", "i", "x")
_MIN_STEM = 4


def _stems(token: str) -> set[str]:
    stems = {token}
    if token.endswith("ies") and len(token) - 3 >= _MIN_STEM - 1:
        stems.add(token[:-3] + "y")  # batteries → battery
    for ending in _ENDINGS:
        if token.endswith(ending) and len(token) - len(ending) >= _MIN_STEM:
            stems.add(token[: -len(ending)])
    return stems


def _significant(token: str) -> bool:
    """A token worth matching: two letters or more, or one CJK character."""
    return len(token) >= 2 or (len(token) == 1 and not token.isascii() and token.isalpha())


def content_tokens(query: str, language: str | None = None) -> list[str]:
    """The words of a spoken phrase that identify something."""
    filler = _FILLER.get(normalize_language_code(language), _FILLER["en"])
    return [tok for tok in re.findall(r"\w+", fold(query)) if _significant(tok) and tok not in filler]


def _token_in(token: str, hay: str) -> bool:
    return any(stem in hay for stem in _stems(token))


def match_rows(query: str, rows: list[dict[str, Any]], language: str | None = None) -> list[dict[str, Any]]:
    """The rows (``name`` + ``object_name``) a spoken *query* can mean.

    One row: resolved. Several: ambiguous — the caller asks which. None: not
    found. An exact name (after folding) that only one row has wins outright,
    even when the words would also fit longer names.
    """
    q = fold(query)
    if not q:
        return []
    exact = [r for r in rows if fold(r["name"]) == q]
    if len(exact) == 1:
        return exact
    # "Oil change car" / "car oil change": the full label, either order.
    labelled = [
        r
        for r in rows
        if q in (fold(f"{r['name']} {r['object_name']}"), fold(f"{r['object_name']} {r['name']}"))
    ]
    if len(labelled) == 1:
        return labelled

    tokens = content_tokens(query, language)
    if not tokens:
        return exact
    hays = {id(r): fold(f"{r['name']} {r['object_name']}") for r in rows}
    matches = [r for r in rows if all(_token_in(tok, hays[id(r)]) for tok in tokens)]
    if exact:
        # Several rows share the spoken name exactly: that IS the ambiguity.
        return exact
    if not matches:
        # Scripts without spaces ("プールのフィルター") and connectors this
        # module does not know: the whole stored name inside the phrase,
        # narrowed by the object name when that was said too.
        within = [r for r in rows if fold(r["name"]) and fold(r["name"]) in q]
        with_object = [r for r in within if fold(r["object_name"]) and fold(r["object_name"]) in q]
        return with_object or within
    if len(matches) > 1:
        # "pool filter" fits both "Filter" and "Filter check" on the pool; the
        # one whose whole name was spoken is meant.
        spoken = " ".join(tokens)
        whole = [
            r
            for r in matches
            if all(_token_in(tok, spoken) for tok in content_tokens(r["name"], language))
        ]
        if whole:
            return whole
    return matches
