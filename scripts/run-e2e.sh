#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
FRONTEND_DIR="$REPO_DIR/custom_components/maintenance_supporter/frontend-src"

echo "=== E2E Test Runner ==="

# 1. Ensure containers are running
echo "Checking containers..."
if ! docker inspect ha-maint --format '{{.State.Health.Status}}' 2>/dev/null | grep -q healthy; then
  echo "ha-maint not healthy — starting..."
  cd "$REPO_DIR/docker" && docker compose up -d homeassistant-dev
  echo "Waiting for health check..."
  until docker inspect ha-maint --format '{{.State.Health.Status}}' 2>/dev/null | grep -q healthy; do sleep 3; done
fi

# 2. Restart playwright for a clean session
echo "Restarting playwright-server..."
docker restart playwright-server 2>/dev/null || {
  cd "$REPO_DIR/docker" && docker compose --profile testing up -d playwright
}
sleep 5
until docker logs playwright-server --tail 1 2>&1 | grep -q "Listening"; do sleep 2; done
echo "Playwright ready."

# 3. Get fresh refresh token
echo "Getting fresh HA token..."
HA_URL="http://localhost:8125"
FLOW_ID=$(curl -s -X POST "$HA_URL/auth/login_flow" \
  -H "Content-Type: application/json" \
  -d "{\"client_id\":\"http://homeassistant-dev:8123/\",\"handler\":[\"homeassistant\",null],\"redirect_uri\":\"http://homeassistant-dev:8123/\"}" \
  | node -e "process.stdin.on('data',d=>console.log(JSON.parse(d).flow_id))")
AUTH_CODE=$(curl -s -X POST "$HA_URL/auth/login_flow/$FLOW_ID" \
  -H "Content-Type: application/json" \
  -d '{"client_id":"http://homeassistant-dev:8123/","username":"dev","password":"dev"}' \
  | node -e "process.stdin.on('data',d=>console.log(JSON.parse(d).result))")
export HA_REFRESH_TOKEN=$(curl -s -X POST "$HA_URL/auth/token" \
  -d "grant_type=authorization_code&code=$AUTH_CODE&client_id=http://homeassistant-dev:8123/" \
  | node -e "process.stdin.on('data',d=>console.log(JSON.parse(d).refresh_token))")
echo "Token acquired."

# 4. Run E2E tests
echo ""
cd "$FRONTEND_DIR"
node e2e-test.mjs
