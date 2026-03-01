"""Check history data for Family Car tasks."""
import asyncio
import os
import json
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
                if obj["name"] != "Family Car":
                    continue
                for t in obj_resp.get("tasks", []):
                    name = t["name"]
                    history = t.get("history", [])
                    interval = t.get("interval_days")
                    schedule = t.get("schedule_type")
                    print("=" * 60)
                    print(name, "| schedule:", schedule, "| interval:", interval, "d")
                    print("History entries:", len(history))
                    for h in history:
                        ts = h.get("timestamp", "?")
                        etype = h.get("type", "?")
                        cost = h.get("cost")
                        dur = h.get("duration")
                        fb = h.get("feedback")
                        notes = h.get("notes", "")[:50]
                        print(f"  {ts}  type={etype:12s}  cost={cost}  dur={dur}  fb={fb}  {notes}")
                    print()

asyncio.run(main())
