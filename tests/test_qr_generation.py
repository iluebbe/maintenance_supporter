"""Tests for QR code generation helpers."""

from __future__ import annotations

from unittest.mock import MagicMock

import pytest

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

    def test_no_urls_relative(self) -> None:
        hass = _make_hass()
        url = build_qr_url(hass, "e1")
        assert url.startswith("/maintenance-supporter")

    def test_trailing_slash_stripped(self) -> None:
        hass = _make_hass(external_url="https://my.ha.example/")
        url = build_qr_url(hass, "e1")
        assert "example//maintenance" not in url
        assert "example/maintenance" in url


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
