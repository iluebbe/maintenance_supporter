"""Tests for panel.py and threshold_calculator.py."""

from __future__ import annotations

from pathlib import Path
from unittest.mock import AsyncMock, MagicMock, patch

from homeassistant.core import HomeAssistant

from custom_components.maintenance_supporter.const import DOMAIN
from custom_components.maintenance_supporter.helpers.threshold_calculator import (
    ThresholdCalculator,
)
from custom_components.maintenance_supporter.panel import (
    _async_file_hash,
    async_register_panel,
    async_unregister_panel,
)

# ═══════════════════════════════════════════════════════════════════════════
# Panel Tests
# ═══════════════════════════════════════════════════════════════════════════


async def test_register_panel(hass: HomeAssistant) -> None:
    """Test that panel registration calls static path and panel_custom."""

    hass.data.setdefault(DOMAIN, {})

    with patch(
        "custom_components.maintenance_supporter.panel.panel_custom.async_register_panel",
        new_callable=AsyncMock,
    ) as mock_register:
        await async_register_panel(hass)

        assert hass.data[DOMAIN].get("_panel_registered") is True
        mock_register.assert_called_once()
        call_kwargs = mock_register.call_args
        # Verify panel_custom was called with correct params
        assert call_kwargs[1]["frontend_url_path"] == "maintenance-supporter"


async def test_register_panel_idempotent(hass: HomeAssistant) -> None:
    """Test that second registration is a no-op."""

    hass.data.setdefault(DOMAIN, {})["_panel_registered"] = True

    with patch(
        "custom_components.maintenance_supporter.panel.panel_custom.async_register_panel",
        new_callable=AsyncMock,
    ) as mock_register:
        await async_register_panel(hass)
        mock_register.assert_not_called()


async def test_unregister_panel(hass: HomeAssistant) -> None:
    """Test that panel is removed."""

    hass.data.setdefault(DOMAIN, {})["_panel_registered"] = True

    with patch(
        "custom_components.maintenance_supporter.panel.frontend.async_remove_panel",
    ) as mock_remove:
        await async_unregister_panel(hass)

        assert hass.data[DOMAIN].get("_panel_registered") is False
        mock_remove.assert_called_once()


async def test_unregister_panel_idempotent(hass: HomeAssistant) -> None:
    """Test that unregister when not registered is a no-op."""

    hass.data.setdefault(DOMAIN, {})

    with patch(
        "custom_components.maintenance_supporter.panel.frontend.async_remove_panel",
    ) as mock_remove:
        await async_unregister_panel(hass)
        mock_remove.assert_not_called()


async def test_file_hash_valid(hass: HomeAssistant) -> None:
    """Test that file hash returns 8-char hex string."""
    # Use a file that exists - the panel module itself
    panel_path = Path(__file__).parent.parent / "custom_components" / "maintenance_supporter" / "panel.py"
    result = await _async_file_hash(hass, panel_path)

    assert len(result) == 8
    assert all(c in "0123456789abcdef" for c in result)


async def test_file_hash_missing_file(hass: HomeAssistant) -> None:
    """Test that missing file returns '0'."""
    result = await _async_file_hash(hass, Path("/nonexistent/file.js"))
    assert result == "0"


async def test_panel_url_versioned(hass: HomeAssistant) -> None:
    """Test that panel URL includes version hash."""

    hass.data.setdefault(DOMAIN, {})

    with patch(
        "custom_components.maintenance_supporter.panel.panel_custom.async_register_panel",
        new_callable=AsyncMock,
    ) as mock_register:
        with patch(
            "custom_components.maintenance_supporter.panel._async_file_hash",
            return_value="abcd1234",
        ):
            await async_register_panel(hass)

            # The static path should contain the hash
            static_calls = hass.http.async_register_static_paths.call_args[0][0]  # type: ignore[attr-defined]
            assert any("abcd1234" in config.url_path for config in static_calls)


# ═══════════════════════════════════════════════════════════════════════════
# Threshold Calculator Tests
# ═══════════════════════════════════════════════════════════════════════════


async def test_suggestions_with_percentiles(hass: HomeAssistant) -> None:
    """Test statistics-based suggestions use P90*1.2 and P10*0.8."""
    hass.states.async_set("sensor.temp", "25.0", {"unit_of_measurement": "°C"})

    calc = ThresholdCalculator(hass)

    from custom_components.maintenance_supporter.helpers.entity_analyzer import StatisticsInfo

    stats = StatisticsInfo(
        has_data=True,
        mean=25.0,
        std_dev=5.0,
        minimum=10.0,
        maximum=40.0,
        percentile_10=15.0,
        percentile_90=35.0,
        period_days=30,
        recent_trend="stable",
    )

    result = calc._suggestions_from_statistics(25.0, "°C", stats)
    assert result.suggested_above == round(35.0 * 1.2, 2)  # 42.0
    assert result.suggested_below == round(15.0 * 0.8, 2)  # 12.0
    assert result.unit == "°C"
    assert result.average == 25.0


async def test_suggestions_narrow_range_stddev(hass: HomeAssistant) -> None:
    """Test that narrow range falls back to mean±2σ."""
    calc = ThresholdCalculator(hass)

    from custom_components.maintenance_supporter.helpers.entity_analyzer import StatisticsInfo

    stats = StatisticsInfo(
        has_data=True,
        mean=25.0,
        std_dev=2.0,
        minimum=20.0,
        maximum=30.0,
        percentile_10=24.0,   # P10*0.8 = 19.2
        percentile_90=24.5,   # P90*1.2 = 29.4 -- but 29.4 > 19.2, so OK
        period_days=30,
        recent_trend="stable",
    )

    # Force above <= below by making P90 < P10 after scaling
    stats_narrow = StatisticsInfo(
        has_data=True,
        mean=25.0,
        std_dev=2.0,
        minimum=20.0,
        maximum=30.0,
        percentile_10=26.0,   # P10*0.8 = 20.8
        percentile_90=17.0,   # P90*1.2 = 20.4, which is <= 20.8
        period_days=30,
        recent_trend="stable",
    )

    result = calc._suggestions_from_statistics(25.0, "°C", stats_narrow)
    # Should fall back to mean ± 2σ
    assert result.suggested_above == round(25.0 + 2 * 2.0, 2)  # 29.0
    assert result.suggested_below == round(25.0 - 2 * 2.0, 2)  # 21.0


async def test_naive_positive_value(hass: HomeAssistant) -> None:
    """Test naive suggestions for positive value: 1.5x/0.5x."""
    calc = ThresholdCalculator(hass)
    result = calc._naive_suggestions(20.0, "°C")
    assert result.suggested_above == 30.0  # 20 * 1.5
    assert result.suggested_below == 10.0  # 20 * 0.5


async def test_naive_zero_value(hass: HomeAssistant) -> None:
    """Test naive suggestions for zero value: ±10."""
    calc = ThresholdCalculator(hass)
    result = calc._naive_suggestions(0.0, "count")
    assert result.suggested_above == 10.0
    assert result.suggested_below == -10.0


async def test_no_entity_empty(hass: HomeAssistant) -> None:
    """Test that non-existent entity returns empty suggestions."""
    calc = ThresholdCalculator(hass)
    result = await calc.async_calculate_suggestions("sensor.nonexistent")
    assert result.current_value is None
    assert result.suggested_above is None


async def test_non_numeric_unit_only(hass: HomeAssistant) -> None:
    """Test that non-numeric entity returns only unit."""
    hass.states.async_set("sensor.status", "active", {"unit_of_measurement": "status"})
    calc = ThresholdCalculator(hass)
    result = await calc.async_calculate_suggestions("sensor.status")
    assert result.unit == "status"
    assert result.current_value is None
    assert result.suggested_above is None


async def test_attribute_based(hass: HomeAssistant) -> None:
    """Test suggestions based on entity attribute."""
    hass.states.async_set("sensor.device", "ok", {
        "unit_of_measurement": "",
        "temperature": 45.0,
    })
    calc = ThresholdCalculator(hass)
    with patch(
        "custom_components.maintenance_supporter.helpers.threshold_calculator.EntityAnalyzer"
    ) as MockAnalyzer:
        instance = MockAnalyzer.return_value
        instance.async_analyze_entity = AsyncMock(return_value=MagicMock(statistics=None))
        result = await calc.async_calculate_suggestions("sensor.device", attribute="temperature")
    assert result.current_value == 45.0
    assert result.suggested_above is not None


async def test_full_flow_with_stats(hass: HomeAssistant) -> None:
    """Test full suggestion flow with mocked entity analyzer."""
    hass.states.async_set("sensor.temp", "25.0", {"unit_of_measurement": "°C"})

    from custom_components.maintenance_supporter.helpers.entity_analyzer import (
        EntityAnalysis,
        StatisticsInfo,
    )

    mock_analysis = EntityAnalysis(
        entity_id="sensor.temp",
        statistics=StatisticsInfo(
            has_data=True, mean=25.0, std_dev=5.0,
            minimum=10.0, maximum=40.0,
            percentile_10=15.0, percentile_90=35.0,
            period_days=30, recent_trend="rising",
        ),
    )

    calc = ThresholdCalculator(hass)
    with patch(
        "custom_components.maintenance_supporter.helpers.threshold_calculator.EntityAnalyzer"
    ) as MockAnalyzer:
        instance = MockAnalyzer.return_value
        instance.async_analyze_entity = AsyncMock(return_value=mock_analysis)

        result = await calc.async_calculate_suggestions("sensor.temp")

    assert result.current_value == 25.0
    assert result.suggested_above is not None
    assert result.suggested_below is not None
    assert result.trend == "rising"
    assert result.data_period_days == 30
