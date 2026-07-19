"""Suggested-setups signature catalog (split from integration_signatures.py).

Layout: ``_model`` (dataclasses + matcher/trigger mechanics), one data
module per category, ``_registry`` (merge + duplicate guard),
``_discovery``. The old import path keeps working via the shim."""

from __future__ import annotations

from ._discovery import discover_integration_setups
from ._model import (
    ConsumableSignature,
    IntegrationSignature,
    build_setup_trigger,
    task_name_variants,
)
from ._registry import SIGNATURES

__all__ = [
    "SIGNATURES",
    "ConsumableSignature",
    "IntegrationSignature",
    "build_setup_trigger",
    "discover_integration_setups",
    "task_name_variants",
]
