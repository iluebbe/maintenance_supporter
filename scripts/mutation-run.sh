#!/usr/bin/env bash
# Mutation-testing audit over the pure-logic helpers (periodic, NOT a CI gate).
#
# Runs scripts/mutation_check.py inside the ha-maint dev container on a WORK
# COPY under /tmp — the bind-mounted repo is never mutated, so an aborted run
# can't leave a mutant behind in the working tree.
#
#   ./scripts/mutation-run.sh              # all targets
#   ./scripts/mutation-run.sh status       # only modules matching "status"
#
# The JSON report lands in .mutation/report-<utc-timestamp>.json (gitignored).
set -euo pipefail
cd "$(dirname "$0")/.."

ONLY="${1:-}"
STAMP="$(date -u +%Y%m%d-%H%M%S)"
mkdir -p .mutation

# scripts/ is NOT part of the container bind mount — copy the two files in.
MSYS_NO_PATHCONV=1 docker exec ha-maint sh -c "rm -rf /tmp/mutwork && mkdir -p /tmp/mutwork/scripts"
docker cp scripts/mutation_check.py ha-maint:/tmp/mutwork/scripts/
docker cp scripts/mutation_targets.json ha-maint:/tmp/mutwork/scripts/

MSYS_NO_PATHCONV=1 docker exec ha-maint sh -c "
  cd /config &&
  cp -r custom_components tests pytest.ini pyproject.toml /tmp/mutwork/ &&
  cd /tmp/mutwork &&
  python scripts/mutation_check.py \
    --targets scripts/mutation_targets.json \
    --report /tmp/mutwork/report.json \
    ${ONLY:+--only $ONLY}
"
MSYS_NO_PATHCONV=1 docker exec ha-maint cat /tmp/mutwork/report.json > ".mutation/report-$STAMP.json"
echo "report: .mutation/report-$STAMP.json"
