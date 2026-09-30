"""Keep docs/ARCHITECTURE.md's file tree and source-file figures in step with the code.

The tree under "## File Structure" is hand-written for its order and its
descriptions; what can be read off the code is written by this script:

* ``(N lines)`` on every counted entry — a file's lines, or a directory's
  ``.py`` / ``.ts`` lines (caches, dependencies, test suites and generated
  output left out);
* a directory's description opens with its file count (and, for
  ``websocket/``, its command count);
* a WebSocket module's description IS its command list, an intent module's
  its intent list — both generated, so they cannot fall behind the code;
* a module a listed directory does not name yet is added to it, described
  by its own docstring (Python) or leading comment (TypeScript) — rewrite
  that text afterwards, it is kept from then on;
* an entry whose file is gone is dropped;
* the header's "N source files (P Python + T TypeScript)".

Entries without a count (built output, manifest, translations …) are free
text; they, the notes between entries and all other descriptions are kept
as written.

It runs on every commit through ``.githooks/pre-commit`` (enable once per
clone: ``git config core.hooksPath .githooks``); tests/test_docs_counts_in_sync.py
fails CI when the doc and this script disagree anyway.

    py -X utf8 scripts/sync_architecture_doc.py            # rewrite in place
    py -X utf8 scripts/sync_architecture_doc.py --check    # exit 1 when stale
"""

from __future__ import annotations

import argparse
import ast
import os
import re
import subprocess
import sys
from collections.abc import Iterator
from dataclasses import dataclass, field
from functools import cache
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOC = ROOT / "docs" / "ARCHITECTURE.md"
COMPONENT = ROOT / "custom_components" / "maintenance_supporter"

SOURCE_SUFFIXES = (".py", ".ts")
# Never counted as source: caches, dependencies, test suites, generated output.
SKIP_DIRS = frozenset({"__pycache__", "node_modules", "__tests__", "dist-ds"})
COUNT_END = 46  # a count's closing parenthesis ends at this column …
DESC_COL = 48  # … and descriptions and their continuation lines start here
WRAP = 90  # generated descriptions wrap at this many characters

_ENTRY = re.compile(r"^((?:│   |    )*)(├── |└── )(.*)$")
# "(1,242 lines)" — or "(1,242)", which the next run spells out.
_COUNTED = re.compile(r"^(\S+)\s+\((\d[\d,]*)(?: lines)?\)(?:\s+(.*))?$")
_FACTS = re.compile(r"^\d[\d,]* \w+(?:, \d[\d,]* \w+)*(?: — |$)")
_HEADER = re.compile(r"(\d[\d,]*) source files \((\d[\d,]*) Python \+ (\d[\d,]*) TypeScript\)")
_COMMAND = re.compile(r'vol\.Required\("type"\):\s*f?"(?:maintenance_supporter|\{DOMAIN\})/([^"]+)"')
_INTENT = re.compile(r"^class (\w+?)Intent\(intent\.IntentHandler\)", re.MULTILINE)
_ABBREVIATIONS = ("e.g.", "i.e.", "incl.", "etc.", "vs.", "approx.", "cf.")


# ── The files ──────────────────────────────────────────────────────────────


@cache
def _all_sources() -> tuple[Path, ...]:
    """Every source file of the component: git's list when there is one
    (untracked scratch files do not count), a directory walk otherwise."""
    try:
        out = subprocess.run(
            ["git", "-C", str(ROOT), "ls-files", "-z", "--", COMPONENT.relative_to(ROOT).as_posix()],
            capture_output=True,
            check=True,
        ).stdout.decode("utf-8")
        files = [ROOT / rel for rel in out.split("\0") if rel]
    except (OSError, subprocess.CalledProcessError):
        files = []
        for dirpath, dirnames, filenames in os.walk(COMPONENT):
            dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
            files.extend(Path(dirpath) / name for name in filenames)
    return tuple(
        sorted(
            p
            for p in files
            if p.suffix in SOURCE_SUFFIXES and p.is_file() and not SKIP_DIRS.intersection(p.relative_to(COMPONENT).parts[:-1])
        )
    )


def _sources(directory: Path) -> list[Path]:
    """Source files under *directory*. A skipped directory listed on purpose
    (``frontend-src/__tests__/``) counts its own files."""
    if SKIP_DIRS.intersection(directory.relative_to(COMPONENT).parts):
        return sorted(p for p in directory.rglob("*") if p.suffix in SOURCE_SUFFIXES and p.is_file())
    return [p for p in _all_sources() if directory in p.parents]


@cache
def _lines(path: Path) -> int:
    return len(path.read_text(encoding="utf-8").splitlines())


def _commands(path: Path) -> list[str]:
    if path.parent.name != "websocket":
        return []
    return _COMMAND.findall(path.read_text(encoding="utf-8"))


def _intents(path: Path) -> list[str]:
    if path.parent != COMPONENT or not path.name.startswith("intent"):
        return []
    return _INTENT.findall(path.read_text(encoding="utf-8"))


def _plural(n: int, noun: str) -> str:
    return f"{n:,} {noun if n == 1 else noun + 's'}"


def _wrap(text: str) -> list[str]:
    out = [""]
    for word in text.split(" "):
        if out[-1] and len(out[-1]) + 1 + len(word) > WRAP:
            out.append(word)
        else:
            out[-1] = f"{out[-1]} {word}" if out[-1] else word
    return out


def _describe(path: Path) -> str:
    """A new entry's first description: the module's own summary sentence."""
    if path.is_dir():
        init = path / "__init__.py"
        return _describe(init) if init.is_file() else ""
    text = path.read_text(encoding="utf-8")
    if path.suffix == ".py":
        try:
            doc = ast.get_docstring(ast.parse(text)) or ""
        except SyntaxError:
            doc = ""
    else:
        doc = _leading_comment(text)
    words = " ".join(doc.strip().split("\n\n")[0].split())
    sentence = words
    for m in re.finditer(r"[.!?](?=\s+[A-Z(])", words):
        if not words[: m.end()].endswith(_ABBREVIATIONS):
            sentence = words[: m.start()]
            break
    if len(sentence) > 140:
        sentence = sentence[:120].rsplit(" ", 1)[0] + " …"
    return sentence.rstrip(".")


def _leading_comment(text: str) -> str:
    """The comment a TypeScript module opens with (imports may come first)."""
    rest = re.sub(r"^import\b[\s\S]*?;[ \t]*$", "", text, flags=re.MULTILINE).lstrip()
    block = re.match(r"/\*+(.*?)\*/", rest, re.DOTALL)
    if block:
        return "\n".join(re.sub(r"^\s*\*? ?", "", line) for line in block.group(1).splitlines())
    lines = []
    for line in rest.splitlines():
        if not line.lstrip().startswith("//"):
            break
        lines.append(line.lstrip()[2:].strip())
    return "\n".join(lines)


# ── The tree ───────────────────────────────────────────────────────────────


@dataclass
class Node:
    """One line of the tree, with its continuation lines and children."""

    kind: str  # "entry" | "spacer" | "note"
    text: str = ""  # free entries and notes: the text as written
    name: str = ""
    counted: bool = False
    lines: int = 0
    desc: str = ""
    cont: list[str] = field(default_factory=list)
    children: list[Node] = field(default_factory=list)
    path: Path | None = None

    @property
    def is_dir(self) -> bool:
        return self.name.endswith("/")

    def entries(self) -> list[Node]:
        return [c for c in self.children if c.kind == "entry"]


def _parse(tree: list[str]) -> Node:
    root = Node("entry", name=tree[0].strip(), text=tree[0])
    stack: list[Node] = [root]
    last: Node | None = None  # the entry a continuation line belongs to
    for line in tree[1:]:
        m = _ENTRY.match(line)
        if m:
            depth = len(m.group(1)) // 4 + 1
            rest = m.group(3)
            counted = _COUNTED.match(rest)
            if counted:
                node = Node(
                    "entry",
                    name=counted.group(1),
                    counted=True,
                    lines=int(counted.group(2).replace(",", "")),
                    desc=(counted.group(3) or "").strip(),
                )
            else:
                node = Node("entry", name=rest.split(" ", 1)[0], text=rest)
            del stack[depth:]
            stack[depth - 1].children.append(node)
            stack.append(node)
            last = node
            continue
        bars = line[: len(line) - len(line.lstrip("│ "))].count("│")
        body = line.lstrip("│ ")
        parent = stack[min(max(bars - 1, 0), len(stack) - 1)]
        if not body:
            parent.children.append(Node("spacer"))
            last = None
        elif last is not None:
            last.cont.append(body.strip())
        else:
            parent.children.append(Node("note", text=body.strip()))
    return root


def _render(root: Node) -> list[str]:
    out = [root.text]

    def pad(prefix: str, text: str) -> str:
        return prefix + " " * max(1, DESC_COL - len(prefix)) + text

    def walk(node: Node, trail: str) -> None:
        entries = node.entries()
        done = False
        for child in node.children:
            if child.kind != "entry":
                bar = trail + ("    " if done else "│   ")
                out.append(bar.rstrip() if child.kind == "spacer" else pad(bar, child.text))
                continue
            last = child is entries[-1]
            head = trail + ("└── " if last else "├── ")
            if child.counted:
                count = f"({child.lines:,} lines)"
                line = head + child.name
                line += " " * max(1, COUNT_END - len(line) - len(count)) + count
                out.append(line + (f"  {child.desc}" if child.desc else ""))
            else:
                out.append(head + child.text)
            below = trail + ("    " if last else "│   ")
            cont = below + ("│   " if child.entries() else "    ")
            out.extend(pad(cont, text) for text in child.cont)
            walk(child, below)
            done = done or last

    walk(root, "")
    return out


# ── Syncing ────────────────────────────────────────────────────────────────


@dataclass
class Result:
    """The synced document and what changed on the way."""

    text: str
    added: list[str] = field(default_factory=list)
    removed: list[str] = field(default_factory=list)
    # (entry, documented lines, actual lines) for every counted entry
    lines: list[tuple[str, int, int]] = field(default_factory=list)


def _rel(path: Path) -> str:
    return path.relative_to(COMPONENT).as_posix() + ("/" if path.is_dir() else "")


def _resolve(name: str, context: Path) -> Path:
    if name.startswith("…"):
        # "…_task_base.py" under config_flow_options_task.py: the one sibling ending so.
        found = [p for p in context.iterdir() if p.name.endswith(name[1:])]
        if len(found) == 1:
            return found[0]
    return context / name.rstrip("/")


def _drop_vanished(node: Node, context: Path, result: Result) -> None:
    kept = []
    for child in node.children:
        if child.kind == "entry":
            child.path = _resolve(child.name, context)
            if child.counted and not child.path.exists():
                result.removed.append((context / child.name).relative_to(COMPONENT).as_posix())
                continue
            _drop_vanished(child, child.path if child.is_dir else context, result)
        kept.append(child)
    node.children = kept


def _listed(node: Node) -> Iterator[Path]:
    """The paths entries in *node*'s directory stand for — entries drawn
    under a file entry live beside it."""
    for child in node.entries():
        if child.path is not None:
            yield child.path
        if not child.is_dir:
            yield from _listed(child)


def _add_missing(node: Node, directory: Path, result: Result) -> None:
    if (node.counted or directory == COMPONENT) and node.entries():
        listed = set(_listed(node))
        inside = [p for p in _all_sources() if directory in p.parents]
        files = [p for p in inside if p.parent == directory and p.name != "__init__.py"]
        subdirs = sorted({directory / p.relative_to(directory).parts[0] for p in inside if p.parent != directory})
        for path in (p for p in files + subdirs if p not in listed):
            new = Node("entry", name=path.name + ("/" if path.is_dir() else ""), counted=True, desc=_describe(path), path=path)
            same_kind = [i for i, c in enumerate(node.children) if c.kind == "entry" and c.counted and c.is_dir == new.is_dir]
            anchor = same_kind or [i for i, c in enumerate(node.children) if c.kind == "entry" and c.counted]
            node.children.insert(anchor[-1] + 1 if anchor else len(node.children), new)
            result.added.append(_rel(path))
    for child in node.entries():
        if child.is_dir and child.path is not None:
            _add_missing(child, child.path, result)


def _derive(node: Node, result: Result) -> None:
    """Counts, directory facts and generated module descriptions."""
    for child in node.entries():
        if child.counted and child.path is not None:
            path = child.path
            if path.is_dir():
                sources = _sources(path)
                lines = sum(_lines(p) for p in sources)
                commands = sum(len(_commands(p)) for p in sources)
                facts = ([_plural(commands, "command")] if commands else []) + [_plural(len(sources), "file")]
                human = _FACTS.sub("", child.desc, count=1)
                child.desc = ", ".join(facts) + (f" — {human}" if human else "")
            else:
                lines = _lines(path)
                listing = [("command", c) for c in _commands(path)] or [("intent", i) for i in _intents(path)]
                if listing:
                    noun = listing[0][0]
                    names = [name for _, name in listing]
                    text = f"{_plural(len(names), noun)}: " + ", ".join(names)
                    child.desc, *child.cont = _wrap(text)
            result.lines.append((_rel(path), child.lines, lines))
            child.lines = lines
        _derive(child, result)


def sync(doc: str) -> Result:
    """*doc* (LF line endings) with everything derived brought up to date."""
    result = Result(doc)
    lines = doc.split("\n")
    heading = lines.index("## File Structure")
    start = next(i for i in range(heading, len(lines)) if lines[i].startswith("```"))
    end = next(i for i in range(start + 1, len(lines)) if lines[i].startswith("```"))

    root = _parse(lines[start + 1 : end])
    root.path = COMPONENT
    _drop_vanished(root, COMPONENT, result)
    _add_missing(root, COMPONENT, result)
    _derive(root, result)
    lines[start + 1 : end] = _render(root)

    text = "\n".join(lines)
    header = _HEADER.search(text)
    if header:
        py = sum(1 for p in _all_sources() if p.suffix == ".py")
        ts = sum(1 for p in _all_sources() if p.suffix == ".ts")
        figures = f"{py + ts:,} source files ({py:,} Python + {ts:,} TypeScript)"
        text = text[: header.start()] + figures + text[header.end() :]
    result.text = text
    return result


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=(__doc__ or "").splitlines()[0])
    parser.add_argument("--check", action="store_true", help="report and exit 1 when the doc is stale; write nothing")
    parser.add_argument("--quiet", action="store_true", help="print only modules added or dropped")
    args = parser.parse_args(argv)

    raw = DOC.read_bytes()
    crlf = b"\r\n" in raw
    text = raw.decode("utf-8").replace("\r\n", "\n")
    result = sync(text)
    stale = result.text != text
    for rel in result.added:
        print(f"docs/ARCHITECTURE.md: added {rel} — check its description")
    for rel in result.removed:
        print(f"docs/ARCHITECTURE.md: dropped {rel} (gone)")
    if not args.quiet or args.check:
        print(f"docs/ARCHITECTURE.md: {'stale' if args.check else 'updated'}" if stale else "docs/ARCHITECTURE.md: up to date")
    if args.check:
        return 1 if stale else 0
    if stale:
        out = result.text.replace("\n", "\r\n") if crlf else result.text
        DOC.write_bytes(out.encode("utf-8"))
    return 0


if __name__ == "__main__":
    sys.exit(main())
