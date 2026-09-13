"""The tolerant matcher behind every search surface (#171).

Pins the user-facing promises: case, diacritics and German digraph
spellings do not matter, word order does not matter, a prefix or a single
typo still finds the thing, and every word of the query has to hit
SOMEWHERE (so "spülm filt" finds the dishwasher's filter task but a stray
extra word does not widen the result).

The examples live in ONE shared fixture
(frontend-src/__tests__/fixtures/search-match-examples.json) that the
TypeScript twin (__tests__/search-match.test.ts) runs as well — the panel's
local groups and the server's document/history groups must agree on what
"matches", so a case added there runs on both sides.
"""

from __future__ import annotations

import json
from pathlib import Path

from custom_components.maintenance_supporter.helpers.search_match import (
    SCORE_EXACT,
    SCORE_FUZZY,
    SCORE_PREFIX,
    SCORE_SUBSTRING,
    compact,
    field_score,
    fold,
    query_tokens,
    score_fields,
    snippet,
    within_one_edit,
    word_score,
    words,
)

_FIXTURE = (
    Path(__file__).resolve().parents[1]
    / "custom_components"
    / "maintenance_supporter"
    / "frontend-src"
    / "__tests__"
    / "fixtures"
    / "search-match-examples.json"
)
_EX = json.loads(_FIXTURE.read_text(encoding="utf-8"))
_SCORES = {"EXACT": SCORE_EXACT, "PREFIX": SCORE_PREFIX, "SUBSTRING": SCORE_SUBSTRING, "FUZZY": SCORE_FUZZY, "NONE": 0}


def _fields(rows: list[list]) -> list[tuple[str, int]]:
    return [(text, weight) for text, weight in rows]


def test_fold_is_length_preserving_and_strips_diacritics() -> None:
    for original in _EX["fold_length_preserving"]:
        assert len(fold(original)) == len(original), original
    for original, expected in _EX["fold"]:
        assert fold(original) == expected


def test_words_and_compact() -> None:
    for text, expected in _EX["words"]:
        assert words(text) == expected
    for text, expected in _EX["compact"]:
        assert compact(text) == expected


def test_query_tokens_add_digraph_variants_without_losing_the_original() -> None:
    for text, expected in _EX["query_tokens"]:
        assert query_tokens(text) == [tuple(variants) for variants in expected], text


def test_within_one_edit() -> None:
    for a, b, expected in _EX["within_one_edit"]:
        assert within_one_edit(a, b) is expected, (a, b)


def test_word_score_ladder() -> None:
    for variants, word, score in _EX["word_score"]:
        assert word_score(tuple(variants), word) == _SCORES[score], (variants, word)
    # Python-only detail: empty variants are skipped.
    assert word_score(("", "filter"), "filter") == SCORE_EXACT


def test_field_score_folds_diacritics_and_separators() -> None:
    for variants, text, score in _EX["field_score"]:
        assert field_score(tuple(variants), text) == _SCORES[score], (variants, text)


def test_score_fields_requires_every_token_and_ignores_order() -> None:
    sf = _EX["score_fields"]
    fields = _fields(sf["fields"])
    for query in sf["hits"]:
        assert score_fields(query_tokens(query), fields) > 0, query
    for query in sf["misses"]:
        assert score_fields(query_tokens(query), fields) == 0, query
    for a, b in sf["order_independent"]:
        assert score_fields(query_tokens(a), fields) == score_fields(query_tokens(b), fields)
    assert score_fields(query_tokens("filter"), []) == 0
    assert score_fields([], fields) == 0


def test_score_fields_ranks_names_above_notes() -> None:
    n = _EX["score_fields"]["name_outranks_notes"]
    in_name = score_fields(query_tokens(n["query"]), _fields(n["in_name"]))
    in_notes = score_fields(query_tokens(n["query"]), _fields(n["in_notes"]))
    assert in_name > in_notes > 0


def test_snippet_cuts_around_the_hit_and_collapses_whitespace() -> None:
    text = "Kapitel 4\n\nStörungen   beheben.\nFehlercode E24: Zulauf prüfen und den Filter reinigen.\n" * 3
    piece, at = snippet(text, "e24", radius=20)
    assert at == text.lower().find("e24")
    assert "E24" in piece
    assert "\n" not in piece and "  " not in piece
    assert piece.startswith("…") and piece.endswith("…")
    assert snippet("nothing here", "zzz") == ("", -1)
