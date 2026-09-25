"""Quality scale *exception-translations* (Gold): user-facing exceptions carry
a translation key, and every key the code raises exists in strings.json.

The existing i18n tests keep the 22 translation files in key/placeholder
parity with strings.json and check the values are really translated; these
tripwires close the gap between the CODE and strings.json:

* every ``translation_key="…"`` given to a raised Home Assistant exception
  (and the keys of the task-inactive wording picked at runtime) exists under
  ``exceptions`` in strings.json, with the placeholders the code passes;
* no new user-facing raise sneaks in without a translation key — the only
  exceptions are internal codes the WebSocket layer maps to its own error
  codes (listed below, each with the reason);
* every ``exceptions`` key in strings.json is still used somewhere.
"""

from __future__ import annotations

import ast
import json
import re
from pathlib import Path

COMPONENT = Path(__file__).resolve().parent.parent / "custom_components" / "maintenance_supporter"
STRINGS = COMPONENT / "strings.json"
USER_FACING = {"ServiceValidationError", "HomeAssistantError", "ConfigEntryNotReady", "ConfigEntryError", "ConfigEntryAuthFailed"}

# Raised as internal codes: the WebSocket handlers catch them and send
# ``str(err)`` as their own error code (the panel translates those codes via
# its locale files) — never shown by Home Assistant itself.
INTERNAL_CODES: dict[str, set[str]] = {
    "helpers/battery_fleet_setup.py": {
        "Battery Fleet object entry vanished after creation",
        "invalid_date",
        "not_found",
        "invalid_device",
        "not_available",
        "Battery fleet include list is full",
        "Battery fleet exclusion list is full",
    },
    "helpers/reference_numbers.py": {"Reference numbers are not loaded"},
}

# Keys chosen at runtime (coordinator._raise_if_inactive picks the wording).
RUNTIME_KEYS = {"task_inactive", "task_inactive_skip", "task_inactive_reset", "task_inactive_postpone"}


def _exceptions() -> dict[str, str]:
    data = json.loads(STRINGS.read_text(encoding="utf-8"))
    return {k: v["message"] for k, v in data.get("exceptions", {}).items()}


def _raises() -> list[tuple[str, int, str, dict[str, ast.expr], ast.Call]]:
    out = []
    for path in sorted(COMPONENT.rglob("*.py")):
        rel = path.relative_to(COMPONENT).as_posix()
        tree = ast.parse(path.read_text(encoding="utf-8"))
        for node in ast.walk(tree):
            if not (isinstance(node, ast.Raise) and isinstance(node.exc, ast.Call)):
                continue
            fn = node.exc.func
            name = fn.id if isinstance(fn, ast.Name) else fn.attr if isinstance(fn, ast.Attribute) else ""
            if name in USER_FACING:
                out.append((rel, node.lineno, name, {k.arg: k.value for k in node.exc.keywords if k.arg}, node.exc))
    return out


def _message_prefix(call: ast.Call) -> str:
    if not call.args:
        return ""
    arg = call.args[0]
    if isinstance(arg, ast.Constant) and isinstance(arg.value, str):
        return arg.value
    if isinstance(arg, ast.JoinedStr) and arg.values and isinstance(arg.values[0], ast.Constant):
        return str(arg.values[0].value).split("(")[0].strip()
    return ""


def test_user_facing_raises_carry_a_translation_key() -> None:
    missing = []
    for rel, line, name, kws, call in _raises():
        if "translation_key" in kws:
            continue
        prefix = _message_prefix(call)
        if any(prefix.startswith(p) for p in INTERNAL_CODES.get(rel, set())) and prefix:
            continue
        missing.append(f"{rel}:{line} {name}({prefix!r})")
    assert not missing, "raise without translation_key (quality scale exception-translations):\n" + "\n".join(missing)


def test_every_raised_translation_key_exists_with_its_placeholders() -> None:
    exceptions = _exceptions()
    problems = []
    for rel, line, _name, kws, _call in _raises():
        key_node = kws.get("translation_key")
        if key_node is None:
            continue
        if not isinstance(key_node, ast.Constant):
            continue  # runtime-chosen key — covered by RUNTIME_KEYS
        key = key_node.value
        if key not in exceptions:
            problems.append(f"{rel}:{line} key {key!r} missing in strings.json exceptions")
            continue
        wanted = set(re.findall(r"{(\w+)}", exceptions[key]))
        ph = kws.get("translation_placeholders")
        if ph is not None and not isinstance(ph, ast.Dict):
            continue  # placeholders built elsewhere — not statically checkable
        given = {k.value for k in ph.keys if isinstance(k, ast.Constant)} if isinstance(ph, ast.Dict) else set()
        if wanted != given:
            problems.append(f"{rel}:{line} key {key!r}: message wants {sorted(wanted)}, code passes {sorted(given)}")
    for key in RUNTIME_KEYS:
        if key not in exceptions:
            problems.append(f"runtime key {key!r} missing in strings.json exceptions")
    assert not problems, "\n".join(problems)


def test_every_exception_string_is_used() -> None:
    used = set(RUNTIME_KEYS)
    for _rel, _line, _name, kws, _call in _raises():
        node = kws.get("translation_key")
        if isinstance(node, ast.Constant):
            used.add(node.value)
    unused = sorted(set(_exceptions()) - used)
    assert not unused, f"strings.json exceptions no code raises any more: {unused}"

