"""Global options flow for the Maintenance Supporter integration.

Contains GlobalOptionsFlow: menu-based global settings (notifications, budget, groups).
Split from config_flow_options.py for better maintainability.
"""

from __future__ import annotations

import logging
import re
from typing import Any
from uuid import uuid4

import voluptuous as vol
from homeassistant.config_entries import ConfigFlowResult, OptionsFlow
from homeassistant.core import HomeAssistant
from homeassistant.helpers import selector

from .config_flow_helpers import select_default
from .const import (
    BUDGET_CURRENCIES,
    CONF_ACTION_COMPLETE_ENABLED,
    CONF_ACTION_SKIP_ENABLED,
    CONF_ACTION_SNOOZE_ENABLED,
    CONF_ADMIN_PANEL_USER_IDS,
    CONF_ADVANCED_ADAPTIVE,
    CONF_ADVANCED_BUDGET,
    CONF_ADVANCED_CHECKLISTS,
    CONF_ADVANCED_COMPLETION_ACTIONS,
    CONF_ADVANCED_ENVIRONMENTAL,
    CONF_ADVANCED_GROUPS,
    CONF_ADVANCED_PREDICTIONS,
    CONF_ADVANCED_SCHEDULE_TIME,
    CONF_ADVANCED_SEASONAL,
    CONF_ARCHIVE_ONEOFF_DAYS,
    CONF_BATTERY_AUTO_RECORD_RECOVERY,
    CONF_BATTERY_LIFETIME_MONTHS,
    CONF_BATTERY_LOW_PERCENT,
    CONF_BATTERY_RECOVERED_PERCENT,
    CONF_BUDGET_ALERT_THRESHOLD,
    CONF_BUDGET_ALERTS_ENABLED,
    CONF_BUDGET_CURRENCY,
    CONF_BUDGET_MONTHLY,
    CONF_BUDGET_YEARLY,
    CONF_CURRENCY_DECIMALS,
    CONF_DEFAULT_CONSUMABLE_THRESHOLD,
    CONF_DEFAULT_WARNING_DAYS,
    CONF_DELETE_ARCHIVED_ONEOFF_DAYS,
    CONF_DISABLED_TEMPLATE_IDS,
    CONF_HOME_REGION,
    CONF_HOME_TYPE,
    CONF_INSTALL_ASSIST_SENTENCES,
    CONF_MAX_NOTIFICATIONS_PER_DAY,
    CONF_MEMBER_DISPLAY,
    CONF_NOTIFICATION_BUNDLE_THRESHOLD,
    CONF_NOTIFICATION_BUNDLING_ENABLED,
    CONF_NOTIFICATION_TITLE_STYLE,
    CONF_NOTIFICATIONS_ENABLED,
    CONF_NOTIFY_COMPLETED,
    CONF_NOTIFY_DUE_SOON_ENABLED,
    CONF_NOTIFY_DUE_SOON_INTERVAL,
    CONF_NOTIFY_EVENT_ONLY,
    CONF_NOTIFY_EXTRA_DATA,
    CONF_NOTIFY_OVERDUE_ENABLED,
    CONF_NOTIFY_OVERDUE_INTERVAL,
    CONF_NOTIFY_SCOPE_VIEW_ID,
    CONF_NOTIFY_SERVICE,
    CONF_NOTIFY_TRIGGERED_ENABLED,
    CONF_NOTIFY_TRIGGERED_INTERVAL,
    CONF_OBJECTS_TABLE_COLUMNS,
    CONF_OPERATOR_WRITE_ENABLED,
    CONF_PANEL_ENABLED,
    CONF_PANEL_TITLE,
    CONF_PART_SEARCH_URL_TEMPLATE,
    CONF_QUIET_HOURS_ENABLED,
    CONF_QUIET_HOURS_END,
    CONF_QUIET_HOURS_START,
    CONF_REF_NUMBERS_IN_LISTS,
    CONF_REMINDER_LEAD_DAYS,
    CONF_ROW_ACTION_STYLE,
    CONF_SHOPPING_LIST_ENTITY,
    CONF_SNOOZE_DURATION_HOURS,
    CONF_WARRANTY_REMINDER_DAYS,
    CONF_WARRANTY_REMINDER_ENABLED,
    CONF_WEEKLY_DIGEST_ENABLED,
    DEFAULT_BUDGET_CURRENCY,
    HOME_REGION_AUTO,
    HOME_TYPES,
    KNOWN_OBJECT_TABLE_COLUMNS,
    MAX_NOTIFY_EXTRA_DATA_LENGTH,
    MAX_PANEL_TITLE_LENGTH,
    MAX_REMINDER_LEADS,
    NOTIFY_COMPLETED_MODES,
    ROW_ACTION_STYLES,
    TIME_HHMMSS_PATTERN,
)
from .helpers.dates import normalize_hhmm
from .helpers.i18n import normalize_language
from .helpers.notify_targets import build_notify_targets
from .helpers.settings_registry import float_range, int_range, setting_default

_LOGGER = logging.getLogger(__name__)

# NumberSelector bounds are pulled from the shared settings registry so the
# options-flow forms can't drift from the WS write-handler's range validation.
_WARN_MIN, _WARN_MAX = int_range(CONF_DEFAULT_WARNING_DAYS)
# The three per-status notify-interval selectors share one bound. That's only
# valid while the registry keeps their ranges identical — assert it so a future
# divergence fails loudly at load instead of silently using the due-soon bound.
_NOTIFY_INTERVAL_MIN, _NOTIFY_INTERVAL_MAX = int_range(CONF_NOTIFY_DUE_SOON_INTERVAL)
assert (
    int_range(CONF_NOTIFY_OVERDUE_INTERVAL)
    == int_range(CONF_NOTIFY_TRIGGERED_INTERVAL)
    == (_NOTIFY_INTERVAL_MIN, _NOTIFY_INTERVAL_MAX)
), "notify-interval ranges diverged — give each selector its own registry bound"
_MAX_PER_DAY_MIN, _MAX_PER_DAY_MAX = int_range(CONF_MAX_NOTIFICATIONS_PER_DAY)
_BUNDLE_MIN, _BUNDLE_MAX = int_range(CONF_NOTIFICATION_BUNDLE_THRESHOLD)
_SNOOZE_MIN, _SNOOZE_MAX = int_range(CONF_SNOOZE_DURATION_HOURS)
_ALERT_MIN, _ALERT_MAX = int_range(CONF_BUDGET_ALERT_THRESHOLD)
_BUDGET_MONTHLY_MIN, _BUDGET_MONTHLY_MAX = float_range(CONF_BUDGET_MONTHLY)
_BUDGET_YEARLY_MIN, _BUDGET_YEARLY_MAX = float_range(CONF_BUDGET_YEARLY)

_VALID_SERVICE_PART = re.compile(r"^[a-z0-9_]+$")
# The notification scope's "every task" choice (a select option can't be "").
_SCOPE_ALL = "__all__"
# v1.4.6: HH:MM or HH:MM:SS, 0–23 hours, 0–59 minutes/seconds. Shared with the
# WS handler via const.TIME_HHMMSS_PATTERN so the two can't diverge.
_VALID_TIME_PATTERN = TIME_HHMMSS_PATTERN


def _safe_time(value: Any, fallback: str) -> str:
    """Return ``value`` if it parses as HH:MM[:SS], else the ``fallback``.

    HA's `TimeSelector` rejects empty strings, `None`, and non-time strings as
    "Invalid time" — and that error then blocks the entire form save, even when
    the user wasn't editing the time field. Coerce the form's *default* to a
    valid time so the user can still hit Save.
    """
    if isinstance(value, str) and _VALID_TIME_PATTERN.match(value):
        return value
    return fallback


def validate_notify_service(raw: str, hass: HomeAssistant | None = None) -> tuple[str, str | None]:
    """Normalize and validate a notify service string.

    Returns (normalized_value, error_key | None).
    """
    value = raw.strip()
    if not value:
        return ("", None)

    # Auto-fix: prepend "notify." if missing
    if "." not in value:
        value = f"notify.{value}"

    parts = value.split(".")
    if len(parts) != 2 or parts[0] != "notify" or not parts[1] or not _VALID_SERVICE_PART.match(parts[1]):
        return (value, "invalid_notify_service")

    # Check service existence (only when hass available, i.e. options flow)
    if hass is not None and not hass.services.has_service(parts[0], parts[1]):
        return (value, "notify_service_not_found")

    return (value, None)


_TEST_NOTIFICATION_RESULTS: dict[str, dict[str, str]] = {
    "de": {
        "success": "✅ Testbenachrichtigung gesendet — Ihr Dienst funktioniert. Wenn ein bestimmtes Gerät nichts bekommt, prüfen Sie dieses Gerät in Ihrer Notify-Gruppe (und das HA-Protokoll).",
        "no_service": "⚠️ Kein Benachrichtigungsdienst konfiguriert. Bitte zuerst unter Allgemeine Einstellungen einen Dienst einrichten.",
        "invalid_service": "❌ Das Format des Benachrichtigungsdienstes ist ungültig. Verwenden Sie 'notify.dienstname'.",
        "failed": "❌ Testbenachrichtigung konnte nicht gesendet werden. Bitte prüfen Sie Ihre Konfiguration.",
        "push_message": "🔧 Testbenachrichtigung — Ihre Benachrichtigungseinrichtung funktioniert!",
        "user_no_device": "ℹ️ Diesem Nutzer ist kein Companion-Gerät zugeordnet — seine Erinnerungen gehen an den Haushalts-Dienst.",
    },
    "nl": {
        "success": "✅ Testmelding verzonden — uw service werkt. Krijgt een specifiek apparaat niets, controleer dat apparaat in uw notify-groep (en het HA-logboek).",
        "no_service": "⚠️ Geen meldingsservice geconfigureerd. Stel eerst een service in onder Algemene instellingen.",
        "invalid_service": "❌ Het formaat van de meldingsservice is ongeldig. Gebruik 'notify.servicenaam'.",
        "failed": "❌ Testmelding kon niet worden verzonden. Controleer uw configuratie.",
        "push_message": "🔧 Testmelding — uw meldingsinstellingen werken!",
        "user_no_device": "ℹ️ Aan deze gebruiker is geen Companion-apparaat gekoppeld — hun herinneringen gaan naar de huishoudelijke dienst.",
    },
    "fr": {
        "success": "✅ Notification de test envoyée — votre service fonctionne. Si un appareil précis ne reçoit rien, vérifiez-le dans votre groupe notify (et les journaux HA).",
        "no_service": "⚠️ Aucun service de notification configuré. Veuillez d'abord configurer un service dans les paramètres généraux.",
        "invalid_service": "❌ Le format du service de notification est invalide. Utilisez 'notify.nom_du_service'.",
        "failed": "❌ Impossible d'envoyer la notification de test. Veuillez vérifier votre configuration.",
        "push_message": "🔧 Notification de test — votre configuration de notifications fonctionne !",
        "user_no_device": "ℹ️ Aucun appareil Companion n'est lié à cet utilisateur — ses rappels partent vers le service du foyer.",
    },
    "it": {
        "success": "✅ Notifica di test inviata — il servizio funziona. Se un dispositivo specifico non riceve nulla, controllalo nel tuo gruppo notify (e nei log di HA).",
        "no_service": "⚠️ Nessun servizio di notifica configurato. Configura prima un servizio nelle impostazioni generali.",
        "invalid_service": "❌ Il formato del servizio di notifica non è valido. Usa 'notify.nome_servizio'.",
        "failed": "❌ Impossibile inviare la notifica di test. Verifica la tua configurazione.",
        "push_message": "🔧 Notifica di test — la configurazione delle notifiche funziona!",
        "user_no_device": "ℹ️ Nessun dispositivo Companion è collegato a questo utente — i suoi promemoria vanno al servizio della casa.",
    },
    "es": {
        "success": "✅ Notificación de prueba enviada — tu servicio funciona. Si un dispositivo concreto no recibe nada, revísalo en tu grupo notify (y los registros de HA).",
        "no_service": "⚠️ No hay servicio de notificación configurado. Configure primero un servicio en la configuración general.",
        "invalid_service": "❌ El formato del servicio de notificación no es válido. Use 'notify.nombre_servicio'.",
        "failed": "❌ No se pudo enviar la notificación de prueba. Verifique su configuración.",
        "push_message": "🔧 Notificación de prueba — ¡su configuración de notificaciones funciona!",
        "user_no_device": "ℹ️ Este usuario no tiene ningún dispositivo Companion vinculado — sus recordatorios van al servicio del hogar.",
    },
    "en": {
        "success": "✅ Test notification sent — your service works. If a specific device gets nothing, check that device inside your notify group (and Home Assistant's logs).",
        "no_service": "⚠️ No notification service configured. Please configure a service in General Settings first.",
        "invalid_service": "❌ The notification service format is invalid. Use 'notify.service_name'.",
        "failed": "❌ Failed to send the test notification. Please verify your service configuration.",
        "push_message": "🔧 Test notification — your notification setup is working!",
        "user_no_device": "ℹ️ No Companion device is linked to this user — their reminders go to the household service.",
    },
    "ru": {
        "success": "✅ Тестовое уведомление отправлено — сервис работает. Если конкретное устройство ничего не получает, проверьте его в вашей notify-группе (и в журналах HA).",
        "no_service": "⚠️ Сервис уведомлений не настроен. Сначала настройте сервис в Основных настройках.",
        "invalid_service": "❌ Неверный формат сервиса уведомлений. Используйте 'notify.имя_сервиса'.",
        "failed": "❌ Не удалось отправить тестовое уведомление. Проверьте настройки сервиса.",
        "push_message": "🔧 Тестовое уведомление — ваша система уведомлений работает!",
        "user_no_device": "ℹ️ К этому пользователю не привязано устройство Companion — его напоминания уходят в общий сервис.",
    },
    "uk": {
        "success": "✅ Тестове сповіщення надіслано — служба працює. Якщо певний пристрій нічого не отримує, перевірте його у вашій notify-групі (та в журналах HA).",
        "no_service": "⚠️ Службу сповіщень не налаштовано. Спочатку вкажіть службу в загальних налаштуваннях.",
        "invalid_service": "❌ Невірний формат служби сповіщень. Використовуйте 'notify.service_name'.",
        "failed": "❌ Не вдалося надіслати тестове сповіщення. Перевірте конфігурацію служби.",
        "push_message": "🔧 Тестове сповіщення — ваші сповіщення працюють!",
        "user_no_device": "ℹ️ До цього користувача не прив'язано пристрій Companion — його нагадування надходять до загальної служби.",
    },
    "pt": {
        "success": "✅ Notificação de teste enviada — o seu serviço funciona. Se um dispositivo específico não receber nada, verifique-o no seu grupo notify (e nos registos do HA).",
        "no_service": "⚠️ Serviço de notificação não configurado. Configure primeiro nas Configurações Gerais.",
        "invalid_service": "❌ Formato inválido do serviço de notificação. Use 'notify.nome_do_servico'.",
        "failed": "❌ Falha ao enviar a notificação de teste. Verifique a configuração do serviço.",
        "push_message": "🔧 Notificação de teste — as suas notificações estão a funcionar!",
        "user_no_device": "ℹ️ Este utilizador não tem nenhum dispositivo Companion associado — os lembretes seguem para o serviço da casa.",
    },
    "zh": {
        "success": "✅ 测试通知已发送 — 您的服务正常。如果某个设备未收到，请在您的 notify 群组中检查该设备（以及 HA 日志）。",
        "no_service": "⚠️ 未配置通知服务。请先在“通用设置”中配置服务。",
        "invalid_service": "❌ 通知服务格式无效。请使用 'notify.服务名称' 格式。",
        "failed": "❌ 测试通知发送失败。请验证您的服务配置。",
        "push_message": "🔧 测试通知 — 您的通知设置已生效！",
        "user_no_device": "ℹ️ 该用户未关联 Companion 设备 — 其提醒将发送到家庭通知服务。",
    },
    "pt-br": {
        "success": "✅ Notificação de teste enviada — seu serviço funciona. Se um dispositivo específico não receber nada, verifique esse dispositivo dentro do seu grupo de notificação (e os logs do Home Assistant).",
        "no_service": "⚠️ Nenhum serviço de notificação configurado. Configure um serviço primeiro em Configurações Gerais.",
        "invalid_service": "❌ O formato do serviço de notificação é inválido. Use 'notify.nome_do_servico'.",
        "failed": "❌ Falha ao enviar a notificação de teste. Verifique a configuração do serviço.",
        "push_message": "🔧 Notificação de teste — sua configuração de notificações está funcionando!",
        "user_no_device": "ℹ️ Este usuário não tem nenhum dispositivo Companion vinculado — os lembretes vão para o serviço da casa.",
    },
    "hu": {
        "success": "✅ Tesztértesítés elküldve — a szolgáltatás működik. Ha egy adott eszközre nem érkezik semmi, ellenőrizze az eszközt az értesítési csoportban (és a Home Assistant naplóit).",
        "no_service": "⚠️ Nincs értesítési szolgáltatás beállítva. Először állítson be egyet az Általános beállításokban.",
        "invalid_service": "❌ Az értesítési szolgáltatás formátuma érvénytelen. Használja a 'notify.szolgaltatas_nev' formát.",
        "failed": "❌ A tesztértesítés küldése nem sikerült. Ellenőrizze a szolgáltatás beállításait.",
        "push_message": "🔧 Tesztértesítés — az értesítési rendszere működik!",
        "user_no_device": "ℹ️ Ehhez a felhasználóhoz nincs Companion eszköz rendelve — az emlékeztetői a háztartási szolgáltatásra mennek.",
    },
    "ko": {
        "success": "✅ 테스트 알림을 보냈습니다 — 서비스가 작동합니다. 특정 기기에 알림이 오지 않으면 알림 그룹 내 해당 기기와 Home Assistant 로그를 확인하세요.",
        "no_service": "⚠️ 알림 서비스가 설정되지 않았습니다. 먼저 일반 설정에서 서비스를 설정하세요.",
        "invalid_service": "❌ 알림 서비스 형식이 잘못되었습니다. 'notify.service_name' 형식을 사용하세요.",
        "failed": "❌ 테스트 알림 전송에 실패했습니다. 서비스 설정을 확인하세요.",
        "push_message": "🔧 테스트 알림 — 알림 설정이 정상 작동합니다!",
        "user_no_device": "ℹ️ 이 사용자에게 연결된 Companion 기기가 없습니다 — 알림은 가정 서비스로 전송됩니다.",
    },
    "tr": {
        "success": "✅ Test bildirimi gönderildi — servisiniz çalışıyor. Belirli bir cihaza bildirim gelmiyorsa bildirim grubunuzdaki o cihazı (ve Home Assistant günlüklerini) kontrol edin.",
        "no_service": "⚠️ Yapılandırılmış bildirim servisi yok. Önce Genel Ayarlar'da bir servis yapılandırın.",
        "invalid_service": "❌ Bildirim servisi biçimi geçersiz. 'notify.servis_adi' kullanın.",
        "failed": "❌ Test bildirimi gönderilemedi. Servis yapılandırmanızı kontrol edin.",
        "push_message": "🔧 Test bildirimi — bildirim kurulumunuz çalışıyor!",
        "user_no_device": "ℹ️ Bu kullanıcıya bağlı bir Companion cihazı yok — hatırlatıcıları ev servisine gider.",
    },
    "cs": {
        "success": "✅ Testovací oznámení odesláno — vaše služba funguje. Pokud konkrétní zařízení nic nedostane, zkontrolujte ho ve své notify skupině (a v protokolu HA).",
        "no_service": "⚠️ Není nakonfigurována žádná oznamovací služba. Nejprve ji nastavte v Obecných nastaveních.",
        "invalid_service": "❌ Formát oznamovací služby je neplatný. Použijte 'notify.nazev_sluzby'.",
        "failed": "❌ Testovací oznámení se nepodařilo odeslat. Zkontrolujte prosím svou konfiguraci.",
        "push_message": "🔧 Testovací oznámení — vaše nastavení oznámení funguje!",
        "user_no_device": "ℹ️ Tento uživatel nemá přiřazené žádné Companion zařízení — jeho připomínky půjdou na službu domácnosti.",
    },
    "da": {
        "success": "✅ Testnotifikation sendt — din tjeneste virker. Hvis en bestemt enhed intet modtager, så tjek den enhed i din notify-gruppe (og HA-loggen).",
        "no_service": "⚠️ Ingen notifikationstjeneste konfigureret. Opsæt først en tjeneste under Generelle indstillinger.",
        "invalid_service": "❌ Notifikationstjenestens format er ugyldigt. Brug 'notify.tjenestenavn'.",
        "failed": "❌ Testnotifikationen kunne ikke sendes. Tjek venligst din konfiguration.",
        "push_message": "🔧 Testnotifikation — din notifikationsopsætning virker!",
        "user_no_device": "ℹ️ Denne bruger har ingen tilknyttet Companion-enhed — deres påmindelser går til husstandens tjeneste.",
    },
    "fi": {
        "success": "✅ Testi-ilmoitus lähetetty — palvelusi toimii. Jos jokin laite ei saa mitään, tarkista se notify-ryhmästäsi (ja HA-lokista).",
        "no_service": "⚠️ Ilmoituspalvelua ei ole määritetty. Määritä palvelu ensin Yleisissä asetuksissa.",
        "invalid_service": "❌ Ilmoituspalvelun muoto on virheellinen. Käytä muotoa 'notify.palvelunnimi'.",
        "failed": "❌ Testi-ilmoituksen lähetys epäonnistui. Tarkista määrityksesi.",
        "push_message": "🔧 Testi-ilmoitus — ilmoitusasetuksesi toimivat!",
        "user_no_device": "ℹ️ Tällä käyttäjällä ei ole liitettyä Companion-laitetta — hänen muistutuksensa menevät talouden palveluun.",
    },
    "hi": {
        "success": "✅ परीक्षण सूचना भेजी गई — आपकी सेवा काम कर रही है। यदि किसी विशेष डिवाइस को कुछ नहीं मिलता, तो अपनी notify समूह में उस डिवाइस की जाँच करें (और HA लॉग)।",
        "no_service": "⚠️ कोई सूचना सेवा कॉन्फ़िगर नहीं है। कृपया पहले सामान्य सेटिंग्स में एक सेवा सेट करें।",
        "invalid_service": "❌ सूचना सेवा का प्रारूप अमान्य है। 'notify.servicename' का उपयोग करें।",
        "failed": "❌ परीक्षण सूचना भेजी नहीं जा सकी। कृपया अपनी कॉन्फ़िगरेशन जाँचें।",
        "push_message": "🔧 परीक्षण सूचना — आपकी सूचना व्यवस्था काम कर रही है!",
        "user_no_device": "ℹ️ इस उपयोगकर्ता से कोई Companion डिवाइस संबद्ध नहीं है — उनकी याद दिलाने वाली सूचनाएँ घरेलू सेवा पर जाएँगी।",
    },
    "ja": {
        "success": "✅ テスト通知を送信しました — サービスは動作しています。特定のデバイスに届かない場合は、notify グループ内のそのデバイス（と HA ログ）を確認してください。",
        "no_service": "⚠️ 通知サービスが設定されていません。まず一般設定でサービスを設定してください。",
        "invalid_service": "❌ 通知サービスの形式が無効です。'notify.サービス名' を使用してください。",
        "failed": "❌ テスト通知を送信できませんでした。設定を確認してください。",
        "push_message": "🔧 テスト通知 — 通知の設定は正常に動作しています！",
        "user_no_device": "ℹ️ このユーザーには Companion デバイスが関連付けられていません — リマインダーは世帯のサービスに送られます。",
    },
    "nb": {
        "success": "✅ Testvarsel sendt — tjenesten din fungerer. Hvis en bestemt enhet ikke mottar noe, sjekk den enheten i notify-gruppen din (og HA-loggen).",
        "no_service": "⚠️ Ingen varslingstjeneste konfigurert. Sett opp en tjeneste under Generelle innstillinger først.",
        "invalid_service": "❌ Varslingstjenestens format er ugyldig. Bruk 'notify.tjenestenavn'.",
        "failed": "❌ Testvarselet kunne ikke sendes. Sjekk konfigurasjonen din.",
        "push_message": "🔧 Testvarsel — varslingsoppsettet ditt fungerer!",
        "user_no_device": "ℹ️ Denne brukeren har ingen tilknyttet Companion-enhet — påminnelsene deres går til husstandens tjeneste.",
    },
    "pl": {
        "success": "✅ Powiadomienie testowe wysłane — twoja usługa działa. Jeśli konkretne urządzenie nic nie otrzymuje, sprawdź je w swojej grupie notify (i w logu HA).",
        "no_service": "⚠️ Nie skonfigurowano usługi powiadomień. Najpierw ustaw usługę w Ustawieniach ogólnych.",
        "invalid_service": "❌ Format usługi powiadomień jest nieprawidłowy. Użyj 'notify.nazwa_uslugi'.",
        "failed": "❌ Nie udało się wysłać powiadomienia testowego. Sprawdź swoją konfigurację.",
        "push_message": "🔧 Powiadomienie testowe — twoja konfiguracja powiadomień działa!",
        "user_no_device": "ℹ️ Ten użytkownik nie ma przypisanego urządzenia Companion — jego przypomnienia trafią do usługi domowej.",
    },
    "sv": {
        "success": "✅ Testnotis skickad — din tjänst fungerar. Om en viss enhet inte får något, kontrollera den enheten i din notify-grupp (och HA-loggen).",
        "no_service": "⚠️ Ingen notistjänst konfigurerad. Konfigurera först en tjänst under Allmänna inställningar.",
        "invalid_service": "❌ Notistjänstens format är ogiltigt. Använd 'notify.tjanstnamn'.",
        "failed": "❌ Testnotisen kunde inte skickas. Kontrollera din konfiguration.",
        "push_message": "🔧 Testnotis — din notiskonfiguration fungerar!",
        "user_no_device": "ℹ️ Den här användaren har ingen kopplad Companion-enhet — deras påminnelser går till hushållets tjänst.",
    },
}


# 2.94: labels the options flow builds at runtime (the detected dwelling in the
# home-profile step, the "all tasks" choice of the notification scope) — the
# static texts live in strings.json like every other step.
_SETTINGS_STRINGS: dict[str, dict[str, str]] = {
    "en": {
        "dwelling_house": "house",
        "dwelling_apartment": "apartment",
        "dwelling_unknown": "not sure yet",
        "scope_all": "All tasks",
        "region_auto": "Automatic ({region})",
        "region_none": "not found",
    },
    "de": {
        "dwelling_house": "Haus",
        "dwelling_apartment": "Wohnung",
        "dwelling_unknown": "noch unklar",
        "scope_all": "Alle Aufgaben",
        "region_auto": "Automatisch ({region})",
        "region_none": "nicht gefunden",
    },
    "cs": {
        "dwelling_house": "dům",
        "dwelling_apartment": "byt",
        "dwelling_unknown": "zatím nejasné",
        "scope_all": "Všechny úkoly",
        "region_auto": "Automaticky ({region})",
        "region_none": "nenalezeno",
    },
    "da": {
        "dwelling_house": "hus",
        "dwelling_apartment": "lejlighed",
        "dwelling_unknown": "endnu uklart",
        "scope_all": "Alle opgaver",
        "region_auto": "Automatisk ({region})",
        "region_none": "ikke fundet",
    },
    "es": {
        "dwelling_house": "casa",
        "dwelling_apartment": "piso",
        "dwelling_unknown": "aún sin determinar",
        "scope_all": "Todas las tareas",
        "region_auto": "Automático ({region})",
        "region_none": "no encontrada",
    },
    "fi": {
        "dwelling_house": "talo",
        "dwelling_apartment": "kerrostaloasunto",
        "dwelling_unknown": "vielä epäselvä",
        "scope_all": "Kaikki tehtävät",
        "region_auto": "Automaattinen ({region})",
        "region_none": "ei löytynyt",
    },
    "fr": {
        "dwelling_house": "maison",
        "dwelling_apartment": "appartement",
        "dwelling_unknown": "pas encore déterminé",
        "scope_all": "Toutes les tâches",
        "region_auto": "Automatique ({region})",
        "region_none": "introuvable",
    },
    "hi": {"dwelling_house": "मकान", "dwelling_apartment": "फ़्लैट", "dwelling_unknown": "अभी तय नहीं", "scope_all": "सभी कार्य", "region_auto": "स्वचालित ({region})", "region_none": "नहीं मिला"},
    "hu": {
        "dwelling_house": "ház",
        "dwelling_apartment": "lakás",
        "dwelling_unknown": "még nem egyértelmű",
        "scope_all": "Minden feladat",
        "region_auto": "Automatikus ({region})",
        "region_none": "nem található",
    },
    "it": {
        "dwelling_house": "casa",
        "dwelling_apartment": "appartamento",
        "dwelling_unknown": "non ancora chiaro",
        "scope_all": "Tutte le attività",
        "region_auto": "Automatico ({region})",
        "region_none": "non trovata",
    },
    "ja": {
        "dwelling_house": "一戸建て",
        "dwelling_apartment": "集合住宅",
        "dwelling_unknown": "まだ不明",
        "scope_all": "すべてのタスク",
        "region_auto": "自動（{region}）",
        "region_none": "見つかりません",
    },
    "ko": {
        "dwelling_house": "단독주택",
        "dwelling_apartment": "아파트",
        "dwelling_unknown": "아직 불확실",
        "scope_all": "모든 작업",
        "region_auto": "자동({region})",
        "region_none": "찾을 수 없음",
    },
    "nb": {
        "dwelling_house": "hus",
        "dwelling_apartment": "leilighet",
        "dwelling_unknown": "ennå uklart",
        "scope_all": "Alle oppgaver",
        "region_auto": "Automatisk ({region})",
        "region_none": "ikke funnet",
    },
    "nl": {
        "dwelling_house": "huis",
        "dwelling_apartment": "appartement",
        "dwelling_unknown": "nog onduidelijk",
        "scope_all": "Alle taken",
        "region_auto": "Automatisch ({region})",
        "region_none": "niet gevonden",
    },
    "pl": {
        "dwelling_house": "dom",
        "dwelling_apartment": "mieszkanie",
        "dwelling_unknown": "jeszcze niejasne",
        "scope_all": "Wszystkie zadania",
        "region_auto": "Automatycznie ({region})",
        "region_none": "nie znaleziono",
    },
    "pt": {
        "dwelling_house": "moradia",
        "dwelling_apartment": "apartamento",
        "dwelling_unknown": "ainda por determinar",
        "scope_all": "Todas as tarefas",
        "region_auto": "Automático ({region})",
        "region_none": "não encontrada",
    },
    "pt-br": {
        "dwelling_house": "casa",
        "dwelling_apartment": "apartamento",
        "dwelling_unknown": "ainda indefinido",
        "scope_all": "Todas as tarefas",
        "region_auto": "Automático ({region})",
        "region_none": "não encontrada",
    },
    "ru": {
        "dwelling_house": "дом",
        "dwelling_apartment": "квартира",
        "dwelling_unknown": "пока неясно",
        "scope_all": "Все задачи",
        "region_auto": "Автоматически ({region})",
        "region_none": "не найден",
    },
    "sv": {
        "dwelling_house": "hus",
        "dwelling_apartment": "lägenhet",
        "dwelling_unknown": "ännu oklart",
        "scope_all": "Alla uppgifter",
        "region_auto": "Automatiskt ({region})",
        "region_none": "hittades inte",
    },
    "tr": {
        "dwelling_house": "müstakil ev",
        "dwelling_apartment": "daire",
        "dwelling_unknown": "henüz belirsiz",
        "scope_all": "Tüm görevler",
        "region_auto": "Otomatik ({region})",
        "region_none": "bulunamadı",
    },
    "uk": {
        "dwelling_house": "будинок",
        "dwelling_apartment": "квартира",
        "dwelling_unknown": "поки неясно",
        "scope_all": "Усі завдання",
        "region_auto": "Автоматично ({region})",
        "region_none": "не знайдено",
    },
    "zh": {"dwelling_house": "独栋住宅", "dwelling_apartment": "公寓", "dwelling_unknown": "尚不确定", "scope_all": "所有任务", "region_auto": "自动（{region}）", "region_none": "未找到"},
}


def _settings_text(hass: HomeAssistant, key: str) -> str:
    return _SETTINGS_STRINGS.get(normalize_language(hass), _SETTINGS_STRINGS["en"])[key]


def parse_lead_days(raw: Any) -> list[int] | None:
    """``"14, 3, 0"`` → ``[14, 3, 0]`` (days before due, 0–365); None when a
    piece is not such a number. Blank = no extra reminders."""
    leads: list[int] = []
    for piece in str(raw or "").replace(";", ",").split(","):
        piece = piece.strip()
        if not piece:
            continue
        if not piece.isdigit() or int(piece) > 365:
            return None
        leads.append(int(piece))
    return leads[: MAX_REMINDER_LEADS * 2]


def _get_test_result_text(hass: HomeAssistant, key: str) -> str:
    """Get localized test notification result text."""
    lang = normalize_language(hass)
    texts = _TEST_NOTIFICATION_RESULTS.get(lang, _TEST_NOTIFICATION_RESULTS["en"])
    return texts.get(key, texts.get("failed", key))


async def send_test_notification(
    hass: HomeAssistant,
    options: dict[str, Any],
    user_id: str | None = None,
) -> str:
    """Send a test notification, optionally to ONE household member.

    Returns a result key ("success", "no_service", "invalid_service",
    "failed", "user_no_device") that callers map to localized text. Action
    buttons are included whenever the corresponding action-feature toggles are
    enabled, so the rendered notification matches the real layout users see
    for actual tasks.

    With ``user_id`` the target is resolved through the SAME lookup the real
    per-task routing uses (``get_user_notify_services``). That is the whole
    point of a per-user test: one that took its own path could report success
    while real reminders still went somewhere else — which is exactly how the
    wrong-service bug behind #75 stayed invisible.
    """
    if user_id:
        from .helpers.notification_manager import get_user_notify_services

        user_services = await get_user_notify_services(hass, user_id)
        if not user_services:
            # Not a failure: this member simply has no Companion device, so
            # their reminders fall back to the household service. Saying so is
            # more useful than sending a test that proves nothing.
            return "user_no_device"
        return await _send_test_to(hass, options, user_services)

    notify_service = str(options.get(CONF_NOTIFY_SERVICE, ""))
    if not notify_service:
        if options.get(CONF_NOTIFY_EVENT_ONLY, False):
            # #173: event-only needs no service — the test fires the event
            # so the user's automation can be checked from Settings.
            return await _send_test_to(hass, options, [""])
        return "no_service"

    # Format-only validation — existence is left to the async_call below so
    # notify services registered lazily (e.g. mobile_app_*) still test cleanly.
    normalized, error = validate_notify_service(notify_service)
    if error:
        return "invalid_service"

    return await _send_test_to(hass, options, [normalized])


async def _send_test_to(
    hass: HomeAssistant,
    options: dict[str, Any],
    services: list[str],
) -> str:
    """Send the test payload to every resolved service; "success" if any went."""
    try:
        from .helpers.notification_manager import build_action_buttons
        from .helpers.notify_hooks import async_emit_and_dispatch, sample_notification_context

        push_msg = _get_test_result_text(hass, "push_message")
        service_data: dict[str, Any] = {
            "title": "Maintenance Supporter",
            "message": push_msg,
        }
        # The same buttons (translated, per the action toggles) a real
        # reminder carries \u2014 test ids, which the action listener ignores.
        test_actions = build_action_buttons(hass, options, normalize_language(hass), entry_id=None, task_id=None, skip_allowed=True)
        if test_actions:
            service_data["data"] = {"actions": test_actions}
        # Dual-path: legacy notify service OR notify entity (send_message).
        # #165: the test walks the same hook as a real notification, so the
        # event and the extra-data template can be verified from Settings.
        # Sample values for EVERY field of the contract (#178), so a template
        # can be written and verified from Settings before a real reminder fires.
        context = sample_notification_context(hass)
        sent_any = False
        for service in services:
            if await async_emit_and_dispatch(hass, service, service_data, context, blocking=True):
                sent_any = True
        return "success" if sent_any else "failed"
    except Exception:  # noqa: BLE001 - any failure mode reports "failed" to the UI
        _LOGGER.debug("Test notification failed for %s", services, exc_info=True)
        return "failed"


class GlobalOptionsFlow(OptionsFlow):
    """Handle global options with menu-based navigation."""

    @property
    def _current(self) -> dict[str, Any]:
        """Get current options."""
        return dict(self.config_entry.options or self.config_entry.data)

    def _opt(self, key: str) -> Any:
        """The stored value of a setting, or its registry default — every form
        ``default=`` goes through here so the flow can't drift from the WS
        ``settings`` echo (tests/test_settings_defaults.py)."""
        return self._current.get(key, setting_default(key))

    def _save_and_return(self, user_input: dict[str, Any]) -> ConfigFlowResult:
        """Merge user input into options and return to the menu."""
        from .helpers.settings_registry import ALLOWED_SETTING_KEYS

        merged = self._current
        # HA's NumberSelector hands back floats; the settings registry (WS
        # writes, export/import) types these keys as int. Store what the
        # registry expects so a settings backup round-trips (bug audit
        # 2026-09-12).
        for key, value in list(user_input.items()):
            if ALLOWED_SETTING_KEYS.get(key) is int and isinstance(value, float) and value.is_integer():
                user_input[key] = int(value)
        # The TimeSelector hands back "HH:MM:SS"; the registry caps the quiet
        # hours at 5 chars, so an 8-char value was dropped on a settings
        # export/import. Store the canonical "HH:MM" (an unparseable value
        # keeps the previous setting — the form's default coerces it anyway).
        for key in (CONF_QUIET_HOURS_START, CONF_QUIET_HOURS_END):
            if key in user_input:
                normalized = normalize_hhmm(user_input[key])
                if normalized is None:
                    user_input.pop(key)
                else:
                    user_input[key] = normalized
        # 2.94: the one sanitiser the panel's writes go through (lists, maps,
        # enums, ranges) — the flow now edits every setting the panel does,
        # and the two write paths must not drift. The steps validated the
        # notify service / shopping list / search template themselves; a
        # value the sanitiser drops is not saved.
        from .websocket.dashboard import sanitize_settings_input

        registered = {k: v for k, v in user_input.items() if k in ALLOWED_SETTING_KEYS}
        cleaned, _error = sanitize_settings_input(registered)
        user_input = {**{k: v for k, v in user_input.items() if k not in ALLOWED_SETTING_KEYS}, **cleaned}
        merged.update(user_input)
        self.hass.config_entries.async_update_entry(self.config_entry, options=merged)
        return self.async_show_menu(
            step_id="global_init",
            menu_options=self._menu_options(),
        )

    def _menu_options(self) -> list[str]:
        """Build dynamic menu options."""
        current = self._current
        # 2.94: every setting the panel edits has a home here too
        # (tests/test_global_settings_parity.py).
        options = [
            "general_settings",
            "advanced_features",
            "panel_access",
            "home_profile",
            "archive_settings",
            "member_avatars",
            "battery_lifetimes",
        ]
        if current.get(CONF_ADVANCED_BUDGET, False):
            options.append("budget_settings")
        if current.get(CONF_ADVANCED_GROUPS, False):
            options.append("manage_groups")
        if current.get(CONF_NOTIFICATIONS_ENABLED, False):
            options.extend(
                [
                    "notification_settings",
                    "notification_actions",
                    "test_notification",
                ]
            )
        options.append("done")
        return options

    # --- Menu ---

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Show global options menu."""
        return self.async_show_menu(
            step_id="global_init",
            menu_options=self._menu_options(),
        )

    async def async_step_global_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Handle menu selection redirect."""
        return await self.async_step_init()

    # Keep old step name as redirect for HA compatibility
    async def async_step_global_options(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Redirect old step name."""
        return await self.async_step_init()

    async def async_step_done(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Finish and close the options flow."""
        return self.async_create_entry(title="", data=self._current)

    # --- Advanced Features ---

    async def async_step_advanced_features(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Toggle visibility of advanced feature sections."""
        if user_input is not None:
            return self._save_and_return(user_input)

        return self.async_show_form(
            step_id="advanced_features",
            data_schema=vol.Schema(
                {
                    vol.Optional(
                        CONF_ADVANCED_ADAPTIVE,
                        default=self._opt(CONF_ADVANCED_ADAPTIVE),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_ADVANCED_PREDICTIONS,
                        default=self._opt(CONF_ADVANCED_PREDICTIONS),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_ADVANCED_SEASONAL,
                        default=self._opt(CONF_ADVANCED_SEASONAL),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_ADVANCED_ENVIRONMENTAL,
                        default=self._opt(CONF_ADVANCED_ENVIRONMENTAL),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_ADVANCED_BUDGET,
                        default=self._opt(CONF_ADVANCED_BUDGET),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_ADVANCED_GROUPS,
                        default=self._opt(CONF_ADVANCED_GROUPS),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_ADVANCED_CHECKLISTS,
                        default=self._opt(CONF_ADVANCED_CHECKLISTS),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_ADVANCED_SCHEDULE_TIME,
                        default=self._opt(CONF_ADVANCED_SCHEDULE_TIME),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_ADVANCED_COMPLETION_ACTIONS,
                        default=self._opt(CONF_ADVANCED_COMPLETION_ACTIONS),
                    ): selector.BooleanSelector(),
                }
            ),
        )

    # --- Panel Access (per-user override) ---

    async def async_step_panel_access(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Operator write delegation + the non-admin allowlist.

        Admins always have full write access. The ``operator_write_enabled``
        switch is OFF by default, so listed non-admins get only the read-only
        operator view (Complete / Skip). Turn it on to grant the listed users
        full create / edit / delete. Both controls are admin-only.
        """
        if user_input is not None:
            return self._save_and_return(user_input)

        # Build the multi-select option list from the HA auth registry,
        # mirroring the panel's own users/list filter (active humans only).
        users = await self.hass.auth.async_get_users()
        non_admin = [u for u in users if not u.is_admin and not u.system_generated and u.is_active]
        options = [
            selector.SelectOptionDict(
                value=u.id,
                label=(u.name or u.id[:8]),
            )
            for u in non_admin
        ]

        return self.async_show_form(
            step_id="panel_access",
            data_schema=vol.Schema(
                {
                    vol.Optional(
                        CONF_OPERATOR_WRITE_ENABLED,
                        default=self._opt(CONF_OPERATOR_WRITE_ENABLED),
                    ): selector.BooleanSelector(),
                    # A deleted user or one promoted to admin is no longer an
                    # option — keeping it as default made the step unsaveable
                    # (bug audit 2026-09-26); it drops out on the next save.
                    vol.Optional(
                        CONF_ADMIN_PANEL_USER_IDS,
                        default=select_default(self._opt(CONF_ADMIN_PANEL_USER_IDS) or [], options),
                    ): selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=options,
                            multiple=True,
                            mode=selector.SelectSelectorMode.LIST,
                        ),
                    ),
                }
            ),
            description_placeholders={
                "user_count": str(len(non_admin)),
            },
        )

    # --- General Settings ---

    async def async_step_general_settings(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """General settings: warning days, notifications toggle, service, panel."""
        errors: dict[str, str] = {}

        if user_input is not None:
            raw_service = user_input.get(CONF_NOTIFY_SERVICE, "")
            # Format-only validation — NO existence check. A notify service can be
            # lazily registered or momentarily absent (e.g. mobile_app_*), so we no
            # longer hard-block saving it (that broke #77). A genuinely-missing
            # service is surfaced afterwards by the runtime repair issue
            # (notify_service_missing) instead.
            normalized, error = validate_notify_service(raw_service)
            if error:
                errors[CONF_NOTIFY_SERVICE] = error
            else:
                user_input[CONF_NOTIFY_SERVICE] = normalized

            # Shopping-list target: a cleared EntitySelector omits the key —
            # normalise to "" so clearing actually turns the sync off. Format
            # only (todo.*): the list's integration may load later.
            raw_list = (user_input.get(CONF_SHOPPING_LIST_ENTITY) or "").strip()
            if raw_list and not raw_list.startswith("todo."):
                errors[CONF_SHOPPING_LIST_ENTITY] = "invalid_shopping_list_entity"
            user_input[CONF_SHOPPING_LIST_ENTITY] = raw_list

            # Trim + cap the optional sidebar title; blank clears the override
            # (panel falls back to the default "Maintenance").
            # An emptied field arrives ABSENT (the frontend drops it) and the
            # options merge kept the old title — map absence to "" so blank
            # really clears (bug audit 2026-09-26).
            raw_title = user_input.get(CONF_PANEL_TITLE)
            user_input[CONF_PANEL_TITLE] = (raw_title if isinstance(raw_title, str) else "").strip()[:MAX_PANEL_TITLE_LENGTH]

            # D#182: shopping-search template — blank = automatic (country,
            # then UI language); otherwise an http(s) URL with {q}.
            from .helpers.parts import valid_search_template

            raw_tpl = (user_input.get(CONF_PART_SEARCH_URL_TEMPLATE) or "").strip()
            if raw_tpl and not valid_search_template(raw_tpl):
                errors[CONF_PART_SEARCH_URL_TEMPLATE] = "invalid_search_template"
            user_input[CONF_PART_SEARCH_URL_TEMPLATE] = raw_tpl

            # The panel reorders columns; a checkbox list cannot. Keep the
            # saved order for the columns still ticked, append new ones.
            if CONF_OBJECTS_TABLE_COLUMNS in user_input:
                picked = list(user_input[CONF_OBJECTS_TABLE_COLUMNS] or [])
                kept = [c for c in self._opt(CONF_OBJECTS_TABLE_COLUMNS) if c in picked]
                columns = kept + [c for c in picked if c not in kept]
                # The name column is not optional (the panel greys it out).
                user_input[CONF_OBJECTS_TABLE_COLUMNS] = columns if "name" in columns else ["name", *columns]

            if not errors:
                return self._save_and_return(user_input)

        current = self._current
        currency_code = self._opt(CONF_BUDGET_CURRENCY)
        currency_options = [
            selector.SelectOptionDict(value=code, label=f"{code} ({symbol})") for code, symbol in BUDGET_CURRENCIES.items()
        ]

        # Offer every notify target as a dropdown so users don't have to guess
        # the slug. The merge (legacy notify services + notify entities, minus
        # the generic send_message, plus the current saved value) is shared with
        # the panel via build_notify_targets so the two surfaces can't drift.
        # ``custom_value`` keeps free text working for not-yet-loaded targets.
        notify_services = build_notify_targets(self.hass, current=current.get(CONF_NOTIFY_SERVICE, ""))

        return self.async_show_form(
            step_id="general_settings",
            data_schema=vol.Schema(
                {
                    vol.Optional(
                        CONF_DEFAULT_WARNING_DAYS,
                        default=self._opt(CONF_DEFAULT_WARNING_DAYS),
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(min=_WARN_MIN, max=_WARN_MAX, step=1, mode=selector.NumberSelectorMode.BOX)
                    ),
                    vol.Optional(
                        CONF_BUDGET_CURRENCY,
                        default=currency_code,
                    ): selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=currency_options,
                            mode=selector.SelectSelectorMode.DROPDOWN,
                        )
                    ),
                    # Decimal places for every displayed amount (0 = whole numbers).
                    vol.Optional(
                        CONF_CURRENCY_DECIMALS,
                        default=self._opt(CONF_CURRENCY_DECIMALS),
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=int_range(CONF_CURRENCY_DECIMALS)[0],
                            max=int_range(CONF_CURRENCY_DECIMALS)[1],
                            step=1,
                            mode=selector.NumberSelectorMode.BOX,
                        )
                    ),
                    # #146 / #180: the battery fleet's low floor and the level a
                    # low battery must rise above to count as replaced.
                    vol.Optional(
                        CONF_BATTERY_LOW_PERCENT,
                        default=self._opt(CONF_BATTERY_LOW_PERCENT),
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=int_range(CONF_BATTERY_LOW_PERCENT)[0],
                            max=int_range(CONF_BATTERY_LOW_PERCENT)[1],
                            step=1,
                            mode=selector.NumberSelectorMode.BOX,
                        )
                    ),
                    vol.Optional(
                        CONF_BATTERY_RECOVERED_PERCENT,
                        default=self._opt(CONF_BATTERY_RECOVERED_PERCENT),
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=int_range(CONF_BATTERY_RECOVERED_PERCENT)[0],
                            max=int_range(CONF_BATTERY_RECOVERED_PERCENT)[1],
                            step=1,
                            mode=selector.NumberSelectorMode.BOX,
                        )
                    ),
                    # #181 follow-up (advanced): a level-driven recovery records
                    # the replacement in Battery Notes and consumes the cells.
                    vol.Optional(
                        CONF_BATTERY_AUTO_RECORD_RECOVERY,
                        default=self._opt(CONF_BATTERY_AUTO_RECORD_RECOVERY),
                    ): selector.BooleanSelector(),
                    # #146: the household "low" floor for consumables.
                    vol.Optional(
                        CONF_DEFAULT_CONSUMABLE_THRESHOLD,
                        default=self._opt(CONF_DEFAULT_CONSUMABLE_THRESHOLD),
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=int_range(CONF_DEFAULT_CONSUMABLE_THRESHOLD)[0],
                            max=int_range(CONF_DEFAULT_CONSUMABLE_THRESHOLD)[1],
                            step=1,
                            mode=selector.NumberSelectorMode.BOX,
                            unit_of_measurement="%",
                        )
                    ),
                    # #145 / #170: how task rows look.
                    vol.Optional(
                        CONF_ROW_ACTION_STYLE,
                        default=self._opt(CONF_ROW_ACTION_STYLE),
                    ): selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=list(ROW_ACTION_STYLES),
                            mode=selector.SelectSelectorMode.DROPDOWN,
                            translation_key="row_action_style",
                        )
                    ),
                    vol.Optional(
                        CONF_REF_NUMBERS_IN_LISTS,
                        default=self._opt(CONF_REF_NUMBERS_IN_LISTS),
                    ): selector.BooleanSelector(),
                    # #67: the objects table's columns (the panel also orders them).
                    vol.Optional(
                        CONF_OBJECTS_TABLE_COLUMNS,
                        default=select_default(self._opt(CONF_OBJECTS_TABLE_COLUMNS), KNOWN_OBJECT_TABLE_COLUMNS),
                    ): selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=list(KNOWN_OBJECT_TABLE_COLUMNS),
                            multiple=True,
                            mode=selector.SelectSelectorMode.LIST,
                            translation_key="objects_table_columns",
                        )
                    ),
                    vol.Optional(
                        CONF_INSTALL_ASSIST_SENTENCES,
                        default=self._opt(CONF_INSTALL_ASSIST_SENTENCES),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_NOTIFICATIONS_ENABLED,
                        default=self._opt(CONF_NOTIFICATIONS_ENABLED),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_NOTIFY_SERVICE,
                        default=self._opt(CONF_NOTIFY_SERVICE),
                    ): selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=notify_services,
                            mode=selector.SelectSelectorMode.DROPDOWN,
                            custom_value=True,
                        )
                    ),
                    # v2.67: mirror auto "buy" tasks into this to-do list
                    # (blank = off). suggested_value keeps the field clearable.
                    vol.Optional(
                        CONF_SHOPPING_LIST_ENTITY,
                        description={"suggested_value": current.get(CONF_SHOPPING_LIST_ENTITY, "")},
                    ): selector.EntitySelector(selector.EntitySelectorConfig(domain="todo")),
                    vol.Optional(
                        CONF_PANEL_ENABLED,
                        default=self._opt(CONF_PANEL_ENABLED),
                    ): selector.BooleanSelector(),
                    # Blank clears the override → panel falls back to the default
                    # title ("Maintenance"). suggested_value pre-fills the current
                    # custom value, or empty when none is set.
                    vol.Optional(
                        CONF_PANEL_TITLE,
                        description={"suggested_value": current.get(CONF_PANEL_TITLE, "")},
                    ): selector.TextSelector(selector.TextSelectorConfig(type=selector.TextSelectorType.TEXT)),
                    # D#182: shopping-search template with {q}; blank = automatic
                    # (Amazon store of the HA country, then of the UI language).
                    vol.Optional(
                        CONF_PART_SEARCH_URL_TEMPLATE,
                        description={"suggested_value": current.get(CONF_PART_SEARCH_URL_TEMPLATE, "")},
                    ): selector.TextSelector(selector.TextSelectorConfig(type=selector.TextSelectorType.URL)),
                }
            ),
            errors=errors,
        )

    # --- Notification Settings ---

    async def async_step_notification_settings(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Per-status notification toggles, intervals, quiet hours, daily limit."""
        errors: dict[str, str] = {}
        if user_input is not None:
            # Same cap as the WS settings path (settings registry max_len).
            # The frontend leaves an emptied field OUT of the submission, so
            # absence means "cleared" — the merge in _save_and_return would
            # otherwise keep the old template (bug audit 2026-09-26).
            extra = user_input.get(CONF_NOTIFY_EXTRA_DATA)
            user_input[CONF_NOTIFY_EXTRA_DATA] = (extra if isinstance(extra, str) else "")[:MAX_NOTIFY_EXTRA_DATA_LENGTH]
            # 2.94: extra reminders "14, 3, 0" days before due (absent = none).
            leads = parse_lead_days(user_input.get(CONF_REMINDER_LEAD_DAYS))
            if leads is None:
                errors[CONF_REMINDER_LEAD_DAYS] = "invalid_reminder_lead_days"
            else:
                user_input[CONF_REMINDER_LEAD_DAYS] = leads
            # "" = every task; a saved view narrows the reminders to its tasks.
            if user_input.get(CONF_NOTIFY_SCOPE_VIEW_ID) == _SCOPE_ALL:
                user_input[CONF_NOTIFY_SCOPE_VIEW_ID] = ""
            if not errors:
                return self._save_and_return(user_input)

        current = self._current
        from .helpers.saved_views import list_saved_views

        scope_options = [selector.SelectOptionDict(value=_SCOPE_ALL, label=_settings_text(self.hass, "scope_all"))]
        scope_options += [
            selector.SelectOptionDict(value=str(v["id"]), label=str(v.get("name") or v["id"]))
            for v in list_saved_views(self.hass)
            if v.get("id")
        ]
        scope = self._opt(CONF_NOTIFY_SCOPE_VIEW_ID) or _SCOPE_ALL
        if scope not in {o["value"] for o in scope_options}:
            scope = _SCOPE_ALL  # the view was deleted — the setting falls back to all tasks

        return self.async_show_form(
            step_id="notification_settings",
            data_schema=vol.Schema(
                {
                    # --- Due Soon ---
                    vol.Optional(
                        CONF_NOTIFY_DUE_SOON_ENABLED,
                        default=self._opt(CONF_NOTIFY_DUE_SOON_ENABLED),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_NOTIFY_DUE_SOON_INTERVAL,
                        default=self._opt(CONF_NOTIFY_DUE_SOON_INTERVAL),
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=_NOTIFY_INTERVAL_MIN, max=_NOTIFY_INTERVAL_MAX, step=1, mode=selector.NumberSelectorMode.BOX
                        )
                    ),
                    # --- Overdue ---
                    vol.Optional(
                        CONF_NOTIFY_OVERDUE_ENABLED,
                        default=self._opt(CONF_NOTIFY_OVERDUE_ENABLED),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_NOTIFY_OVERDUE_INTERVAL,
                        default=self._opt(CONF_NOTIFY_OVERDUE_INTERVAL),
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=_NOTIFY_INTERVAL_MIN, max=_NOTIFY_INTERVAL_MAX, step=1, mode=selector.NumberSelectorMode.BOX
                        )
                    ),
                    # --- Triggered ---
                    vol.Optional(
                        CONF_NOTIFY_TRIGGERED_ENABLED,
                        default=self._opt(CONF_NOTIFY_TRIGGERED_ENABLED),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_NOTIFY_TRIGGERED_INTERVAL,
                        default=self._opt(CONF_NOTIFY_TRIGGERED_INTERVAL),
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=_NOTIFY_INTERVAL_MIN, max=_NOTIFY_INTERVAL_MAX, step=1, mode=selector.NumberSelectorMode.BOX
                        )
                    ),
                    # --- Quiet Hours ---
                    vol.Optional(
                        CONF_QUIET_HOURS_ENABLED,
                        default=self._opt(CONF_QUIET_HOURS_ENABLED),
                    ): selector.BooleanSelector(),
                    # v1.4.6 (#44 follow-up): use `or` instead of dict-default so
                    # empty-string / null / non-HH:MM values in storage don't
                    # break the whole form. HA's TimeSelector rejects an empty
                    # string as "Invalid time" and that error blocks the save
                    # button — even if the user is here to change something
                    # else and quiet_hours is disabled. Coerce to the sane
                    # fallback whenever the persisted value isn't a usable time.
                    vol.Optional(
                        CONF_QUIET_HOURS_START,
                        default=_safe_time(current.get(CONF_QUIET_HOURS_START), setting_default(CONF_QUIET_HOURS_START)),
                    ): selector.TimeSelector(),
                    vol.Optional(
                        CONF_QUIET_HOURS_END,
                        default=_safe_time(current.get(CONF_QUIET_HOURS_END), setting_default(CONF_QUIET_HOURS_END)),
                    ): selector.TimeSelector(),
                    # --- Daily Limit ---
                    vol.Optional(
                        CONF_MAX_NOTIFICATIONS_PER_DAY,
                        default=self._opt(CONF_MAX_NOTIFICATIONS_PER_DAY),
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=_MAX_PER_DAY_MIN, max=_MAX_PER_DAY_MAX, step=1, mode=selector.NumberSelectorMode.BOX
                        )
                    ),
                    # --- Bundling ---
                    vol.Optional(
                        CONF_NOTIFICATION_BUNDLING_ENABLED,
                        default=self._opt(CONF_NOTIFICATION_BUNDLING_ENABLED),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_NOTIFICATION_BUNDLE_THRESHOLD,
                        default=self._opt(CONF_NOTIFICATION_BUNDLE_THRESHOLD),
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=_BUNDLE_MIN, max=_BUNDLE_MAX, step=1, mode=selector.NumberSelectorMode.BOX
                        )
                    ),
                    # v1.4.0 (#44): notification title style
                    vol.Optional(
                        CONF_NOTIFICATION_TITLE_STYLE,
                        default=self._opt(CONF_NOTIFICATION_TITLE_STYLE),
                    ): selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=["default", "object_name", "task_name"],
                            mode=selector.SelectSelectorMode.DROPDOWN,
                            translation_key="notification_title_style",
                        )
                    ),
                    # #173 follow-up: completion notifications (activity kind).
                    vol.Optional(
                        CONF_NOTIFY_COMPLETED,
                        default=self._opt(CONF_NOTIFY_COMPLETED),
                    ): selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=list(NOTIFY_COMPLETED_MODES),
                            mode=selector.SelectSelectorMode.DROPDOWN,
                            translation_key="notify_completed",
                        )
                    ),
                    # 2.80 (#165) / #173: your own notification rule — the same
                    # two settings the panel's Settings tab offers.
                    vol.Optional(
                        CONF_NOTIFY_EVENT_ONLY,
                        default=self._opt(CONF_NOTIFY_EVENT_ONLY),
                    ): selector.BooleanSelector(),
                    # suggested_value, not default: HA's form drops an emptied
                    # field from the submission and a default re-inserted the
                    # old template, so it could never be cleared (bug audit
                    # 2026-09-26; the handler maps absence to "").
                    vol.Optional(
                        CONF_NOTIFY_EXTRA_DATA,
                        description={"suggested_value": self._opt(CONF_NOTIFY_EXTRA_DATA)},
                    ): selector.TextSelector(selector.TextSelectorConfig(type=selector.TextSelectorType.TEXT, multiline=True)),
                    # --- 2.94: the rest of the panel's notification rows ---
                    vol.Optional(
                        CONF_REMINDER_LEAD_DAYS,
                        description={"suggested_value": ", ".join(str(d) for d in self._opt(CONF_REMINDER_LEAD_DAYS))},
                    ): selector.TextSelector(selector.TextSelectorConfig(type=selector.TextSelectorType.TEXT)),
                    # suggested_value: the "every task" choice is a sentinel,
                    # not the registry default "" (tests/test_settings_defaults.py).
                    vol.Optional(
                        CONF_NOTIFY_SCOPE_VIEW_ID,
                        description={"suggested_value": scope},
                    ): selector.SelectSelector(
                        selector.SelectSelectorConfig(options=scope_options, mode=selector.SelectSelectorMode.DROPDOWN)
                    ),
                    vol.Optional(
                        CONF_WEEKLY_DIGEST_ENABLED,
                        default=self._opt(CONF_WEEKLY_DIGEST_ENABLED),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_WARRANTY_REMINDER_ENABLED,
                        default=self._opt(CONF_WARRANTY_REMINDER_ENABLED),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_WARRANTY_REMINDER_DAYS,
                        default=self._opt(CONF_WARRANTY_REMINDER_DAYS),
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=int_range(CONF_WARRANTY_REMINDER_DAYS)[0],
                            max=int_range(CONF_WARRANTY_REMINDER_DAYS)[1],
                            step=1,
                            mode=selector.NumberSelectorMode.BOX,
                        )
                    ),
                }
            ),
            errors=errors,
        )

    # --- Notification Actions ---

    async def async_step_notification_actions(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Interactive action buttons for mobile notifications."""
        if user_input is not None:
            return self._save_and_return(user_input)

        return self.async_show_form(
            step_id="notification_actions",
            data_schema=vol.Schema(
                {
                    vol.Optional(
                        CONF_ACTION_COMPLETE_ENABLED,
                        default=self._opt(CONF_ACTION_COMPLETE_ENABLED),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_ACTION_SKIP_ENABLED,
                        default=self._opt(CONF_ACTION_SKIP_ENABLED),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_ACTION_SNOOZE_ENABLED,
                        default=self._opt(CONF_ACTION_SNOOZE_ENABLED),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_SNOOZE_DURATION_HOURS,
                        default=self._opt(CONF_SNOOZE_DURATION_HOURS),
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=_SNOOZE_MIN, max=_SNOOZE_MAX, step=1, mode=selector.NumberSelectorMode.BOX
                        )
                    ),
                }
            ),
        )

    # --- Test Notification ---

    async def async_step_test_notification(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Send a test notification and show the result."""
        if user_input is not None:
            # User acknowledged the result — return to menu
            return self.async_show_menu(
                step_id="global_init",
                menu_options=self._menu_options(),
            )

        # First call: send the test notification via shared helper so the
        # same actions appear here as from the panel WS call.
        result_key = await send_test_notification(self.hass, self._current)
        result_text = _get_test_result_text(self.hass, result_key)

        return self.async_show_form(
            step_id="test_notification",
            data_schema=vol.Schema({}),
            description_placeholders={"result": result_text},
        )

    # --- Home profile & templates (2.94) ---

    async def async_step_home_profile(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """House or apartment (the recommendations follow it), the state or
        province whose rules the templates follow (where the country has
        such rules), and the templates hidden from the pickers — the panel's
        Home profile and Templates sections."""
        if user_input is not None:
            user_input.setdefault(CONF_DISABLED_TEMPLATE_IDS, [])
            return self._save_and_return(user_input)

        from .helpers.home_profile import async_home_profile
        from .helpers.region import regions_of
        from .templates import TEMPLATE_CATEGORIES, TEMPLATES, localize_template_text

        lang = normalize_language(self.hass)
        profile = await async_home_profile(self.hass)
        detected = profile.dwelling_detected if profile.dwelling_detected in ("house", "apartment") else "unknown"
        climate = profile.climate
        order = {cat_id: i for i, cat_id in enumerate(TEMPLATE_CATEGORIES)}
        templates = sorted(TEMPLATES, key=lambda t: order.get(t.category, len(order)))
        template_options = [
            selector.SelectOptionDict(
                value=t.id,
                label=(
                    f"{TEMPLATE_CATEGORIES.get(t.category, {}).get(f'name_{lang}', TEMPLATE_CATEGORIES.get(t.category, {}).get('name_en', t.category))}"
                    f" › {localize_template_text(t.name, lang) or t.name}"
                ),
            )
            for t in templates
        ]
        fields: dict[Any, Any] = {
            vol.Optional(
                CONF_HOME_TYPE,
                default=self._opt(CONF_HOME_TYPE) if self._opt(CONF_HOME_TYPE) in HOME_TYPES else "auto",
            ): selector.SelectSelector(
                selector.SelectSelectorConfig(
                    options=list(HOME_TYPES),
                    mode=selector.SelectSelectorMode.DROPDOWN,
                    translation_key="home_type",
                )
            ),
        }
        regions = regions_of(profile.country, dict(profile.region_names))
        if regions:
            codes = {r["code"] for r in regions}
            detected_name = profile.region_names.get(profile.region_detected or "") or _settings_text(self.hass, "region_none")
            fields[
                vol.Optional(
                    CONF_HOME_REGION,
                    default=self._opt(CONF_HOME_REGION) if self._opt(CONF_HOME_REGION) in codes else HOME_REGION_AUTO,
                )
            ] = selector.SelectSelector(
                selector.SelectSelectorConfig(
                    options=[
                        selector.SelectOptionDict(
                            value=HOME_REGION_AUTO, label=_settings_text(self.hass, "region_auto").replace("{region}", detected_name)
                        ),
                        *(selector.SelectOptionDict(value=r["code"], label=r["name"]) for r in regions),
                    ],
                    mode=selector.SelectSelectorMode.DROPDOWN,
                )
            )
        return self.async_show_form(
            step_id="home_profile",
            data_schema=vol.Schema(
                {
                    **fields,
                    vol.Optional(
                        CONF_DISABLED_TEMPLATE_IDS,
                        default=select_default(self._opt(CONF_DISABLED_TEMPLATE_IDS), template_options),
                    ): selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=template_options,
                            multiple=True,
                            mode=selector.SelectSelectorMode.DROPDOWN,
                        )
                    ),
                }
            ),
            description_placeholders={
                "detected": _settings_text(self.hass, f"dwelling_{detected}"),
                "country": profile.country or "–",
                "climate": (climate.koppen if climate and climate.koppen else "–"),
            },
        )

    # --- Archive automation (2.94) ---

    async def async_step_archive_settings(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Archive done one-time tasks after N days, delete archived ones after M."""
        if user_input is not None:
            return self._save_and_return(user_input)

        return self.async_show_form(
            step_id="archive_settings",
            data_schema=vol.Schema(
                {
                    vol.Optional(key, default=self._opt(key)): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=int_range(key)[0], max=int_range(key)[1], step=1, mode=selector.NumberSelectorMode.BOX
                        )
                    )
                    for key in (CONF_ARCHIVE_ONEOFF_DAYS, CONF_DELETE_ARCHIVED_ONEOFF_DAYS)
                }
            ),
        )

    # --- Member avatars (2.94) ---

    async def _members(self) -> list[Any]:
        """Household members as the panel lists them: active, non-system users."""
        users = await self.hass.auth.async_get_users()
        return [u for u in users if not u.system_generated and u.is_active]

    async def async_step_member_avatars(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Pick the household member whose avatar (initials, colour) to change."""
        from .helpers.member_display import member_display

        members = await self._members()
        if user_input is not None and user_input.get("member") in {u.id for u in members}:
            self._avatar_user_id = str(user_input["member"])
            return await self.async_step_member_avatar()

        options = []
        for u in members:
            shown = member_display(self._current, u.id, u.name)
            options.append(selector.SelectOptionDict(value=u.id, label=f"{u.name or u.id[:8]} ({shown.get('initials', '')})"))
        return self.async_show_form(
            step_id="member_avatars",
            data_schema=vol.Schema(
                {
                    vol.Required("member"): selector.SelectSelector(
                        selector.SelectSelectorConfig(options=options, mode=selector.SelectSelectorMode.LIST)
                    ),
                }
            ),
        )

    async def async_step_member_avatar(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Initials + palette colour for one member (blank / automatic = the default)."""
        from .helpers.member_display import AVATAR_COLOR_NAMES, AVATAR_PALETTE, member_display

        user_id = getattr(self, "_avatar_user_id", "")
        overrides = dict(self._opt(CONF_MEMBER_DISPLAY) or {})
        if user_input is not None:
            entry: dict[str, str] = {}
            initials = str(user_input.get("initials") or "").strip()
            if initials:
                entry["initials"] = initials
            color = user_input.get("color")
            if color in AVATAR_COLOR_NAMES:
                entry["color"] = AVATAR_PALETTE[AVATAR_COLOR_NAMES.index(color)]
            if entry:
                overrides[user_id] = entry
            else:
                overrides.pop(user_id, None)
            return self._save_and_return({CONF_MEMBER_DISPLAY: overrides})

        members = {u.id: u for u in await self._members()}
        user = members.get(user_id)
        if user is None:
            return await self.async_step_member_avatars()
        current = overrides.get(user_id, {})
        color_name = (
            AVATAR_COLOR_NAMES[AVATAR_PALETTE.index(current["color"])] if current.get("color") in AVATAR_PALETTE else "auto"
        )
        default = member_display({}, user_id, user.name)
        return self.async_show_form(
            step_id="member_avatar",
            data_schema=vol.Schema(
                {
                    vol.Optional("initials", description={"suggested_value": current.get("initials", "")}): selector.TextSelector(
                        selector.TextSelectorConfig(type=selector.TextSelectorType.TEXT)
                    ),
                    vol.Optional("color", default=color_name): selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=["auto", *AVATAR_COLOR_NAMES],
                            mode=selector.SelectSelectorMode.DROPDOWN,
                            translation_key="avatar_color",
                        )
                    ),
                }
            ),
            description_placeholders={"member": user.name or user_id[:8], "initials": default.get("initials", "")},
        )

    # --- Battery lifetimes (2.94) ---

    async def async_step_battery_lifetimes(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Typical lifetime in months per battery type — the forecast for
        batteries without a level sensor. One field per type (the type is the
        label); blank = the built-in value."""
        from .websocket.dashboard import _battery_lifetime_catalog

        rows = _battery_lifetime_catalog(self.hass)
        types = [str(r["type"]) for r in rows]
        if user_input is not None:
            overrides = {t: user_input[t] for t in types if isinstance(user_input.get(t), (int, float))}
            return self._save_and_return({CONF_BATTERY_LIFETIME_MONTHS: overrides})

        from .helpers.battery_lifetime import MAX_LIFETIME_MONTHS, MIN_LIFETIME_MONTHS

        return self.async_show_form(
            step_id="battery_lifetimes",
            data_schema=vol.Schema(
                {
                    vol.Optional(
                        str(r["type"]), description={"suggested_value": r.get("override_months")}
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=MIN_LIFETIME_MONTHS, max=MAX_LIFETIME_MONTHS, step=1, mode=selector.NumberSelectorMode.BOX
                        )
                    )
                    for r in rows
                }
            ),
            description_placeholders={
                "defaults": " · ".join(f"{r['type']} {r['default_months']}" for r in rows),
            },
        )

    # --- Budget Settings ---

    async def async_step_budget_settings(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Budget settings: monthly/yearly budget, alerts."""
        if user_input is not None:
            return self._save_and_return(user_input)

        currency_code = self._opt(CONF_BUDGET_CURRENCY)
        currency_symbol = BUDGET_CURRENCIES.get(currency_code, BUDGET_CURRENCIES[DEFAULT_BUDGET_CURRENCY])

        return self.async_show_form(
            step_id="budget_settings",
            data_schema=vol.Schema(
                {
                    vol.Optional(
                        CONF_BUDGET_MONTHLY,
                        default=self._opt(CONF_BUDGET_MONTHLY),
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=_BUDGET_MONTHLY_MIN,
                            max=_BUDGET_MONTHLY_MAX,
                            step=0.01,
                            mode=selector.NumberSelectorMode.BOX,
                            unit_of_measurement=currency_symbol,
                        )
                    ),
                    vol.Optional(
                        CONF_BUDGET_YEARLY,
                        default=self._opt(CONF_BUDGET_YEARLY),
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=_BUDGET_YEARLY_MIN,
                            max=_BUDGET_YEARLY_MAX,
                            step=0.01,
                            mode=selector.NumberSelectorMode.BOX,
                            unit_of_measurement=currency_symbol,
                        )
                    ),
                    vol.Optional(
                        CONF_BUDGET_ALERTS_ENABLED,
                        default=self._opt(CONF_BUDGET_ALERTS_ENABLED),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_BUDGET_ALERT_THRESHOLD,
                        default=self._opt(CONF_BUDGET_ALERT_THRESHOLD),
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=_ALERT_MIN,
                            max=_ALERT_MAX,
                            step=5,
                            mode=selector.NumberSelectorMode.SLIDER,
                            unit_of_measurement="%",
                        )
                    ),
                }
            ),
        )

    # --- Manage Groups ---

    async def async_step_manage_groups(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """List and manage maintenance groups."""
        from .const import CONF_GROUPS

        current = self._current
        groups = current.get(CONF_GROUPS, {})

        if user_input is not None:
            selected = user_input.get("selected_group")
            if selected == "_add_new":
                return await self.async_step_add_group()
            if selected and selected in groups:
                return await self._delete_group(selected)

        if not groups:
            # No groups yet — go directly to add
            return await self.async_step_add_group()

        options = [
            selector.SelectOptionDict(
                value=gid,
                label=f"{gdata.get('name', gid)} ({len(gdata.get('task_refs', []))} tasks)",
            )
            for gid, gdata in groups.items()
        ]
        options.append(selector.SelectOptionDict(value="_add_new", label="+ Add New Group"))

        return self.async_show_form(
            step_id="manage_groups",
            data_schema=vol.Schema(
                {
                    vol.Required("selected_group"): selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=options,
                            mode=selector.SelectSelectorMode.LIST,
                        )
                    ),
                }
            ),
        )

    async def async_step_add_group(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Add a new maintenance group."""
        from .const import CONF_GROUPS
        from .helpers.sanitize import cap_group_fields

        if user_input is not None:
            group_name = user_input.get("group_name", "").strip()
            if group_name:
                group_id = uuid4().hex
                merged = self._current
                groups = dict(merged.get(CONF_GROUPS, {}))
                new_group = {
                    "name": group_name,
                    "description": user_input.get("group_description", ""),
                    "task_refs": [],
                }
                cap_group_fields(new_group)
                groups[group_id] = new_group
                merged[CONF_GROUPS] = groups
                self.hass.config_entries.async_update_entry(self.config_entry, options=merged)
            return self.async_show_menu(
                step_id="global_init",
                menu_options=self._menu_options(),
            )

        return self.async_show_form(
            step_id="add_group",
            data_schema=vol.Schema(
                {
                    vol.Required("group_name"): selector.TextSelector(
                        selector.TextSelectorConfig(type=selector.TextSelectorType.TEXT)
                    ),
                    vol.Optional("group_description", default=""): selector.TextSelector(
                        selector.TextSelectorConfig(
                            type=selector.TextSelectorType.TEXT,
                            multiline=True,
                        )
                    ),
                }
            ),
        )

    async def _delete_group(self, group_id: str) -> ConfigFlowResult:
        """Delete a group and return to menu."""
        from .const import CONF_GROUPS

        merged = self._current
        groups = dict(merged.get(CONF_GROUPS, {}))
        groups.pop(group_id, None)
        merged[CONF_GROUPS] = groups
        self.hass.config_entries.async_update_entry(self.config_entry, options=merged)
        return self.async_show_menu(
            step_id="global_init",
            menu_options=self._menu_options(),
        )
