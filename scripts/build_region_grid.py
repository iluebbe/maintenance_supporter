"""Build the offline region grid shipped in custom_components/.../data/regions/.

Dev-only tool, standard library only. The integration reads the file it
writes with the standard library as well (zlib), see ``helpers/region.py``.

Source: Natural Earth, 1:10m Cultural Vectors, Admin 1 – States, Provinces
(ne_10m_admin_1_states_provinces). Public domain —
https://www.naturalearthdata.com/about/terms-of-use/
GeoJSON copy used: https://github.com/nvkelso/natural-earth-vector
(geojson/ne_10m_admin_1_states_provinces.geojson).

Only the countries whose templates carry rules below the country level are
rasterized, each over its own bounding box. Natural Earth's units are
grouped where the rules follow a larger unit: Belgian provinces into the
three regions, Italian provinces into regions, the UK's counties into its
four nations.

Two levels keep the file small and the borders sharp: a coarse grid of
0.1° cells, and for every coarse cell that more than one region shares, a
block of 10 × 10 fine cells (0.01°, about 1 km) — so lower Manhattan is New
York, not New Jersey, and Washington DC is not Virginia. Sea is dropped
inside a coarse cell (a cell with land of one region is that region), which
also keeps thin islands such as the Florida Keys.

Output ``regions.bin``:
  b"MSRG2\\n", uint32 big-endian header length, header (UTF-8 JSON), then per
  country one zlib blob: uint8[rows][cols] coarse cells — row 0 = the
  southern edge, col 0 = the western edge; 0 = no region, 255 = see the fine
  block, n = header codes[n - 1] — followed by the fine blocks, 100 bytes
  each (row-major, south to north), in the order of their coarse cells.
  Header: {"source": …, "countries": {"US": {"lat0", "lon0", "step", "fine",
  "rows", "cols", "codes", "offset", "length"}}, "names": {"US-NY": "New York", …}}

Usage:
  python scripts/build_region_grid.py <ne_10m_admin_1_states_provinces.geojson>
"""

from __future__ import annotations

import json
import math
import struct
import sys
import zlib
from pathlib import Path
from typing import Any

OUT = Path(__file__).resolve().parent.parent / "custom_components" / "maintenance_supporter" / "data" / "regions" / "regions.bin"
MAGIC = b"MSRG2\n"
STEP = 0.1  # coarse cell, degrees
FINE = 10  # fine cells per coarse cell side
REFINED = 255

# country: (lat_min, lat_max, lon_min, lon_max) — multiples of STEP
GRIDS: dict[str, tuple[float, float, float, float]] = {
    "US": (18.8, 71.5, -179.5, -66.8),
    "CA": (41.6, 83.2, -141.1, -52.5),
    "AU": (-43.8, -10.6, 112.9, 153.7),
    "AT": (46.3, 49.1, 9.5, 17.2),
    "BE": (49.4, 51.6, 2.5, 6.5),
    "IT": (35.4, 47.2, 6.6, 18.6),
    "GB": (49.8, 60.9, -8.7, 1.8),
}

_BE_REGIONS = {"Flemish": ("BE-VLG", "Flanders"), "Walloon": ("BE-WAL", "Wallonia"), "Capital Region": ("BE-BRU", "Brussels")}
_GB_NATIONS = {"England": ("GB-ENG", "England"), "Scotland": ("GB-SCT", "Scotland"), "Wales": ("GB-WLS", "Wales"), "Northern Ireland": ("GB-NIR", "Northern Ireland")}
# Natural Earth names some Italian regions in English, some in Italian.
_IT_NAMES = {"Sicily": "Sicilia", "Apulia": "Puglia"}


def region_of(props: dict[str, Any]) -> tuple[str, str] | None:
    """(ISO 3166-2 code, display name) of the unit the rules follow."""
    cc = props["iso_a2"]
    if cc == "BE":
        return _BE_REGIONS.get(props.get("region") or "")
    if cc == "GB":
        return _GB_NATIONS.get(props.get("geonunit") or "")
    if cc == "IT":
        code, name = props.get("region_cod"), props.get("region")
        return (code, _IT_NAMES.get(name, name)) if code and name else None
    code = props.get("iso_3166_2") or ""
    return (code, props["name"]) if code.startswith(f"{cc}-") else None


def rings(geometry: dict[str, Any]) -> list[list[tuple[float, float]]]:
    polys = geometry["coordinates"] if geometry["type"] == "MultiPolygon" else [geometry["coordinates"]]
    return [[(float(x), float(y)) for x, y in ring] for poly in polys for ring in poly]


def rasterize(features: list[tuple[int, list[list[tuple[float, float]]]]], lat0: float, lon0: float, step: float, rows: int, cols: int) -> bytearray:
    """Scanline fill (even-odd per feature, so holes stay empty) at cell centres."""
    cells = bytearray(rows * cols)
    for value, feature_rings in features:
        crossings: dict[int, list[float]] = {}
        for ring in feature_rings:
            for (x1, y1), (x2, y2) in zip(ring, ring[1:] + ring[:1], strict=True):
                if y1 == y2:
                    continue
                lo, hi = min(y1, y2), max(y1, y2)
                r0 = max(0, math.ceil((lo - lat0) / step - 0.5))
                r1 = min(rows - 1, math.floor((hi - lat0) / step - 0.5))
                for r in range(r0, r1 + 1):
                    y = lat0 + (r + 0.5) * step
                    if lo <= y < hi:
                        crossings.setdefault(r, []).append(x1 + (y - y1) * (x2 - x1) / (y2 - y1))
        fill = bytes([value])
        for r, xs in crossings.items():
            xs.sort()
            base = r * cols
            for a, b in zip(xs[0::2], xs[1::2], strict=False):
                c0 = max(0, math.ceil((a - lon0) / step - 0.5))
                c1 = min(cols - 1, math.floor((b - lon0) / step - 0.5))
                if c1 >= c0:
                    cells[base + c0 : base + c1 + 1] = fill * (c1 - c0 + 1)
    return cells


def two_levels(fine: bytearray, rows: int, cols: int) -> tuple[bytearray, bytearray]:
    """Coarse cells from the fine raster, plus the blocks of shared cells."""
    fine_cols = cols * FINE
    coarse = bytearray(rows * cols)
    blocks = bytearray()
    for r in range(rows):
        lines = [fine[(r * FINE + i) * fine_cols : (r * FINE + i + 1) * fine_cols] for i in range(FINE)]
        for c in range(cols):
            block = b"".join(line[c * FINE : (c + 1) * FINE] for line in lines)
            present = set(block) - {0}
            if len(present) == 1:
                coarse[r * cols + c] = present.pop()
            elif present:
                coarse[r * cols + c] = REFINED
                blocks += block
    return coarse, blocks


def main(geojson: str) -> None:
    data = json.loads(Path(geojson).read_text(encoding="utf-8"))
    by_country: dict[str, list[tuple[str, str, dict[str, Any]]]] = {}
    for feature in data["features"]:
        props = feature["properties"]
        if props["iso_a2"] in GRIDS and feature.get("geometry"):
            found = region_of(props)
            if found:
                by_country.setdefault(props["iso_a2"], []).append((*found, feature["geometry"]))

    header: dict[str, Any] = {
        "source": "Natural Earth 1:10m Admin 1 – States, Provinces (public domain), rasterized by scripts/build_region_grid.py",
        "countries": {},
        "names": {},
    }
    blobs: list[bytes] = []
    offset = 0
    for cc, (lat0, lat1, lon0, lon1) in GRIDS.items():
        units = by_country[cc]
        codes = sorted({code for code, _, _ in units})
        assert len(codes) < REFINED, cc
        index = {code: i + 1 for i, code in enumerate(codes)}
        for code, name, _ in units:
            header["names"].setdefault(code, name)
        rows, cols = round((lat1 - lat0) / STEP), round((lon1 - lon0) / STEP)
        fine = rasterize([(index[code], rings(geometry)) for code, _, geometry in units], lat0, lon0, STEP / FINE, rows * FINE, cols * FINE)
        coarse, blocks = two_levels(fine, rows, cols)
        blob = zlib.compress(bytes(coarse + blocks), 9)
        header["countries"][cc] = {
            "lat0": lat0,
            "lon0": lon0,
            "step": STEP,
            "fine": FINE,
            "rows": rows,
            "cols": cols,
            "codes": codes,
            "offset": offset,
            "length": len(blob),
        }
        print(f"{cc}: {len(codes)} regions, {rows}x{cols} cells, {len(blocks) // FINE**2} refined, {len(blob)} bytes")
        blobs.append(blob)
        offset += len(blob)
    raw_header = json.dumps(header, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_bytes(MAGIC + struct.pack(">I", len(raw_header)) + raw_header + b"".join(blobs))
    print(f"wrote {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main(*sys.argv[1:])
