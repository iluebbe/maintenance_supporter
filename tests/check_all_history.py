"""Check history data for ALL tasks."""
import asyncio
import os
import aiohttp

TOKEN = os.environ["HA_TOKEN"]
BASE = "http://localhost:8123"

async def main():
    async with aiohttp.ClientSession() as session:
        async with session.ws_connect(BASE + "/api/websocket") as ws:
            await ws.receive_json()
            await ws.send_json({"type": "auth", "access_token": TOKEN})
            await ws.receive_json()

            await ws.send_json({"id": 1, "type": "maintenance_supporter/objects"})
            resp = await ws.receive_json()
            objects = resp.get("result", {}).get("objects", [])

            for obj_resp in objects:
                obj = obj_resp["object"]
                entry_id = obj_resp["entry_id"]
                for t in obj_resp.get("tasks", []):
                    name = t["name"]
                    history = t.get("history", [])
                    interval = t.get("interval_days")
                    schedule = t.get("schedule_type")
                    task_id = t.get("id")
                    lp = t.get("last_performed")
                    ac = t.get("adaptive_config")
                    adaptive = "ON" if ac and ac.get("enabled") else "off"

                    completed = [h for h in history if h.get("type") == "completed"]
                    triggered = [h for h in history if h.get("type") == "triggered"]
                    resets = [h for h in history if h.get("type") == "reset"]
                    skipped = [h for h in history if h.get("type") == "skipped"]

                    has_cost = sum(1 for h in completed if h.get("cost") is not None)
                    has_dur = sum(1 for h in completed if h.get("duration") is not None)
                    has_fb = sum(1 for h in completed if h.get("feedback") is not None)

                    # Check timestamp spread
                    dates = set()
                    for h in completed:
                        ts = h.get("timestamp", "")
                        if ts:
                            dates.add(ts[:10])

                    print("=" * 70)
                    print(obj["name"], "/", name)
                    print("  entry_id:", entry_id[:20] + "...")
                    print("  task_id:", task_id)
                    print("  schedule:", schedule, "| interval:", interval, "d | adaptive:", adaptive)
                    print("  last_performed:", lp)
                    print("  history:", len(history), "total")
                    print("    completed:", len(completed), "(cost:", has_cost, "| dur:", has_dur, "| feedback:", has_fb, ")")
                    print("    triggered:", len(triggered))
                    print("    reset:", len(resets))
                    print("    skipped:", len(skipped))
                    print("  unique completion dates:", sorted(dates))
                    print()

asyncio.run(main())
