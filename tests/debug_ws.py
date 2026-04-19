"""Debug WS response format."""
import asyncio
import json
import os

TOKEN = os.environ["HA_TOKEN"]
BASE = "http://localhost:8123"

async def main():
    import aiohttp
    async with aiohttp.ClientSession() as session:
        async with session.ws_connect(f"{BASE}/api/websocket") as ws:
            auth_msg = await ws.receive_json()
            await ws.send_json({"type": "auth", "access_token": TOKEN})
            auth_ok = await ws.receive_json()
            print(f"Auth: {auth_ok['type']}")

            await ws.send_json({"id": 1, "type": "maintenance_supporter/objects"})
            resp = await ws.receive_json()
            print(f"\nResponse type: {type(resp)}")
            print(f"Keys: {resp.keys()}")
            result = resp.get("result")
            print(f"Result type: {type(result)}")
            if isinstance(result, list):
                print(f"Result length: {len(result)}")
                if result:
                    print(f"First item type: {type(result[0])}")
                    print(f"First item: {json.dumps(result[0], indent=2)[:500]}")
            elif isinstance(result, dict):
                print(f"Result keys: {result.keys()}")
                print(f"Result: {json.dumps(result, indent=2)[:500]}")
            else:
                print(f"Result: {result}")

asyncio.run(main())
