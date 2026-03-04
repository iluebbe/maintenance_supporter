"""QR code generation helpers for Maintenance Supporter."""

from __future__ import annotations

import logging
import urllib.parse
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

from .qrcodegen import QrCode

_LOGGER = logging.getLogger(__name__)

# Map QR action to embedded icon type
_ACTION_ICON_MAP: dict[str, str] = {"view": "info", "complete": "check"}


def build_qr_url(
    hass: HomeAssistant,
    entry_id: str,
    task_id: str | None = None,
    action: str = "view",
    base_url_override: str | None = None,
    url_mode: str = "server",
) -> str:
    """Build the URL to encode in a QR code.

    url_mode controls the URL scheme:
      - "companion": homeassistant://navigate/… (Companion App deep link, most persistent)
      - "local": http://homeassistant.local:8123/… (mDNS, survives IP changes)
      - "server": auto-detected server URL (current HA URL)

    For "server" mode, resolution order: base_url_override > get_url() > external > internal.
    Raises ValueError only in "server" mode when no URL can be determined.
    """
    if url_mode == "companion":
        base = "homeassistant://navigate"
    elif url_mode == "local":
        base = "http://homeassistant.local:8123"
    elif base_url_override:
        base = base_url_override.rstrip("/")
    else:
        # Try HA's get_url() which considers external/internal/cloud URLs
        try:
            from homeassistant.helpers.network import get_url
            base = get_url(hass).rstrip("/")
        except Exception:
            if hass.config.external_url:
                base = hass.config.external_url.rstrip("/")
            elif hass.config.internal_url:
                base = hass.config.internal_url.rstrip("/")
            else:
                raise ValueError(
                    "No Home Assistant URL configured. "
                    "Set an external or internal URL in Settings → System → Network."
                )

    params: dict[str, str] = {"entry_id": entry_id}
    if task_id:
        params["task_id"] = task_id
    if action and action != "view":
        params["action"] = action

    query = urllib.parse.urlencode(params)
    return f"{base}/maintenance-supporter?{query}"


def _icon_elements(icon: str, cx: float, cy: float, r: float, fill: str) -> str:
    """Return SVG elements for an icon centered at (cx, cy) fitting within radius r."""
    if icon == "info":
        # Letter "i": dot on top + vertical stem
        dot_cy = cy - r * 0.38
        dot_r = r * 0.13
        stem_x = cx - r * 0.10
        stem_y = cy - r * 0.12
        stem_w = r * 0.20
        stem_h = r * 0.58
        stem_rx = r * 0.06
        return (
            f'<circle cx="{cx:.2f}" cy="{dot_cy:.2f}" r="{dot_r:.2f}" fill="{fill}"/>'
            f'<rect x="{stem_x:.2f}" y="{stem_y:.2f}" width="{stem_w:.2f}" '
            f'height="{stem_h:.2f}" rx="{stem_rx:.2f}" fill="{fill}"/>'
        )
    if icon == "check":
        # Checkmark polyline
        sw = r * 0.22
        x1, y1 = cx - r * 0.38, cy + r * 0.02
        x2, y2 = cx - r * 0.08, cy + r * 0.35
        x3, y3 = cx + r * 0.42, cy - r * 0.30
        return (
            f'<polyline points="{x1:.2f},{y1:.2f} {x2:.2f},{y2:.2f} {x3:.2f},{y3:.2f}" '
            f'fill="none" stroke="{fill}" stroke-width="{sw:.2f}" '
            f'stroke-linecap="round" stroke-linejoin="round"/>'
        )
    return ""


def generate_qr_svg(
    url: str,
    border: int = 2,
    dark: str = "#000000",
    light: str = "#FFFFFF",
    icon: str | None = None,
) -> str:
    """Generate a QR code as an SVG string.

    Returns raw SVG markup (no data URI wrapping).
    When icon is set ("info" or "check"), uses HIGH error correction and
    embeds a circular logo with the icon in the center of the QR code.
    """
    ecc = QrCode.Ecc.HIGH if icon else QrCode.Ecc.MEDIUM
    qr = QrCode.encode_text(url, ecc)
    svg = qr.to_svg_str(border)
    # Replace default colors if custom ones are requested
    if dark != "#000000":
        svg = svg.replace('fill="#000000"', f'fill="{dark}"')
    if light != "#FFFFFF":
        svg = svg.replace('fill="#FFFFFF"', f'fill="{light}"')

    if icon:
        size = qr.get_size()
        total = size + border * 2
        cx = total / 2
        cy = total / 2
        # Logo covers ~18% of QR width — safe with HIGH ECC (30% tolerance)
        logo_r = size * 0.09
        pad = logo_r * 0.18  # white padding ring around circle

        logo_svg = (
            f'<circle cx="{cx:.2f}" cy="{cy:.2f}" r="{logo_r + pad:.2f}" fill="{light}"/>'
            f'<circle cx="{cx:.2f}" cy="{cy:.2f}" r="{logo_r:.2f}" fill="{dark}"/>'
            + _icon_elements(icon, cx, cy, logo_r * 0.70, light)
        )
        svg = svg.replace("</svg>", f"{logo_svg}\n</svg>")

    return svg


def generate_qr_svg_data_uri(
    url: str,
    border: int = 2,
    dark: str = "#000000",
    light: str = "#FFFFFF",
    icon: str | None = None,
) -> str:
    """Generate a QR code as an SVG data URI (for use in <img src>)."""
    svg = generate_qr_svg(url, border=border, dark=dark, light=light, icon=icon)
    encoded = urllib.parse.quote(svg, safe="")
    return f"data:image/svg+xml,{encoded}"
