"""The tolerant matcher behind every search surface (#171).

Pins the user-facing promises: case, diacritics and German digraph
spellings do not matter, word order does not matter, a prefix or a single
typo still finds the thing, and every word of the query has to hit
SOMEWHERE (so "spülm filt" finds the dishwasher's filter task but a stray
extra word does not widen the result).
"""

from __future__ import annotations

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


def test_fold_is_length_preserving_and_strips_diacritics() -> None:
    for original in ("Kühlschrank", "Straße", "Ærø", "ÉCOLE", "naïve café", "Łódź"):
        assert len(fold(original)) == len(original)
    assert fold("Kühlschrank") == "kuhlschrank"
    assert fold("Straße") == "strase"
    assert fold("ÉCOLE") == "ecole"
    assert fold("Łódź") == "lodz"


def test_words_and_compact() -> None:
    assert words("Fehler-Code E-24, Zulauf!") == ["fehler", "code", "e", "24", "zulauf"]
    assert compact("E-24 / WM14T5") == "e24wm14t5"


def test_query_tokens_add_digraph_variants_without_losing_the_original() -> None:
    assert query_tokens("Spuel-Maschine") == [("spuel", "spul"), ("maschine",)]
    assert query_tokens("Strasse") == [("strasse", "strase")]
    assert query_tokens("Bauer") == [("bauer", "baur")]
    assert query_tokens("  ") == []


def test_within_one_edit() -> None:
    assert within_one_edit("reinigen", "reinigne")  # transposition
    assert within_one_edit("filter", "fiter")  # deletion
    assert within_one_edit("filter", "fillter")  # insertion
    assert within_one_edit("filter", "filtar")  # substitution
    assert not within_one_edit("filter", "flitre")
    assert not within_one_edit("abc", "abcde")


def test_word_score_ladder() -> None:
    assert word_score(("filter",), "filter") == SCORE_EXACT
    assert word_score(("filt",), "filter") == SCORE_PREFIX
    assert word_score(("leitung",), "bedienungsanleitung") == SCORE_SUBSTRING
    assert word_score(("reinigne",), "reinigen") == SCORE_FUZZY
    # A typo inside a longer word the token is a prefix of (gn ↔ ng).
    assert word_score(("reinigugn",), "reinigungsmittel") == SCORE_FUZZY
    # Short tokens: no substring, no typo tolerance.
    assert word_score(("er",), "filter") == 0
    assert word_score(("filt",), "fitler") == 0


def test_field_score_folds_diacritics_and_separators() -> None:
    assert field_score(("kuhl",), "Kühlschrank") == SCORE_PREFIX
    assert field_score(("spul",), "Spülmaschine") == SCORE_PREFIX
    assert field_score(("e24",), "Fehlercode E-24") == SCORE_SUBSTRING


def test_score_fields_requires_every_token_and_ignores_order() -> None:
    fields = [("Filter reinigen", 3), ("Spülmaschine", 2)]
    assert score_fields(query_tokens("spülm filt"), fields) > 0
    assert score_fields(query_tokens("filt spülm"), fields) == score_fields(query_tokens("spülm filt"), fields)
    assert score_fields(query_tokens("spuel filter"), fields) > 0  # digraph spelling
    assert score_fields(query_tokens("spülm garten"), fields) == 0  # one token misses → no hit
    assert score_fields(query_tokens("filter"), []) == 0
    assert score_fields([], fields) == 0


def test_score_fields_ranks_names_above_notes() -> None:
    in_name = score_fields(query_tokens("filter"), [("Filter", 3), ("", 1)])
    in_notes = score_fields(query_tokens("filter"), [("Pumpe", 3), ("Filter wechseln", 1)])
    assert in_name > in_notes > 0


def test_snippet_cuts_around_the_hit_and_collapses_whitespace() -> None:
    text = "Kapitel 4\n\nStörungen   beheben.\nFehlercode E24: Zulauf prüfen und den Filter reinigen.\n" * 3
    piece, at = snippet(text, "e24", radius=20)
    assert at == text.lower().find("e24")
    assert "E24" in piece
    assert "\n" not in piece and "  " not in piece
    assert piece.startswith("…") and piece.endswith("…")
    assert snippet("nothing here", "zzz") == ("", -1)
