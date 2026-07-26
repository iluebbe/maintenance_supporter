"""Logbook (activity timeline) descriptions for lifecycle events.

Without this platform our bus events show up in HA's activity timeline as
raw "event maintenance_supporter_task_completed" rows. With it they read as
proper entries — *"Oil Change (Family Car) was completed — 95 €, 45 min"* —
localized like the rest of the integration, attached to the task's sensor
entity (and thereby its object's device page timeline) where possible.
"""

from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any

from homeassistant.components.logbook.const import (
    LOGBOOK_ENTRY_ENTITY_ID,
    LOGBOOK_ENTRY_ICON,
    LOGBOOK_ENTRY_MESSAGE,
    LOGBOOK_ENTRY_NAME,
)
from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers import entity_registry as er

from .const import (
    DOMAIN,
    EVENT_TASK_COMPLETED,
    EVENT_TASK_RESET,
    EVENT_TASK_SKIPPED,
    EVENT_TRIGGER_ACTIVATED,
    EVENT_TRIGGER_DEACTIVATED,
    slugify_object_name,
)
from .helpers.i18n import normalize_language

if TYPE_CHECKING:
    from collections.abc import Callable

# The verb phrases; everything else in a message (costs, durations, notes,
# values) is language-neutral data appended verbatim.
_STRINGS: dict[str, dict[str, str]] = {
    "en": {
        "completed": "was completed",
        "skipped": "was skipped",
        "reset": "was reset to {date}",
        "trigger_on": "sensor trigger activated",
        "trigger_off": "sensor trigger cleared",
    },
    "de": {
        "completed": "wurde erledigt",
        "skipped": "wurde übersprungen",
        "reset": "wurde auf {date} zurückgesetzt",
        "trigger_on": "Sensor-Trigger ausgelöst",
        "trigger_off": "Sensor-Trigger aufgehoben",
    },
    "es": {
        "completed": "se completó",
        "skipped": "se omitió",
        "reset": "se restableció a {date}",
        "trigger_on": "disparador de sensor activado",
        "trigger_off": "disparador de sensor desactivado",
    },
    "fr": {
        "completed": "a été effectuée",
        "skipped": "a été ignorée",
        "reset": "a été réinitialisée au {date}",
        "trigger_on": "déclencheur de capteur activé",
        "trigger_off": "déclencheur de capteur désactivé",
    },
    "it": {
        "completed": "è stata completata",
        "skipped": "è stata saltata",
        "reset": "è stata ripristinata al {date}",
        "trigger_on": "trigger del sensore attivato",
        "trigger_off": "trigger del sensore disattivato",
    },
    "nl": {
        "completed": "is voltooid",
        "skipped": "is overgeslagen",
        "reset": "is teruggezet naar {date}",
        "trigger_on": "sensortrigger geactiveerd",
        "trigger_off": "sensortrigger opgeheven",
    },
    "pt": {
        "completed": "foi concluída",
        "skipped": "foi ignorada",
        "reset": "foi reposta para {date}",
        "trigger_on": "gatilho de sensor ativado",
        "trigger_off": "gatilho de sensor desativado",
    },
    "ru": {
        "completed": "выполнена",
        "skipped": "пропущена",
        "reset": "сброшена на {date}",
        "trigger_on": "сенсорный триггер активирован",
        "trigger_off": "сенсорный триггер деактивирован",
    },
    "uk": {
        "completed": "виконано",
        "skipped": "пропущено",
        "reset": "скинуто на {date}",
        "trigger_on": "сенсорний тригер активовано",
        "trigger_off": "сенсорний тригер деактивовано",
    },
    "pl": {
        "completed": "zostało ukończone",
        "skipped": "zostało pominięte",
        "reset": "zostało zresetowane na {date}",
        "trigger_on": "wyzwalacz czujnika aktywowany",
        "trigger_off": "wyzwalacz czujnika dezaktywowany",
    },
    "cs": {
        "completed": "bylo dokončeno",
        "skipped": "bylo přeskočeno",
        "reset": "bylo obnoveno na {date}",
        "trigger_on": "senzorový spouštěč aktivován",
        "trigger_off": "senzorový spouštěč deaktivován",
    },
    "sv": {
        "completed": "slutfördes",
        "skipped": "hoppades över",
        "reset": "återställdes till {date}",
        "trigger_on": "sensorutlösare aktiverad",
        "trigger_off": "sensorutlösare rensad",
    },
    "da": {
        "completed": "blev fuldført",
        "skipped": "blev sprunget over",
        "reset": "blev nulstillet til {date}",
        "trigger_on": "sensorudløser aktiveret",
        "trigger_off": "sensorudløser ryddet",
    },
    "fi": {
        "completed": "suoritettiin",
        "skipped": "ohitettiin",
        "reset": "palautettiin päivään {date}",
        "trigger_on": "anturiliipaisin aktivoitui",
        "trigger_off": "anturiliipaisin poistui",
    },
    "nb": {
        "completed": "ble fullført",
        "skipped": "ble hoppet over",
        "reset": "ble tilbakestilt til {date}",
        "trigger_on": "sensorutløser aktivert",
        "trigger_off": "sensorutløser fjernet",
    },
    "ja": {
        "completed": "が完了しました",
        "skipped": "がスキップされました",
        "reset": "が {date} にリセットされました",
        "trigger_on": "センサートリガーが作動しました",
        "trigger_off": "センサートリガーが解除されました",
    },
    "hi": {
        "completed": "पूरा किया गया",
        "skipped": "छोड़ दिया गया",
        "reset": "{date} पर रीसेट किया गया",
        "trigger_on": "सेंसर ट्रिगर सक्रिय हुआ",
        "trigger_off": "सेंसर ट्रिगर साफ़ हुआ",
    },
    "zh": {
        "completed": "已完成",
        "skipped": "已跳过",
        "reset": "已重置为 {date}",
        "trigger_on": "传感器触发器已激活",
        "trigger_off": "传感器触发器已清除",
    },
    "pt-br": {
        "completed": "foi concluída",
        "skipped": "foi pulada",
        "reset": "foi redefinida para {date}",
        "trigger_on": "gatilho de sensor ativado",
        "trigger_off": "gatilho de sensor desativado",
    },
    "hu": {
        "completed": "elkészült",
        "skipped": "kihagyva",
        "reset": "visszaállítva erre: {date}",
        "trigger_on": "érzékelő-trigger aktiválódott",
        "trigger_off": "érzékelő-trigger megszűnt",
    },
    "ko": {
        "completed": "완료됨",
        "skipped": "건너뜀",
        "reset": "{date}(으)로 재설정됨",
        "trigger_on": "센서 트리거 활성화됨",
        "trigger_off": "센서 트리거 해제됨",
    },
    "tr": {
        "completed": "tamamlandı",
        "skipped": "atlandı",
        "reset": "{date} tarihine sıfırlandı",
        "trigger_on": "sensör tetikleyicisi etkinleşti",
        "trigger_off": "sensör tetikleyicisi temizlendi",
    },
}


def _t(hass: HomeAssistant, key: str, **kwargs: str) -> str:
    lang = normalize_language(hass)
    table = _STRINGS.get(lang, _STRINGS["en"])
    text = table.get(key, _STRINGS["en"][key])
    return text.format(**kwargs) if kwargs else text


def _entry_name(data: Mapping[str, Any]) -> str:
    task = data.get("task_name") or "?"
    obj = data.get("object_name")
    return f"{task} ({obj})" if obj else task


def _task_entity_id(hass: HomeAssistant, data: Mapping[str, Any]) -> str | None:
    """Resolve the task's sensor entity so the entry lands on its timeline."""
    obj = data.get("object_name")
    task_id = data.get("task_id")
    if not obj or not task_id:
        return None
    unique_id = f"maintenance_supporter_{slugify_object_name(obj)}_{task_id}"
    return er.async_get(hass).async_get_entity_id("sensor", DOMAIN, unique_id)


def _detail_suffix(data: Mapping[str, Any]) -> str:
    """Language-neutral completion details: cost, duration, notes."""
    parts: list[str] = []
    if (cost := data.get("cost")) is not None:
        parts.append(str(cost))
    if (duration := data.get("duration")) is not None:
        parts.append(f"{duration} min")
    if notes := data.get("notes"):
        parts.append(str(notes))
    return f" — {', '.join(parts)}" if parts else ""


@callback
def async_describe_events(
    hass: HomeAssistant,
    async_describe_event: Callable[[str, str, Callable[[Event], dict[str, Any]]], None],
) -> None:
    """Describe the integration's bus events for the activity timeline."""

    @callback
    def describe_completed(event: Event) -> dict[str, Any]:
        data = event.data
        entry = {
            LOGBOOK_ENTRY_NAME: _entry_name(data),
            LOGBOOK_ENTRY_MESSAGE: _t(hass, "completed") + _detail_suffix(data),
            LOGBOOK_ENTRY_ICON: "mdi:check-circle",
        }
        if entity_id := _task_entity_id(hass, data):
            entry[LOGBOOK_ENTRY_ENTITY_ID] = entity_id
        return entry

    @callback
    def describe_skipped(event: Event) -> dict[str, Any]:
        data = event.data
        message = _t(hass, "skipped")
        if reason := data.get("reason"):
            message += f" — {reason}"
        entry = {
            LOGBOOK_ENTRY_NAME: _entry_name(data),
            LOGBOOK_ENTRY_MESSAGE: message,
            LOGBOOK_ENTRY_ICON: "mdi:skip-next-circle-outline",
        }
        if entity_id := _task_entity_id(hass, data):
            entry[LOGBOOK_ENTRY_ENTITY_ID] = entity_id
        return entry

    @callback
    def describe_reset(event: Event) -> dict[str, Any]:
        data = event.data
        entry = {
            LOGBOOK_ENTRY_NAME: _entry_name(data),
            LOGBOOK_ENTRY_MESSAGE: _t(hass, "reset", date=str(data.get("date") or "?")),
            LOGBOOK_ENTRY_ICON: "mdi:restore",
        }
        if entity_id := _task_entity_id(hass, data):
            entry[LOGBOOK_ENTRY_ENTITY_ID] = entity_id
        return entry

    @callback
    def describe_trigger(event: Event) -> dict[str, Any]:
        data = event.data
        activated = event.event_type == EVENT_TRIGGER_ACTIVATED
        message = _t(hass, "trigger_on" if activated else "trigger_off")
        if activated and (value := data.get("trigger_value")) is not None:
            message += f" ({data.get('trigger_entity')}: {value})"
        entry = {
            LOGBOOK_ENTRY_NAME: data.get("entity_id") or DOMAIN,
            LOGBOOK_ENTRY_MESSAGE: message,
            LOGBOOK_ENTRY_ICON: "mdi:flash" if activated else "mdi:flash-off",
        }
        if entity_id := data.get("entity_id"):
            entry[LOGBOOK_ENTRY_ENTITY_ID] = entity_id
        return entry

    async_describe_event(DOMAIN, EVENT_TASK_COMPLETED, describe_completed)
    async_describe_event(DOMAIN, EVENT_TASK_SKIPPED, describe_skipped)
    async_describe_event(DOMAIN, EVENT_TASK_RESET, describe_reset)
    async_describe_event(DOMAIN, EVENT_TRIGGER_ACTIVATED, describe_trigger)
    async_describe_event(DOMAIN, EVENT_TRIGGER_DEACTIVATED, describe_trigger)
