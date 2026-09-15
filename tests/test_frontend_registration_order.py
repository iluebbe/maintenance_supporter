"""#184: the Lovelace card resources are registered BEFORE any store load in
the shared setup — HA serves the extra-module list at page-load time and never
re-injects later registrations into an open page, so every second the
registration sits behind a store load widens the "Custom element doesn't
exist" window on a hub that opens a dashboard while HA is still starting."""

from __future__ import annotations

from pathlib import Path

import custom_components.maintenance_supporter as ms


def _shared_setup_source() -> str:
    src = Path(ms.__file__).read_text(encoding="utf-8")
    body = src.split("async def _async_setup_shared(", 1)[1]
    # the function ends at the next top-level def
    return body.split("\nasync def ", 1)[0].split("\ndef ", 1)[0]


def test_card_registration_precedes_every_store_load() -> None:
    body = _shared_setup_source()
    reg = body.index("await async_register_card(hass)")
    for marker in ("async_load()", "async_setup_business_days(hass)", "async_register_commands(hass)"):
        assert marker in body, marker
        assert reg < body.index(marker), f"card registration must come before {marker}"
    assert body.count("await async_register_card(hass)") == 1
