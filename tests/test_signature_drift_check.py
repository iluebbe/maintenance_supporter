"""#249: the weekly drift check tells drift from a fetch that failed.

GitHub's raw host answered 429 for one of tuya's three source files; the
strings that live in that file read as gone and the run filed a drift issue.
A passing failure (429, 5xx, timeout) is tried twice more and then reported
as "not verified this week", without an issue. A file that is gone (404) and
strings missing from files that all loaded are drift.
"""

from __future__ import annotations

import importlib.util
import io
import urllib.error
from pathlib import Path
from typing import Any

import pytest

_SPEC = importlib.util.spec_from_file_location("check_signature_drift", Path(__file__).parent.parent / "scripts" / "check_signature_drift.py")
assert _SPEC is not None and _SPEC.loader is not None
drift: Any = importlib.util.module_from_spec(_SPEC)
_SPEC.loader.exec_module(drift)


def _http(code: int) -> urllib.error.HTTPError:
    return urllib.error.HTTPError("https://x", code, "x", {}, io.BytesIO())  # type: ignore[arg-type]


def test_a_passing_failure_is_tried_again_after_a_pause() -> None:
    answers: list[Any] = [drift.Transient("HTTP 429"), drift.Transient("HTTP 503"), "source"]
    pauses: list[float] = []

    def once(url: str) -> str:
        answer = answers.pop(0)
        if isinstance(answer, Exception):
            raise answer
        return answer

    assert drift.fetch("u", once=once, sleep=pauses.append) == "source"
    assert pauses == list(drift.RETRY_PAUSES)


def test_three_failures_give_up_and_a_missing_file_is_not_retried() -> None:
    pauses: list[float] = []

    def busy(url: str) -> str:
        raise drift.Transient("HTTP 429")

    with pytest.raises(drift.Transient):
        drift.fetch("u", once=busy, sleep=pauses.append)
    assert len(pauses) == 2

    def gone(url: str) -> str:
        raise drift.Gone("HTTP 404")

    pauses.clear()
    with pytest.raises(drift.Gone):
        drift.fetch("u", once=gone, sleep=pauses.append)
    assert pauses == [], "a moved file does not come back on a retry"


@pytest.mark.parametrize(("code", "kind"), [(429, "Transient"), (500, "Transient"), (503, "Transient"), (404, "Gone"), (410, "Gone")])
def test_http_errors_are_sorted(monkeypatch: pytest.MonkeyPatch, code: int, kind: str) -> None:
    def urlopen(*_a: Any, **_k: Any) -> Any:
        raise _http(code)

    monkeypatch.setattr(drift.urllib.request, "urlopen", urlopen)
    with pytest.raises(getattr(drift, kind)):
        drift.fetch_once("https://x")


def test_drift_and_unverified_are_told_apart() -> None:
    files = {"a": "alpha beta", "b": "gamma", "c": "delta"}

    def fetcher(url: str) -> str:
        if url == "busy":
            raise drift.Transient("HTTP 429")
        if url == "moved":
            raise drift.Gone("HTTP 404")
        return files[url]

    probes = {
        "tuya_like": {"urls": ["a", "busy"], "strings": ["alpha", "only_in_busy"]},  # #249
        "fine_without_one": {"urls": ["a", "busy"], "strings": ["alpha", "beta"]},
        "renamed": {"urls": ["b"], "strings": ["gamma", "gone_now"]},
        "moved": {"urls": ["moved", "c"], "strings": ["delta"]},
        "ok": {"urls": ["c"], "strings": ["delta"]},
    }
    drifted, unverified = drift.check(probes, fetcher)
    assert drifted == ["moved: source file gone ['moved']", "renamed: missing ['gone_now']"]
    assert unverified == ["tuya_like: 1 of 2 source files did not load"]


def test_only_drift_files_an_issue(monkeypatch: pytest.MonkeyPatch, capsys: pytest.CaptureFixture[str]) -> None:
    monkeypatch.setattr(drift, "check", lambda probes: ([], ["tuya: 1 of 3 source files did not load"]))
    assert drift.main() == 0
    assert "NOT VERIFIED THIS WEEK" in capsys.readouterr().out
    monkeypatch.setattr(drift, "check", lambda probes: (["x: missing ['y']"], []))
    assert drift.main() == 1


def test_the_probes_name_the_new_upstream_strings() -> None:
    """#249: nest_protect's replace-by date comes from utc_secs_to_date
    (0.6.0), unifi_unas names its pools by translation key (0.10.0)."""
    import json

    probes = json.loads((Path(__file__).parent.parent / "scripts" / "signature_probes.json").read_text(encoding="utf-8"))
    assert "value_fn=utc_secs_to_date" in probes["nest_protect"]["strings"]
    assert any("pool_usage" in s for s in probes["unifi_unas"]["strings"])
    assert any(u.endswith("/translations/en.json") for u in probes["unifi_unas"]["urls"]), "the name the entity id comes from"
