"""Add a frontend locale key to ALL 18 languages in one atomic step.

THE canonical way to add a panel/card UI string. Refuses to run unless a value
is supplied for every language, so the "add to en.json now, translate later"
path — the root cause of the 2026-07 batch of 270 untranslated values — does
not exist. CI enforces the result twice: ``test_frontend_locale_key_parity``
(key present everywhere) and ``test_frontend_locale_value_completeness``
(value actually translated, native script where applicable).

Usage (run with ``py -X utf8``):

    py -X utf8 scripts/add_locale_key.py my_new_key translations.json
    py -X utf8 scripts/add_locale_key.py my_new_key translations.json --after existing_key

where ``translations.json`` is a file mapping EVERY language code to the
translated value::

    {"en": "Save", "de": "Speichern", "fr": "Enregistrer", ...}

``--after`` inserts below an existing key (keeps feature grouping); default is
before the closing brace. Placeholders (``{name}``) must match English in every
value. A value identical to English in a non-cognate language is rejected —
if it IS a genuine cognate/loanword, add it and extend ``_VALUE_OK`` in
``tests/test_i18n.py`` in the same commit (that is a reviewed decision).
"""

from __future__ import annotations

import argparse
import io
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
LOCALES = os.path.join(HERE, "..", "custom_components", "maintenance_supporter", "frontend-src", "locales")

LANGUAGES = ["en", "de", "nl", "fr", "it", "es", "pt", "ru", "uk", "pl", "cs", "sv", "zh", "da", "fi", "nb", "ja", "hi"]

# Mirrors tests/test_i18n.py — languages written in a non-Latin script.
NATIVE_SCRIPTS = {
    "ru": r"[Ѐ-ӿ]",
    "uk": r"[Ѐ-ӿ]",
    "zh": r"[一-鿿]",
    "ja": r"[぀-ヿ一-鿿]",
    "hi": r"[ऀ-ॿ]",
}

TOKEN_RE = re.compile(r"\{(\w+)\}")


def fail(msg: str) -> None:
    print(f"ERROR: {msg}", file=sys.stderr)
    sys.exit(1)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("key", help="new locale key (snake_case)")
    ap.add_argument("values_file", help="JSON file: {lang: translated value} for ALL languages")
    ap.add_argument("--after", help="insert after this existing key (default: end of file)")
    ap.add_argument("--allow-english", action="store_true", help="skip the untranslated-value heuristic (cognates; extend _VALUE_OK in tests/test_i18n.py too)")
    args = ap.parse_args()

    if not re.fullmatch(r"[a-z0-9_]+", args.key):
        fail(f"key {args.key!r} must be snake_case")

    values = json.load(io.open(args.values_file, encoding="utf-8"))
    missing = [lg for lg in LANGUAGES if lg not in values or not str(values[lg]).strip()]
    if missing:
        fail(f"missing translations for: {', '.join(missing)} — every language is required, no partial adds")
    extra = sorted(set(values) - set(LANGUAGES))
    if extra:
        fail(f"unknown language codes: {', '.join(extra)}")

    en_tokens = sorted(TOKEN_RE.findall(values["en"]))
    for lg in LANGUAGES:
        val = values[lg]
        if sorted(TOKEN_RE.findall(val)) != en_tokens:
            fail(f"{lg}: placeholder mismatch (en has {en_tokens})")
        if lg == "en" or args.allow_english:
            continue
        stripped = TOKEN_RE.sub("", val).strip()
        if len(stripped) <= 3:
            continue
        native = NATIVE_SCRIPTS.get(lg)
        if native and re.search(r"[A-Za-z]{3}", stripped) and not re.search(native, val):
            fail(f"{lg}: {val!r} has no {lg}-script characters — untranslated? (--allow-english to override)")
        if not native and val == values["en"]:
            fail(f"{lg}: value identical to English — translate it, or --allow-english for a genuine cognate (then extend _VALUE_OK in tests/test_i18n.py)")

    for lg in LANGUAGES:
        path = os.path.join(LOCALES, f"{lg}.json")
        with io.open(path, encoding="utf-8") as f:
            lines = f.readlines()
        data = json.loads("".join(lines))
        if args.key in data:
            fail(f"{lg}: key {args.key!r} already exists")
        if args.after and args.after not in data:
            fail(f"{lg}: --after key {args.after!r} not found")

        entry = f'  "{args.key}": {json.dumps(values[lg], ensure_ascii=False)}'
        if args.after:
            anchor = re.compile(r'^(\s*)"%s":' % re.escape(args.after))
            for i, line in enumerate(lines):
                if anchor.match(line):
                    comma = "," if line.rstrip().endswith(",") else ""
                    if not comma:  # anchor was the last entry — give it a comma
                        lines[i] = line.rstrip("\n").rstrip() + ",\n"
                    lines.insert(i + 1, entry + (",\n" if comma else "\n"))
                    break
        else:
            # before the final closing brace; previous last entry gains a comma
            for i in range(len(lines) - 1, -1, -1):
                if lines[i].strip() == "}":
                    j = i - 1
                    while j >= 0 and not lines[j].strip():
                        j -= 1
                    if j >= 0 and not lines[j].rstrip().endswith((",", "{")):
                        lines[j] = lines[j].rstrip("\n").rstrip() + ",\n"
                    lines.insert(i, entry + "\n")
                    break

        text = "".join(lines)
        json.loads(text)  # must still parse
        with io.open(path, "w", encoding="utf-8", newline="\n") as f:
            f.write(text)
        print(f"OK {lg}: {values[lg]}")

    print(f"\nAdded {args.key!r} to all {len(LANGUAGES)} locales.")
    print("Next: node esbuild.mjs (copies locales into frontend/) and run tests/test_i18n.py.")


if __name__ == "__main__":
    main()
