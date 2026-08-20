#!/usr/bin/env python3
"""Minimal AST mutation-testing runner for the pure-logic helpers.

Why not mutmut: 2.5.1 crashes on Python 3.14 (glob API), and 3.x's
trampoline design both fights the pytest-homeassistant-custom-component
harness (its whole-suite stats run aborts) and removes the per-module test
selection this repo's speed depends on. ~200 lines under our control beat a
tool we'd have to fork; see docs/design/mutation-testing.md.

Usage (inside the dev container, on a WORK COPY — never on the bind mount):

    python scripts/mutation_check.py --targets scripts/mutation_targets.json
    python scripts/mutation_check.py --targets ... --only trigger_fallback

For every target module the runner enumerates mutation points, applies one
mutation at a time (writing ``ast.unparse`` output over the module), runs
ONLY the mapped test files, and restores the original afterwards. A test
failure (or timeout, counting as an infinite-loop kill) means the mutant is
KILLED; an exit code 0 means it SURVIVED — a spot the suite cannot see.

Mutation operators (deliberately conservative — no string mutations, they
would rewrite dict keys and produce noise, and no statement deletion):

* comparison flips:  > <-> >=,  < <-> <=,  == <-> !=,  in <-> not in,
  is <-> is not
* boolean flips:     and <-> or
* arithmetic flips:  + <-> -
* unary drop:        not X -> X
* constant flips:    True <-> False, integer/float n -> n + 1

Lines carrying ``# pragma: no mutate`` are skipped.
Exit code is always 0 unless ``--fail-on-survivors`` is given (the run is a
periodic audit, not a CI gate).
"""

from __future__ import annotations

import argparse
import ast
import copy
import json
import subprocess
import sys
import time
from pathlib import Path

_COMPARE_FLIPS: dict[type[ast.cmpop], type[ast.cmpop]] = {
    ast.Gt: ast.GtE,
    ast.GtE: ast.Gt,
    ast.Lt: ast.LtE,
    ast.LtE: ast.Lt,
    ast.Eq: ast.NotEq,
    ast.NotEq: ast.Eq,
    ast.In: ast.NotIn,
    ast.NotIn: ast.In,
    ast.Is: ast.IsNot,
    ast.IsNot: ast.Is,
}
_BINOP_FLIPS: dict[type[ast.operator], type[ast.operator]] = {
    ast.Add: ast.Sub,
    ast.Sub: ast.Add,
}


def _no_mutate_lines(source: str) -> set[int]:
    return {
        i
        for i, line in enumerate(source.splitlines(), start=1)
        if "pragma: no mutate" in line
    }


def _iter_points(tree: ast.AST, skip_lines: set[int]) -> list[tuple[int, int | None, str]]:
    """Return (index, lineno, description) for every mutation point.

    CRITICAL: the enumeration must use the exact traversal the _Mutator
    uses (NodeTransformer's depth-first generic_visit) — a first version
    collected via ast.walk (breadth-first), which mis-addressed every index
    and scrambled the survivor line numbers. A collect-only _Mutator pass
    (target=-1) IS the same traversal by construction.
    """
    collector = _Mutator(target=-1, skip_lines=skip_lines)
    collector.visit(copy.deepcopy(tree))
    return [(i, ln, desc) for i, (ln, desc) in enumerate(collector.seen)]


class _Mutator(ast.NodeTransformer):
    """Apply exactly the target-index mutation (same enumeration as above)."""

    def __init__(self, target: int, skip_lines: set[int]) -> None:
        self.target = target
        self.skip_lines = skip_lines
        self.idx = 0
        self.applied = False
        # (lineno, description) per point, in THIS traversal's order — the
        # collect pass (target=-1) records them so indices line up exactly.
        self.seen: list[tuple[int | None, str]] = []
        self._lineno: int | None = None

    def _hit(self, desc: str) -> bool:
        self.seen.append((self._lineno, desc))
        hit = self.idx == self.target
        self.idx += 1
        if hit:
            self.applied = True
        return hit

    def visit(self, node: ast.AST) -> ast.AST:
        node = super().generic_visit(node)
        lineno = getattr(node, "lineno", None)
        if lineno in self.skip_lines:
            return node
        self._lineno = lineno
        if isinstance(node, ast.Compare):
            new_ops = []
            for op in node.ops:
                if type(op) in _COMPARE_FLIPS:
                    flip = _COMPARE_FLIPS[type(op)]
                    hit = self._hit(f"{type(op).__name__} -> {flip.__name__}")
                    new_ops.append(flip() if hit else op)
                else:
                    new_ops.append(op)
            node.ops = new_ops
        elif isinstance(node, ast.BoolOp):
            flip_name = "Or" if isinstance(node.op, ast.And) else "And"
            if self._hit(f"{type(node.op).__name__} -> {flip_name}"):
                node.op = ast.Or() if isinstance(node.op, ast.And) else ast.And()
        elif isinstance(node, ast.BinOp) and type(node.op) in _BINOP_FLIPS:
            flip2 = _BINOP_FLIPS[type(node.op)]
            if self._hit(f"{type(node.op).__name__} -> {flip2.__name__}"):
                node.op = flip2()
        elif isinstance(node, ast.UnaryOp) and isinstance(node.op, ast.Not):
            if self._hit("drop not"):
                return node.operand
        elif isinstance(node, ast.Constant):
            if node.value is True or node.value is False:
                if self._hit(f"{node.value} -> {not node.value}"):
                    node.value = not node.value
            elif isinstance(node.value, (int, float)) and not isinstance(node.value, bool):
                if self._hit(f"{node.value} -> {node.value + 1}"):
                    node.value = node.value + 1
        return node


def _run_tests(test_files: list[str], timeout: int) -> str:
    """Return 'killed', 'survived' or 'timeout' for the current on-disk state."""
    try:
        proc = subprocess.run(
            [sys.executable, "-m", "pytest", *test_files, "-x", "-q",
             "-p", "no:cacheprovider", "--no-header"],
            capture_output=True,
            timeout=timeout,
        )
    except subprocess.TimeoutExpired:
        return "timeout"
    return "survived" if proc.returncode == 0 else "killed"


def mutate_module(module: str, test_files: list[str], timeout: int) -> dict:
    path = Path(module)
    original = path.read_text(encoding="utf-8")
    skip = _no_mutate_lines(original)
    tree = ast.parse(original)
    points = list(_iter_points(tree, skip))

    # Sanity: the mapped tests must PASS unmutated, or every result is noise.
    if _run_tests(test_files, timeout) != "survived":
        print(f"!! {module}: mapped tests fail on the ORIGINAL code — fix the mapping first")
        return {"module": module, "error": "baseline-red", "points": len(points)}

    survivors: list[dict] = []
    killed = 0
    timeouts = 0
    started = time.monotonic()
    try:
        for idx, lineno, desc in points:
            mutator = _Mutator(idx, skip)
            mutated_tree = mutator.visit(copy.deepcopy(tree))
            if not mutator.applied:
                continue
            path.write_text(ast.unparse(ast.fix_missing_locations(mutated_tree)), encoding="utf-8")
            verdict = _run_tests(test_files, timeout)
            if verdict == "survived":
                survivors.append({"line": lineno, "mutation": desc})
            elif verdict == "timeout":
                timeouts += 1
            else:
                killed += 1
    finally:
        path.write_text(original, encoding="utf-8")

    elapsed = time.monotonic() - started
    total = killed + timeouts + len(survivors)
    score = (killed + timeouts) / total * 100 if total else 100.0
    print(f"\n== {module}")
    print(f"   {total} mutants | killed {killed} (+{timeouts} by timeout) | "
          f"SURVIVED {len(survivors)} | score {score:.0f}% | {elapsed:.0f}s")
    for s in survivors:
        print(f"   SURVIVOR  {module}:{s['line']}  {s['mutation']}")
    return {
        "module": module,
        "total": total,
        "killed": killed,
        "timeouts": timeouts,
        "survivors": survivors,
        "score": round(score, 1),
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--targets", required=True, help="JSON mapping file")
    ap.add_argument("--only", help="substring filter on the module path")
    ap.add_argument("--timeout", type=int, default=120, help="per-mutant pytest timeout (s)")
    ap.add_argument("--report", help="write the JSON report here")
    ap.add_argument("--fail-on-survivors", action="store_true")
    args = ap.parse_args()

    targets = json.loads(Path(args.targets).read_text(encoding="utf-8"))
    results = []
    for entry in targets:
        if args.only and args.only not in entry["module"]:
            continue
        results.append(mutate_module(entry["module"], entry["tests"], args.timeout))

    if args.report:
        Path(args.report).write_text(json.dumps(results, indent=2), encoding="utf-8")
    survivors = sum(len(r.get("survivors", [])) for r in results)
    print(f"\nTOTAL: {survivors} survivor(s) across {len(results)} module(s)")
    return 1 if (args.fail_on_survivors and survivors) else 0


if __name__ == "__main__":
    raise SystemExit(main())
