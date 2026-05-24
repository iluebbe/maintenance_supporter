"""Regression test for the compound-trigger options-flow routing bug.

Home Assistant routes config/options-flow form submissions to the handler method
``async_step_<step_id>``. The options flow's compound sub-steps return forms with
``step_id="compound_*"`` (reusing the existing ``options.step.compound_*``
translations), but their implementations are named ``async_step_opt_compound_*``.
Without matching ``async_step_compound_*`` names on the options flow, HA looked up
a method that existed only on the *config* flow and raised ``UnknownStep`` the
moment the compound-logic form was submitted -- so editing a compound trigger
from Settings -> Options was impossible. The fix exposes the routed names as
aliases; this test guards it.
"""

from __future__ import annotations

from custom_components.maintenance_supporter.config_flow_options_task import (
    MaintenanceOptionsFlow,
)

# Every step_id the options-flow compound steps return via async_show_form.
COMPOUND_STEP_IDS = (
    "compound_logic",
    "compound_condition_entity",
    "compound_condition_type",
    "compound_condition_threshold",
    "compound_condition_counter",
    "compound_condition_state_change",
    "compound_condition_runtime",
    "compound_review",
)


def test_options_flow_exposes_compound_step_methods() -> None:
    """HA resolves a submitted form's next handler via getattr(flow,
    f"async_step_{step_id}"). Each compound step_id the options flow emits must
    therefore resolve to a callable on MaintenanceOptionsFlow, or submitting the
    form raises UnknownStep (the original bug)."""
    for step_id in COMPOUND_STEP_IDS:
        method = getattr(MaintenanceOptionsFlow, f"async_step_{step_id}", None)
        assert callable(method), (
            f"MaintenanceOptionsFlow.async_step_{step_id} is missing -> HA raises "
            f"UnknownStep when the '{step_id}' form is submitted"
        )
