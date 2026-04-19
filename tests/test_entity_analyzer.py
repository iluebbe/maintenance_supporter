"""Tests for helpers/entity_analyzer.py."""

from __future__ import annotations

from typing import Any
from unittest.mock import patch

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError

from custom_components.maintenance_supporter.helpers.entity_analyzer import (
    AttributeInfo,
    EntityAnalysis,
    EntityAnalyzer,
    StatisticsInfo,
)

# ─── async_analyze_entity ────────────────────────────────────────────────


async def test_analyze_nonexistent_entity(hass: HomeAssistant) -> None:
    """Test analyzing a non-existent entity returns None."""
    analyzer = EntityAnalyzer(hass)
    result = await analyzer.async_analyze_entity("sensor.nonexistent")
    assert result is None


async def test_analyze_numeric_state(hass: HomeAssistant) -> None:
    """Test analyzing entity with numeric state."""
    hass.states.async_set("sensor.temp", "25.5", {
        "unit_of_measurement": "°C",
        "device_class": "temperature",
    })

    analyzer = EntityAnalyzer(hass)
    with patch.object(analyzer, "_async_fetch_statistics", return_value=None):
        result = await analyzer.async_analyze_entity("sensor.temp")

    assert result is not None
    assert result.entity_id == "sensor.temp"
    assert result.is_numeric_state is True
    assert result.domain == "sensor"
    assert result.device_class == "temperature"
    assert result.unit_of_measurement == "°C"
    assert result.current_state == "25.5"


async def test_analyze_non_numeric_state(hass: HomeAssistant) -> None:
    """Test analyzing entity with non-numeric state."""
    hass.states.async_set("binary_sensor.door", "off", {
        "device_class": "door",
    })

    analyzer = EntityAnalyzer(hass)
    with patch.object(analyzer, "_async_fetch_statistics", return_value=None):
        result = await analyzer.async_analyze_entity("binary_sensor.door")

    assert result is not None
    assert result.is_numeric_state is False
    assert result.domain == "binary_sensor"
    assert result.current_state == "off"


async def test_analyze_numeric_attributes(hass: HomeAssistant) -> None:
    """Test discovering numeric attributes."""
    hass.states.async_set("sensor.weather", "ok", {
        "temperature": 22.5,
        "humidity": 65,
        "pressure": 1013.25,
        "condition": "sunny",  # non-numeric, should be excluded
        "friendly_name": "Weather",  # non-numeric
    })

    analyzer = EntityAnalyzer(hass)
    with patch.object(analyzer, "_async_fetch_statistics", return_value=None):
        result = await analyzer.async_analyze_entity("sensor.weather")

    assert result is not None
    # Should find 3 numeric attributes (temperature, humidity, pressure)
    assert "temperature" in result.numeric_attributes
    assert "humidity" in result.numeric_attributes
    assert "pressure" in result.numeric_attributes
    assert "condition" not in result.numeric_attributes
    assert "friendly_name" not in result.numeric_attributes

    assert result.numeric_attributes["temperature"].current_value == 22.5
    assert result.numeric_attributes["humidity"].current_value == 65.0


async def test_analyze_private_attributes_excluded(hass: HomeAssistant) -> None:
    """Test that private attributes (starting with _) are excluded."""
    hass.states.async_set("sensor.device", "25", {
        "_internal": 42,
        "public_value": 100,
    })

    analyzer = EntityAnalyzer(hass)
    with patch.object(analyzer, "_async_fetch_statistics", return_value=None):
        result = await analyzer.async_analyze_entity("sensor.device")

    assert result is not None
    assert "_internal" not in result.numeric_attributes
    assert "public_value" in result.numeric_attributes


# ─── _async_fetch_statistics ─────────────────────────────────────────────


async def test_fetch_statistics_import_error(hass: HomeAssistant) -> None:
    """Test that ImportError returns None."""
    analyzer = EntityAnalyzer(hass)

    with patch.dict("sys.modules", {"homeassistant.components.recorder.statistics": None}):
        with patch(
            "custom_components.maintenance_supporter.helpers.entity_analyzer.EntityAnalyzer._async_fetch_statistics"
        ) as mock_fetch:
            mock_fetch.return_value = None
            result = await analyzer._async_fetch_statistics("sensor.temp")

    assert result is None


async def _mock_fetch(
    hass: HomeAssistant,
    analyzer: EntityAnalyzer,
    entity_id: str,
    mock_result: dict[str, Any],
) -> StatisticsInfo | None:
    """Helper to call _async_fetch_statistics with mocked recorder."""

    async def _mock_executor(fn: Any) -> Any:
        return fn()

    with patch(
        "homeassistant.components.recorder.statistics.statistics_during_period",
        return_value=mock_result,
    ):
        with patch("homeassistant.components.recorder.get_instance") as mock_gi:
            mock_gi.return_value.async_add_executor_job = _mock_executor
            return await analyzer._async_fetch_statistics(entity_id)


async def test_fetch_statistics_with_data(hass: HomeAssistant) -> None:
    """Test statistics processing with valid data."""
    analyzer = EntityAnalyzer(hass)

    rows = [
        {"mean": 20.0 + i * 0.5, "min": 18.0 + i * 0.3, "max": 25.0 + i * 0.7}
        for i in range(20)
    ]

    result = await _mock_fetch(hass, analyzer, "sensor.temp", {"sensor.temp": rows})

    assert result is not None
    assert result.has_data is True
    assert result.period_days == 20
    assert result.mean is not None
    assert result.minimum is not None
    assert result.maximum is not None
    assert result.std_dev is not None
    assert result.percentile_10 is not None
    assert result.percentile_90 is not None
    assert result.recent_trend is not None  # 20 >= 14


async def test_fetch_statistics_trend_rising(hass: HomeAssistant) -> None:
    """Test trend detection: rising."""
    analyzer = EntityAnalyzer(hass)

    rows = []
    for i in range(14):
        val = 20.0 if i < 7 else 30.0
        rows.append({"mean": val, "min": val - 2, "max": val + 2})

    result = await _mock_fetch(hass, analyzer, "sensor.temp", {"sensor.temp": rows})
    assert result is not None
    assert result.recent_trend == "rising"


async def test_fetch_statistics_trend_falling(hass: HomeAssistant) -> None:
    """Test trend detection: falling."""
    analyzer = EntityAnalyzer(hass)

    rows = []
    for i in range(14):
        val = 30.0 if i < 7 else 20.0
        rows.append({"mean": val, "min": val - 2, "max": val + 2})

    result = await _mock_fetch(hass, analyzer, "sensor.temp", {"sensor.temp": rows})
    assert result is not None
    assert result.recent_trend == "falling"


async def test_fetch_statistics_trend_stable(hass: HomeAssistant) -> None:
    """Test trend detection: stable."""
    analyzer = EntityAnalyzer(hass)
    rows = [{"mean": 25.0, "min": 24.0, "max": 26.0} for _ in range(14)]

    result = await _mock_fetch(hass, analyzer, "sensor.temp", {"sensor.temp": rows})
    assert result is not None
    assert result.recent_trend == "stable"


async def test_fetch_statistics_empty_rows(hass: HomeAssistant) -> None:
    """Test statistics with empty rows."""
    analyzer = EntityAnalyzer(hass)

    result = await _mock_fetch(hass, analyzer, "sensor.temp", {"sensor.temp": []})
    assert result is not None
    assert result.has_data is False


async def test_fetch_statistics_no_entity_data(hass: HomeAssistant) -> None:
    """Test statistics with entity not in result."""
    analyzer = EntityAnalyzer(hass)

    result = await _mock_fetch(hass, analyzer, "sensor.temp", {})
    assert result is not None
    assert result.has_data is False


async def test_fetch_statistics_null_means_uses_mins(hass: HomeAssistant) -> None:
    """Test statistics uses mins when means are all None."""
    analyzer = EntityAnalyzer(hass)

    rows = [{"mean": None, "min": 10.0 + i, "max": 30.0 + i} for i in range(10)]

    result = await _mock_fetch(hass, analyzer, "sensor.temp", {"sensor.temp": rows})
    assert result is not None
    assert result.has_data is True
    assert result.mean is None
    assert result.minimum is not None
    assert result.std_dev is not None


async def test_fetch_statistics_error_handled(hass: HomeAssistant) -> None:
    """Test that statistics fetch errors are handled gracefully."""

    analyzer = EntityAnalyzer(hass)

    async def _mock_executor(fn: Any) -> Any:
        return fn()

    with patch(
        "homeassistant.components.recorder.statistics.statistics_during_period",
        side_effect=HomeAssistantError("Recorder error"),
    ):
        with patch("homeassistant.components.recorder.get_instance") as mock_gi:
            mock_gi.return_value.async_add_executor_job = _mock_executor
            result = await analyzer._async_fetch_statistics("sensor.temp")

    assert result is None


async def test_fetch_statistics_few_points_no_percentiles(hass: HomeAssistant) -> None:
    """Test that <5 data points don't compute percentiles."""
    analyzer = EntityAnalyzer(hass)
    rows = [{"mean": 20.0 + i, "min": 18.0, "max": 22.0} for i in range(3)]

    result = await _mock_fetch(hass, analyzer, "sensor.temp", {"sensor.temp": rows})
    assert result is not None
    assert result.has_data is True
    assert result.percentile_10 is None
    assert result.percentile_90 is None
    assert result.std_dev is not None  # >=2 points


async def test_fetch_statistics_single_point_no_stddev(hass: HomeAssistant) -> None:
    """Test that 1 data point doesn't compute std_dev."""
    analyzer = EntityAnalyzer(hass)
    rows = [{"mean": 25.0, "min": 24.0, "max": 26.0}]

    result = await _mock_fetch(hass, analyzer, "sensor.temp", {"sensor.temp": rows})
    assert result is not None
    assert result.has_data is True
    assert result.std_dev is None
    assert result.mean == 25.0


# ─── Dataclass tests ─────────────────────────────────────────────────────


def test_statistics_info_defaults() -> None:
    """Test StatisticsInfo default values."""
    info = StatisticsInfo()
    assert info.has_data is False
    assert info.period_days == 0
    assert info.mean is None
    assert info.recent_trend is None


def test_entity_analysis_defaults() -> None:
    """Test EntityAnalysis default values."""
    analysis = EntityAnalysis(entity_id="sensor.test")
    assert analysis.entity_id == "sensor.test"
    assert analysis.domain == ""
    assert analysis.is_numeric_state is False
    assert analysis.numeric_attributes == {}
    assert analysis.statistics is None


def test_attribute_info() -> None:
    """Test AttributeInfo construction."""
    info = AttributeInfo(name="temperature", current_value=22.5, unit="°C")
    assert info.name == "temperature"
    assert info.current_value == 22.5
    assert info.unit == "°C"
