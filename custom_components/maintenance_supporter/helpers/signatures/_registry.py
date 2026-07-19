"""Assembles the full signature catalog from the category data modules."""

from __future__ import annotations

from . import air, cars, garden, heating, home_it, kitchen, locks, pets, printers, transports, vacuums, wallboxes, xiaomi
from ._model import IntegrationSignature

_MODULES = (air, cars, garden, heating, home_it, kitchen, locks, pets, printers, transports, vacuums, wallboxes, xiaomi)

SIGNATURES: dict[str, IntegrationSignature] = {}
for _mod in _MODULES:
    for _domain, _sig in _mod.SIGNATURES.items():
        if _domain in SIGNATURES:  # pragma: no cover — tripwired
            raise ValueError(
                f"duplicate signature domain {_domain!r} in {_mod.__name__}"
            )
        SIGNATURES[_domain] = _sig
