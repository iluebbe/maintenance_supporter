"""Full language audit (run: py -X utf8 scripts/audit_translations.py).

Checks per surface: key parity, empty values, placeholder parity, and
English-identical values in non-EN files (heuristic, with an allowlist of
legitimately language-neutral strings).

NOTE: since 2026-07 the frontend surface is gated in CI by sharper tests —
``test_frontend_locale_value_completeness`` (EN-identical values in Latin
languages, missing native script in ru/uk/zh/ja/hi) and
``test_frontend_t_usage_coverage`` (every static ``t("key")`` exists) in
``tests/test_i18n.py``. New keys go in via ``scripts/add_locale_key.py``,
which requires all 18 translations up front. This script remains useful as a
periodic deep audit (it also covers the backend + template surfaces).
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CC = os.path.join(ROOT, "custom_components", "maintenance_supporter")

problems = []


def load_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def flatten(d, prefix=""):
    out = {}
    for k, v in d.items():
        key = f"{prefix}.{k}" if prefix else k
        if isinstance(v, dict):
            out.update(flatten(v, key))
        else:
            out[key] = v
    return out


def placeholders(s):
    return sorted(re.findall(r"\{[a-z_0-9]+\}", s or ""))


# Strings that are legitimately identical across languages.
NEUTRAL = {
    "ok", "status", "e-mail", "email", "id", "url", "qr", "pdf", "csv", "json",
    "matter", "nfc", "tags", "info", "smart", "min", "max", "top",
}


# Audited cognates: these values are genuinely identical in the listed
# languages ("Filter"/"Service" in de/nl/da/nb/sv/fr, "Object" in nl).
COGNATE_KEYS = {
    "filter_label", "qr_print_filter", "service", "object",
    "on_complete_action_service",
    "entity.sensor.maintenance_task.state_attributes.maintenance_type.state.service",
    "selector.maintenance_type.options.service",
    "services.add_task.fields.entry_id.name",
    "services.delete_task.fields.entry_id.name",
    "services.list_tasks.fields.entry_id.name",
    "services.update_task.fields.entry_id.name",
}


def english_identical_suspicious(key, en_val, val):
    if key in COGNATE_KEYS:
        return False
    if not isinstance(en_val, str) or not isinstance(val, str):
        return False
    if val != en_val:
        return False
    v = en_val.strip()
    if len(v) <= 3:
        return False
    if v.lower() in NEUTRAL:
        return False
    if not re.search(r"[a-zA-Z]{4}", v):
        return False  # numbers/symbols
    # Single capitalized word could be a brand (Roborock, Bambu...) — only
    # flag if it contains a space or a clearly English word.
    english_markers = re.compile(
        r"\b(the|and|for|with|your|task|tasks|days|when|replace|clean|filter|"
        r"service|value|reading|counting|empty|leave|enter|show|hide|new|"
        r"delete|save|cancel|settings|overdue|due|object|objects)\b", re.I)
    return bool(english_markers.search(v))


# ── 1. Frontend locales ──────────────────────────────────────────────────
FL = os.path.join(CC, "frontend-src", "locales")
langs = sorted(f[:-5] for f in os.listdir(FL) if f.endswith(".json"))
data = {lg: load_json(os.path.join(FL, f"{lg}.json")) for lg in langs}
en = data["en"]
en_keys = set(en)
print(f"[frontend] {len(langs)} locales, {len(en_keys)} EN keys")
for lg in langs:
    if lg == "en":
        continue
    keys = set(data[lg])
    missing = en_keys - keys
    extra = keys - en_keys
    if missing:
        problems.append(f"frontend {lg}: MISSING keys: {sorted(missing)[:10]}{'...' if len(missing) > 10 else ''} ({len(missing)})")
    if extra:
        problems.append(f"frontend {lg}: EXTRA keys: {sorted(extra)[:10]} ({len(extra)})")
    for k in keys & en_keys:
        v = data[lg][k]
        if isinstance(v, str) and not v.strip():
            problems.append(f"frontend {lg}: EMPTY value for '{k}'")
        if isinstance(v, str) and placeholders(en.get(k, "")) != placeholders(v):
            problems.append(f"frontend {lg}: PLACEHOLDER mismatch '{k}': en={placeholders(en[k])} vs {placeholders(v)}")
en_identical = {}
for lg in langs:
    if lg == "en":
        continue
    hits = [k for k in set(data[lg]) & en_keys if english_identical_suspicious(k, en[k], data[lg][k])]
    for k in hits:
        en_identical.setdefault(k, []).append(lg)
for k, lgs in sorted(en_identical.items()):
    problems.append(f"frontend EN-identical '{k}' = {en[k][:60]!r} in: {','.join(lgs)}")

# ── 2. Backend HA translations ───────────────────────────────────────────
BT = os.path.join(CC, "translations")
blangs = sorted(f[:-5] for f in os.listdir(BT) if f.endswith(".json"))
bdata = {lg: flatten(load_json(os.path.join(BT, f"{lg}.json"))) for lg in blangs}
ben = bdata["en"]
ben_keys = set(ben)
print(f"[backend] {len(blangs)} translation files, {len(ben_keys)} flattened EN keys")
strings = flatten(load_json(os.path.join(CC, "strings.json")))
if set(strings) != ben_keys:
    d1 = set(strings) - ben_keys
    d2 = ben_keys - set(strings)
    problems.append(f"backend strings.json != en.json: only-strings={sorted(d1)[:6]} only-en={sorted(d2)[:6]}")
for lg in blangs:
    if lg == "en":
        continue
    keys = set(bdata[lg])
    missing = ben_keys - keys
    extra = keys - ben_keys
    if missing:
        problems.append(f"backend {lg}: MISSING keys ({len(missing)}): {sorted(missing)[:8]}{'...' if len(missing) > 8 else ''}")
    if extra:
        problems.append(f"backend {lg}: EXTRA keys ({len(extra)}): {sorted(extra)[:8]}")
    for k in keys & ben_keys:
        v = bdata[lg][k]
        if isinstance(v, str) and not v.strip():
            problems.append(f"backend {lg}: EMPTY value for '{k}'")
        if isinstance(v, str) and placeholders(ben.get(k, "")) != placeholders(v):
            problems.append(f"backend {lg}: PLACEHOLDER mismatch '{k}'")
ben_identical = {}
for lg in blangs:
    if lg == "en":
        continue
    for k in set(bdata[lg]) & ben_keys:
        if english_identical_suspicious(k, ben[k], bdata[lg][k]):
            ben_identical.setdefault(k, []).append(lg)
for k, lgs in sorted(ben_identical.items()):
    problems.append(f"backend EN-identical '{k}' = {ben[k][:60]!r} in: {','.join(lgs)}")

# ── 3. Template/signature i18n (_T in templates_i18n.py) ─────────────────
sys.path.insert(0, os.path.join(ROOT))
import ast

with open(os.path.join(CC, "templates_i18n.py"), encoding="utf-8") as f:
    src = f.read()
tree = ast.parse(src)
T = {}
for node in ast.walk(tree):
    if isinstance(node, (ast.Assign, ast.AnnAssign)):
        targets = node.targets if isinstance(node, ast.Assign) else [node.target]
        for t in targets:
            if getattr(t, "id", "") == "_T" and isinstance(node.value, ast.Dict):
                for kn, vn in zip(node.value.keys, node.value.values, strict=True):
                    if isinstance(kn, ast.Constant) and isinstance(vn, ast.Dict):
                        T[kn.value] = {
                            k2.value: v2.value
                            for k2, v2 in zip(vn.keys, vn.values, strict=True)
                            if isinstance(k2, ast.Constant) and isinstance(v2, ast.Constant)
                        }
EXPECTED_17 = {"de", "es", "fr", "it", "nl", "pt", "ru", "uk", "pl", "cs", "sv", "da", "nb", "fi", "ja", "hi", "zh"}
print(f"[templates] _T entries: {len(T)}")
for name, mapping in T.items():
    missing = EXPECTED_17 - set(mapping)
    if missing:
        problems.append(f"templates _T '{name}': missing langs {sorted(missing)}")
    for lg, v in mapping.items():
        if not str(v).strip():
            problems.append(f"templates _T '{name}': EMPTY {lg}")

# Every signature task name + template name/task/category name must be in _T.
from custom_components.maintenance_supporter.helpers.integration_signatures import SIGNATURES

sig_names = {t.task_name for s in SIGNATURES.values() for t in s.tasks}
missing_sig = sorted(n for n in sig_names if n not in T)
if missing_sig:
    problems.append(f"signature task names NOT in _T: {missing_sig}")
print(f"[signatures] {len(sig_names)} distinct task names, all in _T: {not missing_sig}")

from custom_components.maintenance_supporter.templates import TEMPLATE_CATEGORIES, TEMPLATES

tmpl_strings = set()
for tmpl in TEMPLATES:
    tmpl_strings.add(tmpl.name)
    for task in tmpl.tasks:
        tmpl_strings.add(task.name)
        for item in getattr(task, "checklist", None) or []:
            tmpl_strings.add(item)
missing_tmpl = sorted(s for s in tmpl_strings if s not in T)
if missing_tmpl:
    problems.append(f"template strings NOT in _T ({len(missing_tmpl)}): {missing_tmpl[:12]}")
print(f"[templates] {len(tmpl_strings)} template name/task/checklist strings, all in _T: {not missing_tmpl}")

cat_issues = []
for cat_id, cat in TEMPLATE_CATEGORIES.items():
    for lg in EXPECTED_17 | {"en"}:
        if not (cat.get(f"name_{lg}") or "").strip():
            cat_issues.append(f"{cat_id}: name_{lg}")
if cat_issues:
    problems.append(f"category names incomplete: {cat_issues}")
print(f"[categories] {len(TEMPLATE_CATEGORIES)} categories fully localized: {not cat_issues}")

# ── Result ───────────────────────────────────────────────────────────────
print()
if problems:
    print(f"PROBLEMS ({len(problems)}):")
    for p in problems:
        print(" -", p)
    sys.exit(1)
print("ALL CLEAN")
