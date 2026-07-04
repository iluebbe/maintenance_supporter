"""Backward-compat re-export shim for the task WS handlers.

The handlers were split (module modularization refactor) across tasks_validation
/ tasks_persist / tasks_crud / tasks_lifecycle / tasks_actions / tasks_history.
This shim keeps the historical `...websocket.tasks import X` import path stable
for the test suite, the websocket command registration, and the sibling
production modules. ``__all__`` makes the re-exports explicit for mypy --strict.
"""

from .tasks_actions import (
    ws_complete_task,
    ws_quick_complete_task,
    ws_reset_task,
    ws_skip_task,
)
from .tasks_crud import (
    async_delete_task,
    ws_create_task,
    ws_delete_task,
    ws_duplicate_task,
    ws_update_task,
)
from .tasks_history import ws_update_history_entry
from .tasks_lifecycle import (
    _is_recurring_schedule,
    ws_archive_task,
    ws_list_tasks,
    ws_unarchive_task,
)
from .tasks_persist import (
    async_create_task_simple,
    async_persist_task,
)
from .tasks_validation import (
    _SAFE_URL_SCHEMES,
    _TRIGGER_ALLOWED_KEYS,
    _TRIGGER_REQUIRED_FIELDS,
    _VALID_TRIGGER_TYPES,
    _check_nfc_tag_duplicate,
    _is_safe_url,
    _validate_compound_trigger,
    _validate_trigger_config,
)

__all__ = [
    "_SAFE_URL_SCHEMES",
    "_TRIGGER_ALLOWED_KEYS",
    "_TRIGGER_REQUIRED_FIELDS",
    "_VALID_TRIGGER_TYPES",
    "_check_nfc_tag_duplicate",
    "_is_recurring_schedule",
    "_is_safe_url",
    "_validate_compound_trigger",
    "_validate_trigger_config",
    "async_create_task_simple",
    "async_delete_task",
    "async_persist_task",
    "ws_archive_task",
    "ws_complete_task",
    "ws_create_task",
    "ws_delete_task",
    "ws_duplicate_task",
    "ws_list_tasks",
    "ws_quick_complete_task",
    "ws_reset_task",
    "ws_skip_task",
    "ws_unarchive_task",
    "ws_update_history_entry",
    "ws_update_task",
]
