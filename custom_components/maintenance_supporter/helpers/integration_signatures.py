"""Compatibility shim — the catalog moved to ``helpers/signatures/``.

Split 2026-07-19 (the data dict had grown past 1,400 lines): dataclasses
and matcher/trigger mechanics live in ``signatures/_model``, the entries
in one data module per category, assembly in ``signatures/_registry``.
Import from here or from the package — both stay supported."""

from __future__ import annotations

from .signatures import (
    SIGNATURES,
    ConsumableSignature,
    IntegrationSignature,
    build_setup_trigger,
    discover_integration_setups,
    proposal_name_variants,
    task_name_variants,
)

__all__ = [
    "SIGNATURES",
    "ConsumableSignature",
    "IntegrationSignature",
    "build_setup_trigger",
    "discover_integration_setups",
    "proposal_name_variants",
    "task_name_variants",
]
