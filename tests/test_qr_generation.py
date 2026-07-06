"""Tests for QR code generation helpers."""

from __future__ import annotations

from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant

from custom_components.maintenance_supporter.helpers.qr_generator import (
    build_qr_url,
    generate_qr_svg,
    generate_qr_svg_data_uri,
)

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _make_hass(
    external_url: str | None = None,
    internal_url: str | None = None,
) -> MagicMock:
    """Create a minimal mock hass with config URLs."""
    hass = MagicMock()
    hass.config.external_url = external_url
    hass.config.internal_url = internal_url
    return hass


# ---------------------------------------------------------------------------
# build_qr_url
# ---------------------------------------------------------------------------


class TestBuildQrUrl:
    """Tests for build_qr_url()."""

    def test_object_only(self) -> None:
        hass = _make_hass(external_url="https://my.ha.example")
        url = build_qr_url(hass, "entry123")
        assert url == "https://my.ha.example/maintenance-supporter?entry_id=entry123"

    def test_with_task(self) -> None:
        hass = _make_hass(external_url="https://my.ha.example")
        url = build_qr_url(hass, "entry123", task_id="task456")
        assert "entry_id=entry123" in url
        assert "task_id=task456" in url

    def test_complete_action(self) -> None:
        hass = _make_hass(external_url="https://my.ha.example")
        url = build_qr_url(hass, "e1", task_id="t1", action="complete")
        assert "action=complete" in url

    def test_view_action_omitted(self) -> None:
        """view is the default action and should not appear in the URL."""
        hass = _make_hass(external_url="https://my.ha.example")
        url = build_qr_url(hass, "e1", action="view")
        assert "action=" not in url

    def test_base_url_override(self) -> None:
        hass = _make_hass(external_url="https://my.ha.example")
        url = build_qr_url(hass, "e1", base_url_override="https://custom.url")
        assert url.startswith("https://custom.url/maintenance-supporter")

    def test_internal_fallback(self) -> None:
        hass = _make_hass(internal_url="http://192.168.1.10:8123")
        url = build_qr_url(hass, "e1")
        assert url.startswith("http://192.168.1.10:8123/maintenance-supporter")

    def test_no_urls_raises(self) -> None:
        hass = _make_hass()
        with pytest.raises(ValueError, match="No Home Assistant URL configured"):
            build_qr_url(hass, "e1")

    def test_trailing_slash_stripped(self) -> None:
        hass = _make_hass(external_url="https://my.ha.example/")
        url = build_qr_url(hass, "e1")
        assert "example//maintenance" not in url
        assert "example/maintenance" in url

    def test_companion_url_mode(self) -> None:
        hass = _make_hass()  # no URLs needed for companion mode
        url = build_qr_url(hass, "e1", url_mode="companion")
        assert url.startswith("homeassistant://navigate/maintenance-supporter")
        assert "entry_id=e1" in url

    def test_local_url_mode(self) -> None:
        hass = _make_hass()
        url = build_qr_url(hass, "e1", url_mode="local")
        assert url.startswith("http://homeassistant.local:8123/maintenance-supporter")

    def test_companion_with_task_and_action(self) -> None:
        hass = _make_hass()
        url = build_qr_url(hass, "e1", task_id="t1", action="complete", url_mode="companion")
        assert "homeassistant://navigate" in url
        assert "task_id=t1" in url
        assert "action=complete" in url


# ---------------------------------------------------------------------------
# generate_qr_svg / generate_qr_svg_data_uri
# ---------------------------------------------------------------------------


class TestGenerateQrSvg:
    """Tests for SVG generation."""

    def test_returns_svg_string(self) -> None:
        svg = generate_qr_svg("https://example.com")
        assert svg.startswith("<?xml")
        assert "<svg" in svg
        assert "</svg>" in svg

    def test_custom_colors(self) -> None:
        svg = generate_qr_svg("https://example.com", dark="#FF0000", light="#00FF00")
        assert 'fill="#FF0000"' in svg
        assert 'fill="#00FF00"' in svg
        assert 'fill="#000000"' not in svg
        assert 'fill="#FFFFFF"' not in svg

    def test_default_colors(self) -> None:
        svg = generate_qr_svg("https://example.com")
        assert 'fill="#000000"' in svg
        assert 'fill="#FFFFFF"' in svg

    def test_info_icon_embedded(self) -> None:
        svg = generate_qr_svg("https://example.com", icon="info")
        assert "<circle" in svg  # icon background + dot
        assert "<rect" in svg  # stem of "i"

    def test_check_icon_embedded(self) -> None:
        svg = generate_qr_svg("https://example.com", icon="check")
        assert "<polyline" in svg  # checkmark
        assert "<circle" in svg  # icon background

    def test_no_icon_by_default(self) -> None:
        svg = generate_qr_svg("https://example.com")
        assert "<circle" not in svg
        assert "<polyline" not in svg

    def test_icon_data_uri(self) -> None:
        uri = generate_qr_svg_data_uri("https://example.com", icon="info")
        assert uri.startswith("data:image/svg+xml,")
        assert "circle" in uri


class TestGenerateQrSvgDataUri:
    """Tests for SVG data URI generation."""

    def test_returns_data_uri(self) -> None:
        uri = generate_qr_svg_data_uri("https://example.com")
        assert uri.startswith("data:image/svg+xml,")
        assert "%3Csvg" in uri  # URL-encoded <svg

    def test_different_border(self) -> None:
        uri_small = generate_qr_svg_data_uri("https://example.com", border=1)
        uri_large = generate_qr_svg_data_uri("https://example.com", border=4)
        assert uri_small != uri_large

    def test_roundtrip_decodable(self) -> None:
        """The data URI should be decodable back to valid SVG."""
        import urllib.parse

        uri = generate_qr_svg_data_uri("https://example.com")
        svg = urllib.parse.unquote(uri.removeprefix("data:image/svg+xml,"))
        assert "<svg" in svg
        assert "</svg>" in svg


# ---------------------------------------------------------------------------
# build_qr_url — url_mode variants (local / companion) against real hass
# ---------------------------------------------------------------------------


async def test_qr_generator_build_url_local_mode(hass: HomeAssistant) -> None:
    """build_qr_url with url_mode='local' uses homeassistant.local:8123."""
    from custom_components.maintenance_supporter.helpers.qr_generator import build_qr_url

    url = build_qr_url(
        hass,
        entry_id="abc123",
        task_id="task1",
        action="view",
        url_mode="local",
    )
    assert "homeassistant.local:8123" in url
    assert "entry_id=abc123" in url


async def test_qr_generator_build_url_companion_mode(hass: HomeAssistant) -> None:
    """build_qr_url with url_mode='companion' uses homeassistant://navigate."""
    from custom_components.maintenance_supporter.helpers.qr_generator import build_qr_url

    url = build_qr_url(
        hass,
        entry_id="abc123",
        action="complete",
        url_mode="companion",
    )
    assert url.startswith("homeassistant://navigate")
    assert "entry_id=abc123" in url
    assert "action=complete" in url


# === migrated from test_cov_helpers.py (behaviour-based split) ===


def test_build_qr_url_companion_mode() -> None:
    """Line 56 area: companion mode returns homeassistant://navigate URL."""
    from custom_components.maintenance_supporter.helpers.qr_generator import build_qr_url

    hass = MagicMock()
    url = build_qr_url(hass, "abc123", task_id="t1", url_mode="companion")
    assert url.startswith("homeassistant://navigate")
    assert "abc123" in url


def test_build_qr_url_local_mode() -> None:
    """Local mode returns homeassistant.local URL."""
    from custom_components.maintenance_supporter.helpers.qr_generator import build_qr_url

    hass = MagicMock()
    url = build_qr_url(hass, "abc123", url_mode="local")
    assert url.startswith("http://homeassistant.local:8123")


def test_icon_elements_info() -> None:
    """Lines 102+: _icon_elements returns SVG for info icon."""
    from custom_components.maintenance_supporter.helpers.qr_generator import _icon_elements

    svg = _icon_elements("info", 10.0, 10.0, 5.0, "#000")
    assert "<circle" in svg
    assert "<rect" in svg


def test_icon_elements_check() -> None:
    """_icon_elements returns SVG for check icon."""
    from custom_components.maintenance_supporter.helpers.qr_generator import _icon_elements

    svg = _icon_elements("check", 10.0, 10.0, 5.0, "#FFF")
    assert "<polyline" in svg


def test_icon_elements_lightning() -> None:
    """Lines 102-117: _icon_elements returns SVG for lightning icon."""
    from custom_components.maintenance_supporter.helpers.qr_generator import _icon_elements

    svg = _icon_elements("lightning", 10.0, 10.0, 5.0, "#FFF")
    assert "<polygon" in svg


def test_icon_elements_unknown_returns_empty() -> None:
    """Line 117 (implicit): unknown icon returns empty string."""
    from custom_components.maintenance_supporter.helpers.qr_generator import _icon_elements

    svg = _icon_elements("unknown_icon", 10.0, 10.0, 5.0, "#000")
    assert svg == ""


def test_generate_qr_svg_with_icons() -> None:
    """generate_qr_svg embeds logo when icon is set (all three variants)."""
    from custom_components.maintenance_supporter.helpers.qr_generator import generate_qr_svg

    url = "https://example.com/test"
    for icon in ("info", "check", "lightning"):
        svg = generate_qr_svg(url, icon=icon)
        assert "<svg" in svg
        assert "</svg>" in svg
        # Logo circle should be embedded
        assert "<circle" in svg


def test_generate_qr_svg_no_icon() -> None:
    """generate_qr_svg without icon: no embedded logo circle from our code."""
    from custom_components.maintenance_supporter.helpers.qr_generator import generate_qr_svg

    svg = generate_qr_svg("https://example.com/test")
    assert "<svg" in svg
    assert "</svg>" in svg


def test_generate_qr_svg_custom_colors() -> None:
    """Line 56: custom dark/light color replacement in SVG."""
    from custom_components.maintenance_supporter.helpers.qr_generator import generate_qr_svg

    svg = generate_qr_svg("https://x.com", dark="#112233", light="#AABBCC")
    assert "#112233" in svg
    assert "#AABBCC" in svg
