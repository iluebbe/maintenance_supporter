#!/bin/bash
set -euo pipefail

LABEL="${1:-snapshot}"
SNAP_DIR="$(cd "$(dirname "$0")/.." && pwd)/snapshots"
CONFIG_DIR="$(cd "$(dirname "$0")/.." && pwd)/config-dev"

mkdir -p "$SNAP_DIR"

SNAP_FILE="$SNAP_DIR/snap-${LABEL}-$(date +%Y%m%d-%H%M%S).tar.gz"

echo "Stopping ha-dev for consistent snapshot..."
docker stop ha-dev

echo "Creating snapshot: $SNAP_FILE"
tar czf "$SNAP_FILE" \
  --exclude='deps' \
  --exclude='__pycache__' \
  --exclude='home-assistant.log' \
  -C "$CONFIG_DIR" .

echo "Starting ha-dev..."
docker start ha-dev

echo "Snapshot saved: $SNAP_FILE"
