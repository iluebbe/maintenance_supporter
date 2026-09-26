"""The home profile: house or apartment, climate and country — all local.

Drives the "Recommended for your home" section of the template gallery and
the seasonal windows / hemisphere of template tasks. Nothing leaves the
instance: the dwelling type is guessed from the floor and area registries
(and a few entity hints), the climate from the configured location via the
offline grids in :mod:`.climate`. The guess is a suggestion — the
``home_type`` setting (auto / house / apartment) always wins.
"""

from __future__ import annotations

import unicodedata
import zlib
from collections.abc import Iterable
from dataclasses import dataclass
from typing import Any

from homeassistant.core import HomeAssistant

from ..const import CONF_HOME_TYPE, DOMAIN, HOME_TYPES
from .climate import ClimateInfo, describe, load_grids

DWELLING_HOUSE = "house"
DWELLING_APARTMENT = "apartment"
DWELLING_UNKNOWN = "unknown"
HOME_TYPE_AUTO = HOME_TYPES[0]

TRAIT_RADON = "radon"
# Countries with a national radon programme and radon-prone regions — the
# test is cheap, so the hint is country-wide.
RADON_COUNTRIES = frozenset({"AT", "CA", "CH", "CZ", "DE", "FI", "FR", "GB", "IE", "NO", "SE", "US"})

TRAIT_EARTHQUAKE = "earthquake"
# High seismic hazard across most of the country; the US only on the West
# Coast and in Alaska (checked by location below).
EARTHQUAKE_COUNTRIES = frozenset(
    {
        "AL", "CL", "CO", "CR", "EC", "GR", "GT", "ID", "IR", "IS", "IT", "JP",
        "MX", "NI", "NP", "NZ", "PE", "PH", "SV", "TR", "TW",
    }
)  # fmt: skip
_US_EARTHQUAKE_BOXES = ((32.0, 49.5, -125.0, -114.0), (51.0, 72.0, -180.0, -130.0))

_GRIDS_KEY = "_climate_grids"

# Detection reasons that prove a feature of the home (template ``requires``).
_FEATURE_REASONS: dict[str, frozenset[str]] = {
    "garage": frozenset({"area_garage", "entity_garage"}),
    "basement": frozenset({"area_basement", "basement_floor"}),
    "garden": frozenset({"area_garden", "entity_lawn_mower"}),
}

# Area-name keywords, all 22 UI languages merged (a household may name rooms
# in any language). Matched as substrings of the accent-folded, lower-cased
# area / floor name. Ambiguous words are left out on purpose: "loft" (also a
# loft flat), "ático" (penthouse), "patio" and "yard"/"piha" (also a block's
# courtyard); "Tiefgarage" is caught by "garage" but that only weighs 1.
_KEYWORDS: dict[str, tuple[int, tuple[str, ...]]] = {
    # reason: (weight, keywords)
    "garden": (
        2,
        (
            "garden", "backyard", "garten", "tuin", "jardin", "giardino", "jardim", "quintal",
            "сад", "ogrod", "zahrad", "tradgard", "have", "hage", "puutarha", "kert", "bahce",
            "庭", "花园", "院子", "बगीचा", "정원", "마당",
        ),
    ),
    "shed": (
        2,
        (
            "shed", "schuppen", "gartenhaus", "schuur", "tuinhuis", "cabanon", "capanno", "cobertizo",
            "galpao", "сарай", "szopa", "kulna", "friggebod", "skur", "uthus", "vaja", "feszer", "kulube",
            "物置", "工具棚",
        ),
    ),
    "driveway": (2, ("driveway", "einfahrt", "auffahrt", "oprit", "vialetto", "podjazd", "prijezd", "uppfart", "indkorsel", "innkjorsel", "felhajto")),
    "garage": (
        1,
        (
            "garage", "carport", "garaje", "cochera", "garagem", "гараж", "garaz", "garasje", "autotalli",
            "garazs", "garaj", "ガレージ", "車庫", "车库", "गैराज", "차고",
        ),
    ),
    "basement": (
        1,
        (
            "basement", "cellar", "keller", "kelder", "sous-sol", "cantina", "seminterrato", "taverna",
            "sotano", "porao", "подвал", "підвал", "piwnica", "sklep", "kallare", "kaelder", "kælder",
            "kjeller", "kellari", "pince", "bodrum", "地下", "तहखाना", "지하",
        ),
    ),
    "attic": (
        1,
        (
            "attic", "dachboden", "spitzboden", "zolder", "grenier", "combles", "soffitta", "sottotetto",
            "desvan", "buhardilla", "sotao", "чердак", "горище", "strych", "poddasze", "podkrovi",
            "ullakko", "padlas", "cati kati", "屋根裏", "阁楼", "अटारी", "다락",
        ),
    ),
}
_BALCONY = (
    "balcony", "balkon", "balcon", "balcone", "sacada", "балкон", "balkong", "altan", "parveke",
    "erkely", "ベランダ", "バルコニー", "阳台", "बालकनी", "발코니", "베란다",
)  # fmt: skip


def _fold(text: str) -> str:
    """Lower-case and strip accents (ö→o, ž→z); keeps non-Latin scripts."""
    decomposed = unicodedata.normalize("NFKD", text.casefold())
    return "".join(ch for ch in decomposed if not unicodedata.combining(ch))


@dataclass(frozen=True)
class DwellingGuess:
    kind: str  # house | apartment | unknown
    reasons: tuple[str, ...]


def guess_dwelling(floor_levels: Iterable[int | None], names: Iterable[str], entity_hints: Iterable[str]) -> DwellingGuess:
    """Pure: house, apartment or unknown from the registries' contents.

    ``names`` are area and floor names; ``entity_hints`` the reason codes of
    house-only equipment found among the entities. Scores: 3+ → house. No
    house signal at all → apartment when there is a balcony, or when the home
    is small (one floor, at most 6 areas); anything else stays unknown.
    """
    levels = list(floor_levels)
    folded = [_fold(n) for n in names if n]
    score = 0
    reasons: list[str] = []
    if len(levels) >= 2:
        score += 2
        reasons.append("floors")
    if any(level is not None and level < 0 for level in levels):
        score += 1
        reasons.append("basement_floor")
    for reason, (weight, words) in _KEYWORDS.items():
        if any(w in name for name in folded for w in words):
            score += weight
            reasons.append(f"area_{reason}")
    for hint in sorted(set(entity_hints)):
        score += 2 if hint in ("lawn_mower", "gate") else 1
        reasons.append(f"entity_{hint}")
    if score >= 3:
        return DwellingGuess(DWELLING_HOUSE, tuple(reasons))
    if score == 0:
        if any(w in name for name in folded for w in _BALCONY):
            return DwellingGuess(DWELLING_APARTMENT, ("area_balcony",))
        area_count = len(folded) - len(levels)
        if len(levels) <= 1 and 0 < area_count <= 6:
            return DwellingGuess(DWELLING_APARTMENT, ("small_home",))
    return DwellingGuess(DWELLING_UNKNOWN, tuple(reasons))


def _entity_hints(hass: HomeAssistant) -> set[str]:
    hints: set[str] = set()
    for state in hass.states.async_all():
        domain = state.entity_id.split(".", 1)[0]
        device_class = state.attributes.get("device_class")
        if domain == "lawn_mower":
            hints.add("lawn_mower")
        elif domain == "cover" and device_class in ("garage", "gate"):
            hints.add(str(device_class))
        elif domain == "binary_sensor" and device_class == "garage_door":
            hints.add("garage")
    return hints


def detect_dwelling(hass: HomeAssistant) -> DwellingGuess:
    from homeassistant.helpers import area_registry as ar
    from homeassistant.helpers import floor_registry as fr

    floors = list(fr.async_get(hass).async_list_floors())
    areas = list(ar.async_get(hass).async_list_areas())
    return guess_dwelling(
        [f.level for f in floors],
        [a.name for a in areas] + [f.name for f in floors],
        _entity_hints(hass),
    )


async def async_climate(hass: HomeAssistant) -> ClimateInfo | None:
    """The configured location's climate (grids cached after the first read)."""
    lat, lon = hass.config.latitude, hass.config.longitude
    # 0°/0° is "Null Island" in the Gulf of Guinea — HA's unset location.
    if lat is None or lon is None or (lat == 0 and lon == 0):
        return None
    store = hass.data.setdefault(DOMAIN, {})
    grids = store.get(_GRIDS_KEY)
    if grids is None:
        try:
            grids = await hass.async_add_executor_job(load_grids)
        except (OSError, ValueError, zlib.error):
            return None
        store[_GRIDS_KEY] = grids
    return describe(float(lat), float(lon), grids)


@dataclass(frozen=True)
class HomeProfile:
    dwelling: str  # the effective one: the setting, else the guess
    dwelling_detected: str
    dwelling_reasons: tuple[str, ...]
    dwelling_source: str  # "setting" | "auto"
    country: str | None
    climate: ClimateInfo | None
    location: tuple[float, float] | None = None

    @property
    def traits(self) -> frozenset[str]:
        traits = set(self.climate.traits) if self.climate else set()
        if self.country in RADON_COUNTRIES:
            traits.add(TRAIT_RADON)
        if self.country in EARTHQUAKE_COUNTRIES or (
            self.country == "US"
            and self.location is not None
            and any(a <= self.location[0] <= b and c <= self.location[1] <= d for a, b, c, d in _US_EARTHQUAKE_BOXES)
        ):
            traits.add(TRAIT_EARTHQUAKE)
        return frozenset(traits)

    @property
    def features(self) -> frozenset[str]:
        """Equipment the detection saw (garage, basement, garden) — kept even
        when the dwelling type is overridden, the rooms are still there."""
        return frozenset(f for f, codes in _FEATURE_REASONS.items() if codes & set(self.dwelling_reasons))

    @property
    def hemisphere(self) -> str:
        return self.climate.hemisphere if self.climate else "north"

    @property
    def has_winter(self) -> bool:
        return self.climate.has_winter if self.climate else True

    def as_dict(self) -> dict[str, Any]:
        return {
            "dwelling": self.dwelling,
            "dwelling_detected": self.dwelling_detected,
            "dwelling_reasons": list(self.dwelling_reasons),
            "dwelling_source": self.dwelling_source,
            "country": self.country,
            "hemisphere": self.hemisphere,
            "climate": self.climate.as_dict() if self.climate else None,
            "traits": sorted(self.traits),
            "features": sorted(self.features),
        }


async def async_home_profile(hass: HomeAssistant) -> HomeProfile:
    from .global_options import global_option

    guess = detect_dwelling(hass)
    setting = str(global_option(hass, CONF_HOME_TYPE) or HOME_TYPE_AUTO)
    dwelling = setting if setting in (DWELLING_HOUSE, DWELLING_APARTMENT) else guess.kind
    country = str(hass.config.country).upper() if hass.config.country else None
    return HomeProfile(
        dwelling=dwelling,
        dwelling_detected=guess.kind,
        dwelling_reasons=guess.reasons,
        dwelling_source="setting" if setting in (DWELLING_HOUSE, DWELLING_APARTMENT) else "auto",
        country=country,
        climate=await async_climate(hass),
        location=(float(hass.config.latitude), float(hass.config.longitude))
        if hass.config.latitude is not None and hass.config.longitude is not None
        else None,
    )
