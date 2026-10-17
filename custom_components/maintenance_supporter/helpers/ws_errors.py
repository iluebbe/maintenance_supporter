"""WS refusals the panel shows in the user's language (i18n audit 2026-09-27).

A plain ``send_error(id, code, "English text")`` reached every user in
English: the panel translated the code into a headline and appended the
English text. These helpers attach a translation key from strings.json
``exceptions`` (shipped in all 22 languages); the panel renders it through
Home Assistant's own backend translations (frontend-src/helpers/
backend-errors.ts). The English message stays for logs and old frontends.
"""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from homeassistant.exceptions import HomeAssistantError

from ..const import DOMAIN

if TYPE_CHECKING:
    from homeassistant.components.websocket_api.connection import ActiveConnection


def send_translated_error(
    connection: ActiveConnection,
    msg_id: int,
    code: str,
    message: str,
    *,
    translation_key: str,
    translation_placeholders: dict[str, str] | None = None,
) -> None:
    """Refuse with ``code`` and a translatable text."""
    connection.send_error(
        msg_id,
        code,
        message,
        translation_domain=DOMAIN,
        translation_key=translation_key,
        translation_placeholders=translation_placeholders,
    )


UNSAFE_URL_MESSAGE = (
    "This link is not allowed: links that run scripts or open local files (javascript:, data:, file: and the like) are refused."
)


def send_unsafe_url_error(connection: ActiveConnection, msg_id: int) -> None:
    """Refuse a link that runs scripts or opens local files — the one refusal
    of every command that takes a link (a document web-link, a task's or an
    object's documentation URL; the add_object action raises the same key).
    Five commands spelled it out word for word (DRY audit 2026-10-12)."""
    send_translated_error(connection, msg_id, "invalid_url", UNSAFE_URL_MESSAGE, translation_key="unsafe_url")


def send_exception_error(connection: ActiveConnection, msg_id: int, err: HomeAssistantError, fallback_code: str) -> None:
    """Refuse with a raised Home Assistant exception — its key is the code,
    and its translation (with the task name) reaches the panel."""
    placeholders: dict[str, Any] | None = err.translation_placeholders
    connection.send_error(
        msg_id,
        err.translation_key or fallback_code,
        str(err),
        translation_domain=err.translation_domain,
        translation_key=err.translation_key,
        translation_placeholders={k: str(v) for k, v in placeholders.items()} if placeholders else None,
    )
