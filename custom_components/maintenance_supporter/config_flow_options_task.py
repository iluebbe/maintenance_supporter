"""Per-object task options flow — assembled from focused mixins.

MaintenanceOptionsFlow was split (module modularization refactor) into
config_flow_options_task_base + _crud / _add / _trigger / _adaptive / _object
mixins. This module assembles them into the final class and keeps the
`MaintenanceOptionsFlow` name importable from the original path (config_flow.py
and config_flow_options.py import it unchanged).
"""

from __future__ import annotations

from .config_flow_options_task_adaptive import AdaptiveMixin
from .config_flow_options_task_add import AddTaskMixin
from .config_flow_options_task_base import _OptionsFlowBase
from .config_flow_options_task_crud import TaskCrudMixin
from .config_flow_options_task_object import ObjectSettingsMixin
from .config_flow_options_task_trigger import TriggerStepsMixin

__all__ = ["MaintenanceOptionsFlow"]


class MaintenanceOptionsFlow(
    TaskCrudMixin,
    AddTaskMixin,
    TriggerStepsMixin,
    AdaptiveMixin,
    ObjectSettingsMixin,
    _OptionsFlowBase,
):
    """Handle maintenance object options (per-object task CRUD + triggers)."""
