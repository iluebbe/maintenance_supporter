"""QR code generation helpers for Maintenance Supporter."""

from __future__ import annotations

import urllib.parse
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

from .qrcodegen import QrCode


def build_qr_url(
    hass: HomeAssistant,
    entry_id: str,
    task_id: str | None = None,
    action: str = "view",
    base_url_override: str | None = None,
) -> str:
    """Build the URL to encode in a QR code.

    Resolution order for base: base_url_override > external_url > internal_url > "" (relative).
    """
    if base_url_override:
        base = base_url_override.rstrip("/")
    elif hass.config.external_url:
        base = hass.config.external_url.rstrip("/")
    elif hass.config.internal_url:
        base = hass.config.internal_url.rstrip("/")
    else:
        base = ""

    params: dict[str, str] = {"entry_id": entry_id}
    if task_id:
        params["task_id"] = task_id
    if action and action != "view":
        params["action"] = action

    query = urllib.parse.urlencode(params)
    return f"{base}/maintenance-supporter?{query}"


def generate_qr_svg(
    url: str,
    border: int = 2,
    dark: str = "#000000",
    light: str = "#FFFFFF",
) -> str:
    """Generate a QR code as an SVG string.

    Returns raw SVG markup (no data URI wrapping).
    """
    qr = QrCode.encode_text(url, QrCode.Ecc.MEDIUM)
    svg = qr.to_svg_str(border)
    # Replace default colors if custom ones are requested
    if dark != "#000000":
        svg = svg.replace('fill="#000000"', f'fill="{dark}"')
    if light != "#FFFFFF":
        svg = svg.replace('fill="#FFFFFF"', f'fill="{light}"')
    return svg


def generate_qr_svg_data_uri(
    url: str,
    border: int = 2,
    dark: str = "#000000",
    light: str = "#FFFFFF",
) -> str:
    """Generate a QR code as an SVG data URI (for use in <img src>)."""
    svg = generate_qr_svg(url, border=border, dark=dark, light=light)
    encoded = urllib.parse.quote(svg, safe="")
    return f"data:image/svg+xml,{encoded}"
