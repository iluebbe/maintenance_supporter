"""The typed data shapes (models/shapes.py) against the frontend and the code.

Typing audit 2026-10-25: the stored and served dicts had no types, and the
first types to add them leave a gap mypy does not close — it checks
``d["key"]`` against a TypedDict but accepts any key in ``d.get("key")``.
These tests guard what mypy cannot:

* every shape declares the same keys as its interface in
  ``frontend-src/types.ts``, and the WS task summary the keys of
  ``MaintenanceTask`` (the #48/#50 class: a field one side has and the
  other drops);
* every ``.get`` / ``.pop`` / ``in`` on a name annotated with a shape asks
  for a key the shape declares;
* no ``_``-prefixed key is read that nothing writes, and no adaptive_config
  key is declared that nothing writes — the class of the dead learning
  branch the audit found (a recommendation read from ``_seasonal_factors``
  and ``weibull_eta``, which no code ever stored).
"""

from __future__ import annotations

import ast
import re
import typing
from collections.abc import Iterator
from functools import cache
from pathlib import Path

from custom_components.maintenance_supporter import const
from custom_components.maintenance_supporter.models import shapes

_PKG = Path(__file__).resolve().parents[1] / "custom_components" / "maintenance_supporter"
_TYPES_TS = _PKG / "frontend-src" / "types.ts"

# Shapes typed inline in TypeScript (no interface of their own).
_INLINE_IN_TS = {"UsedPart", "ScheduleEnds"}


@cache
def _shape_classes() -> dict[str, type]:
    return {
        name: cls for name, cls in vars(shapes).items() if isinstance(cls, type) and typing.is_typeddict(cls)
    }


def _shape_keys(cls: type) -> frozenset[str]:
    return frozenset(cls.__required_keys__ | cls.__optional_keys__)  # type: ignore[attr-defined]


@cache
def _ts_source() -> str:
    text = _TYPES_TS.read_text(encoding="utf-8")
    text = re.sub(r"/\*.*?\*/", "", text, flags=re.S)
    return re.sub(r"//[^\n]*", "", text)


def _ts_interface_keys(name: str) -> set[str]:
    """Top-level property names of ``export interface <name>``."""
    src = _ts_source()
    match = re.search(rf"export interface {name}\b[^{{]*\{{", src)
    assert match, f"interface {name} not found in types.ts"
    keys: set[str] = set()
    depth, statement = 1, ""
    for ch in src[match.end() :]:
        if depth == 1 and ch in ";\n":
            statement = ""
            continue
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                break
        elif depth == 1:
            statement += ch
            prop = re.match(r"\s*(\w+)\??\s*:", statement)
            if prop:
                keys.add(prop.group(1))
    return keys


def test_shapes_declare_the_keys_of_their_typescript_interface() -> None:
    mismatches = []
    for name, cls in _shape_classes().items():
        if name in _INLINE_IN_TS or name in shapes.BACKEND_ONLY_SHAPES:
            continue
        python = _shape_keys(cls) - shapes.BACKEND_ONLY_KEYS.get(name, frozenset())
        ts = _ts_interface_keys(shapes.TS_INTERFACES.get(name, name))
        if python != ts:
            mismatches.append(f"{name}: backend only {sorted(python - ts)}, frontend only {sorted(ts - python)}")
    assert not mismatches, "\n".join(mismatches)


def test_ws_task_summary_carries_the_keys_of_maintenance_task() -> None:
    """``_build_task_summary`` is the producer of the frontend's
    ``MaintenanceTask``: a key one side has and the other lacks is either a
    persisted field the panel never sees or a field the panel reads and
    never gets."""
    tree = ast.parse((_PKG / "websocket" / "__init__.py").read_text(encoding="utf-8"))
    builder = next(n for n in tree.body if isinstance(n, ast.FunctionDef) and n.name == "_build_task_summary")
    returned = [n for n in ast.walk(builder) if isinstance(n, ast.Return)][-1].value
    assert returned is not None
    summary = {
        key.value
        for node in ast.walk(returned)
        if isinstance(node, ast.Dict)
        for key in node.keys
        if isinstance(key, ast.Constant)
    }
    # Added per task by _build_object_response, after the summary is built.
    summary |= {"document_count"}
    ts = _ts_interface_keys("MaintenanceTask")
    assert summary == ts, f"summary only {sorted(summary - ts)}, frontend only {sorted(ts - summary)}"


# --- key accesses in the integration's own code ------------------------------


def _const_value(node: ast.AST) -> str | None:
    """The string key a node stands for: a literal or a const.py constant."""
    if isinstance(node, ast.Constant) and isinstance(node.value, str):
        return node.value
    if isinstance(node, ast.Name | ast.Attribute):
        name = node.id if isinstance(node, ast.Name) else node.attr
        value = getattr(const, name, None) if name.isupper() else None
        return value if isinstance(value, str) else None
    return None


@cache
def _sources() -> tuple[tuple[str, ast.Module], ...]:
    return tuple(
        (path.relative_to(_PKG).as_posix(), ast.parse(path.read_text(encoding="utf-8")))
        for path in sorted(_PKG.rglob("*.py"))
        if not any(part.startswith("frontend") for part in path.relative_to(_PKG).parts)
    )


_SEQUENCES = {"list", "Sequence", "Iterable", "tuple", "Collection", "MutableSequence"}


def _shape_of(annotation: ast.AST | None) -> tuple[str | None, str | None]:
    """(the shape an annotation names, the shape of its elements)."""
    names = _shape_classes()
    if annotation is None:
        return None, None
    if isinstance(annotation, ast.Name) and annotation.id in names:
        return annotation.id, None
    if isinstance(annotation, ast.BinOp):  # X | None
        left, right = _shape_of(annotation.left), _shape_of(annotation.right)
        return left[0] or right[0], left[1] or right[1]
    if (
        isinstance(annotation, ast.Subscript)
        and isinstance(annotation.value, ast.Name)
        and annotation.value.id in _SEQUENCES
    ):
        inner = annotation.slice.elts[0] if isinstance(annotation.slice, ast.Tuple) else annotation.slice
        return None, _shape_of(inner)[0]
    return None, None


def _return_shape(annotation: ast.AST | None) -> tuple[str | None, str | None]:
    """(the shape a return annotation names, the shape of its elements or
    dict values): ``StoredTask | None``, ``dict[str, StoredTask]``."""
    if (
        isinstance(annotation, ast.Subscript)
        and isinstance(annotation.value, ast.Name)
        and annotation.value.id in {"dict", "Mapping"}
        and isinstance(annotation.slice, ast.Tuple)
    ):
        return None, _shape_of(annotation.slice.elts[1])[0]
    return _shape_of(annotation)


@cache
def _typed_returns() -> dict[str, tuple[str | None, str | None]]:
    """Functions whose return annotation names a shape (``merged_task``),
    by name; a name defined with different returns is left out."""
    seen: dict[str, set[tuple[str | None, str | None]]] = {}
    for _rel, tree in _sources():
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef | ast.AsyncFunctionDef):
                seen.setdefault(node.name, set()).add(_return_shape(node.returns))
    return {name: next(iter(shapes)) for name, shapes in seen.items() if len(shapes) == 1 and shapes != {(None, None)}}


def _called_name(node: ast.AST) -> str | None:
    """``f(...)`` / ``x.f(...)`` / ``f(...) or {}`` -> ``f``."""
    if isinstance(node, ast.BoolOp) and node.values:
        return _called_name(node.values[0])
    if isinstance(node, ast.Call):
        func = node.func
        return func.id if isinstance(func, ast.Name) else func.attr if isinstance(func, ast.Attribute) else None
    return None


@cache
def _typed_attributes() -> dict[str, tuple[str | None, str | None]]:
    """Dataclass fields of the models annotated with a shape (``task.history``)."""
    out: dict[str, tuple[str | None, str | None]] = {}
    for rel, tree in _sources():
        if not rel.startswith("models/") or rel == "models/shapes.py":
            continue
        for cls in (n for n in tree.body if isinstance(n, ast.ClassDef)):
            for item in cls.body:
                if isinstance(item, ast.AnnAssign) and isinstance(item.target, ast.Name):
                    shape = _shape_of(item.annotation)
                    if shape != (None, None):
                        out[item.target.id] = shape
    return out


def _iter_source(node: ast.AST) -> ast.AST:
    """``reversed(x)`` / ``sorted(x)`` / ``list(x)`` / ``x[a:b]`` iterate x."""
    if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.args:
        if node.func.id in {"reversed", "sorted", "list", "enumerate"}:
            return _iter_source(node.args[0])
    if isinstance(node, ast.Subscript) and isinstance(node.slice, ast.Slice):
        return _iter_source(node.value)
    return node


class _ShapeReads(ast.NodeVisitor):
    """Collects (shape, key, line) for key reads on shape-typed expressions."""

    def __init__(self) -> None:
        self.scopes: list[dict[str, tuple[str | None, str | None]]] = [{}]
        self.reads: list[tuple[str, str, int]] = []

    def _lookup(self, node: ast.AST) -> tuple[str | None, str | None]:
        if isinstance(node, ast.Name):
            for scope in reversed(self.scopes):
                if node.id in scope:
                    return scope[node.id]
        if isinstance(node, ast.Attribute):
            return _typed_attributes().get(node.attr, (None, None))
        return None, None

    def _bind(self, target: ast.AST, shape: tuple[str | None, str | None]) -> None:
        if isinstance(target, ast.Name):
            self.scopes[-1][target.id] = shape

    def _bind_loop(self, target: ast.AST, iterable: ast.AST) -> None:
        # f(...).values() / f(...).items() over a function returning dict[str, Shape]
        if (
            isinstance(iterable, ast.Call)
            and isinstance(iterable.func, ast.Attribute)
            and iterable.func.attr in {"values", "items"}
            and (name := _called_name(iterable.func.value)) in _typed_returns()
        ):
            value = _typed_returns()[name][1]
            if iterable.func.attr == "items" and isinstance(target, ast.Tuple) and len(target.elts) == 2:
                target = target.elts[1]
            self._bind(target, (value, None))
            return
        element = self._lookup(_iter_source(iterable))[1]
        if isinstance(iterable, ast.Call) and isinstance(iterable.func, ast.Name) and iterable.func.id == "enumerate":
            if isinstance(target, ast.Tuple) and len(target.elts) == 2:
                target = target.elts[1]
        self._bind(target, (element, None))

    def visit_Assign(self, node: ast.Assign) -> None:
        self.generic_visit(node)
        if len(node.targets) == 1:
            # x = merged_task(...) binds x to the shape; any other value unbinds it
            name = _called_name(node.value)
            self._bind(node.targets[0], _typed_returns().get(name or "", (None, None)))

    def visit_FunctionDef(self, node: ast.FunctionDef | ast.AsyncFunctionDef) -> None:
        scope: dict[str, tuple[str | None, str | None]] = {}
        for arg in (*node.args.posonlyargs, *node.args.args, *node.args.kwonlyargs):
            shape = _shape_of(arg.annotation)
            if shape != (None, None):
                scope[arg.arg] = shape
        self.scopes.append(scope)
        self.generic_visit(node)
        self.scopes.pop()

    visit_AsyncFunctionDef = visit_FunctionDef  # type: ignore[assignment]

    def visit_AnnAssign(self, node: ast.AnnAssign) -> None:
        self._bind(node.target, _shape_of(node.annotation))
        self.generic_visit(node)

    def visit_For(self, node: ast.For | ast.AsyncFor) -> None:
        self._bind_loop(node.target, node.iter)
        self.generic_visit(node)

    visit_AsyncFor = visit_For  # type: ignore[assignment]

    def _visit_comprehension(self, node: ast.ListComp | ast.SetComp | ast.GeneratorExp | ast.DictComp) -> None:
        self.scopes.append({})
        for generator in node.generators:
            self.visit(generator.iter)
            self._bind_loop(generator.target, generator.iter)
            for condition in generator.ifs:
                self.visit(condition)
        for part in ("elt", "key", "value"):
            if (child := getattr(node, part, None)) is not None:
                self.visit(child)
        self.scopes.pop()

    visit_ListComp = visit_SetComp = visit_GeneratorExp = visit_DictComp = _visit_comprehension  # type: ignore[assignment]

    def _record(self, receiver: ast.AST, key_node: ast.AST, line: int) -> None:
        shape = self._lookup(receiver)[0]
        key = _const_value(key_node)
        if shape is not None and key is not None:
            self.reads.append((shape, key, line))

    def visit_Call(self, node: ast.Call) -> None:
        func = node.func
        if isinstance(func, ast.Attribute) and func.attr in {"get", "pop", "setdefault"} and node.args:
            self._record(func.value, node.args[0], node.lineno)
        self.generic_visit(node)

    def visit_Subscript(self, node: ast.Subscript) -> None:
        self._record(node.value, node.slice, node.lineno)
        self.generic_visit(node)

    def visit_Compare(self, node: ast.Compare) -> None:
        if len(node.ops) == 1 and isinstance(node.ops[0], ast.In | ast.NotIn):
            self._record(node.comparators[0], node.left, node.lineno)
        self.generic_visit(node)


def test_reads_on_typed_names_ask_for_declared_keys() -> None:
    """mypy accepts ``shape.get("anything")``; this does not."""
    declared = {name: _shape_keys(cls) for name, cls in _shape_classes().items()}
    unknown = []
    for rel, tree in _sources():
        visitor = _ShapeReads()
        visitor.visit(tree)
        unknown += [f"{rel}:{line} {shape}[{key!r}]" for shape, key, line in visitor.reads if key not in declared[shape]]
    assert not unknown, "keys the shape does not declare:\n" + "\n".join(unknown)


def _key_accesses() -> Iterator[tuple[str, str, bool, str]]:
    """(key, file:line, is_write, kind) for every string-keyed access."""
    for rel, tree in _sources():
        for node in ast.walk(tree):
            where = f"{rel}:{getattr(node, 'lineno', 0)}"
            if isinstance(node, ast.Subscript):
                key = _const_value(node.slice)
                if key is not None:
                    yield key, where, isinstance(node.ctx, ast.Store | ast.Del), "subscript"
            elif isinstance(node, ast.Call):
                func = node.func
                if isinstance(func, ast.Attribute) and func.attr in {"get", "pop", "setdefault"} and node.args:
                    key = _const_value(node.args[0])
                    if key is not None:
                        yield key, where, func.attr == "setdefault", func.attr
                for keyword in node.keywords:
                    if keyword.arg:
                        yield keyword.arg, where, True, "keyword"
            elif isinstance(node, ast.Dict):
                for key_node in node.keys:
                    key = _const_value(key_node) if key_node is not None else None
                    if key is not None:
                        yield key, where, True, "dict"
            elif isinstance(node, ast.Compare) and len(node.ops) == 1 and isinstance(node.ops[0], ast.In | ast.NotIn):
                key = _const_value(node.left)
                if key is not None:
                    yield key, where, False, "in"


def test_underscore_keys_that_are_read_are_written() -> None:
    """A ``_``-prefixed key is internal: nothing outside writes it. Read
    with no writer, it is a typo or a dead branch (``_seasonal_factors``)."""
    reads: dict[str, list[str]] = {}
    written: set[str] = set()
    for key, where, is_write, _kind in _key_accesses():
        if not key.startswith("_") or key.startswith("__"):
            continue
        if is_write:
            written.add(key)
        else:
            reads.setdefault(key, []).append(where)
    dead = {key: places[:3] for key, places in reads.items() if key not in written}
    assert not dead, f"read but never written: {dead}"


def test_adaptive_config_keys_are_written_somewhere() -> None:
    """Every declared adaptive_config key has a writer: the backend (a store,
    a dict display, a WS / flow schema field) or the panel's task dialog.
    A declared key nothing writes is a read that can only see None."""
    python_strings = {
        node.value
        for rel, tree in _sources()
        if rel != "models/shapes.py"
        for node in ast.walk(tree)
        if isinstance(node, ast.Constant) and isinstance(node.value, str)
    }
    accesses = list(_key_accesses())
    reads_only = {key for key, _where, is_write, _kind in accesses if not is_write} - {
        key for key, _where, is_write, _kind in accesses if is_write
    }
    frontend = "\n".join(
        path.read_text(encoding="utf-8")
        for path in (_PKG / "frontend-src").rglob("*.ts")
        if not {"__tests__", "node_modules"} & set(path.parts) and path.name != "types.ts"
    )
    unwritten = [
        key
        for key in sorted(_shape_keys(shapes.AdaptiveConfig))
        if (key not in python_strings or key in reads_only) and not re.search(rf"\b{key}\s*:", frontend)
    ]
    assert not unwritten, f"adaptive_config keys nothing writes: {unwritten}"


def test_computed_task_fields_are_attributes_not_keys() -> None:
    """The coordinator publishes a ``TaskResult`` per task; the computed
    fields are its attributes. The old ``_status`` / ``_next_due`` / ...
    keys on the task dict read None forever — no production code names one."""
    import dataclasses

    from custom_components.maintenance_supporter.models.task_result import TaskResult

    retired = {f"_{field.name}" for field in dataclasses.fields(TaskResult) if field.name != "task"}
    hits = [
        f"{rel}:{node.lineno} {node.value}"
        for rel, tree in _sources()
        for node in ast.walk(tree)
        if isinstance(node, ast.Constant) and node.value in retired
    ]
    assert not hits, "\n".join(hits)


# --- the stored task dict --------------------------------------------------------


def _export_task_keys() -> set[str]:
    """The task keys the JSON export copies (``tdata.get(...)`` / ``tdata[...]``)."""
    tree = next(tree for rel, tree in _sources() if rel == "export.py")
    keys: set[str] = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute) and node.func.attr == "get" and node.args:
            receiver, key_node = node.func.value, node.args[0]
        elif isinstance(node, ast.Subscript):
            receiver, key_node = node.value, node.slice
        else:
            continue
        if isinstance(receiver, ast.Name) and receiver.id == "tdata" and (key := _const_value(key_node)):
            keys.add(key)
    return keys


def test_stored_task_declares_what_the_writers_store() -> None:
    """Every key the export copies, the model serializes, the Store splits
    off and the import accepts is a StoredTask key — a stored field the shape
    lacks is one the typed reads cannot see."""
    from custom_components.maintenance_supporter import storage
    from custom_components.maintenance_supporter.models.maintenance_task import MaintenanceTask
    from custom_components.maintenance_supporter.websocket import io

    model = MaintenanceTask.from_dict(
        {
            "name": "Filter",
            "last_planned_due": "2026-01-01",
            "planned_day": 3,
            "due_override": "2026-02-01",
            "schedule_time": "08:00",
            "last_performed": "2026-01-01",
            "created_at": "2025-01-01",
            "trigger_config": {"type": "threshold", "entity_id": "sensor.x", "trigger_above": 1},
            "notes": "n",
            "documentation_url": "https://example.org",
            "custom_icon": "mdi:filter",
            "nfc_tag_id": "tag",
            "reading_unit": "kWh",
            "readings": [{"id": "a", "name": "A"}],
            "priority": "high",
            "labels": ["x"],
            "mirror_todo_entities": ["todo.x"],
            "mirror_todo_use_default": False,
            "complete_when": {"entity_id": "binary_sensor.door", "to_state": "on"},
            "earliest_completion_days": 2,
            "ref_no": 4,
            "archived_at": "2026-03-01",
            "archived_reason": "manual",
            "paused_at": "2026-03-01",
            "paused_until": "2026-04-01",
            "responsible_user_id": "u1",
            "assignee_pool": ["u1", "u2"],
            "rotation_strategy": "round_robin",
            "checklist": ["a"],
            "adaptive_config": {"enabled": True},
            "phases": {"p1": {"name": "P1"}},
            "phase_sequence": ["p1"],
        }
    ).to_dict()
    sources = {
        "export": _export_task_keys(),
        "MaintenanceTask.to_dict": set(model),
        "the Store": set(storage._DYNAMIC_TASK_FIELDS) | set(storage._SPLIT_ONLY_TASK_FIELDS),
        "the import": set(io._TASK_FIELD_TYPES),
    }
    declared = _shape_keys(shapes.StoredTask)
    missing = {name: sorted(keys - declared) for name, keys in sources.items() if keys - declared}
    assert not missing, f"stored task keys StoredTask does not declare: {missing}"


def test_stored_task_keys_are_named_in_the_code() -> None:
    """A declared key nothing in the integration names is a guess, not a field."""
    python_strings = {
        node.value
        for rel, tree in _sources()
        if rel != "models/shapes.py"
        for node in ast.walk(tree)
        if isinstance(node, ast.Constant) and isinstance(node.value, str)
    }
    unnamed = sorted(key for key in _shape_keys(shapes.StoredTask) if key not in python_strings)
    assert not unnamed, f"StoredTask keys no code names: {unnamed}"
