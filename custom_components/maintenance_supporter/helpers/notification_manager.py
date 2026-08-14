"""Notification manager for maintenance reminders."""

from __future__ import annotations

import logging
from collections.abc import Mapping
from datetime import date, datetime, time, timedelta
from typing import Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import issue_registry as ir
from homeassistant.util import dt as dt_util

from ..const import (
    CONF_ACTION_COMPLETE_ENABLED,
    CONF_ACTION_SKIP_ENABLED,
    CONF_ACTION_SNOOZE_ENABLED,
    CONF_MAX_NOTIFICATIONS_PER_DAY,
    CONF_NOTIFICATION_TITLE_STYLE,
    CONF_NOTIFICATIONS_ENABLED,
    CONF_NOTIFY_DUE_SOON_ENABLED,
    CONF_NOTIFY_DUE_SOON_INTERVAL,
    CONF_NOTIFY_OVERDUE_ENABLED,
    CONF_NOTIFY_OVERDUE_INTERVAL,
    CONF_NOTIFY_SERVICE,
    CONF_NOTIFY_TRIGGERED_ENABLED,
    CONF_NOTIFY_TRIGGERED_INTERVAL,
    CONF_QUIET_HOURS_ENABLED,
    CONF_QUIET_HOURS_END,
    CONF_QUIET_HOURS_START,
    CONF_SNOOZE_DURATION_HOURS,
    DEFAULT_MAX_NOTIFICATIONS_PER_DAY,
    DEFAULT_SNOOZE_DURATION_HOURS,
    DOMAIN,
    MaintenanceStatus,
)
from .global_options import get_global_options
from .i18n import normalize_language

_LOGGER = logging.getLogger(__name__)

# Repair-issue id raised when the *configured* global notify service does not
# exist (e.g. the mobile app or notify group it points at was removed), so
# notifications would silently fail. Scope is the top-level service only — a
# broken member *inside* a notify group is invisible here (HA dispatches to the
# working members and only logs the bad one), so we never flag that case.
_NOTIFY_SERVICE_MISSING_ISSUE_ID = "notify_service_missing"

# Sentinel value: interval=0 means "notify once, never repeat".
# A naive datetime.max is intentionally NOT comparable with the timezone-aware
# values stored elsewhere in self._last_notified — every code path that touches
# this sentinel guards on equality (`last == _SENT_ONCE` / `last != _SENT_ONCE`)
# BEFORE attempting any subtraction, so the naive/aware mix never reaches an
# arithmetic operation. Replacing with a tz-aware version would still work but
# adds noise; the sentinel is a singleton, not a real timestamp.
_SENT_ONCE = datetime.max  # noqa: DTZ901 - intentional naive sentinel, see comment above

# --- Notification message translations ---
_NOTIFICATION_STRINGS: dict[str, dict[str, str]] = {
    "de": {
        "due_soon_title": "Wartung bald fällig",
        "due_soon_message": "{task} für {object} ist in {days} Tag(en) fällig (Fällig: {due}).",
        "overdue_title": "Wartung überfällig!",
        "overdue_message": "{task} für {object} ist {days} Tag(e) überfällig!",
        "triggered_title": "Wartung ausgelöst",
        "triggered_message": "{task} für {object} wurde durch Sensordaten ausgelöst.",
        "action_complete": "Erledigt",
        "action_skip": "Überspringen",
        "action_snooze": "Später",
        "bundled_title": "Wartung: {count} Aufgaben",
        "bundled_message": "{object}: {task_list}",
        "digest_title": "Wöchentliche Wartungsübersicht",
        "digest_message": "{overdue} überfällig, {due_soon} diese Woche fällig.",
        "warranty_title": "Garantie läuft bald ab",
        "warranty_message": "{count} Objekt(e) mit Garantie-Ablauf in {days} Tagen: {names}",
        "bundled_overdue": "{task} (überfällig)",
        "bundled_due_soon": "{task} (bald fällig)",
        "bundled_triggered": "{task} (ausgelöst)",
        "budget_alert_title": "Wartungsbudget-Warnung",
        "budget_alert_monthly": "Monatsbudget zu {pct}% ausgeschöpft ({spent} von {budget})",
        "budget_alert_yearly": "Jahresbudget zu {pct}% ausgeschöpft ({spent} von {budget})",
    },
    "nl": {
        "due_soon_title": "Onderhoud binnenkort",
        "due_soon_message": "{task} voor {object} is over {days} dag(en) te doen (Vervaldatum: {due}).",
        "overdue_title": "Onderhoud achterstallig!",
        "overdue_message": "{task} voor {object} is {days} dag(en) achterstallig!",
        "triggered_title": "Onderhoud geactiveerd",
        "triggered_message": "{task} voor {object} is geactiveerd door sensordata.",
        "action_complete": "Voltooid",
        "action_skip": "Overslaan",
        "action_snooze": "Later",
        "bundled_title": "Onderhoud: {count} taken",
        "bundled_message": "{object}: {task_list}",
        "digest_title": "Wekelijks onderhoudsoverzicht",
        "digest_message": "{overdue} achterstallig, {due_soon} deze week.",
        "warranty_title": "Warranty expiring soon",
        "warranty_message": "{count} object(s) with warranty expiring within {days} days: {names}",
        "bundled_overdue": "{task} (achterstallig)",
        "bundled_due_soon": "{task} (binnenkort)",
        "bundled_triggered": "{task} (geactiveerd)",
        "budget_alert_title": "Onderhoudsbudget waarschuwing",
        "budget_alert_monthly": "Maandbudget op {pct}% ({spent} van {budget})",
        "budget_alert_yearly": "Jaarbudget op {pct}% ({spent} van {budget})",
    },
    "fr": {
        "due_soon_title": "Maintenance bientôt due",
        "due_soon_message": "{task} pour {object} est dû dans {days} jour(s) (Échéance : {due}).",
        "overdue_title": "Maintenance en retard !",
        "overdue_message": "{task} pour {object} est en retard de {days} jour(s) !",
        "triggered_title": "Maintenance déclenchée",
        "triggered_message": "{task} pour {object} a été déclenchée par les données du capteur.",
        "action_complete": "Terminé",
        "action_skip": "Ignorer",
        "action_snooze": "Reporter",
        "bundled_title": "Maintenance : {count} tâches",
        "bundled_message": "{object} : {task_list}",
        "digest_title": "Récapitulatif hebdomadaire d'entretien",
        "digest_message": "{overdue} en retard, {due_soon} cette semaine.",
        "warranty_title": "Warranty expiring soon",
        "warranty_message": "{count} object(s) with warranty expiring within {days} days: {names}",
        "bundled_overdue": "{task} (en retard)",
        "bundled_due_soon": "{task} (bientôt dû)",
        "bundled_triggered": "{task} (déclenché)",
        "budget_alert_title": "Alerte budget maintenance",
        "budget_alert_monthly": "Budget mensuel à {pct}% ({spent} sur {budget})",
        "budget_alert_yearly": "Budget annuel à {pct}% ({spent} sur {budget})",
    },
    "it": {
        "due_soon_title": "Manutenzione in scadenza",
        "due_soon_message": "{task} per {object} è in scadenza tra {days} giorno/i (Scadenza: {due}).",
        "overdue_title": "Manutenzione scaduta!",
        "overdue_message": "{task} per {object} è scaduta da {days} giorno/i!",
        "triggered_title": "Manutenzione attivata",
        "triggered_message": "{task} per {object} è stata attivata dai dati del sensore.",
        "action_complete": "Completato",
        "action_skip": "Salta",
        "action_snooze": "Posticipa",
        "bundled_title": "Manutenzione: {count} attività",
        "bundled_message": "{object}: {task_list}",
        "digest_title": "Riepilogo settimanale manutenzione",
        "digest_message": "{overdue} scadute, {due_soon} questa settimana.",
        "warranty_title": "Warranty expiring soon",
        "warranty_message": "{count} object(s) with warranty expiring within {days} days: {names}",
        "bundled_overdue": "{task} (scaduta)",
        "bundled_due_soon": "{task} (in scadenza)",
        "bundled_triggered": "{task} (attivata)",
        "budget_alert_title": "Avviso budget manutenzione",
        "budget_alert_monthly": "Budget mensile al {pct}% ({spent} di {budget})",
        "budget_alert_yearly": "Budget annuale al {pct}% ({spent} di {budget})",
    },
    "es": {
        "due_soon_title": "Mantenimiento próximo",
        "due_soon_message": "{task} para {object} vence en {days} día(s) (Vencimiento: {due}).",
        "overdue_title": "¡Mantenimiento vencido!",
        "overdue_message": "¡{task} para {object} está vencido por {days} día(s)!",
        "triggered_title": "Mantenimiento activado",
        "triggered_message": "{task} para {object} ha sido activado por datos del sensor.",
        "action_complete": "Completar",
        "action_skip": "Omitir",
        "action_snooze": "Posponer",
        "bundled_title": "Mantenimiento: {count} tareas",
        "bundled_message": "{object}: {task_list}",
        "digest_title": "Resumen semanal de mantenimiento",
        "digest_message": "{overdue} vencidas, {due_soon} esta semana.",
        "warranty_title": "Warranty expiring soon",
        "warranty_message": "{count} object(s) with warranty expiring within {days} days: {names}",
        "bundled_overdue": "{task} (vencido)",
        "bundled_due_soon": "{task} (próximo)",
        "bundled_triggered": "{task} (activado)",
        "budget_alert_title": "Alerta de presupuesto de mantenimiento",
        "budget_alert_monthly": "Presupuesto mensual al {pct}% ({spent} de {budget})",
        "budget_alert_yearly": "Presupuesto anual al {pct}% ({spent} de {budget})",
    },
    "en": {
        "due_soon_title": "Maintenance Due Soon",
        "due_soon_message": "{task} for {object} is due in {days} day(s) (Due: {due}).",
        "overdue_title": "Maintenance Overdue!",
        "overdue_message": "{task} for {object} is {days} day(s) overdue!",
        "triggered_title": "Maintenance Triggered",
        "triggered_message": "{task} for {object} has been triggered by sensor data.",
        "action_complete": "Complete",
        "action_skip": "Skip",
        "action_snooze": "Snooze",
        "bundled_title": "Maintenance: {count} tasks",
        "bundled_message": "{object}: {task_list}",
        "digest_title": "Weekly maintenance digest",
        "digest_message": "{overdue} overdue, {due_soon} due this week.",
        "warranty_title": "Warranty expiring soon",
        "warranty_message": "{count} object(s) with warranty expiring within {days} days: {names}",
        "bundled_overdue": "{task} (overdue)",
        "bundled_due_soon": "{task} (due soon)",
        "bundled_triggered": "{task} (triggered)",
        "budget_alert_title": "Maintenance Budget Warning",
        "budget_alert_monthly": "Monthly budget at {pct}% ({spent} of {budget})",
        "budget_alert_yearly": "Yearly budget at {pct}% ({spent} of {budget})",
    },
    "da": {
        "due_soon_title": "Vedligeholdelse snart forfalden",
        "due_soon_message": "{task} for {object} forfalder om {days} dag(e) (Forfalder: {due}).",
        "overdue_title": "Vedligeholdelse forfalden!",
        "overdue_message": "{task} for {object} er {days} dag(e) forsinket!",
        "triggered_title": "Vedligeholdelse udløst",
        "triggered_message": "{task} for {object} blev udløst af sensordata.",
        "action_complete": "Udført",
        "action_skip": "Spring over",
        "action_snooze": "Senere",
        "bundled_title": "Vedligeholdelse: {count} opgaver",
        "bundled_message": "{object}: {task_list}",
        "digest_title": "Ugentlig vedligeholdelsesoversigt",
        "digest_message": "{overdue} forfaldne, {due_soon} denne uge.",
        "warranty_title": "Warranty expiring soon",
        "warranty_message": "{count} object(s) with warranty expiring within {days} days: {names}",
        "bundled_overdue": "{task} (forfalden)",
        "bundled_due_soon": "{task} (snart forfalden)",
        "bundled_triggered": "{task} (udløst)",
        "budget_alert_title": "Advarsel om vedligeholdelsesbudget",
        "budget_alert_monthly": "Månedsbudget på {pct}% ({spent} af {budget})",
        "budget_alert_yearly": "Årsbudget på {pct}% ({spent} af {budget})",
    },
    "fi": {
        "due_soon_title": "Huolto erääntyy pian",
        "due_soon_message": "{task} kohteelle {object} erääntyy {days} päivän kuluttua (Eräpäivä: {due}).",
        "overdue_title": "Huolto myöhässä!",
        "overdue_message": "{task} kohteelle {object} on {days} päivää myöhässä!",
        "triggered_title": "Huolto käynnistetty",
        "triggered_message": "{task} kohteelle {object} käynnistyi anturitietojen perusteella.",
        "action_complete": "Valmis",
        "action_skip": "Ohita",
        "action_snooze": "Myöhemmin",
        "bundled_title": "Huolto: {count} tehtävää",
        "bundled_message": "{object}: {task_list}",
        "digest_title": "Viikoittainen huoltokooste",
        "digest_message": "{overdue} myöhässä, {due_soon} tällä viikolla.",
        "warranty_title": "Warranty expiring soon",
        "warranty_message": "{count} object(s) with warranty expiring within {days} days: {names}",
        "bundled_overdue": "{task} (myöhässä)",
        "bundled_due_soon": "{task} (pian)",
        "bundled_triggered": "{task} (käynnistetty)",
        "budget_alert_title": "Huoltobudjetin varoitus",
        "budget_alert_monthly": "Kuukausibudjetti {pct}% ({spent} / {budget})",
        "budget_alert_yearly": "Vuosibudjetti {pct}% ({spent} / {budget})",
    },
    "nb": {
        "due_soon_title": "Vedlikehold forfaller snart",
        "due_soon_message": "{task} for {object} forfaller om {days} dag(er) (Forfaller: {due}).",
        "overdue_title": "Vedlikehold forfalt!",
        "overdue_message": "{task} for {object} er {days} dag(er) forsinket!",
        "triggered_title": "Vedlikehold utløst",
        "triggered_message": "{task} for {object} ble utløst av sensordata.",
        "action_complete": "Fullført",
        "action_skip": "Hopp over",
        "action_snooze": "Senere",
        "bundled_title": "Vedlikehold: {count} oppgaver",
        "bundled_message": "{object}: {task_list}",
        "digest_title": "Ukentlig vedlikeholdsoversikt",
        "digest_message": "{overdue} forfalt, {due_soon} denne uken.",
        "warranty_title": "Warranty expiring soon",
        "warranty_message": "{count} object(s) with warranty expiring within {days} days: {names}",
        "bundled_overdue": "{task} (forfalt)",
        "bundled_due_soon": "{task} (snart)",
        "bundled_triggered": "{task} (utløst)",
        "budget_alert_title": "Varsel om vedlikeholdsbudsjett",
        "budget_alert_monthly": "Månedsbudsjett på {pct}% ({spent} av {budget})",
        "budget_alert_yearly": "Årsbudsjett på {pct}% ({spent} av {budget})",
    },
    "ja": {
        "due_soon_title": "メンテナンス期限間近",
        "due_soon_message": "{object} の {task} はあと {days} 日で期限です（期限: {due}）。",
        "overdue_title": "メンテナンス期限超過！",
        "overdue_message": "{object} の {task} は {days} 日超過しています！",
        "triggered_title": "メンテナンス起動",
        "triggered_message": "{object} の {task} がセンサーデータにより起動されました。",
        "action_complete": "完了",
        "action_skip": "スキップ",
        "action_snooze": "後で",
        "bundled_title": "メンテナンス: {count} 件のタスク",
        "bundled_message": "{object}: {task_list}",
        "digest_title": "週間メンテナンスまとめ",
        "digest_message": "期限切れ {overdue} 件、今週 {due_soon} 件。",
        "warranty_title": "Warranty expiring soon",
        "warranty_message": "{count} object(s) with warranty expiring within {days} days: {names}",
        "bundled_overdue": "{task}（超過）",
        "bundled_due_soon": "{task}（間近）",
        "bundled_triggered": "{task}（起動）",
        "budget_alert_title": "メンテナンス予算の警告",
        "budget_alert_monthly": "月間予算が {pct}%（{budget} 中 {spent}）",
        "budget_alert_yearly": "年間予算が {pct}%（{budget} 中 {spent}）",
    },
    "hi": {
        "due_soon_title": "रखरखाव जल्द देय",
        "due_soon_message": "{object} के लिए {task} {days} दिन में देय है (देय: {due})।",
        "overdue_title": "रखरखाव अतिदेय!",
        "overdue_message": "{object} के लिए {task} {days} दिन अतिदेय है!",
        "triggered_title": "रखरखाव ट्रिगर हुआ",
        "triggered_message": "{object} के लिए {task} सेंसर डेटा द्वारा ट्रिगर हुआ।",
        "action_complete": "पूर्ण",
        "action_skip": "छोड़ें",
        "action_snooze": "बाद में",
        "bundled_title": "रखरखाव: {count} कार्य",
        "bundled_message": "{object}: {task_list}",
        "digest_title": "साप्ताहिक रखरखाव सारांश",
        "digest_message": "{overdue} अतिदेय, {due_soon} इस सप्ताह।",
        "warranty_title": "Warranty expiring soon",
        "warranty_message": "{count} object(s) with warranty expiring within {days} days: {names}",
        "bundled_overdue": "{task} (अतिदेय)",
        "bundled_due_soon": "{task} (जल्द देय)",
        "bundled_triggered": "{task} (ट्रिगर)",
        "budget_alert_title": "रखरखाव बजट चेतावनी",
        "budget_alert_monthly": "मासिक बजट {pct}% पर ({budget} में से {spent})",
        "budget_alert_yearly": "वार्षिक बजट {pct}% पर ({budget} में से {spent})",
    },
    "zh": {
        "due_soon_title": "维护即将到期",
        "due_soon_message": "{object} 的 {task} 将在 {days} 天后到期（到期日期：{due}）。",
        "overdue_title": "维护已超期！",
        "overdue_message": "{object} 的 {task} 已超期 {days} 天！",
        "triggered_title": "维护已触发",
        "triggered_message": "传感器数据已触发 {object} 的 {task}。",
        "action_complete": "完成",
        "action_skip": "跳过",
        "action_snooze": "稍后提醒",
        "bundled_title": "维护：共有 {count} 项任务",
        "bundled_message": "{object}: {task_list}",
        "digest_title": "每周维护摘要",
        "digest_message": "逾期 {overdue} 项，本周 {due_soon} 项。",
        "warranty_title": "Warranty expiring soon",
        "warranty_message": "{count} object(s) with warranty expiring within {days} days: {names}",
        "bundled_overdue": "{task}（超期）",
        "bundled_due_soon": "{task}（即将到期）",
        "bundled_triggered": "{task}（已触发）",
        "budget_alert_title": "维护预算警报",
        "budget_alert_monthly": "月度预算已达 {pct}%（已支出 {spent} / 总预算 {budget}）",
        "budget_alert_yearly": "年度预算已达 {pct}%（已支出 {spent} / 总预算 {budget}）",
    },
    "ru": {
        "due_soon_title": "Обслуживание скоро требуется",
        "due_soon_message": "{task} для {object} требуется через {days} дн. (Срок: {due}).",
        "overdue_title": "Обслуживание просрочено!",
        "overdue_message": "{task} для {object} просрочено на {days} дн.!",
        "triggered_title": "Обслуживание сработало",
        "triggered_message": "{task} для {object} было запущено по данным датчика.",
        "action_complete": "Выполнить",
        "action_skip": "Пропустить",
        "action_snooze": "Отложить",
        "bundled_title": "Обслуживание: {count} задач",
        "bundled_message": "{object}: {task_list}",
        "digest_title": "Еженедельная сводка обслуживания",
        "digest_message": "{overdue} просрочено, {due_soon} на этой неделе.",
        "warranty_title": "Warranty expiring soon",
        "warranty_message": "{count} object(s) with warranty expiring within {days} days: {names}",
        "bundled_overdue": "{task} (просрочено)",
        "bundled_due_soon": "{task} (скоро)",
        "bundled_triggered": "{task} (сработало)",
        "budget_alert_title": "Предупреждение о бюджете обслуживания",
        "budget_alert_monthly": "Месячный бюджет: {pct}% ({spent} из {budget})",
        "budget_alert_yearly": "Годовой бюджет: {pct}% ({spent} из {budget})",
    },
    "uk": {
        "due_soon_title": "Незабаром термін обслуговування",
        "due_soon_message": "{task} для {object} через {days} день(днів) (Термін: {due}).",
        "overdue_title": "Обслуговування прострочено!",
        "overdue_message": "{task} для {object} прострочено на {days} день(днів)!",
        "triggered_title": "Обслуговування спрацювало",
        "triggered_message": "{task} для {object} спрацювало за даними сенсора.",
        "action_complete": "Виконати",
        "action_skip": "Пропустити",
        "action_snooze": "Відкласти",
        "bundled_title": "Обслуговування: {count} завдань",
        "bundled_message": "{object}: {task_list}",
        "digest_title": "Щотижневий огляд обслуговування",
        "digest_message": "{overdue} прострочено, {due_soon} цього тижня.",
        "warranty_title": "Warranty expiring soon",
        "warranty_message": "{count} object(s) with warranty expiring within {days} days: {names}",
        "bundled_overdue": "{task} (прострочено)",
        "bundled_due_soon": "{task} (незабаром)",
        "bundled_triggered": "{task} (спрацювало)",
        "budget_alert_title": "Попередження про бюджет обслуговування",
        "budget_alert_monthly": "Щомісячний бюджет використано на {pct}% ({spent} з {budget})",
        "budget_alert_yearly": "Щорічний бюджет використано на {pct}% ({spent} з {budget})",
    },
    "pt": {
        "due_soon_title": "Manutenção em breve",
        "due_soon_message": "{task} para {object} é necessário em {days} dia(s) (Prazo: {due}).",
        "overdue_title": "Manutenção atrasada!",
        "overdue_message": "{task} para {object} está atrasado em {days} dia(s)!",
        "triggered_title": "Manutenção acionada",
        "triggered_message": "{task} para {object} foi acionado por dados do sensor.",
        "action_complete": "Concluir",
        "action_skip": "Ignorar",
        "action_snooze": "Adiar",
        "bundled_title": "Manutenção: {count} tarefas",
        "bundled_message": "{object}: {task_list}",
        "digest_title": "Resumo semanal de manutenção",
        "digest_message": "{overdue} atrasadas, {due_soon} esta semana.",
        "warranty_title": "Warranty expiring soon",
        "warranty_message": "{count} object(s) with warranty expiring within {days} days: {names}",
        "bundled_overdue": "{task} (atrasado)",
        "bundled_due_soon": "{task} (em breve)",
        "bundled_triggered": "{task} (acionado)",
        "budget_alert_title": "Alerta de orçamento de manutenção",
        "budget_alert_monthly": "Orçamento mensal em {pct}% ({spent} de {budget})",
        "budget_alert_yearly": "Orçamento anual em {pct}% ({spent} de {budget})",
    },
    # v1.4.2: Polish notifications (panel + config-flow have been pl since v1.3.3
    # but phone notifications still went out in English).
    "pl": {
        "due_soon_title": "Wkrótce wymagana konserwacja",
        "due_soon_message": "{task} dla {object} wymagane za {days} dni (Termin: {due}).",
        "overdue_title": "Konserwacja przeterminowana!",
        "overdue_message": "{task} dla {object} jest przeterminowane o {days} dni!",
        "triggered_title": "Konserwacja wyzwolona",
        "triggered_message": "{task} dla {object} zostało wyzwolone przez dane z czujnika.",
        "action_complete": "Zakończ",
        "action_skip": "Pomiń",
        "action_snooze": "Drzemka",
        "bundled_title": "Konserwacja: {count} zadań",
        "bundled_message": "{object}: {task_list}",
        "digest_title": "Cotygodniowe podsumowanie konserwacji",
        "digest_message": "{overdue} zaległych, {due_soon} w tym tygodniu.",
        "warranty_title": "Warranty expiring soon",
        "warranty_message": "{count} object(s) with warranty expiring within {days} days: {names}",
        "bundled_overdue": "{task} (przeterminowane)",
        "bundled_due_soon": "{task} (wkrótce)",
        "bundled_triggered": "{task} (wyzwolone)",
        "budget_alert_title": "Ostrzeżenie o budżecie konserwacji",
        "budget_alert_monthly": "Budżet miesięczny na poziomie {pct}% ({spent} z {budget})",
        "budget_alert_yearly": "Budżet roczny na poziomie {pct}% ({spent} z {budget})",
    },
    # v1.4.2: Czech notifications (panel UI is cs since v1.0.41; closing the
    # config-flow + notification gap together).
    "cs": {
        "due_soon_title": "Údržba se blíží",
        "due_soon_message": "{task} pro {object} je třeba za {days} dní (Termín: {due}).",
        "overdue_title": "Údržba po termínu!",
        "overdue_message": "{task} pro {object} je {days} dní po termínu!",
        "triggered_title": "Údržba spuštěna",
        "triggered_message": "{task} pro {object} bylo spuštěno daty ze senzoru.",
        "action_complete": "Hotovo",
        "action_skip": "Přeskočit",
        "action_snooze": "Odložit",
        "bundled_title": "Údržba: {count} úkolů",
        "bundled_message": "{object}: {task_list}",
        "digest_title": "Týdenní přehled údržby",
        "digest_message": "{overdue} po termínu, {due_soon} tento týden.",
        "warranty_title": "Warranty expiring soon",
        "warranty_message": "{count} object(s) with warranty expiring within {days} days: {names}",
        "bundled_overdue": "{task} (po termínu)",
        "bundled_due_soon": "{task} (brzy)",
        "bundled_triggered": "{task} (spuštěno)",
        "budget_alert_title": "Upozornění na rozpočet údržby",
        "budget_alert_monthly": "Měsíční rozpočet na {pct}% ({spent} z {budget})",
        "budget_alert_yearly": "Roční rozpočet na {pct}% ({spent} z {budget})",
    },
    # v1.4.2: Swedish notifications.
    "sv": {
        "due_soon_title": "Underhåll snart",
        "due_soon_message": "{task} för {object} förfaller om {days} dag(ar) (Förfaller: {due}).",
        "overdue_title": "Underhåll försenat!",
        "overdue_message": "{task} för {object} är {days} dag(ar) försenat!",
        "triggered_title": "Underhåll utlöst",
        "triggered_message": "{task} för {object} har utlösts av sensordata.",
        "action_complete": "Slutför",
        "action_skip": "Hoppa över",
        "action_snooze": "Snooza",
        "bundled_title": "Underhåll: {count} uppgifter",
        "bundled_message": "{object}: {task_list}",
        "digest_title": "Veckovis underhållssammanfattning",
        "digest_message": "{overdue} försenade, {due_soon} denna vecka.",
        "warranty_title": "Warranty expiring soon",
        "warranty_message": "{count} object(s) with warranty expiring within {days} days: {names}",
        "bundled_overdue": "{task} (försenat)",
        "bundled_due_soon": "{task} (snart)",
        "bundled_triggered": "{task} (utlöst)",
        "budget_alert_title": "Varning för underhållsbudget",
        "budget_alert_monthly": "Månadsbudget på {pct}% ({spent} av {budget})",
        "budget_alert_yearly": "Årsbudget på {pct}% ({spent} av {budget})",
    },
    "pt-br": {
        "due_soon_title": "Manutenção em breve",
        "due_soon_message": "{task} de {object} vence em {days} dia(s) (vencimento: {due}).",
        "overdue_title": "Manutenção atrasada!",
        "overdue_message": "{task} de {object} está {days} dia(s) atrasada!",
        "triggered_title": "Manutenção acionada",
        "triggered_message": "{task} de {object} foi acionada por dados de sensor.",
        "action_complete": "Concluir",
        "action_skip": "Pular",
        "action_snooze": "Adiar",
        "bundled_title": "Manutenção: {count} tarefas",
        "bundled_message": "{object}: {task_list}",
        "digest_title": "Resumo semanal de manutenção",
        "digest_message": "{overdue} atrasadas, {due_soon} vencem nesta semana.",
        "warranty_title": "Garantia expirando em breve",
        "warranty_message": "{count} objeto(s) com garantia expirando em {days} dias: {names}",
        "bundled_overdue": "{task} (atrasada)",
        "bundled_due_soon": "{task} (em breve)",
        "bundled_triggered": "{task} (acionada)",
        "budget_alert_title": "Alerta de orçamento de manutenção",
        "budget_alert_monthly": "Orçamento mensal em {pct}% ({spent} de {budget})",
        "budget_alert_yearly": "Orçamento anual em {pct}% ({spent} de {budget})",
    },
    "hu": {
        "due_soon_title": "Karbantartás hamarosan esedékes",
        "due_soon_message": "{object} – {task} {days} nap múlva esedékes (határidő: {due}).",
        "overdue_title": "Karbantartás lejárt!",
        "overdue_message": "{object} – {task} {days} napja esedékes!",
        "triggered_title": "Karbantartás aktiválódott",
        "triggered_message": "{object} – {task} feladatot érzékelőadatok aktiválták.",
        "action_complete": "Kész",
        "action_skip": "Kihagyás",
        "action_snooze": "Halasztás",
        "bundled_title": "Karbantartás: {count} feladat",
        "bundled_message": "{object}: {task_list}",
        "digest_title": "Heti karbantartási összefoglaló",
        "digest_message": "{overdue} lejárt, {due_soon} esedékes ezen a héten.",
        "warranty_title": "Hamarosan lejáró garancia",
        "warranty_message": "{count} objektum garanciája jár le {days} napon belül: {names}",
        "bundled_overdue": "{task} (lejárt)",
        "bundled_due_soon": "{task} (hamarosan)",
        "bundled_triggered": "{task} (aktiválva)",
        "budget_alert_title": "Karbantartási keret figyelmeztetés",
        "budget_alert_monthly": "Havi keret {pct}%-on ({spent} / {budget})",
        "budget_alert_yearly": "Éves keret {pct}%-on ({spent} / {budget})",
    },
    "ko": {
        "due_soon_title": "곧 예정된 유지보수",
        "due_soon_message": "{object}의 {task}이(가) {days}일 후 예정입니다 (기한: {due}).",
        "overdue_title": "유지보수 기한 초과!",
        "overdue_message": "{object}의 {task}이(가) {days}일 지났습니다!",
        "triggered_title": "유지보수 트리거됨",
        "triggered_message": "{object}의 {task}이(가) 센서 데이터로 트리거되었습니다.",
        "action_complete": "완료",
        "action_skip": "건너뛰기",
        "action_snooze": "미루기",
        "bundled_title": "유지보수: 작업 {count}개",
        "bundled_message": "{object}: {task_list}",
        "digest_title": "주간 유지보수 요약",
        "digest_message": "기한 초과 {overdue}건, 이번 주 예정 {due_soon}건.",
        "warranty_title": "보증 기간 만료 임박",
        "warranty_message": "{days}일 이내에 보증이 만료되는 객체 {count}개: {names}",
        "bundled_overdue": "{task} (기한 초과)",
        "bundled_due_soon": "{task} (곧 예정)",
        "bundled_triggered": "{task} (트리거됨)",
        "budget_alert_title": "유지보수 예산 경고",
        "budget_alert_monthly": "월 예산 {pct}% 사용 ({budget} 중 {spent})",
        "budget_alert_yearly": "연 예산 {pct}% 사용 ({budget} 중 {spent})",
    },
    "tr": {
        "due_soon_title": "Bakım zamanı yaklaşıyor",
        "due_soon_message": "{object} için {task}, {days} gün içinde yapılmalı (Tarih: {due}).",
        "overdue_title": "Bakım gecikti!",
        "overdue_message": "{object} için {task}, {days} gün gecikti!",
        "triggered_title": "Bakım tetiklendi",
        "triggered_message": "{object} için {task}, sensör verileriyle tetiklendi.",
        "action_complete": "Tamamla",
        "action_skip": "Atla",
        "action_snooze": "Ertele",
        "bundled_title": "Bakım: {count} görev",
        "bundled_message": "{object}: {task_list}",
        "digest_title": "Haftalık bakım özeti",
        "digest_message": "{overdue} gecikmiş, {due_soon} bu hafta yapılacak.",
        "warranty_title": "Garanti yakında sona eriyor",
        "warranty_message": "{days} gün içinde garantisi sona erecek {count} nesne: {names}",
        "bundled_overdue": "{task} (gecikmiş)",
        "bundled_due_soon": "{task} (yaklaşıyor)",
        "bundled_triggered": "{task} (tetiklendi)",
        "budget_alert_title": "Bakım bütçesi uyarısı",
        "budget_alert_monthly": "Aylık bütçe %{pct} ({spent} / {budget})",
        "budget_alert_yearly": "Yıllık bütçe %{pct} ({spent} / {budget})",
    },
}


def _notif_t(key: str, lang: str, **kwargs: str) -> str:
    """Get notification translation string."""
    strings = _NOTIFICATION_STRINGS.get(lang, _NOTIFICATION_STRINGS["en"])
    text = strings.get(key, _NOTIFICATION_STRINGS["en"].get(key, key))
    if kwargs:
        safe_kwargs = {k: str(v).replace("{", "{{").replace("}", "}}") for k, v in kwargs.items()}
        text = text.format(**safe_kwargs)
    return text


async def get_user_notify_services(hass: HomeAssistant, user_id: str) -> list[str]:
    """Find all notify services for a user via mobile_app config entries.

    Discovery strategy:
    1. Find mobile_app config entries whose data contains matching user_id
    2. Look up associated devices in the device registry
    3. Find corresponding notify.mobile_app_* services
    4. Return list of service names
    """
    from homeassistant.helpers import device_registry as dr
    from homeassistant.util import slugify

    device_reg = dr.async_get(hass)
    services: list[str] = []
    seen: set[str] = set()

    # Find mobile_app config entries for this user
    for entry in hass.config_entries.async_entries("mobile_app"):
        if entry.data.get("user_id") != user_id:
            continue

        # mobile_app registers its notify service as ``notify.mobile_app_<slug>``
        # where <slug> = slugify(device name): the legacy notify platform
        # slugifies each target, and mobile_app's target is
        # ``entry.data[ATTR_DEVICE_NAME]`` ("device_name"). The previous code
        # used the device IDENTIFIER (a webhook UUID) instead, so the lookup
        # never matched and user notifications silently fell back to the global
        # service (#75). Use the entry's device_name (authoritative), plus the
        # device-registry names as a safety net (older entries without
        # device_name, or a device the user renamed).
        candidate_names: set[str] = {entry.data.get("device_name") or ""}
        for device in dr.async_entries_for_config_entry(device_reg, entry.entry_id):
            candidate_names.add(device.name_by_user or "")
            candidate_names.add(device.name or "")

        for name in candidate_names:
            if not name:
                continue
            service = f"mobile_app_{slugify(name)}"
            if service in seen or not hass.services.has_service("notify", service):
                continue
            seen.add(service)
            services.append(f"notify.{service}")
            _LOGGER.debug("Found notify service notify.%s for user %s", service, user_id)

    return services


async def async_dispatch_notify(
    hass: HomeAssistant,
    target: str,
    service_data: dict[str, Any],
    *,
    blocking: bool = False,
) -> bool:
    """Send ``service_data`` to a notify target, handling both notify models.

    - A legacy notify *service* (``notify.mobile_app_<slug>``, a notify group, …)
      is called directly and carries the full payload — action buttons, tag, url.
    - A notify *entity* (the newer model — many single devices live only here)
      has no callable per-name service; it's reached via ``notify.send_message``
      with ``entity_id``, which carries only ``message`` + ``title`` (the entity
      model can't take ``data``, so action buttons / tag / url are dropped).

    Returns True if a target was dispatched, False if neither a service nor an
    entity by that name exists. Exceptions are left for the caller to handle.
    """
    domain, _, name = target.partition(".")
    if not name:
        _LOGGER.warning("Invalid notify target: %s", target)
        return False
    if hass.services.has_service(domain, name):
        await hass.services.async_call(domain, name, service_data, blocking=blocking)
        return True
    if hass.states.get(target) is not None:
        await hass.services.async_call(
            "notify",
            "send_message",
            {
                "entity_id": target,
                "title": service_data.get("title", ""),
                "message": service_data.get("message", ""),
            },
            blocking=blocking,
        )
        return True
    _LOGGER.warning("Notify target not found (no service or entity): %s", target)
    return False


# Per-status config mapping
_STATUS_ENABLED_KEYS: dict[str, str] = {
    MaintenanceStatus.DUE_SOON: CONF_NOTIFY_DUE_SOON_ENABLED,
    MaintenanceStatus.OVERDUE: CONF_NOTIFY_OVERDUE_ENABLED,
    MaintenanceStatus.TRIGGERED: CONF_NOTIFY_TRIGGERED_ENABLED,
}

_STATUS_INTERVAL_KEYS: dict[str, tuple[str, int]] = {
    MaintenanceStatus.DUE_SOON: (CONF_NOTIFY_DUE_SOON_INTERVAL, 24),
    MaintenanceStatus.OVERDUE: (CONF_NOTIFY_OVERDUE_INTERVAL, 12),
    MaintenanceStatus.TRIGGERED: (CONF_NOTIFY_TRIGGERED_INTERVAL, 0),
}


class NotificationManager:
    """Manages maintenance notifications and reminders."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the notification manager."""
        self.hass = hass
        self._last_notified: dict[str, datetime] = {}
        self._snoozed_until: dict[str, datetime] = {}
        self._daily_count: int = 0
        self._daily_reset_date: date | None = None
        # Tracks the last-known state of the "configured notify service missing"
        # repair issue. None = not yet reconciled this process; the first
        # ``async_verify_configured_service`` call forces a registry sync so a
        # stale issue persisted from a previous run is cleared on restart.
        self._notify_issue_active: bool | None = None

    @property
    def _global_options(self) -> Mapping[str, Any]:
        """Get global options from the global config entry."""
        return get_global_options(self.hass)

    @property
    def _lang(self) -> str:
        """Get the HA UI language as a 2-letter table key."""
        return normalize_language(self.hass)

    @property
    def enabled(self) -> bool:
        """Check if notifications are globally enabled."""
        return bool(self._global_options.get(CONF_NOTIFICATIONS_ENABLED, False))

    @property
    def notify_service(self) -> str:
        """Get the configured notify service."""
        return str(self._global_options.get(CONF_NOTIFY_SERVICE, ""))

    @property
    def title_style(self) -> str:
        """v1.4.0 (#44): how to format the notification title.

        Returns one of "default" / "object_name" / "task_name". Defaults to
        "default" so existing installs see no behaviour change. Defensive
        against a partially-initialised manager (some unit tests construct
        NotificationManager via __new__ without setting `hass`).
        """
        try:
            raw = str(self._global_options.get(CONF_NOTIFICATION_TITLE_STYLE, "default"))
        except AttributeError:
            return "default"
        if raw not in ("default", "object_name", "task_name"):
            return "default"
        return raw

    def _configured_service_exists(self, service: str) -> bool:
        """Return True if the configured notify target exists right now.

        Either a registered ``notify.<name>`` service (legacy: mobile_app,
        notify groups) OR a notify *entity* (newer model, sent via
        ``notify.send_message``). Otherwise the repair issue would false-fire on
        a perfectly valid entity target.
        """
        domain, _, name = service.partition(".")
        if not name:
            return False
        if self.hass.services.has_service(domain, name):
            return True
        return self.hass.states.get(service) is not None

    @callback
    def async_verify_configured_service(self) -> None:
        """Raise/clear a repair issue when the configured notify service is gone.

        Notifications are sent with ``blocking=False``, so a configured service
        that no longer exists (renamed mobile app, removed notify group, …) fails
        *silently*. This surfaces that as a Home Assistant repair issue instead.

        Transition-gated and idempotent: cheap to call on every send attempt, on
        global-options changes, and once HA has started. Scope is deliberately the
        **top-level** configured service only — a broken member *inside* a notify
        group is invisible from here (HA dispatches to the working members and only
        logs the bad one in its own system log), so we never flag, nor false-alarm
        on, that case.
        """
        service = self.notify_service
        missing = bool(service) and self.enabled and not self._configured_service_exists(service)
        # None (first call) never equals a bool, so the registry is reconciled
        # once at startup — clearing any issue persisted from a previous run.
        if missing == self._notify_issue_active:
            return
        self._notify_issue_active = missing
        if missing:
            _LOGGER.warning(
                "Configured notify service '%s' is not available — notifications will silently fail; raising a repair issue",
                service,
            )
            ir.async_create_issue(
                self.hass,
                DOMAIN,
                _NOTIFY_SERVICE_MISSING_ISSUE_ID,
                is_fixable=False,
                severity=ir.IssueSeverity.WARNING,
                translation_key="notify_service_missing",
                translation_placeholders={"service": service},
            )
        else:
            ir.async_delete_issue(self.hass, DOMAIN, _NOTIFY_SERVICE_MISSING_ISSUE_ID)

    def _is_status_enabled(self, status: str) -> bool:
        """Check if notifications for this specific status are enabled."""
        key = _STATUS_ENABLED_KEYS.get(status)
        if key is None:
            return False
        return bool(self._global_options.get(key, True))

    def _get_interval_hours(self, status: str) -> int:
        """Get repeat interval for a status. 0 = single notification."""
        entry = _STATUS_INTERVAL_KEYS.get(status)
        if entry is None:
            return 24
        key, default = entry
        return int(self._global_options.get(key, default))

    def _is_quiet_hours(self) -> bool:
        """Check if current time is in quiet hours."""
        options = self._global_options

        # Quiet hours default: enabled (matches config flow)
        if not options.get(CONF_QUIET_HOURS_ENABLED, True):
            return False

        start_str = options.get(CONF_QUIET_HOURS_START, "22:00")
        end_str = options.get(CONF_QUIET_HOURS_END, "08:00")

        try:
            start = time.fromisoformat(start_str)
            end = time.fromisoformat(end_str)
        except (ValueError, TypeError):
            return False

        now = dt_util.now().time()

        if start <= end:
            return start <= now <= end
        # Overnight quiet hours (e.g., 22:00 - 08:00)
        return now >= start or now <= end

    def _check_daily_limit(self) -> bool:
        """Check if daily notification limit has been reached."""
        today = dt_util.now().date()
        if self._daily_reset_date != today:
            self._daily_count = 0
            self._daily_reset_date = today

        max_per_day = self._global_options.get(CONF_MAX_NOTIFICATIONS_PER_DAY, DEFAULT_MAX_NOTIFICATIONS_PER_DAY)
        if max_per_day > 0 and self._daily_count >= max_per_day:
            _LOGGER.debug("Daily notification limit reached (%s/%s)", self._daily_count, max_per_day)
            return False
        return True

    def _is_snoozed(self, key: str) -> bool:
        """Check if a notification key is snoozed."""
        until = self._snoozed_until.get(key)
        if until is None:
            return False
        if dt_util.now() >= until:
            # Snooze expired
            del self._snoozed_until[key]
            return False
        return True

    def snooze_task(self, entry_id: str, task_id: str) -> None:
        """Snooze all notifications for a task."""
        hours = self._global_options.get(CONF_SNOOZE_DURATION_HOURS, DEFAULT_SNOOZE_DURATION_HOURS)
        until = dt_util.now() + timedelta(hours=hours)
        # Snooze for all status types
        for status in (MaintenanceStatus.DUE_SOON, MaintenanceStatus.OVERDUE, MaintenanceStatus.TRIGGERED):
            key = f"{entry_id}_{task_id}_{status}"
            self._snoozed_until[key] = until
        _LOGGER.debug("Snoozed task %s for %s hours (until %s)", task_id, hours, until)

    async def async_task_status_changed(
        self,
        entry_id: str,
        task_id: str,
        task_name: str,
        object_name: str,
        new_status: str,
        days_until_due: int | None = None,
        next_due: str | None = None,
        responsible_user_id: str | None = None,
    ) -> None:
        """Handle status change / repeat check and send notification if appropriate."""
        # Keep the "configured notify service missing" repair issue in sync with
        # reality on every attempt (cheap; transition-gated internally).
        self.async_verify_configured_service()

        if not self.enabled:
            return

        # Only notify for certain statuses
        if new_status not in _STATUS_ENABLED_KEYS:
            return

        # Check if this status is enabled
        if not self._is_status_enabled(new_status):
            return

        # Check quiet hours
        if self._is_quiet_hours():
            _LOGGER.debug("Skipping notification during quiet hours")
            return

        # Vacation mode (v1.2.0): suppress unless task is on the exempt list.
        # Sensor-triggered notifications use the same path so they're covered.
        from .vacation import get_vacation_state

        if get_vacation_state(self.hass).is_silent_for(task_id):
            _LOGGER.debug("Skipping notification — vacation mode active for %s", task_id)
            return

        # Rate limiting / interval
        key = f"{entry_id}_{task_id}_{new_status}"

        # Check snooze
        if self._is_snoozed(key):
            _LOGGER.debug("Notification snoozed for %s", key)
            return

        interval_hours = self._get_interval_hours(new_status)

        if key in self._last_notified:
            last = self._last_notified[key]
            if last == _SENT_ONCE:
                # interval=0: already sent once, never repeat
                return
            elapsed = (dt_util.now() - last).total_seconds()
            if interval_hours > 0 and elapsed < interval_hours * 3600:
                return
            # interval=0 but hasn't been sent yet → allow

        # Check daily limit
        if not self._check_daily_limit():
            return

        # Build translated message
        lang = self._lang
        title, message = self._build_message(new_status, lang, task_name, object_name, days_until_due, next_due)

        # Determine target services: user-specific or global
        target_services = []
        if responsible_user_id:
            user_services = await get_user_notify_services(self.hass, responsible_user_id)
            if user_services:
                target_services = user_services
                _LOGGER.debug(
                    "Sending notification to user %s services: %s",
                    responsible_user_id,
                    user_services,
                )
            else:
                _LOGGER.debug(
                    "User %s has no notification services, falling back to global",
                    responsible_user_id,
                )

        # Fallback to global service
        if not target_services and self.notify_service:
            target_services = [self.notify_service]

        if not target_services:
            _LOGGER.warning("No notification services available")
            return

        # Send to all target services
        success = False
        for service in target_services:
            if await self._async_send_notification_to_service(
                service=service,
                title=title,
                message=message,
                entry_id=entry_id,
                task_id=task_id,
            ):
                success = True

        if not success:
            return

        # Record send time (only on success)
        if interval_hours == 0:
            self._last_notified[key] = _SENT_ONCE
        else:
            self._last_notified[key] = dt_util.now()
        self._daily_count += 1

        _LOGGER.debug("Notification sent: %s - %s", title, message)

    def _build_message(
        self,
        status: str,
        lang: str,
        task_name: str,
        object_name: str,
        days_until_due: int | None,
        next_due: str | None,
    ) -> tuple[str, str]:
        """Build translated notification title and message."""
        if status == MaintenanceStatus.DUE_SOON:
            title = _notif_t("due_soon_title", lang)
            message = _notif_t(
                "due_soon_message",
                lang,
                task=task_name,
                object=object_name,
                days=str(days_until_due) if days_until_due is not None else "?",
                due=next_due if next_due is not None else "?",
            )
        elif status == MaintenanceStatus.OVERDUE:
            title = _notif_t("overdue_title", lang)
            days_overdue = str(abs(days_until_due)) if days_until_due is not None else "?"
            message = _notif_t(
                "overdue_message",
                lang,
                task=task_name,
                object=object_name,
                days=days_overdue,
            )
        elif status == MaintenanceStatus.TRIGGERED:
            title = _notif_t("triggered_title", lang)
            message = _notif_t(
                "triggered_message",
                lang,
                task=task_name,
                object=object_name,
            )
        else:
            title = "Maintenance"
            message = f"{task_name} ({object_name})"

        # v1.4.0 (#44): override title with object/task name so phone
        # notification stacks remain distinguishable at a glance.
        style = self.title_style
        if style == "object_name" and object_name:
            title = object_name
        elif style == "task_name" and task_name:
            title = task_name

        return title, message

    async def _async_send_notification_to_service(
        self,
        service: str,
        title: str,
        message: str,
        entry_id: str,
        task_id: str,
    ) -> bool:
        """Send notification via specific service, optionally with action buttons.

        Args:
            service: Full service name like "notify.mobile_app_device"
            title: Notification title
            message: Notification message
            entry_id: Config entry ID for action buttons
            task_id: Task ID for action buttons

        Returns:
            True if the notification was sent successfully, False otherwise.
        """
        options = self._global_options
        lang = self._lang

        # Build action buttons for Companion App
        actions: list[dict[str, str]] = []
        if options.get(CONF_ACTION_COMPLETE_ENABLED, False):
            actions.append(
                {
                    "action": f"MS_COMPLETE_{entry_id}_{task_id}",
                    "title": f"\u2705 {_notif_t('action_complete', lang)}",
                }
            )
        if options.get(CONF_ACTION_SKIP_ENABLED, False):
            actions.append(
                {
                    "action": f"MS_SKIP_{entry_id}_{task_id}",
                    "title": f"\u23ed\ufe0f {_notif_t('action_skip', lang)}",
                }
            )
        if options.get(CONF_ACTION_SNOOZE_ENABLED, False):
            actions.append(
                {
                    "action": f"MS_SNOOZE_{entry_id}_{task_id}",
                    "title": f"\U0001f4a4 {_notif_t('action_snooze', lang)}",
                }
            )

        service_data: dict[str, Any] = {"title": title, "message": message}
        data: dict[str, Any] = {
            "tag": f"maintenance_{task_id}",
            "url": f"/maintenance-supporter?entry_id={entry_id}&task_id={task_id}",
            "clickAction": f"/maintenance-supporter?entry_id={entry_id}&task_id={task_id}",
        }
        if actions:
            data["actions"] = actions[:3]  # Android supports max 3
        service_data["data"] = data

        try:
            return await async_dispatch_notify(self.hass, service, service_data)
        except (HomeAssistantError, ValueError, TypeError):
            _LOGGER.exception("Failed to send notification to %s", service)
            return False

    async def async_send_bundled(
        self,
        entry_id: str,
        object_name: str,
        tasks: list[dict[str, Any]],
    ) -> None:
        """Send a single bundled notification summarising multiple tasks."""
        self.async_verify_configured_service()
        if not self.enabled or not self.notify_service:
            return

        if self._is_quiet_hours():
            return

        # Rate-limit bundled notifications (once per hour)
        bundle_key = f"{entry_id}_bundled"
        if bundle_key in self._last_notified:
            last = self._last_notified[bundle_key]
            if last != _SENT_ONCE:
                elapsed = (dt_util.now() - last).total_seconds()
                if elapsed < 3600:
                    return

        if not self._check_daily_limit():
            return

        lang = self._lang
        status_key_map = {
            MaintenanceStatus.OVERDUE: "bundled_overdue",
            MaintenanceStatus.DUE_SOON: "bundled_due_soon",
            MaintenanceStatus.TRIGGERED: "bundled_triggered",
        }

        task_parts: list[str] = []
        for t in tasks:
            key = status_key_map.get(t["status"], "bundled_due_soon")
            task_parts.append(_notif_t(key, lang, task=t["task_name"]))

        title = _notif_t("bundled_title", lang, count=str(len(tasks)))
        message = _notif_t("bundled_message", lang, object=object_name, task_list=", ".join(task_parts))

        # v1.4.0 (#44): for bundled notifications, "object_name" style still
        # prefers the object as the title; "task_name" doesn't map cleanly
        # for multi-task bundles, so we leave the count-based default.
        if self.title_style == "object_name" and object_name:
            title = object_name

        service_data: dict[str, Any] = {
            "title": title,
            "message": message,
            "data": {
                "tag": f"maintenance_bundled_{entry_id}",
                "url": f"/maintenance-supporter?entry_id={entry_id}",
                "clickAction": f"/maintenance-supporter?entry_id={entry_id}",
            },
        }

        try:
            if await async_dispatch_notify(self.hass, self.notify_service, service_data):
                self._last_notified[bundle_key] = dt_util.now()
                self._daily_count += 1
                _LOGGER.debug("Bundled notification sent: %s - %s", title, message)
        except (HomeAssistantError, ValueError, TypeError):
            _LOGGER.exception("Failed to send bundled notification")

    async def async_send_weekly_digest(self, overdue: int, due_soon: int) -> None:
        """Send the opt-in weekly summary notification.

        One message with the cross-object counts. Unlike the reactive per-task
        notifications this is a scheduled once-a-week send, so it deliberately
        skips the rate-limit / quiet-hours gating (it fires at a fixed morning
        hour the user chose by enabling the digest).
        """
        self.async_verify_configured_service()
        if not self.enabled or not self.notify_service:
            return
        lang = self._lang
        service_data: dict[str, Any] = {
            "title": _notif_t("digest_title", lang),
            "message": _notif_t("digest_message", lang, overdue=str(overdue), due_soon=str(due_soon)),
            "data": {
                "tag": "maintenance_weekly_digest",
                "url": "/maintenance-supporter",
                "clickAction": "/maintenance-supporter",
            },
        }
        try:
            await async_dispatch_notify(self.hass, self.notify_service, service_data)
            _LOGGER.debug("Weekly digest sent: %s overdue, %s due soon", overdue, due_soon)
        except (HomeAssistantError, ValueError, TypeError):
            _LOGGER.exception("Failed to send weekly digest")

    async def async_send_warranty_reminder(self, names: list[str], days: int) -> None:
        """Send the opt-in warranty-expiry reminder — one message listing the
        objects whose warranty expires within ``days`` days. Like the digest,
        a scheduled once-a-day send that skips rate-limit / quiet-hours gating.
        """
        self.async_verify_configured_service()
        if not self.enabled or not self.notify_service or not names:
            return
        lang = self._lang
        service_data: dict[str, Any] = {
            "title": _notif_t("warranty_title", lang),
            "message": _notif_t(
                "warranty_message",
                lang,
                count=str(len(names)),
                days=str(days),
                names=", ".join(names),
            ),
            "data": {
                "tag": "maintenance_warranty_reminder",
                "url": "/maintenance-supporter",
                "clickAction": "/maintenance-supporter",
            },
        }
        try:
            await async_dispatch_notify(self.hass, self.notify_service, service_data)
            _LOGGER.debug("Warranty reminder sent: %s object(s)", len(names))
        except (HomeAssistantError, ValueError, TypeError):
            _LOGGER.exception("Failed to send warranty reminder")

    async def async_send_lead_reminder(
        self,
        entry_id: str,
        task_id: str,
        task_name: str,
        object_name: str,
        days: int,
        next_due: str | None = None,
        responsible_user_id: str | None = None,
    ) -> None:
        """Send one lead-time reminder (task is due in exactly ``days`` days).

        Fired by the daily lead-reminder tick when a task's days-until-due
        matches one of the configured ``reminder_lead_days``. Reuses the
        due-soon strings (same message shape) and the per-user routing of the
        status-change path. Honours quiet hours, vacation mode, snooze, and
        the daily limit; the once-per-day tick is the repeat gate, so no
        ``_last_notified`` bookkeeping is needed.
        """
        self.async_verify_configured_service()
        if not self.enabled:
            return
        if self._is_quiet_hours():
            return
        from .vacation import get_vacation_state

        if get_vacation_state(self.hass).is_silent_for(task_id):
            return
        # An active snooze silences lead reminders too (same key family the
        # snooze action writes).
        if self._is_snoozed(f"{entry_id}_{task_id}_{MaintenanceStatus.DUE_SOON}"):
            return
        if not self._check_daily_limit():
            return

        lang = self._lang
        title = _notif_t("due_soon_title", lang)
        message = _notif_t(
            "due_soon_message",
            lang,
            task=task_name,
            object=object_name,
            days=str(days),
            due=next_due if next_due is not None else "?",
        )

        target_services: list[str] = []
        if responsible_user_id:
            user_services = await get_user_notify_services(self.hass, responsible_user_id)
            if user_services:
                target_services = user_services
        if not target_services and self.notify_service:
            target_services = [self.notify_service]
        if not target_services:
            return

        success = False
        for service in target_services:
            if await self._async_send_notification_to_service(
                service=service,
                title=title,
                message=message,
                entry_id=entry_id,
                task_id=task_id,
            ):
                success = True
        if success:
            self._daily_count += 1
            _LOGGER.debug("Lead reminder sent: %s due in %s day(s)", task_name, days)

    async def async_budget_alert(
        self,
        period: str,
        spent: float,
        budget: float,
        currency_symbol: str = "€",
    ) -> None:
        """Send a budget threshold alert notification."""
        if not self.enabled or not self.notify_service:
            return

        if self._is_quiet_hours():
            return

        # Rate-limit budget alerts (once per 24 hours per period)
        budget_key = f"_budget_{period}"
        if budget_key in self._last_notified:
            last = self._last_notified[budget_key]
            if last != _SENT_ONCE:
                elapsed = (dt_util.now() - last).total_seconds()
                if elapsed < 86400:  # 24 hours
                    return

        if not self._check_daily_limit():
            return

        pct = round(spent / budget * 100) if budget > 0 else 0
        lang = self._lang
        title = _notif_t("budget_alert_title", lang)
        key = f"budget_alert_{period}"
        message = _notif_t(
            key,
            lang,
            pct=str(pct),
            spent=f"{spent:.2f}{currency_symbol}",
            budget=f"{budget:.2f}{currency_symbol}",
        )

        service_data: dict[str, Any] = {
            "title": title,
            "message": message,
            "data": {
                "tag": f"maintenance_budget_{period}",
                "url": "/maintenance-supporter",
                "clickAction": "/maintenance-supporter",
            },
        }

        try:
            if await async_dispatch_notify(self.hass, self.notify_service, service_data):
                self._last_notified[budget_key] = dt_util.now()
                self._daily_count += 1
                _LOGGER.debug("Budget alert sent: %s - %s", title, message)
        except (HomeAssistantError, ValueError, TypeError):
            _LOGGER.exception("Failed to send budget alert")

    def seed_startup_state(self, entry_id: str, task_id: str, status: str) -> None:
        """Seed notification state for a task that is already notifiable at startup.

        Called once on first coordinator refresh to prevent a burst of stale
        notifications.  Sets the ``_last_notified`` timestamp so the repeat
        interval starts *now* rather than firing immediately.
        """
        key = f"{entry_id}_{task_id}_{status}"
        interval_hours = self._get_interval_hours(status)
        if interval_hours == 0:
            self._last_notified[key] = _SENT_ONCE
        else:
            self._last_notified[key] = dt_util.now()

    def clear_task_state(self, entry_id: str, task_id: str) -> None:
        """Clear notification state for a task (after completion/reset)."""
        for status in (MaintenanceStatus.DUE_SOON, MaintenanceStatus.OVERDUE, MaintenanceStatus.TRIGGERED):
            key = f"{entry_id}_{task_id}_{status}"
            self._last_notified.pop(key, None)
            self._snoozed_until.pop(key, None)

    async def async_dismiss_task_notification(self, task_id: str) -> None:
        """Dismiss a task notification on Companion App devices.

        ``clear_notification`` is a legacy mobile_app service feature; the notify
        *entity* model (notify.send_message) has no equivalent, so an entity-only
        target can't be dismissed and is simply skipped.
        """
        service = self.notify_service
        domain, _, name = service.partition(".")
        if not (name and self.hass.services.has_service(domain, name)):
            return
        tag = f"maintenance_{task_id}"
        try:
            await self.hass.services.async_call(
                domain,
                name,
                {"message": "clear_notification", "data": {"tag": tag}},
                blocking=False,
            )
        except (HomeAssistantError, ValueError, TypeError):
            _LOGGER.debug("Failed to dismiss notification for tag %s", tag)

    async def async_unload(self) -> None:
        """Clean up the notification manager."""
        self._last_notified.clear()
        self._snoozed_until.clear()
        self._daily_count = 0
        self._daily_reset_date = None
