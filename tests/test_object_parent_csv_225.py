"""#225: the objects table's CSV names the object each one sits inside.

The panel draws a sub-object inside its parent (Vehicles holding both
cars); the one-row-per-object download lists every object on its own row,
so the ``object_parent`` column keeps the nesting readable there.
"""

from __future__ import annotations

import csv
import io

from homeassistant.core import HomeAssistant

from custom_components.maintenance_supporter.helpers.csv_handler import export_object_records_csv

from .conftest import build_object_data, make_global_entry, make_object_entry, setup_integration


async def test_the_csv_names_the_parent(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    vehicles = make_object_entry(hass, tasks={}, name="Vehicles", uid="vehicles", object_data=build_object_data(name="Vehicles", object_id="vehicles"))
    car = make_object_entry(hass, tasks={}, name="Car", uid="car", object_data={**build_object_data(name="Car", object_id="car"), "parent_entry_id": vehicles.entry_id})
    gone = make_object_entry(hass, tasks={}, name="Trailer", uid="trailer", object_data={**build_object_data(name="Trailer", object_id="trailer"), "parent_entry_id": "deleted_entry"})
    await setup_integration(hass, g, vehicles, car, gone)

    rows = {r["object_name"]: r for r in csv.DictReader(io.StringIO(export_object_records_csv(hass)))}
    assert list(rows["Car"]).index("object_parent") == 1, "right after the name"
    assert rows["Car"]["object_parent"] == "Vehicles"
    assert rows["Vehicles"]["object_parent"] == ""
    assert rows["Trailer"]["object_parent"] == "", "a parent that is gone names nothing"
