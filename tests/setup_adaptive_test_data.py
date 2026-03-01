"""Set up test data for adaptive scheduling features.

Strategy: Use reset(date=past) + complete(feedback) cycles to build
realistic history with actual time intervals, allowing the adaptive
engine to learn.

Run inside Docker container:
  python /config/tests/setup_adaptive_test_data.py
"""

import asyncio
import os
import json
from datetime import date, timedelta

TOKEN = os.environ["HA_TOKEN"]
BASE = "http://localhost:8123"

msg_id_counter = 1


async def ws_send(ws, msg_type, **kwargs):
    global msg_id_counter
    mid = msg_id_counter
    msg_id_counter += 1
    msg = {"id": mid, "type": msg_type, **kwargs}
    await ws.send_json(msg)
    while True:
        resp = await ws.receive_json()
        if resp.get("id") == mid:
            return resp


async def enable_adaptive_via_options_flow(session, headers, entry_id, task_id, interval):
    """Enable adaptive scheduling on a task via the HA options flow."""
    # Start options flow
    async with session.post(
        f"{BASE}/api/config/config_entries/options/flow",
        headers=headers,
        json={"handler": entry_id}
    ) as r:
        flow = await r.json()
        flow_id = flow.get("flow_id")
        if not flow_id:
            print(f"  ERROR starting flow: {flow}")
            return False

    # init -> manage_tasks
    async with session.post(
        f"{BASE}/api/config/config_entries/options/flow/{flow_id}",
        headers=headers,
        json={"next_step_id": "manage_tasks"}
    ) as r:
        await r.json()

    # manage_tasks -> select task
    async with session.post(
        f"{BASE}/api/config/config_entries/options/flow/{flow_id}",
        headers=headers,
        json={"selected_task": task_id}
    ) as r:
        await r.json()

    # task_action -> adaptive_scheduling
    async with session.post(
        f"{BASE}/api/config/config_entries/options/flow/{flow_id}",
        headers=headers,
        json={"next_step_id": "adaptive_scheduling"}
    ) as r:
        await r.json()

    # Submit adaptive scheduling form
    async with session.post(
        f"{BASE}/api/config/config_entries/options/flow/{flow_id}",
        headers=headers,
        json={
            "adaptive_enabled": True,
            "ewa_alpha": 0.3,
            "min_interval_days": max(7, interval // 4),
            "max_interval_days": min(365, interval * 3),
        }
    ) as r:
        result = await r.json()
        if result.get("type") == "create_entry":
            print(f"  Adaptive scheduling ENABLED!")
            return True
        else:
            print(f"  Unexpected: {result.get('type')}")
            return False


async def main():
    import aiohttp

    HEADERS = {"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}

    async with aiohttp.ClientSession() as session:
        async with session.ws_connect(f"{BASE}/api/websocket") as ws:
            # Auth
            await ws.receive_json()
            await ws.send_json({"type": "auth", "access_token": TOKEN})
            await ws.receive_json()
            print("Connected to HA WebSocket\n")

            # ─── Step 1: Get all objects ───
            resp = await ws_send(ws, "maintenance_supporter/objects")
            objects = resp.get("result", {}).get("objects", [])
            print(f"Found {len(objects)} maintenance objects:")

            entry_map = {}
            for obj_resp in objects:
                entry_id = obj_resp["entry_id"]
                obj = obj_resp["object"]
                tasks = obj_resp.get("tasks", [])
                entry_map[entry_id] = {"object": obj, "tasks": tasks}
                print(f"  {obj['name']} (entry: {entry_id[:16]}...)")
                for t in tasks:
                    ac = t.get("adaptive_config")
                    print(f"    - {t['name']} (schedule={t['schedule_type']}, "
                          f"interval={t.get('interval_days')}d, "
                          f"adaptive={'ON' if ac and ac.get('enabled') else 'off'}, "
                          f"history={len(t.get('history', []))})")

            # ─── Step 2: Find time-based tasks ───
            target_tasks = []
            for eid, data in entry_map.items():
                obj_name = data["object"]["name"]
                for t in data["tasks"]:
                    if t["schedule_type"] == "time_based" and t.get("interval_days"):
                        target_tasks.append({
                            "entry_id": eid,
                            "task_id": t["id"],
                            "obj_name": obj_name,
                            "task_name": t["name"],
                            "interval": t.get("interval_days"),
                            "has_adaptive": bool((t.get("adaptive_config") or {}).get("enabled")),
                        })

            print(f"\nTime-based tasks for adaptive scheduling:")
            for tt in target_tasks:
                print(f"  {tt['obj_name']} / {tt['task_name']} ({tt['interval']}d) "
                      f"- adaptive: {'ON' if tt['has_adaptive'] else 'off'}")

            if not target_tasks:
                print("No eligible tasks found!")
                return

            # ─── Step 3: Enable adaptive scheduling ───
            for tt in target_tasks:
                if tt["has_adaptive"]:
                    print(f"\n  Skipping {tt['task_name']} - already enabled")
                    continue

                print(f"\n{'='*60}")
                print(f"Enabling adaptive: {tt['obj_name']} / {tt['task_name']}")
                print(f"{'='*60}")

                await enable_adaptive_via_options_flow(
                    session, HEADERS, tt["entry_id"], tt["task_id"], tt["interval"]
                )

            # ─── Step 4: Build history with realistic intervals ───
            # Use reset(date=past) then complete(feedback) to create
            # entries with proper time gaps that the adaptive engine can learn from.
            print(f"\n{'='*60}")
            print("Building adaptive learning data with spaced completions")
            print(f"{'='*60}")

            today = date.today()

            # Scenarios: (days_ago_for_reset, feedback, notes, cost, duration)
            # Each completion simulates: reset to date X days ago, then complete "today"
            # giving actual_interval = X days.
            # We work backwards in time to build a realistic history.
            scenarios = {
                30: [  # For 30-day interval tasks
                    (28, "needed",     "Filter was dirty, good timing",         10.0, 15),
                    (32, "needed",     "Slightly overdue, noticeable wear",     10.0, 20),
                    (25, "not_needed", "Still fairly clean, could wait longer", 10.0, 10),
                    (35, "needed",     "Definitely overdue this time",          15.0, 25),
                    (30, "not_sure",   "Hard to tell, moderate buildup",        None, 15),
                    (27, "needed",     "Good maintenance timing",               10.0, 20),
                    (33, "not_needed", "Premature - still in good shape",       10.0, 10),
                    (29, "needed",     "Regular wear pattern observed",         12.0, 18),
                    (26, "needed",     "Needed - heavy usage period",           10.0, 15),
                    (31, "needed",     "Right on schedule",                     10.0, 20),
                ],
                180: [  # For 180-day interval tasks
                    (170, "needed",     "Good timing for tire rotation",       45.0, 30),
                    (190, "needed",     "Slightly overdue, uneven wear",       50.0, 35),
                    (160, "not_needed", "Tires still even, could wait",        45.0, 30),
                    (200, "needed",     "Clearly overdue, visible wear",       55.0, 40),
                    (175, "not_sure",   "Borderline - moderate wear",          None, 30),
                    (165, "needed",     "Seasonal change, good timing",        45.0, 30),
                    (185, "not_needed", "Wear was minimal this time",          45.0, 25),
                    (180, "needed",     "Standard rotation needed",            48.0, 30),
                    (155, "needed",     "Heavy driving period, needed early",  45.0, 30),
                    (195, "needed",     "Right on schedule with heavy use",    50.0, 35),
                ],
            }

            for tt in target_tasks:
                interval = tt["interval"]
                task_scenarios = scenarios.get(interval, scenarios[30])  # Default to 30d
                print(f"\n  {tt['obj_name']} / {tt['task_name']} ({interval}d interval):")

                # First, reset to clear any existing state
                await ws_send(ws, "maintenance_supporter/task/reset",
                             entry_id=tt["entry_id"], task_id=tt["task_id"])

                for i, (days_ago, fb, notes, cost, duration) in enumerate(task_scenarios):
                    # Reset to a date in the past (simulating last_performed = days_ago)
                    past_date = (today - timedelta(days=days_ago)).isoformat()
                    await ws_send(ws, "maintenance_supporter/task/reset",
                                 entry_id=tt["entry_id"], task_id=tt["task_id"],
                                 date=past_date)

                    # Complete with feedback (sets last_performed to today)
                    # The coordinator computes actual_interval = today - past_date = days_ago
                    data = {
                        "entry_id": tt["entry_id"],
                        "task_id": tt["task_id"],
                        "feedback": fb,
                        "notes": f"{notes} (#{i+1})",
                        "duration": duration,
                    }
                    if cost:
                        data["cost"] = cost
                    resp = await ws_send(ws, "maintenance_supporter/task/complete", **data)
                    success = resp.get("success", False)
                    actual = days_ago
                    symbol = "✓" if success else "✗"
                    print(f"    #{i+1:2d} reset={days_ago:3d}d ago, fb={fb:12s} "
                          f"-> {symbol} (actual_interval={actual}d)")

                    # Small delay to avoid overwhelming HA
                    await asyncio.sleep(0.1)

            # ─── Step 5: Verify adaptive state ───
            print(f"\n{'='*60}")
            print("Verifying adaptive scheduling state")
            print(f"{'='*60}")

            # Give HA a moment to process
            await asyncio.sleep(1)

            resp = await ws_send(ws, "maintenance_supporter/objects")
            objects = resp.get("result", {}).get("objects", [])

            for obj_resp in objects:
                obj = obj_resp["object"]
                for t in obj_resp.get("tasks", []):
                    ac = t.get("adaptive_config")
                    if ac and ac.get("enabled"):
                        print(f"\n  {obj['name']} / {t['name']}:")
                        print(f"    interval_days: {t.get('interval_days')}")
                        print(f"    adaptive_config:")
                        for k in ["enabled", "smoothed_interval", "feedback_count",
                                  "confidence", "weibull_beta", "weibull_eta",
                                  "current_recommendation", "recommendation_reason",
                                  "base_interval", "ewa_alpha",
                                  "min_interval_days", "max_interval_days"]:
                            print(f"      {k}: {ac.get(k)}")
                        print(f"    suggested_interval: {t.get('suggested_interval')}")
                        print(f"    interval_confidence: {t.get('interval_confidence')}")
                        print(f"    interval_analysis: {t.get('interval_analysis')}")

                        fb_entries = [h for h in t.get("history", []) if h.get("feedback")]
                        print(f"    History entries with feedback: {len(fb_entries)}")

            # ─── Step 6: Test analyze_interval WS command ───
            print(f"\n{'='*60}")
            print("Testing analyze_interval WS command")
            print(f"{'='*60}")

            for tt in target_tasks:
                resp = await ws_send(ws, "maintenance_supporter/task/analyze_interval",
                                    entry_id=tt["entry_id"], task_id=tt["task_id"])
                analysis = resp.get("result", {})
                print(f"\n  {tt['obj_name']} / {tt['task_name']}:")
                for k, v in analysis.items():
                    if isinstance(v, float):
                        print(f"    {k}: {v:.2f}")
                    else:
                        print(f"    {k}: {v}")

            print(f"\n{'='*60}")
            print("DONE! Test data setup complete.")
            print(f"{'='*60}")
            print(f"\nVerify at: http://localhost:8123/maintenance-supporter")
            print("  - Open a task → check suggestion badge next to interval")
            print("  - Click Complete → check feedback toggle")
            print("  - Settings > Integrations > [Object] > Configure > Adaptive Scheduling")


if __name__ == "__main__":
    asyncio.run(main())
