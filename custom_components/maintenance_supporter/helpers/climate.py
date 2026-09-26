"""The home location's climate, offline — for template recommendations.

Two small rasters ship in ``data/climate/`` (built by
``scripts/build_climate_grids.py`` from Beck et al. 2023, CC BY 4.0):

* ``koppen_0p5.bin`` — zlib(uint8[360][720]): Köppen-Geiger class 1991–2020
  (1..30, see :data:`KOPPEN_CODES`; 0 = water). Row 0 covers 90°N..89.5°N,
  column 0 covers 180°W..179.5°W.
* ``temp_1p0.bin`` — zlib(int8[2][180][360]): coldest and warmest monthly
  mean air temperature 1991–2020 in whole °C (-128 = no data). Row 0 is the
  cell centred on 89.5°N, column 0 the one centred on 179.5°W.

The class alone is not enough: Berlin and Munich are "Cfb" like London, yet
outdoor taps freeze there — so frost, snow and hot summers are read from the
temperatures, humidity and aridity from the class. Everything here is a
recommendation hint; nothing is created or hidden because of it.
"""

from __future__ import annotations

import zlib
from collections.abc import Iterable
from dataclasses import dataclass
from pathlib import Path
from typing import Any

KOPPEN_CODES: tuple[str, ...] = (
    "",
    "Af", "Am", "Aw",
    "BWh", "BWk", "BSh", "BSk",
    "Csa", "Csb", "Csc", "Cwa", "Cwb", "Cwc", "Cfa", "Cfb", "Cfc",
    "Dsa", "Dsb", "Dsc", "Dsd", "Dwa", "Dwb", "Dwc", "Dwd", "Dfa", "Dfb", "Dfc", "Dfd",
    "ET", "EF",
)  # fmt: skip

# Trait codes (also the reason codes the panel translates).
TRAIT_FREEZE = "freeze"  # hard frost in winter: outdoor taps, pipes, irrigation
TRAIT_SNOW = "snow"  # a real snow winter
TRAIT_HOT_SUMMER = "hot_summer"  # air conditioning territory
TRAIT_HOT_HUMID = "hot_humid"  # tropical / humid subtropical: mould, AC condensate
TRAIT_HOT_DRY = "hot_dry"  # arid with warm summers: evaporative coolers, dust
TRAIT_TERMITES = "termites"
TRAIT_WILDFIRE = "wildfire"
TRAIT_CYCLONE = "cyclone"  # hurricane / typhoon / cyclone basins
TRAIT_TROPICAL = "tropical"  # no cold season at all
TRAIT_DAMP = "damp"  # oceanic: mould, moss on roofs, condensation
TRAIT_MEDITERRANEAN = "mediterranean"  # hot dry summers, flat roof terraces, mosquitoes
TRAIT_SEVERE_WINTER = "severe_winter"  # roof snow loads, heating cables
CLIMATE_TRAITS: tuple[str, ...] = (
    TRAIT_FREEZE,
    TRAIT_SNOW,
    TRAIT_SEVERE_WINTER,
    TRAIT_HOT_SUMMER,
    TRAIT_HOT_HUMID,
    TRAIT_HOT_DRY,
    TRAIT_DAMP,
    TRAIT_MEDITERRANEAN,
    TRAIT_TERMITES,
    TRAIT_WILDFIRE,
    TRAIT_CYCLONE,
    TRAIT_TROPICAL,
)

# Thresholds on the coldest / warmest monthly mean (°C).
FREEZE_MAX_COLDEST = 7  # Atlanta (7) and London (5) still see hard frosts; Rome (8) rarely
SNOW_MAX_COLDEST = 0  # Munich, Stockholm, Denver, Toronto
SEVERE_WINTER_MAX_COLDEST = -5  # Helsinki, Moscow, Minneapolis, Montreal
HOT_SUMMER_MIN_WARMEST = 24  # Madrid, Rome, Atlanta — not Berlin (19)
HOT_DRY_MIN_WARMEST = 21  # Denver's swamp coolers, Phoenix, Dubai
WINTER_MAX_COLDEST = 10  # above this there is no cold season to plan around

_TERMITE_CLASSES = frozenset({"Af", "Am", "Aw", "BWh", "BSh", "Cfa", "Cwa", "Csa"})
_WILDFIRE_CLASSES = frozenset({"Csa", "Csb", "BSh", "BSk"})

# Tropical-cyclone basins, coarse (lat_min, lat_max, lon_min, lon_max). A
# recommendation hint — inland cells inside a box are fine (remnant storms).
_CYCLONE_BOXES: tuple[tuple[float, float, float, float], ...] = (
    (10.0, 37.0, -100.0, -60.0),  # Gulf of Mexico, Caribbean, US south-east coast
    (12.0, 27.0, -118.0, -95.0),  # Mexican Pacific coast
    (8.0, 42.0, 105.0, 150.0),  # Philippines, Taiwan, south/east China, Korea, Japan
    (5.0, 26.0, 65.0, 95.0),  # Arabian Sea, Bay of Bengal
    (-26.0, -10.0, 30.0, 60.0),  # Mozambique, Madagascar, Mascarenes
    (-30.0, -10.0, 110.0, 160.0),  # northern and eastern Australia
    (-25.0, -10.0, 160.0, 180.0),  # south-west Pacific islands
)

_DATA_DIR = Path(__file__).resolve().parent.parent / "data" / "climate"
_KOPPEN_SHAPE = (360, 720)
_TEMP_SHAPE = (180, 360)


@dataclass(frozen=True)
class ClimateInfo:
    """What the location's climate means for maintenance."""

    koppen: str | None
    coldest_c: int | None
    warmest_c: int | None
    hemisphere: str  # "north" | "south"
    traits: frozenset[str]

    @property
    def has_winter(self) -> bool:
        """Whether there is a cold season to plan seasonal windows around.

        Unknown temperatures count as a winter — the conservative choice for
        templates written with a northern winter in mind.
        """
        return self.coldest_c is None or self.coldest_c <= WINTER_MAX_COLDEST

    def as_dict(self) -> dict[str, Any]:
        return {
            "koppen": self.koppen,
            "coldest_c": self.coldest_c,
            "warmest_c": self.warmest_c,
            "hemisphere": self.hemisphere,
            "has_winter": self.has_winter,
            "traits": sorted(self.traits),
        }


def load_grids(data_dir: Path = _DATA_DIR) -> tuple[bytes, bytes]:
    """Read and inflate both rasters (blocking — run in the executor)."""
    koppen = zlib.decompress((data_dir / "koppen_0p5.bin").read_bytes())
    temp = zlib.decompress((data_dir / "temp_1p0.bin").read_bytes())
    if len(koppen) != _KOPPEN_SHAPE[0] * _KOPPEN_SHAPE[1] or len(temp) != 2 * _TEMP_SHAPE[0] * _TEMP_SHAPE[1]:
        raise ValueError("climate grids have an unexpected size")
    return koppen, temp


def _cell(lat: float, lon: float, rows: int, cols: int) -> tuple[int, int]:
    res = 180.0 / rows
    row = min(rows - 1, max(0, int((90.0 - lat) / res)))
    col = int(((lon + 180.0) % 360.0) / res) % cols
    return row, col


def _nearest(grid: bytes, rows: int, cols: int, row: int, col: int, *, empty: int, radius: int, offset: int = 0) -> int | None:
    """The value at (row, col), else the nearest non-empty cell within
    ``radius`` rings — a coastal home often rounds into a water cell."""
    for ring in range(radius + 1):
        for dr in range(-ring, ring + 1):
            for dc in range(-ring, ring + 1):
                if max(abs(dr), abs(dc)) != ring:
                    continue
                r = row + dr
                if not 0 <= r < rows:
                    continue
                value = grid[offset + r * cols + (col + dc) % cols]
                if value != empty:
                    return value
    return None


def _signed(byte: int) -> int:
    return byte - 256 if byte > 127 else byte


def describe(lat: float, lon: float, grids: tuple[bytes, bytes]) -> ClimateInfo:
    """Classify a location — pure, so tests need neither HA nor files."""
    koppen_grid, temp_grid = grids
    krow, kcol = _cell(lat, lon, *_KOPPEN_SHAPE)
    code_index = _nearest(koppen_grid, *_KOPPEN_SHAPE, krow, kcol, empty=0, radius=3)
    koppen = KOPPEN_CODES[code_index] if code_index and code_index < len(KOPPEN_CODES) else None

    trow, tcol = _cell(lat, lon, *_TEMP_SHAPE)
    plane = _TEMP_SHAPE[0] * _TEMP_SHAPE[1]
    raw_cold = _nearest(temp_grid, *_TEMP_SHAPE, trow, tcol, empty=0x80, radius=2)
    raw_warm = _nearest(temp_grid, *_TEMP_SHAPE, trow, tcol, empty=0x80, radius=2, offset=plane)
    coldest = _signed(raw_cold) if raw_cold is not None else None
    warmest = _signed(raw_warm) if raw_warm is not None else None
    return ClimateInfo(
        koppen=koppen,
        coldest_c=coldest,
        warmest_c=warmest,
        hemisphere="south" if lat < 0 else "north",
        traits=frozenset(_traits(lat, lon, koppen, coldest, warmest)),
    )


def _traits(lat: float, lon: float, koppen: str | None, coldest: int | None, warmest: int | None) -> Iterable[str]:
    group = koppen[0] if koppen else ""
    if coldest is not None:
        if coldest <= FREEZE_MAX_COLDEST:
            yield TRAIT_FREEZE
        if coldest <= SNOW_MAX_COLDEST:
            yield TRAIT_SNOW
        if coldest <= SEVERE_WINTER_MAX_COLDEST:
            yield TRAIT_SEVERE_WINTER
    if warmest is not None:
        if warmest >= HOT_SUMMER_MIN_WARMEST:
            yield TRAIT_HOT_SUMMER
        if group == "B" and warmest >= HOT_DRY_MIN_WARMEST:
            yield TRAIT_HOT_DRY
    if group == "A" or koppen in ("Cfa", "Cwa"):
        yield TRAIT_HOT_HUMID
    if group == "A":
        yield TRAIT_TROPICAL
    if koppen in ("Cfb", "Cfc"):
        yield TRAIT_DAMP
    if koppen == "Csa":
        yield TRAIT_MEDITERRANEAN
    if koppen in _TERMITE_CLASSES:
        yield TRAIT_TERMITES
    if koppen in _WILDFIRE_CLASSES:
        yield TRAIT_WILDFIRE
    if any(la0 <= lat <= la1 and lo0 <= lon <= lo1 for la0, la1, lo0, lo1 in _CYCLONE_BOXES):
        yield TRAIT_CYCLONE


def flip_months(months: Iterable[int], hemisphere: str) -> tuple[int, ...]:
    """Northern-hemisphere months as the same season south of the equator."""
    if hemisphere != "south":
        return tuple(months)
    return tuple(sorted((m + 5) % 12 + 1 for m in months))
