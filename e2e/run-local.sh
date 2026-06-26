#!/usr/bin/env bash
# Run the E2E suite locally against a throwaway Home Assistant, driving a
# browser inside the docker playwright-server (stable full Chromium — avoids
# local headless flakiness). Pass extra `playwright test` args through, e.g.
#   ./e2e/run-local.sh specs/onboarding.spec.ts --headed
set -euo pipefail
export MSYS_NO_PATHCONV=1
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HA_PORT="${HA_PORT:-8129}"

echo "==> Build frontend bundle (so HA serves current integration code)"
( cd "$ROOT/custom_components/maintenance_supporter/frontend-src" && npm ci --silent && node esbuild.mjs )

echo "==> Start docker playwright-server"
( cd "$ROOT" && docker compose -f docker/compose.yaml --profile testing up -d playwright )
NET="$(docker inspect -f '{{range $k,$v := .NetworkSettings.Networks}}{{$k}}{{end}}' playwright-server)"

echo "==> Boot pristine HA (ha-e2e) on network '$NET', port $HA_PORT"
docker rm -f ha-e2e >/dev/null 2>&1 || true
rm -rf "$ROOT/docker/.e2e-config"
mkdir -p "$ROOT/docker/.e2e-config"
cat > "$ROOT/docker/.e2e-config/configuration.yaml" <<'YAML'
default_config:
logger:
  default: warning
  logs:
    custom_components.maintenance_supporter: warning
YAML
docker run -d --name ha-e2e --network "$NET" -p "$HA_PORT:8123" \
  -v "$ROOT/docker/.e2e-config:/config" \
  -v "$ROOT/custom_components:/config/custom_components:ro" \
  -e TZ=UTC ghcr.io/home-assistant/home-assistant:2026.6.3 >/dev/null

echo "==> Wait for HA API (up to 300s)"
for _ in $(seq 1 150); do
  curl -sf -o /dev/null "http://localhost:$HA_PORT/manifest.json" && break || sleep 2
done

echo "==> Install e2e deps + run"
( cd "$ROOT/e2e" && PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install --no-audit --no-fund )
cd "$ROOT/e2e"
export E2E_HA_URL="http://ha-e2e:8123"        # browser (inside docker) reaches HA by name
export E2E_HA_REST_URL="http://localhost:$HA_PORT"  # this script's onboarding REST
export E2E_PW_WS="ws://127.0.0.1:3000/"
npx playwright test "$@"

echo "==> Done. HA left running; remove with: docker rm -f ha-e2e"
