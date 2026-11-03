"""Build ``templates_history.py``: what every built-in template task used to say.

Run once from the repository (it reads the git history), then the table is
frozen::

    py -X utf8 scripts/build_template_history.py

Why a table: a task made from a template before 2.118 does not remember what
the template gave it. To tell "the user changed this" from "the template has
changed since", the template-updates check (helpers/template_updates.py)
compares the task's value with everything the template ever said, in every
language. A task made since 2.118 carries its own fingerprints
(``origin["applied"]``), so values after the freeze are never needed here.

For every template task (by its key, the English name it had at the freeze):

- ``added``: the day it first appeared in a template (a task added after an
  object was made is offered to it as new).
- ``recurrence`` / ``warning_days``: every raw value combination it had; the
  check builds them for the home like a template is built today.
- ``names`` / ``notes``: fingerprints of every localized name and every
  localized note as created (base note plus each country's note).

Each commit's templates.py and templates_i18n.py are loaded into a throwaway
package with permissive stubs for the rest of the integration.
"""

from __future__ import annotations

import hashlib
import importlib
import subprocess
import sys
import tempfile
import types
from importlib.machinery import ModuleSpec
from pathlib import Path
from typing import Any

REPO = Path(__file__).resolve().parent.parent
PKG = "custom_components/maintenance_supporter"
OUT = REPO / PKG / "templates_history.py"
LANGS = ("en", "de", "nl", "fr", "it", "es", "pt", "pt-br", "ru", "uk", "pl", "cs", "sv", "zh", "da", "fi", "nb", "ja", "hi", "hu", "ko", "tr")
RAW_RECURRENCE = ("schedule_type", "interval_days", "season_months", "schedule", "country_intervals")


def fingerprint(text: str) -> str:
    """The same 8-hex fingerprint helpers/template_updates.py takes."""
    return hashlib.sha1(text.encode("utf-8")).hexdigest()[:8]


def git(*args: str) -> str:
    return subprocess.run(["git", "-C", str(REPO), *args], capture_output=True, text=True, encoding="utf-8", check=True).stdout


class _Any:
    """Whatever a stubbed name is used as."""

    def __call__(self, *a: Any, **k: Any) -> _Any:
        return _Any()

    def __getattr__(self, name: str) -> _Any:
        return _Any()

    def __iter__(self) -> Any:
        return iter(())

    def __bool__(self) -> bool:
        return False


class _StubModule(types.ModuleType):
    def __getattr__(self, name: str) -> Any:
        if name.startswith("__"):
            raise AttributeError(name)
        return _Any()


def _load(commit: str, n: int) -> tuple[Any, Any] | None:
    tmp = Path(tempfile.mkdtemp())
    pkg = f"_tplhist{n}"
    root = tmp / pkg
    root.mkdir()
    (root / "__init__.py").write_text("", encoding="utf-8")
    for name in ("templates.py", "templates_i18n.py"):
        try:
            src = git("show", f"{commit}:{PKG}/{name}")
        except subprocess.CalledProcessError:
            src = ""
        (root / name).write_text(src, encoding="utf-8")

    class Finder:
        def find_spec(self, fullname: str, path: Any, target: Any = None) -> ModuleSpec | None:
            if fullname.startswith(pkg + ".") and fullname.split(".")[1] not in ("templates", "templates_i18n"):
                return ModuleSpec(fullname, self, is_package=True)  # type: ignore[arg-type]
            return None

        def create_module(self, spec: ModuleSpec) -> types.ModuleType:
            module = _StubModule(spec.name)
            module.__path__ = []
            if spec.name == f"{pkg}.const":
                module.DEFAULT_WARNING_DAYS = 7  # type: ignore[attr-defined]
            return module

        def exec_module(self, module: types.ModuleType) -> None:
            pass

    finder = Finder()
    sys.meta_path.insert(0, finder)  # type: ignore[arg-type]
    sys.path.insert(0, str(tmp))
    try:
        templates = importlib.import_module(f"{pkg}.templates")
        try:
            localize = getattr(importlib.import_module(f"{pkg}.templates_i18n"), "localize_template_text", None)
        except Exception:  # noqa: BLE001 — an early commit without the table: English only
            localize = None
        return templates, localize
    except SyntaxError:  # two merge-artifact commits of 2026-04-18
        return None
    finally:
        sys.meta_path.remove(finder)  # type: ignore[arg-type]


def _localized(localize: Any, text: str | None, lang: str) -> str | None:
    if not text:
        return None
    if localize is None or lang == "en":
        return text
    return localize(text, lang) or text


def _freeze(value: Any) -> Any:
    """A raw field as a hashable, printable literal."""
    if isinstance(value, dict):
        return tuple(sorted((k, _freeze(v)) for k, v in value.items()))
    if isinstance(value, (list, tuple, set, frozenset)):
        items = [_freeze(v) for v in value]
        return tuple(sorted(items) if isinstance(value, (set, frozenset)) else items)
    return value


def _thaw(value: Any) -> Any:
    """Back from :func:`_freeze` for the generated module (dicts as dicts)."""
    if isinstance(value, tuple) and value and all(isinstance(i, tuple) and len(i) == 2 and isinstance(i[0], str) for i in value):
        return {k: _thaw(v) for k, v in value}
    if isinstance(value, tuple):
        return [_thaw(v) for v in value]
    return value


def main() -> None:
    commits = [line.split() for line in git("log", "--reverse", "--format=%h %ad", "--date=short", "--", f"{PKG}/templates.py", f"{PKG}/templates_i18n.py").splitlines() if line.strip()]
    history: dict[str, dict[str, dict[str, Any]]] = {}
    for n, (commit, day) in enumerate(commits):
        loaded = _load(commit, n)
        if loaded is None:
            print(f"skip {commit} {day}: not loadable")
            continue
        templates, localize = loaded
        for template in getattr(templates, "TEMPLATES", []):
            for tt in template.tasks:
                key = getattr(tt, "key", "") or tt.name
                rec = history.setdefault(template.id, {}).setdefault(key, {"added": day, "recurrence": set(), "warning_days": set(), "names": set(), "notes": set()})
                # A field an older TaskTemplate did not have yet, or left empty: None.
                rec["recurrence"].add(_freeze({f: getattr(tt, f, None) or None for f in RAW_RECURRENCE}))
                rec["warning_days"].add(tt.warning_days if isinstance(tt.warning_days, int) else 7)
                country_notes = getattr(tt, "country_notes", None) or {}
                for lang in LANGS:
                    rec["names"].add(fingerprint(_localized(localize, tt.name, lang) or tt.name))
                    base = _localized(localize, tt.notes, lang)
                    # No note at all is a value too: a task made while the
                    # template had none is offered the note it gained later.
                    for extra in (None, *country_notes.values()):
                        parts = [p for p in (base, _localized(localize, extra, lang)) if p]
                        rec["notes"].add(fingerprint("\n\n".join(parts)))
        print(f"{commit} {day}: {sum(len(t) for t in history.values())} task keys")

    lines = [
        '"""What the built-in templates used to say, generated by',
        "scripts/build_template_history.py from the git history and frozen (2.118).",
        "",
        "helpers/template_updates.py reads it once per task made before 2.118, to",
        "tell a value the user changed from one the template has changed since.",
        "Template id → task key (its English name at the freeze) → every raw",
        "recurrence and warning-days value it had, the day it first appeared, and",
        "8-hex fingerprints of every localized name and note as created. Tasks",
        "made since carry their own fingerprints; do not edit or regenerate.",
        '"""',
        "",
        "from __future__ import annotations",
        "",
        "from typing import Any, Final",
        "",
        "HISTORY: Final[dict[str, dict[str, dict[str, Any]]]] = {",
    ]
    for template_id in sorted(history):
        lines.append(f"    {template_id!r}: {{")
        for key in sorted(history[template_id]):
            rec = history[template_id][key]
            recurrence = sorted((_thaw(r) for r in rec["recurrence"]), key=repr)
            lines.append(f"        {key!r}: {{")
            lines.append(f"            \"added\": {rec['added']!r},")
            lines.append(f"            \"recurrence\": {recurrence!r},")
            lines.append(f"            \"warning_days\": {sorted(rec['warning_days'])!r},")
            lines.append(f"            \"names\": {' '.join(sorted(rec['names']))!r},")
            lines.append(f"            \"notes\": {' '.join(sorted(rec['notes']))!r},")
            lines.append("        },")
        lines.append("    },")
    lines.append("}")
    OUT.write_text("\n".join(lines) + "\n", encoding="utf-8", newline="\n")
    print(f"wrote {OUT} ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
