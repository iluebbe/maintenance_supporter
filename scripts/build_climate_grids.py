"""Build the offline climate grids shipped in custom_components/.../data/climate/.

Dev-only tool (needs Pillow, numpy and h5py — NOT runtime dependencies). The
integration reads the two compact files it writes with the standard library
only (zlib), see ``helpers/climate.py``.

Source: Beck, H. E., et al. High-resolution (1 km) Köppen-Geiger maps for
1901–2099 based on constrained CMIP6 projections. Scientific Data 10, 724
(2023). Licence: CC BY 4.0 — https://www.gloh2o.org/koppen/

Inputs (from the V3 downloads on figshare, article 21789074):
  koppen_geiger_tif.zip  → 1991_2020/koppen_geiger_0p5.tif
  climate_data_1p0.zip   → 1991_2020/ensemble_mean_1p0.nc

Outputs:
  koppen_0p5.bin  zlib(uint8[360][720])  class 1..30 (legend in helpers/climate.py),
                  0 = water; row 0 = 90°N..89.5°N, col 0 = 180°W..179.5°W
  temp_1p0.bin    zlib(int8[2][180][360]) coldest / warmest monthly mean air
                  temperature 1991–2020 in whole °C, -128 = no data;
                  row 0 = 89.5°N, col 0 = 179.5°W (cell centres)

Usage:
  python scripts/build_climate_grids.py <koppen_geiger_0p5.tif> <ensemble_mean_1p0.nc>
"""

from __future__ import annotations

import sys
import zlib
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "custom_components" / "maintenance_supporter" / "data" / "climate"


def main(tif: str, nc: str) -> None:
    import h5py
    import numpy as np
    from PIL import Image

    koppen = np.array(Image.open(tif), dtype=np.uint8)
    assert koppen.shape == (360, 720), koppen.shape
    assert int(koppen.max()) <= 30

    with h5py.File(nc, "r") as f:
        lat = f["lat"][:]
        lon = f["lon"][:]
        temp = f["air_temperature"][:]
    assert temp.shape == (12, 180, 360), temp.shape
    assert lat[0] > lat[-1] and lon[0] < lon[-1], "expected north-to-south rows, west-to-east columns"
    temp = np.where(temp <= -9000, np.nan, temp)
    import warnings

    with warnings.catch_warnings():
        warnings.simplefilter("ignore", RuntimeWarning)  # all-NaN ocean cells
        coldest = np.nanmin(temp, axis=0)
        warmest = np.nanmax(temp, axis=0)

    def encode(a: np.ndarray) -> np.ndarray:
        return np.where(np.isnan(a), -128, np.clip(np.round(a), -127, 127)).astype(np.int8)

    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "koppen_0p5.bin").write_bytes(zlib.compress(koppen.tobytes(), 9))
    (OUT / "temp_1p0.bin").write_bytes(zlib.compress(encode(coldest).tobytes() + encode(warmest).tobytes(), 9))
    for name in ("koppen_0p5.bin", "temp_1p0.bin"):
        print(name, (OUT / name).stat().st_size, "bytes")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
