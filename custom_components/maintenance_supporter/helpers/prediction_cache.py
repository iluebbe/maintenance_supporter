"""Hourly cache for the recorder half of the sensor prediction.

The forecast of a sensor-based threshold or counter task regresses up to 180
days of hourly recorder statistics. That query is the slow part (100 to 450
ms per task on a real recorder) and it ran on EVERY refresh of the object, so
a skip or a completion on an object with a few such tasks waited half a
second for numbers that could not have changed: the recorder compiles hourly
statistics once an hour.

The cache keeps what comes from the recorder alone (a sensor's degradation
fit, an environmental sensor's series) for one statistics hour. Everything
else (the thresholds, the counter baseline, the environmental sensor's live
value, the completion history) is still computed on every refresh, so an
edit or a completion shows at once. A changed trigger sensor or direction is
a different key and is fetched right away.

A refresh that answers a click (``stale_ok``) takes the previous hour's value
instead of waiting for the new one; the next periodic refresh, which nobody
waits for, fetches it. Only a value never fetched (the first refresh after a
start) is always awaited.
"""

from __future__ import annotations

from collections.abc import Awaitable, Callable, Hashable
from datetime import datetime, timedelta
from typing import Any, TypeVar

from homeassistant.util import dt as dt_util

_T = TypeVar("_T")

# The recorder compiles the statistics of an hour a few minutes after it
# ends; a fetch inside that gap would cache the old hour for a whole hour.
STATISTICS_SETTLE = timedelta(minutes=15)

# Keys nobody asked for in this many hours (an edited trigger's old sensor)
# are dropped; every key in use is asked for on each periodic refresh.
_UNUSED_HOURS = 2


def statistics_hour(now: datetime | None = None) -> int:
    """The recorder statistics hour a fetch made ``now`` would see."""
    moment = now or dt_util.utcnow()
    return int((moment - STATISTICS_SETTLE).timestamp() // 3600)


class PredictionCache:
    """Recorder-derived prediction inputs, one value per key and statistics hour."""

    def __init__(self) -> None:
        self._entries: dict[Hashable, tuple[int, Any]] = {}

    async def async_get(
        self,
        key: Hashable,
        fetch: Callable[[], Awaitable[_T]],
        keep: Callable[[_T], bool] = bool,
        *,
        stale_ok: bool = False,
    ) -> _T:
        """The value for ``key`` this statistics hour, fetched when missing.

        ``keep`` says whether a fetched value is worth caching. An empty result
        (no statistics yet, a recorder hiccup) is not: it is fetched again on
        the next refresh, exactly as without the cache.
        """
        hour = statistics_hour()
        cached = self._entries.get(key)
        if cached is not None and (cached[0] >= hour or stale_ok):
            value: _T = cached[1]
            return value
        value = await fetch()
        if keep(value):
            self._entries[key] = (hour, value)
        else:
            self._entries.pop(key, None)
        for old in [k for k, (h, _v) in self._entries.items() if h < hour - _UNUSED_HOURS]:
            del self._entries[old]
        return value
