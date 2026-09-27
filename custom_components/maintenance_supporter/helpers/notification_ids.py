"""The wire formats of a notification — one builder (and parser) each.

* **Tags** (``data.tag``): a newer push with the same tag replaces the older
  one on the phone, and ``clear_notification`` dismisses by it — so the
  status reminder, the completion notice and the dismissal must agree on the
  per-task tag.
* **Deep links** (``data.url`` / ``clickAction`` and the event's ``url``):
  where a tap lands in the panel — the query keys the panel's deep-link
  handler reads (``entry_id``, ``task_id``, ``tab``).
* **Action ids** (Companion buttons): ``MS_<VERB>_<entry_id>_<task_id>``,
  parsed back by the ``mobile_app_notification_action`` listener; the
  Settings test send uses ``MS_TEST_<VERB>``, which the parser ignores so a
  tap on a test button completes nothing.

They were hand-formatted at a dozen sites across the notification manager,
the notification context and the action listener (DRY audit 2026-09-26 B);
a build→parse round trip in ``tests/test_dry_round4_runtime.py`` keeps each
builder and its reader in step.
"""

from __future__ import annotations

from typing import Any
from urllib.parse import parse_qs, urlsplit

# The panel's route (``panel_custom`` url_path — see const.PANEL_NAME).
PANEL_PATH = "/maintenance-supporter"

_TAG_PREFIX = "maintenance_"
QUIET_END_TAG = f"{_TAG_PREFIX}quiet_end"
DIGEST_TAG = f"{_TAG_PREFIX}weekly_digest"
WARRANTY_TAG = f"{_TAG_PREFIX}warranty_reminder"

ACTION_PREFIX = "MS_"
_TEST_ACTION_PREFIX = f"{ACTION_PREFIX}TEST_"
# Button verb (as sent) → the action the listener performs.
ACTION_VERBS: dict[str, str] = {"COMPLETE": "complete", "SKIP": "skip", "SNOOZE": "snooze"}


def task_tag(task_id: str) -> str:
    """The per-task tag: the task's reminders, its completion notice and the
    dismissal after a button action all replace each other."""
    return f"{_TAG_PREFIX}{task_id}"


def bundle_tag(entry_id: str) -> str:
    """The per-object tag of a bundled reminder."""
    return f"{_TAG_PREFIX}bundled_{entry_id}"


def budget_tag(period: str) -> str:
    """The tag of a budget alert (``monthly`` / ``yearly``)."""
    return f"{_TAG_PREFIX}budget_{period}"


def panel_url(*, entry_id: str | None = None, task_id: str | None = None, tab: str | None = None) -> str:
    """The panel deep link: a task, else an object, else a tab, else the panel."""
    if entry_id and task_id:
        return f"{PANEL_PATH}?entry_id={entry_id}&task_id={task_id}"
    if entry_id:
        return f"{PANEL_PATH}?entry_id={entry_id}"
    if tab:
        return f"{PANEL_PATH}?tab={tab}"
    return PANEL_PATH


def parse_panel_url(url: str) -> dict[str, str]:
    """The deep-link parameters of a :func:`panel_url` (``{}`` for another
    path) — the reader side the round-trip tripwire checks the builder with."""
    parts = urlsplit(url)
    if parts.path != PANEL_PATH:
        return {}
    return {key: values[0] for key, values in parse_qs(parts.query).items() if values}


def action_id(verb: str, entry_id: str | None, task_id: str | None) -> str:
    """A Companion button's action id; ``entry_id``/``task_id`` ``None`` = the
    Settings test send (``MS_TEST_<VERB>``)."""
    if entry_id is None or task_id is None:
        return f"{_TEST_ACTION_PREFIX}{verb}"
    return f"{ACTION_PREFIX}{verb}_{entry_id}_{task_id}"


def parse_action_id(action: Any) -> tuple[str, str, str] | None:
    """``(action, entry_id, task_id)`` of one of our task buttons —
    ``action`` is ``complete`` / ``skip`` / ``snooze``.

    ``None`` for anything that is not a task button of ours (another
    integration's action, a test-send button). ``ValueError`` for one of our
    verbs whose id part is malformed — the listener logs that. The entry id
    (a ULID) carries no underscore, so the first one separates the two ids.
    """
    if not isinstance(action, str) or not action.startswith(ACTION_PREFIX):
        return None
    for verb, kind in ACTION_VERBS.items():
        prefix = f"{ACTION_PREFIX}{verb}_"
        if action.startswith(prefix):
            entry_id, _, task_id = action[len(prefix) :].partition("_")
            if not entry_id or not task_id:
                raise ValueError(f"malformed notification action {action!r}")
            return kind, entry_id, task_id
    return None
