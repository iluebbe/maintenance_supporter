#!/usr/bin/env bash
# Local smoke test mirroring the docker-smoke CI job.
#
# Usage:
#   ./docker/smoke-test.sh                 # uses default HA image
#   HA_IMAGE=ghcr.io/.../home-assistant:2026.4.3 ./docker/smoke-test.sh
#
# Exit code: 0 if HA boots and our integration loads without errors,
# non-zero otherwise. Run before pushing a release.
set -euo pipefail

# Disable git-bash path mangling so the -v mount target keeps its leading
# slash on Windows. Without this, "/config" becomes "C:/Program Files/Git/config"
# and the bind mount lands in the wrong place.
export MSYS_NO_PATHCONV=1

HA_IMAGE="${HA_IMAGE:-ghcr.io/home-assistant/home-assistant:2026.4.3}"
PORT="${HA_SMOKE_PORT:-8127}"
NAME="ha-smoke-test"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Docker Desktop on Windows can't bind-mount /tmp reliably. Keep the
# test config dir inside the repo so the path survives path translation.
CFG_DIR="${REPO_ROOT}/docker/.smoke-config"
rm -rf "${CFG_DIR}"
mkdir -p "${CFG_DIR}"
trap 'docker rm -f "${NAME}" >/dev/null 2>&1 || true; rm -rf "${CFG_DIR}"' EXIT

echo "==> Building frontend bundle"
( cd "${REPO_ROOT}/custom_components/maintenance_supporter/frontend-src" \
    && npm ci --silent && node esbuild.mjs )

echo "==> Preparing HA config at ${CFG_DIR}"
mkdir -p "${CFG_DIR}/custom_components"
cp -r "${REPO_ROOT}/custom_components/maintenance_supporter" \
      "${CFG_DIR}/custom_components/maintenance_supporter"
cat > "${CFG_DIR}/configuration.yaml" <<'YAML'
# Minimal HA config — we only need enough services for the integration to
# load. Skipping default_config keeps cold-start under 60s on most boxes.
http:
api:
frontend:
websocket_api:
config:
panel_custom:
lovelace:
recorder:
  db_url: "sqlite:///:memory:"
logger:
  default: warning
  logs:
    custom_components.maintenance_supporter: debug
    homeassistant.loader: info
    homeassistant.setup: info
YAML

echo "==> Starting ${HA_IMAGE} on port ${PORT}"
docker rm -f "${NAME}" >/dev/null 2>&1 || true
docker run -d --name "${NAME}" \
  -v "${CFG_DIR}:/config" \
  -e TZ=UTC \
  -p "${PORT}:8123" \
  "${HA_IMAGE}" >/dev/null

echo "==> Waiting for HA API (max 300s)"
for _ in $(seq 1 150); do
  if curl -sf "http://localhost:${PORT}/manifest.json" >/dev/null 2>&1; then
    echo "    API up."
    break
  fi
  sleep 2
done
if ! curl -sf "http://localhost:${PORT}/manifest.json" >/dev/null 2>&1; then
  echo "ERROR: HA did not start within 300s"
  docker logs "${NAME}" --tail 200
  exit 1
fi

echo "==> Verifying integration modules import"
# HA puts custom components on its own loader path, not sys.path. The
# PYTHONPATH is exported *inside* the container shell so git-bash
# can't mangle the "/config" path on its way through the docker CLI.
docker exec "${NAME}" sh -c 'PYTHONPATH=/config python -c "
from custom_components.maintenance_supporter import __init__, config_flow, coordinator
from custom_components.maintenance_supporter.websocket import __init__ as ws_init
print(\"OK — top-level modules import cleanly\")
"'

echo "==> Scanning logs for integration ERROR / Traceback"
if docker logs "${NAME}" 2>&1 \
     | grep -E 'ERROR.*maintenance_supporter|Setup failed for maintenance_supporter|Traceback \(most recent call last\):' \
     | grep -v 'trigger_runtime_hours not configured'; then
  echo "ERROR: setup errors found above"
  docker logs "${NAME}" --tail 200
  exit 1
fi

echo
echo "Smoke test passed — HA started, integration loaded, no errors."
