"""D#182: the shopping-search store follows the HA COUNTRY, then the UI
language; ``part_search_url_template`` is user-settable and must carry {q}."""

from __future__ import annotations

from datetime import date

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType

from custom_components.maintenance_supporter.const import CONF_PART_SEARCH_URL_TEMPLATE
from custom_components.maintenance_supporter.helpers.parts import (
    build_buy_task,
    default_search_template,
    resolve_shopping_url,
    valid_search_template,
)
from custom_components.maintenance_supporter.websocket.dashboard import _build_full_settings, _search_url_default, sanitize_settings_input

from .conftest import setup_integration


@pytest.mark.parametrize(
    ("country", "host"),
    [
        ("DE", "amazon.de"),
        ("AT", "amazon.de"),
        ("CH", "amazon.de"),
        ("FR", "amazon.fr"),
        ("IT", "amazon.it"),
        ("ES", "amazon.es"),
        ("NL", "amazon.nl"),
        ("BE", "amazon.nl"),
        ("PL", "amazon.pl"),
        ("SE", "amazon.se"),
        ("TR", "amazon.com.tr"),
        ("BR", "amazon.com.br"),
        ("GB", "amazon.co.uk"),
        ("UK", "amazon.co.uk"),
        ("CA", "amazon.ca"),
        ("AU", "amazon.com.au"),
        ("JP", "amazon.co.jp"),
        ("IN", "amazon.in"),
        ("MX", "amazon.com.mx"),
        ("US", "amazon.com"),
        ("de", "amazon.de"),  # case-insensitive
    ],
)
def test_country_decides_the_store(country: str, host: str) -> None:
    # An ENGLISH UI in that country — the language must not win.
    assert default_search_template("en", country) == f"https://www.{host}/s?k={{q}}"


def test_language_is_the_fallback_when_the_country_is_unset_or_unknown() -> None:
    assert default_search_template("de", None) == "https://www.amazon.de/s?k={q}"
    assert default_search_template("de", "") == "https://www.amazon.de/s?k={q}"
    assert default_search_template("de", "XX") == "https://www.amazon.de/s?k={q}"
    assert default_search_template("sv", None) == "https://www.amazon.se/s?k={q}"
    assert default_search_template("ja", None) == "https://www.amazon.co.jp/s?k={q}"
    assert default_search_template("en", None) == "https://www.amazon.com/s?k={q}"
    assert default_search_template("xx", "XX") == "https://www.amazon.com/s?k={q}"


def test_explicit_template_wins_over_country_and_language() -> None:
    part = {"name": "Brita Maxtra"}
    assert resolve_shopping_url(part, "https://shop.example/s?q={q}", "de", "DE") == "https://shop.example/s?q=Brita+Maxtra"
    assert resolve_shopping_url(part, None, "en", "FR") == "https://www.amazon.fr/s?k=Brita+Maxtra"
    assert resolve_shopping_url(part, "   ", "en", "FR") == "https://www.amazon.fr/s?k=Brita+Maxtra"
    task = build_buy_task(part | {"id": "p1"}, 0, object_id="o", lang="en", search_template=None, today=date(2026, 9, 13), country="DE")
    assert task["documentation_url"] == "https://www.amazon.de/s?k=Brita+Maxtra"


def test_valid_search_template_requires_http_and_q() -> None:
    assert valid_search_template("https://shop.example/s?q={q}")
    assert valid_search_template("http://shop.example/{q}")
    assert not valid_search_template("")
    assert not valid_search_template("https://shop.example/s")  # no {q}
    assert not valid_search_template("ftp://shop.example/{q}")
    assert not valid_search_template("shop.example/{q}")
    assert not valid_search_template("https://x/{q}" + "y" * 600)


def test_sanitiser_rejects_a_template_without_q_and_trims() -> None:
    filtered, err = sanitize_settings_input({CONF_PART_SEARCH_URL_TEMPLATE: "https://shop.example/s"})
    assert err == "invalid_search_template"
    filtered, err = sanitize_settings_input({CONF_PART_SEARCH_URL_TEMPLATE: "  https://shop.example/s?q={q} "})
    assert err is None and filtered == {CONF_PART_SEARCH_URL_TEMPLATE: "https://shop.example/s?q={q}"}
    # Blank clears → automatic.
    filtered, err = sanitize_settings_input({CONF_PART_SEARCH_URL_TEMPLATE: "  "})
    assert err is None and filtered == {CONF_PART_SEARCH_URL_TEMPLATE: ""}
    # Registry default + echo.
    assert _build_full_settings({})["general"]["part_search_url_template"] == ""
    assert _build_full_settings({}, part_search_url_default="https://www.amazon.de/s?k={q}")["general"]["part_search_url_default"] == "https://www.amazon.de/s?k={q}"


async def test_settings_default_follows_hass_country_then_language(hass: HomeAssistant) -> None:
    hass.config.country = "DE"
    hass.config.language = "en"
    assert _search_url_default(hass) == "https://www.amazon.de/s?k={q}"
    hass.config.country = None
    hass.config.language = "fr"
    assert _search_url_default(hass) == "https://www.amazon.fr/s?k={q}"


async def test_options_flow_field_validates_and_saves(hass: HomeAssistant, global_config_entry) -> None:
    await setup_integration(hass, global_config_entry)
    result = await hass.config_entries.options.async_init(global_config_entry.entry_id)
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "general_settings"})
    assert result["step_id"] == "general_settings"
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], user_input={CONF_PART_SEARCH_URL_TEMPLATE: "https://shop.example/s"}
    )
    assert result["type"] == FlowResultType.FORM
    assert result["errors"] == {CONF_PART_SEARCH_URL_TEMPLATE: "invalid_search_template"}
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], user_input={CONF_PART_SEARCH_URL_TEMPLATE: " https://shop.example/s?q={q} "}
    )
    assert result["type"] == FlowResultType.MENU
    assert global_config_entry.options[CONF_PART_SEARCH_URL_TEMPLATE] == "https://shop.example/s?q={q}"
