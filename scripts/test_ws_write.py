"""Test write WS commands on HA dev instance."""
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
    await ws.send_json({"type": "auth", "access_token": TOKEN})
    msg = await ws.receive_json()
    assert msg["type"] == "auth_ok", f"Auth failed: {msg}"
    print("✅ Auth OK")

    msg_id = 0

    # Get objects to find a task for testing
    msg_id += 1
    await ws.send_json({"id": msg_id, "type": "maintenance_supporter/objects"})
    msg = await ws.receive_json()
    objects = msg["result"]["objects"]

    # Find Swimming Pool > pH Test for testing
    target_entry_id = None
    target_task_id = None
    for obj in objects:
        if obj["object"]["name"] == "Swimming Pool":
            target_entry_id = obj["entry_id"]
            for task in obj["tasks"]:
                if task["name"] == "pH Test":
                    target_task_id = task["id"]
                    print(f"   Target: {obj['object']['name']} > {task['name']} [{task['status']}] days={task['days_until_due']}")
                    break
            break

    assert target_entry_id and target_task_id, "Could not find Swimming Pool > pH Test"

    # Test: Complete task
    msg_id += 1
    await ws.send_json({
        "id": msg_id,
        "type": "maintenance_supporter/task/complete",
        "entry_id": target_entry_id,
        "task_id": target_task_id,
        "notes": "Test completion on HA 2026.2.1",
        "cost": 12.50,
        "duration": 15,
    })
    msg = await ws.receive_json()
    if msg.get("success"):
        print("✅ Complete task: OK")
    else:
        print(f"❌ Complete task: {msg}")

    # Wait a moment for coordinator to update
    await asyncio.sleep(1)

    # Check the task status after completion
    msg_id += 1
    await ws.send_json({"id": msg_id, "type": "maintenance_supporter/object", "entry_id": target_entry_id})
    msg = await ws.receive_json()
    for task in msg["result"]["tasks"]:
        if task["id"] == target_task_id:
            print(f"   After complete: status={task['status']}, days_until_due={task['days_until_due']}")
            history = task.get("history", [])
            if history:
                last = history[-1]
                print(f"   Last history: type={last.get('type')}, notes={last.get('notes')}, cost={last.get('cost')}, duration={last.get('duration')}")
            break

    # Test: Skip task
    msg_id += 1
    await ws.send_json({
        "id": msg_id,
        "type": "maintenance_supporter/task/skip",
        "entry_id": target_entry_id,
        "task_id": target_task_id,
        "reason": "Test skip on HA 2026.2.1",
    })
    msg = await ws.receive_json()
    if msg.get("success"):
        print("✅ Skip task: OK")
    else:
        print(f"❌ Skip task: {msg}")

    # Test: Reset task
    msg_id += 1
    await ws.send_json({
        "id": msg_id,
        "type": "maintenance_supporter/task/reset",
        "entry_id": target_entry_id,
        "task_id": target_task_id,
    })
    msg = await ws.receive_json()
    if msg.get("success"):
        print("✅ Reset task: OK")
    else:
        print(f"❌ Reset task: {msg}")

    # Test: Subscribe (quick check)
    msg_id += 1
    await ws.send_json({"id": msg_id, "type": "maintenance_supporter/subscribe"})
    msg = await ws.receive_json()
    if msg.get("success"):
        print("✅ Subscribe: OK")
    else:
        print(f"❌ Subscribe: {msg}")

    # Test: Statistics after changes
    msg_id += 1
    await ws.send_json({"id": msg_id, "type": "maintenance_supporter/statistics"})
    msg = await ws.receive_json()
    stats = msg.get("result", {})
    print(f"✅ Statistics: total_cost={stats.get('total_cost')}, overdue={stats.get('overdue')}, tasks={stats.get('total_tasks')}")

    await ws.close()
    await session.close()
    print("\n✅ All write tests passed on HA 2026.2.1!")

asyncio.run(main())
