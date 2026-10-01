"""Menu paths quoted in the docs must exist in the UI.

The guides send people through the panel: "Settings → General → Shopping
list (buy tasks)", "Add ▾ → Suggested setups", "⋮ → Move to another
object…". A label renamed in the panel, or a block that moved to another
section, leaves the docs pointing at something that is not there. The review
of GETTING_STARTED (2026-10-01) found paths through sections that never
existed ("Settings → Options → General Settings"), a block named one level
too high ("Settings → Typical battery lifetimes" sits in General) and labels
that had changed ("Shopping search URL" reads "Shopping search link").

Checked: every path that starts at the panel's Settings, at the Add ▾ menu,
at a ⋮ menu or at the integration's Configure dialog. The step after
Settings must be a section of the panel's Settings page (an <h3> of
settings-view.ts); every later step a label of the panel
(frontend-src/locales/en.json); after Configure, a label of the options flow
(strings.json). Paths through Home Assistant's own pages (Settings →
Devices & services → …) carry Home Assistant's labels and are checked from
Configure on only. A step may be written with emphasis or quotes (a marked
last step must then match whole), a trailing qualifier in parentheses may be
left out ("Shopping list"), and an unmarked last step may run on into the
sentence: a label it starts with counts.
"""

from __future__ import annotations

import json
import re
from functools import cache
from pathlib import Path

import pytest

_ROOT = Path(__file__).resolve().parent.parent
_COMPONENT = _ROOT / "custom_components" / "maintenance_supporter"

# Home Assistant's own Settings pages: their labels are not ours to check.
_HA_PAGES = frozenset(
    {
        "devices & services",
        "dashboards",
        "automations & scenes",
        "areas, labels & zones",
        "people",
        "system",
        "voice assistants",
        "apps",
        "add-ons",
        "tags",
    }
)
_ANCHOR = re.compile(r"(?<![\w-])(Settings|Add ▾|⋮|Configure(?: dialog)?)[*\"]*\s→\s")
_ARROW = re.compile(r"\s→\s")
_MAX_STEP = 50


def _docs() -> list[tuple[str, str]]:
    # CHANGELOG, ROADMAP, docs/design/ and the forum drafts (docs/forum-*.md)
    # record history in the words of their day and are not scanned.
    paths = [_ROOT / "README.md", _ROOT / "CONTRIBUTING.md"]
    paths += sorted(p for p in (_ROOT / "docs").glob("*.md") if not p.name.startswith("forum-"))
    paths += sorted((_ROOT / "skills").rglob("*.md"))
    docs = [(p.relative_to(_ROOT).as_posix(), p.read_text(encoding="utf-8")) for p in paths if p.exists()]
    if not any(rel.startswith("docs/") for rel, _ in docs):
        pytest.skip("docs/ not mounted in this environment (enforced in CI)")
    return docs


def _norm(text: str) -> str:
    text = re.sub(r"[*`\"“”„]", "", text).replace("▾", "")
    text = re.sub(r"\s+", " ", text).strip().lower()
    return text.removeprefix("+ ").rstrip(" …:.").strip()


def _label_set(values: list[str]) -> frozenset[str]:
    out: set[str] = set()
    for value in values:
        out.add(_norm(value))
        # "Shopping list (buy tasks)", "Battery counts as replaced above (%)":
        # the qualifier may be left out.
        out.add(_norm(re.sub(r"\s*\([^)]*\)\s*$", "", value)))
    out.discard("")
    return frozenset(out)


def _strings(node: object) -> list[str]:
    if isinstance(node, str):
        return [node]
    if isinstance(node, dict):
        return [s for value in node.values() for s in _strings(value)]
    if isinstance(node, list):
        return [s for value in node for s in _strings(value)]
    return []


@cache
def _labels() -> tuple[frozenset[str], frozenset[str], frozenset[str]]:
    """(Settings sections, panel labels, options-flow labels)."""
    en = json.loads((_COMPONENT / "frontend-src" / "locales" / "en.json").read_text(encoding="utf-8"))
    view = (_COMPONENT / "frontend-src" / "components" / "settings-view.ts").read_text(encoding="utf-8")
    sections = [en[key] for key in re.findall(r'<h3[^>]*>\s*\$\{t\("([a-z_]+)"', view)]
    assert len(sections) >= 10, "settings-view.ts sections not found — update this test's section pattern"
    options = json.loads((_COMPONENT / "strings.json").read_text(encoding="utf-8"))["options"]
    return _label_set(sections), _label_set([v for v in en.values() if isinstance(v, str)]), _label_set(_strings(options))


def _prose(text: str) -> str:
    """Paragraph text: code blocks out, wrapped lines joined."""
    text = re.sub(r"```.*?```", "", text, flags=re.DOTALL)
    return re.sub(r"(?<!\n)\n(?!\n)", " ", text)


def _is_step(candidate: str) -> bool:
    """Text between two arrows that can be a menu step, not prose."""
    return (
        len(_norm(candidate)) <= _MAX_STEP
        and not re.search(r"[|.;!?]", candidate)
        and candidate.count("(") == candidate.count(")")
    )


def _last_step(tail: str, *, inside_marks: bool) -> tuple[str, bool]:
    """The path's last step and whether it must match whole. The docs mark a
    label with emphasis or quotes — the step itself ("… → *Snooze*") or the
    whole path ("*Settings → … → Snooze*", *inside_marks*): the marked words
    are the label. Unmarked, the step runs on into the sentence, and a label
    it starts with counts."""
    pattern = r"[*\"“]*([^*\"“”]+)[*\"”]" if inside_marks else r"[*\"“]+([^*\"“”]+)[*\"”]"
    marked = re.match(pattern, tail)
    if marked and _is_step(marked.group(1)):
        return marked.group(1), True
    return tail, False


def _chains(text: str) -> list[tuple[str, list[tuple[str, bool]]]]:
    """(anchor, [(step, must match whole), …]) for every path in *text*."""
    found = []
    pos = 0
    while (start := _ANCHOR.search(text, pos)) is not None:
        steps: list[tuple[str, bool]] = []
        cursor = start.end()
        while (arrow := _ARROW.search(text, cursor)) is not None and _is_step(text[cursor : arrow.start()]):
            steps.append((text[cursor : arrow.start()], True))
            cursor = arrow.end()
        inside_marks = text[max(start.start() - 1, 0) : start.start()] in ("*", '"', "“")
        steps.append(_last_step(text[cursor : cursor + 160], inside_marks=inside_marks))
        found.append((start.group(1), steps))
        pos = cursor
    return found


def _match(step: str, labels: frozenset[str], *, whole: bool) -> bool:
    """Whether *step* names one of *labels* — whole, or as the start of the
    running text (a label then ends at a word boundary)."""
    step = _norm(step)
    if whole:
        return step in labels
    return any(step.startswith(label) and (len(step) == len(label) or not step[len(label)].isalnum()) for label in labels)


def _check(anchor: str, steps: list[tuple[str, bool]]) -> str | None:
    """Why the path is wrong, or None."""
    sections, panel, options = _labels()
    if anchor == "Settings":
        first, whole = steps[0]
        if _match(first, _HA_PAGES, whole=whole):
            # Home Assistant's own pages; ours start at Configure.
            names = [_norm(step) for step, _ in steps[:-1]]
            if "configure" not in names:
                return None
            return _check_steps(steps[names.index("configure") + 1 :], options, "an options-flow label")
        if not _match(first, sections, whole=whole):
            return f"{_shown(first)!r} is not a section of the panel's Settings"
        return _check_steps(steps[1:], panel, "a panel label")
    if anchor.startswith("Configure"):
        return _check_steps(steps, options, "an options-flow label")
    return _check_steps(steps, panel, "a panel label")


def _shown(step: str) -> str:
    """A step as a message quotes it: up to a table border, 40 characters."""
    return _norm(step.split("|")[0])[:40]


def _check_steps(steps: list[tuple[str, bool]], labels: frozenset[str], kind: str) -> str | None:
    for step, whole in steps:
        if not _match(step, labels, whole=whole):
            return f"{_shown(step)!r} is not {kind}"
    return None


def test_menu_paths_in_the_docs_exist() -> None:
    wrong = []
    for rel, text in _docs():
        for anchor, steps in _chains(_prose(text)):
            problem = _check(anchor, steps)
            if problem:
                quoted = " → ".join([anchor, *(_shown(step) for step, _ in steps)])
                wrong.append(f"{rel}: {quoted!r} — {problem}")
    assert not wrong, "menu paths in the docs that the UI does not have:\n  " + "\n  ".join(wrong)


@pytest.mark.parametrize(
    ("sentence", "fault"),
    [
        # The paths the 2026-10-01 review found, and their kind.
        ("rename it in Settings → Options → General Settings or …", "'options' is not a section"),
        ("*Settings → Typical battery lifetimes* lists your fleet's types", "is not a section"),
        ("Settings → General → *Shopping search URL* (the placeholder", "'shopping search url"),
        ("(task → ⋮ → *Snoozz*; or in the card)", "'snoozz"),
        ("also Configure → *Panel Accesss*.", "'panel accesss"),
        ("**Add ▾ → From templates gallery** opens", "'from templates gallery"),
        # Written right, in the styles the docs use.
        ("*Settings → Devices & services → Add integration → Local Calendar*", None),
        ("HA Settings → Devices & services → Maintenance Supporter → Configure → **Panel Access**.", None),
        ("Settings → General, next to the low floor |", None),
        ("pick a list in *Settings → General → Shopping list (buy tasks)* and", None),
        ('Settings → Notifications → *"Notify only for view"*).', None),
        ("object → ⋮ → *Replace…* retires it", None),
        ("**Add ▾ → Suggested setups** looks through", None),
    ],
)
def test_the_path_check_catches_what_it_should(sentence: str, fault: str | None) -> None:
    """The check itself: a wrong section, a renamed label, a typo in a menu
    item fail; Home Assistant's own pages and every spelling the docs use
    pass. Without this a broken label lookup would wave every path through."""
    (anchor, steps), *_ = _chains(_prose(sentence))
    problem = _check(anchor, steps)
    if fault is None:
        assert problem is None, problem
    else:
        assert problem is not None and fault in problem, problem
