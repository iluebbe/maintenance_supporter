#!/bin/bash
# Bootstrap script for the Maintenance Supporter dev environment.
# Creates config, onboards HA, creates demo data — fully automated.
#
# Usage:
#   bash scripts/init-dev.sh
#
# Prerequisites:
#   - Docker and Docker Compose
#   - Python 3.10+ with `requests` (pip install requests)
#   - curl

set -euo pipefail
cd "$(dirname "$0")/.."

# Detect Python command (python3 on Linux/Mac, py on Windows/git-bash)
if command -v python3 &>/dev/null; then
    PYTHON=python3
elif command -v py &>/dev/null; then
    PYTHON=py
elif command -v python &>/dev/null; then
    PYTHON=python
else
    echo "ERROR: Python not found. Install Python 3.10+ and ensure it's on PATH."
    exit 1
fi

DOCKER_DIR="docker"
CONFIG_DIR="$DOCKER_DIR/config-dev"
SEED_DIR="$DOCKER_DIR/config-seed"
ENV_FILE="$DOCKER_DIR/.env"
HA_URL="${HA_URL:-http://localhost:8123}"

# ---------------------------------------------------------------------------
# 1. Populate config-dev from seed
# ---------------------------------------------------------------------------
if [ ! -f "$CONFIG_DIR/configuration.yaml" ]; then
    echo "Initializing config-dev from seed..."
    mkdir -p "$CONFIG_DIR"
    cp "$SEED_DIR"/*.yaml "$CONFIG_DIR/"
    echo "  Copied configuration files."
else
    echo "config-dev already initialized (configuration.yaml exists)."
fi

# ---------------------------------------------------------------------------
# 2. Create faketime.txt if missing (compose volume mount needs it)
# ---------------------------------------------------------------------------
touch "$DOCKER_DIR/faketime.txt"

# ---------------------------------------------------------------------------
# 3. Start HA
# ---------------------------------------------------------------------------
echo "Starting HA dev container..."
docker compose -f "$DOCKER_DIR/compose.yaml" up -d homeassistant-dev

# ---------------------------------------------------------------------------
# 4. Wait for health check
# ---------------------------------------------------------------------------
echo "Waiting for HA to become ready..."
MAX_WAIT=120
ELAPSED=0
while [ $ELAPSED -lt $MAX_WAIT ]; do
    if docker exec ha-dev wget -q -O /dev/null http://localhost:8123/manifest.json 2>/dev/null; then
        echo "  HA is ready (${ELAPSED}s)."
        break
    fi
    if [ $ELAPSED -ge $MAX_WAIT ]; then
        echo "ERROR: HA did not start within ${MAX_WAIT}s."
        exit 1
    fi
    sleep 5
    ELAPSED=$((ELAPSED + 5))
done

# Give HA a moment to finish loading integrations
sleep 5

# ---------------------------------------------------------------------------
# 5. Onboarding (only on fresh HA)
# ---------------------------------------------------------------------------
ONBOARDING_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$HA_URL/api/onboarding" 2>/dev/null || echo "000")

if [ "$ONBOARDING_STATUS" = "200" ]; then
    echo "Completing HA onboarding..."

    # Step 1: Create user
    AUTH_RESP=$(curl -s -X POST "$HA_URL/api/onboarding/users" \
        -H "Content-Type: application/json" \
        -d '{"client_id":"http://localhost:8123/","name":"Dev","username":"dev","password":"dev","language":"en"}')

    AUTH_CODE=$(echo "$AUTH_RESP" | $PYTHON -c "import sys,json; print(json.load(sys.stdin)['auth_code'])" 2>/dev/null) || {
        echo "ERROR: Failed to create user. Response: $AUTH_RESP"
        exit 1
    }

    # Step 2: Exchange auth_code for tokens
    TOKEN_RESP=$(curl -s -X POST "$HA_URL/auth/token" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "grant_type=authorization_code&code=${AUTH_CODE}&client_id=http://localhost:8123/")

    ACCESS_TOKEN=$(echo "$TOKEN_RESP" | $PYTHON -c "import sys,json; print(json.load(sys.stdin)['access_token'])" 2>/dev/null) || {
        echo "ERROR: Failed to get access token. Response: $TOKEN_RESP"
        exit 1
    }

    # Step 3: Complete remaining onboarding steps
    curl -s -X POST "$HA_URL/api/onboarding/core_config" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H "Content-Type: application/json" -d '{}' > /dev/null 2>&1 || true

    curl -s -X POST "$HA_URL/api/onboarding/analytics" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H "Content-Type: application/json" -d '{}' > /dev/null 2>&1 || true

    curl -s -X POST "$HA_URL/api/onboarding/integration" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"client_id":"http://localhost:8123/","redirect_uri":"http://localhost:8123/"}' > /dev/null 2>&1 || true

    # Save token for scripts
    echo "HA_TOKEN=$ACCESS_TOKEN" > "$ENV_FILE"
    export HA_TOKEN="$ACCESS_TOKEN"
    echo "  Onboarding complete. Token saved to $ENV_FILE"
    echo "  Login: dev / dev"
else
    echo "HA already onboarded."
    # Load existing token if available
    if [ -f "$ENV_FILE" ]; then
        # shellcheck disable=SC1090
        source "$ENV_FILE"
        export HA_TOKEN
    fi
fi

# ---------------------------------------------------------------------------
# 6. Create demo objects (idempotent — skips existing)
# ---------------------------------------------------------------------------
echo ""
echo "Creating demo objects..."
$PYTHON scripts/setup_demo.py

# ---------------------------------------------------------------------------
# 7. Restart HA so storage files are flushed, then seed history
# ---------------------------------------------------------------------------
echo ""
echo "Restarting HA to flush storage..."
docker compose -f "$DOCKER_DIR/compose.yaml" restart homeassistant-dev
sleep 10

echo "Seeding maintenance history..."
$PYTHON scripts/seed_history.py

# ---------------------------------------------------------------------------
# 8. Final restart to load seeded history
# ---------------------------------------------------------------------------
echo ""
echo "Restarting HA to load history data..."
docker compose -f "$DOCKER_DIR/compose.yaml" restart homeassistant-dev

echo ""
echo "========================================="
echo "  Dev environment ready!"
echo "  URL:   http://localhost:8123"
echo "  Login: dev / dev"
echo "  Panel: Maintenance (sidebar)"
echo "========================================="
