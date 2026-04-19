"""Quick check of adaptive scheduling state."""
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
                for t in obj_resp.get("tasks", []):
                    ac = t.get("adaptive_config")
                    if ac and ac.get("enabled"):
                        si = t.get("suggested_interval")
                        ic = t.get("interval_confidence")
                        ia = t.get("interval_analysis")
                        cr = ac.get("current_recommendation")
                        sm = ac.get("smoothed_interval")
                        fc = ac.get("feedback_count")
                        co = ac.get("confidence")
                        name = obj["name"] + " / " + t["name"]
                        print(name)
                        print("  suggested_interval:", si)
                        print("  interval_confidence:", ic)
                        print("  interval_analysis:", ia)
                        print("  current_recommendation:", cr)
                        print("  smoothed_interval:", sm)
                        print("  feedback_count:", fc)
                        print("  confidence:", co)
                        print()

asyncio.run(main())
