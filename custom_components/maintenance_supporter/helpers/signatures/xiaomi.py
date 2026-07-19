"""Xiaomi ecosystem integrations (MIoT / Xiaomi Home) — multi-category.

Data module of the suggested-setups signature catalog — see
``helpers/signatures/_model.py`` for the direction semantics and the
method contract (every entry cites and is verified against the
integration's source; drift-probed weekly)."""

from __future__ import annotations

from ._model import ConsumableSignature, IntegrationSignature

SIGNATURES: dict[str, IntegrationSignature] = {
    "xiaomi_miot": IntegrationSignature(
        name="Xiaomi MIoT",
        verified="2026-07-17 @ al-one/hass-xiaomi-miot master",
        source=(
            "al-one/hass-xiaomi-miot — generic MIoT-spec entities; entity_id "
            "suffix = the spec property name (core/miot_spec.py format_name + "
            "eid = f'{model}_{mac[-4:]}_{desc_name}'). Cross-device consumables: "
            "'filter-life-level' (PERCENTAGE) on air purifiers/humidifiers/water "
            "purifiers/vacuums, 'brush-life-level' (PERCENTAGE) on vacuums. The "
            "days/used-hours filter counterparts describe the SAME filter, so "
            "only the percent signal is cataloged to avoid duplicate tasks."
        ),
        tasks=(
            # Matched via the entity_id suffix (translation_key is the noisier
            # 'filter-filter_life_level' form). One % task per filter; the side
            # brush collides to a '_2' suffix and is intentionally not matched.
            ConsumableSignature(("filter_life_level",), "Replace Filter", "percent_left"),
            ConsumableSignature(("brush_life_level",), "Replace Main Brush", "percent_left"),
        ),
    ),
    "xiaomi_home": IntegrationSignature(
        name="Xiaomi Home",
        verified="2026-07-18 @ XiaoMi/ha_xiaomi_home main",
        source=(
            "XiaoMi/ha_xiaomi_home miot/miot_device.py gen_prop_entity_id: "
            "entity_id = f'{model}_{did}_{model}_{slugify_name(prop)}_p_{siid}_{piid}' "
            "(property name mid-string, no translation_key) — matched via the "
            "'_<key>_p_' infix. Same MIoT spec properties as hass-xiaomi-miot."
        ),
        tasks=(
            ConsumableSignature(("filter_life_level",), "Replace Filter", "percent_left"),
            ConsumableSignature(("brush_life_level",), "Replace Main Brush", "percent_left"),
        ),
    ),
}
