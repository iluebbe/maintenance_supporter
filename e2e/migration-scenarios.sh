#!/usr/bin/env bash
# Update-order matrix for the object↔device attachment rework.
#
# A user updates Home Assistant and the integration independently, in either
# order, or not at all. The rework changes how a stored device link is honoured
# and HA 2026.8 changes what the registry allows, so every combination deserves
# an answer rather than an assumption.
#
# One base state is built once — an object linked to a `demo` device, created by
# the RELEASED version on HA 2026.7 — and every scenario starts from a fresh
# copy of it. Each run reports where the entities ended up.
#
# Usage: bash e2e/migration-scenarios.sh
set -u

REPO="C:/Users/ilueb/OneDrive/Programming/maintenance_supporter_claude"
OLD_CODE="C:/Users/ilueb/AppData/Local/Temp/ms-v2441/custom_components"   # released v2.44.1
NEW_CODE="$REPO/custom_components"                                        # this working tree
HA7="docker-homeassistant-dev:latest"                                     # 2026.7.2
HA8="ghcr.io/home-assistant/home-assistant:2026.8.0b0"
PORT=8134
NAME="ha-scenario"
BASE="$REPO/docker/.scn-base"
WORK="$REPO/docker/.scn-work"

cd "$REPO" || exit 1

boot() {  # boot <image> <code-dir>
  docker rm -f "$NAME" >/dev/null 2>&1
  MSYS_NO_PATHCONV=1 docker run -d --name "$NAME" --network docker_ha-net -p "$PORT:8123" \
    -e TZ=Europe/Berlin \
    -v "$WORK:/config" -v "$2:/config/custom_components" "$1" >/dev/null 2>&1 || return 1
  for _ in $(seq 1 60); do
    code=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:$PORT/api/onboarding" 2>/dev/null)
    [ "$code" != "000" ] && { sleep 25; return 0; }
    sleep 5
  done
  echo "  (HA never came up)"
  return 1
}

fresh_copy() { rm -rf "$WORK"; cp -r "$BASE" "$WORK"; rm -rf "$WORK/custom_components"; }

# ── build the base state once: released code, HA 2026.7 ────────────────────
if [ ! -d "$BASE" ]; then
  echo "== building the base state (v2.44.1 on HA 2026.7) =="
  rm -rf "$WORK"; mkdir -p "$WORK"
  cp "$REPO/docker/config-beta-template.yaml" "$WORK/configuration.yaml"
  boot "$HA7" "$OLD_CODE" || exit 1
  node "$REPO/e2e/scenario-probe.mjs" seed "$PORT" || exit 1
  docker stop "$NAME" >/dev/null 2>&1
  sleep 3
  rm -rf "$BASE"; cp -r "$WORK" "$BASE"; rm -rf "$BASE/custom_components"
  echo "   base state stored"
fi

run() {  # run <label> <image> <code>
  fresh_copy
  boot "$2" "$3" || { echo "$1: boot failed"; return; }
  node "$REPO/e2e/scenario-probe.mjs" probe "$PORT" "$1" || echo "$1: probe failed"
}

echo
echo "== scenarios (all start from the same v2.44.1 / HA 2026.7 state) =="

run "1 nothing updated                        " "$HA7" "$OLD_CODE"
run "2 HA -> 2026.8, integration NOT updated   " "$HA8" "$OLD_CODE"
run "3 integration updated, HA stays 2026.7    " "$HA7" "$NEW_CODE"
run "4 integration updated, then HA -> 2026.8  " "$HA8" "$NEW_CODE"

# 5: the order a user hits when HA updates first and the integration follows.
echo
echo "== 5 HA -> 2026.8 first (broken), integration updated afterwards =="
fresh_copy
boot "$HA8" "$OLD_CODE" && node "$REPO/e2e/scenario-probe.mjs" probe "$PORT" "5a while still on the old integration      "
docker rm -f "$NAME" >/dev/null 2>&1
MSYS_NO_PATHCONV=1 docker run -d --name "$NAME" --network docker_ha-net -p "$PORT:8123" -e TZ=Europe/Berlin \
  -v "$WORK:/config" -v "$NEW_CODE:/config/custom_components" "$HA8" >/dev/null 2>&1
for _ in $(seq 1 60); do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:$PORT/api/onboarding" 2>/dev/null)
  [ "$code" != "000" ] && break
  sleep 5
done
sleep 25
node "$REPO/e2e/scenario-probe.mjs" probe "$PORT" "5b after updating the integration          "

# 6: integration first while still on 2026.7, then the HA update.
echo
echo "== 6 integration updated on 2026.7 first, then HA -> 2026.8 =="
fresh_copy
boot "$HA7" "$NEW_CODE" >/dev/null 2>&1
docker rm -f "$NAME" >/dev/null 2>&1
MSYS_NO_PATHCONV=1 docker run -d --name "$NAME" --network docker_ha-net -p "$PORT:8123" -e TZ=Europe/Berlin \
  -v "$WORK:/config" -v "$NEW_CODE:/config/custom_components" "$HA8" >/dev/null 2>&1
for _ in $(seq 1 60); do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:$PORT/api/onboarding" 2>/dev/null)
  [ "$code" != "000" ] && break
  sleep 5
done
sleep 25
node "$REPO/e2e/scenario-probe.mjs" probe "$PORT" "6 integration first, then HA               "

docker rm -f "$NAME" >/dev/null 2>&1
echo
echo "done"
