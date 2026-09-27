# Region grid

One small, zlib-compressed raster the integration uses to find the state,
province or region the home is in (Settings → Home profile). Some template
rules differ below the country — New York inspects cars every year, Florida
not at all; Flanders tests them every two years, Wallonia every year — and
the templates follow the home's region where they name one. It is read with
the Python standard library only — see `helpers/region.py` for the format.

| File | Content | Resolution |
|---|---|---|
| `regions.bin` | First-level subdivisions (ISO 3166-2) of the US, Canada, Australia, Austria, Belgium (its three regions), Italy (its regions) and the UK (its four nations) | 0.1°, 0.01° where a cell is shared by two regions |

Only the location configured in Home Assistant is looked up, locally; the
*State, province or region* setting overrides the result.

`names_i18n.json` holds each region's name in the 22 languages (the map's own
names mix languages: "Kärnten", "Lombardia", "Québec").

Built by `scripts/build_region_grid.py` from Natural Earth's 1:10m
*Admin 1 – States, Provinces* map (https://www.naturalearthdata.com/), which is
in the public domain (https://www.naturalearthdata.com/about/terms-of-use/).
