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
        verified="2026-07-17 @ al-one/hass-xiaomi-miot master; reset buttons re-checked 2026-09-27 @ 919b7a49",
        source=(
            "al-one/hass-xiaomi-miot — generic MIoT-spec entities; entity_id "
            "suffix = the spec property name (core/miot_spec.py format_name + "
            "eid = f'{model}_{mac[-4:]}_{desc_name}'). Cross-device consumables: "
            "'filter-life-level' (PERCENTAGE) on air purifiers/humidifiers/water "
            "purifiers/vacuums, 'brush-life-level' (PERCENTAGE) on vacuums. The "
            "days/used-hours filter counterparts describe the SAME filter, so "
            "only the percent signal is cataloged to avoid duplicate tasks. "
            "Resets (re-checked 2026-09-27 @ 919b7a49): MIoT actions become buttons "
            "only where the device customization lists them in button_actions "
            "(core/device_customizes.py: '*.vacuum.*' reset_*, and many purifiers / "
            "humidifiers / pet waterers with reset_filter_life); core/hass_entity.py names "
            "the action button device.spec.generate_entity_id(action.name) → "
            "'button.<model>_<mac4>_reset_filter_life' / '_reset_brush_life' (tk "
            "'filter-reset_filter_life' / 'brush_cleaner-reset_brush_life'). With a "
            "duplicated service (two filters, main + side brush) only the first instance "
            "gets a button — the same first instance the sensor suffix matches."
        ),
        tasks=(
            # Matched via the entity_id suffix (translation_key is the noisier
            # 'filter-filter_life_level' form). One % task per filter; the side
            # brush collides to a '_2' suffix and is intentionally not matched.
            # 2.95: completing presses the model's reset button where
            # button_actions lists it.
            ConsumableSignature(("filter_life_level",), "Replace Filter", "percent_left", resets=(("filter_life_level", "reset_filter_life"),)),
            ConsumableSignature(("brush_life_level",), "Replace Main Brush", "percent_left", resets=(("brush_life_level", "reset_brush_life"),)),
        ),
    ),
    "xiaomi_home": IntegrationSignature(
        name="Xiaomi Home",
        verified="2026-07-18 @ XiaoMi/ha_xiaomi_home main",
        source=(
            "XiaoMi/ha_xiaomi_home miot/miot_device.py gen_prop_entity_id: "
            "entity_id = f'{model}_{did}_{model}_{slugify_name(prop)}_p_{siid}_{piid}' "
            "(property name mid-string, no translation_key) — matched via the "
            "'_<key>_p_' infix. Same MIoT spec properties as hass-xiaomi-miot. "
            "Known limits (2026-09-27 @ bf38d930): on specs with two brush-cleaner "
            "services (dreame-p2009: siid 9 'Main Cleaning Brush', siid 10 'Side "
            "Cleaning Brush', both 'brush-life-level') the infix matches BOTH brushes "
            "into the one 'Replace Main Brush' task (any-low); which siid is the side "
            "brush differs per spec, so no key can tell them apart. Reset actions become "
            "buttons '…_reset_filter_life_a_<siid>_<aiid>' — no catalog matcher sees an "
            "'_a_' infix, so they stay unwired."
        ),
        tasks=(
            # No reset: the action buttons' '_a_' ids are never matched (above).
            ConsumableSignature(("filter_life_level",), "Replace Filter", "percent_left"),
            ConsumableSignature(("brush_life_level",), "Replace Main Brush", "percent_left"),
        ),
    ),
}
