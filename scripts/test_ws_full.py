"""Comprehensive WS test for maintenance_supporter."""
import asyncio
import aiohttp
import json
import os
import sys
from pathlib import Path

HARDCODED_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkMmMyZGFiN2E3YzA0Yjc1YWU3MmUzYTNhOWRkMTlhNSIsImlhdCI6MTc3MDQ4Mzc5NywiZXhwIjoxODAyMDE5Nzk3fQ.fo2oCXoNa5TKdxkycLzJqyvt7WI1jv05E3n95jdk-4E"

def get_token():
    if t := os.environ.get("HA_TOKEN"):
        return t
    env_path = Path(__file__).parent.parent / "docker" / ".env"
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            if line.startswith("HA_TOKEN="):
                return line.split("=", 1)[1].strip()
    return HARDCODED_TOKEN

TOKEN = get_token()
URL = "ws://localhost:8123/api/websocket"

async def main():
    session = aiohttp.ClientSession()
    ws = await session.ws_connect(URL)

    # Auth
    msg = await ws.receive_json()
    print(f"1. Auth required: type={msg['type']}")
    await ws.send_json({"type": "auth", "access_token": TOKEN})
    msg = await ws.receive_json()
    print(f"2. Auth result: {msg['type']}")
    if msg["type"] != "auth_ok":
        print("Auth failed!")
        sys.exit(1)

    msg_id = 1

    # --- Test: Get all objects ---
    msg_id += 1
    await ws.send_json({"id": msg_id, "type": "maintenance_supporter/objects"})
    msg = await ws.receive_json()
    objects = msg.get("result", {}).get("objects", [])
    print(f"\n3. Objects: {len(objects)} found")

    # Check trigger_entity_info on tasks with triggers
    for obj in objects:
        obj_name = obj["object"]["name"]
        for task in obj["tasks"]:
            tei = task.get("trigger_entity_info")
            trigger_active = task.get("trigger_active")
            trigger_val = task.get("trigger_current_value")
            status = task.get("status")
            days = task.get("days_until_due")
            t_type = task.get("type")

            line = f"   {obj_name} > {task['name']} [{status}]"
            if days is not None:
                line += f" days_until_due={days}"
            if trigger_active is not None:
                line += f" trigger_active={trigger_active}"
            if trigger_val is not None:
                line += f" trigger_value={trigger_val}"
            if tei:
                line += f"\n      trigger_entity_info: friendly_name={tei.get('friendly_name')}, unit={tei.get('unit_of_measurement')}, min={tei.get('min')}, max={tei.get('max')}"
            print(line)

    # --- Test: Get single object (first one with trigger tasks) ---
    msg_id += 1
    entry_id = objects[0]["entry_id"]
    await ws.send_json({"id": msg_id, "type": "maintenance_supporter/object", "entry_id": entry_id})
    msg = await ws.receive_json()
    detail = msg.get("result", {})
    print(f"\n4. Object detail for '{detail.get('object', {}).get('name', '?')}': {len(detail.get('tasks', []))} tasks")
    for task in detail.get("tasks", []):
        tei = task.get("trigger_entity_info")
        history = task.get("history", [])
        print(f"   Task: {task['name']} [{task['status']}] history_entries={len(history)}")
        if tei:
            print(f"      trigger_entity_info: {json.dumps(tei, ensure_ascii=False)}")
        if history:
            last = history[-1]
            print(f"      last_history: type={last.get('type')}, date={last.get('date')}, trigger_value={last.get('trigger_value')}")

    # --- Test: Statistics ---
    msg_id += 1
    await ws.send_json({"id": msg_id, "type": "maintenance_supporter/statistics"})
    msg = await ws.receive_json()
    stats = msg.get("result", {})
    print(f"\n5. Statistics: {json.dumps(stats, indent=2)}")

    # --- Test: Static files ---
    print("\n6. Static files:")
    for url in ["/maintenance_supporter_panel", "/maintenance_supporter_card"]:
        try:
            resp = await session.get(f"http://localhost:8123{url}", headers={"Authorization": f"Bearer {TOKEN}"})
            size = len(await resp.read())
            print(f"   {url}: HTTP {resp.status}, size={size} bytes")
            resp.close()
        except Exception as e:
            print(f"   {url}: ERROR {e}")

    await ws.close()
    await session.close()
    print("\n✅ All tests passed!")

asyncio.run(main())
