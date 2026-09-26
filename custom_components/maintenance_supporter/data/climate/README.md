# Climate grids

Two small, zlib-compressed rasters the integration uses to describe the home's
climate (Settings → Home profile, template recommendations). They are read with
the Python standard library only — see `helpers/climate.py` for the format.

| File | Content | Resolution |
|---|---|---|
| `koppen_0p5.bin` | Köppen-Geiger climate class 1991–2020 (1–30, 0 = water) | 0.5° |
| `temp_1p0.bin` | Coldest and warmest monthly mean air temperature 1991–2020 (°C) | 1° |

Built by `scripts/build_climate_grids.py` from:

> Beck, H. E., T. R. McVicar, N. Vergopolan, A. Berg, N. J. Lutsko, A. Dufour,
> Z. Zeng, X. Jiang, A. I. J. M. van Dijk, and D. G. Miralles. High-resolution
> (1 km) Köppen-Geiger maps for 1901–2099 based on constrained CMIP6
> projections. *Scientific Data* 10, 724 (2023).
> https://www.gloh2o.org/koppen/

The source data is licensed under
[Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).
These files are derived from it (resampled class grid; coldest/warmest monthly
means rounded to whole degrees).
