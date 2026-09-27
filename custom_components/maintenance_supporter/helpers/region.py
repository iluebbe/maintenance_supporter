"""The state, province or region of its country the home is in — offline.

Some duties differ below the country: New York inspects cars every year,
Florida not at all; Flanders tests them every two years, Wallonia every
year. ``data/regions/regions.bin`` holds a grid of first-level subdivisions
(ISO 3166-2 codes) for the countries whose templates carry such rules,
rasterized from Natural Earth's admin-1 map (public domain) by
``scripts/build_region_grid.py``: 0.1° cells, and 0.01° blocks where a cell
is shared by two regions. The configured location is looked up in it; the
``home_region`` setting overrides the guess (helpers/home_profile). Nothing
leaves the instance.
"""

from __future__ import annotations

import bisect
import json
import re
import struct
import zlib
from dataclasses import dataclass
from pathlib import Path
from typing import Any

MAGIC = b"MSRG2\n"
REGION_AUTO = "auto"
_CODE = re.compile(r"^[A-Z]{2}-[A-Z0-9]{1,3}$")
_DATA = Path(__file__).resolve().parent.parent / "data" / "regions" / "regions.bin"
# The names in every language (the grid carries the map source's own names,
# which mix languages: "Kärnten", "Lombardia", "Québec").
_NAMES_I18N = _DATA.parent / "names_i18n.json"
_REFINED = 255
# A home on the coast can sit in a sea cell: the nearest region within this
# many coarse cells counts (0.3°, about 30 km).
_NEAREST_RADIUS = 3


@dataclass(frozen=True)
class RegionGrid:
    """One country's grid: row 0 is the southern edge, col 0 the western."""

    lat0: float
    lon0: float
    step: float
    fine: int
    rows: int
    cols: int
    codes: tuple[str, ...]
    coarse: bytes
    refined: tuple[int, ...]  # coarse indices with a fine block, ascending
    blocks: bytes

    def _block(self, index: int) -> bytes:
        size = self.fine * self.fine
        n = bisect.bisect_left(self.refined, index)
        return self.blocks[n * size : (n + 1) * size]

    def _dominant(self, index: int) -> int:
        block = self._block(index)
        values = [v for v in block if v]
        return max(set(values), key=values.count) if values else 0

    def at(self, lat: float, lon: float) -> str | None:
        """The region at ``lat``/``lon``, else the nearest one within reach."""
        y, x = (lat - self.lat0) / self.step, (lon - self.lon0) / self.step
        row, col = int(y // 1), int(x // 1)
        if 0 <= row < self.rows and 0 <= col < self.cols:
            index = row * self.cols + col
            value = self.coarse[index]
            if value == _REFINED:
                fr, fc = int((y - row) * self.fine), int((x - col) * self.fine)
                block = self._block(index)
                value = block[fr * self.fine + fc]
                if not value:  # the sea part of a shared cell: nearest fine land
                    near = [
                        ((r - fr) ** 2 + (c - fc) ** 2, block[r * self.fine + c])
                        for r in range(self.fine)
                        for c in range(self.fine)
                        if block[r * self.fine + c]
                    ]
                    value = min(near)[1] if near else 0
            if value:
                return self.codes[value - 1]
        for radius in range(1, _NEAREST_RADIUS + 1):
            best: tuple[int, int] | None = None
            for r in range(row - radius, row + radius + 1):
                for c in range(col - radius, col + radius + 1):
                    if max(abs(r - row), abs(c - col)) != radius or not (0 <= r < self.rows and 0 <= c < self.cols):
                        continue
                    index = r * self.cols + c
                    value = self.coarse[index]
                    if value == _REFINED:
                        value = self._dominant(index)
                    distance = (r - row) ** 2 + (c - col) ** 2
                    if value and (best is None or distance < best[0]):
                        best = (distance, value)
            if best is not None:
                return self.codes[best[1] - 1]
        return None


def _read(path: Path) -> tuple[dict[str, Any], bytes]:
    raw = path.read_bytes()
    if not raw.startswith(MAGIC):
        raise ValueError("not a region grid")
    (length,) = struct.unpack(">I", raw[len(MAGIC) : len(MAGIC) + 4])
    start = len(MAGIC) + 4
    header: dict[str, Any] = json.loads(raw[start : start + length].decode("utf-8"))
    return header, raw[start + length :]


def load_region_names(path: Path = _DATA) -> dict[str, str]:
    """Every covered region's display name by ISO 3166-2 code (blocking)."""
    return dict(_read(path)[0]["names"])


def load_region_grid(country: str, path: Path = _DATA) -> RegionGrid | None:
    """The grid of ``country``, or None when it has no regions (blocking —
    run it in the executor; only this country's part is unpacked)."""
    header, body = _read(path)
    meta = header["countries"].get(country)
    if meta is None:
        return None
    rows, cols, fine = int(meta["rows"]), int(meta["cols"]), int(meta["fine"])
    data = zlib.decompress(body[meta["offset"] : meta["offset"] + meta["length"]])
    coarse = data[: rows * cols]
    refined = tuple(i for i, v in enumerate(coarse) if v == _REFINED)
    blocks = data[rows * cols :]
    if len(blocks) != len(refined) * fine * fine:
        raise ValueError(f"region grid for {country} is damaged")
    return RegionGrid(
        float(meta["lat0"]),
        float(meta["lon0"]),
        float(meta["step"]),
        fine,
        rows,
        cols,
        tuple(meta["codes"]),
        coarse,
        refined,
        blocks,
    )


def load_region_name_translations(path: Path = _NAMES_I18N) -> dict[str, dict[str, str]]:
    """``{code: {language: name}}`` (blocking); empty when the file is missing."""
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return {}
    return data if isinstance(data, dict) else {}


def localize_region_names(names: dict[str, str], translations: dict[str, dict[str, str]], lang: str) -> dict[str, str]:
    """Each region's name in ``lang`` — else English, else the map's own name."""
    out = {}
    for code, name in names.items():
        per_lang = translations.get(code) or {}
        out[code] = per_lang.get(lang) or per_lang.get("en") or name
    return out


def regions_of(country: str | None, names: dict[str, str]) -> list[dict[str, str]]:
    """The country's regions for a picker, sorted by name."""
    prefix = f"{country}-"
    return sorted(({"code": c, "name": n} for c, n in names.items() if country and c.startswith(prefix)), key=lambda r: r["name"])


def is_region_setting(value: object) -> bool:
    """``auto`` or an ISO 3166-2 code (``US-NY``, ``AT-9``, ``BE-VLG``)."""
    return value == REGION_AUTO or (isinstance(value, str) and bool(_CODE.match(value)))
