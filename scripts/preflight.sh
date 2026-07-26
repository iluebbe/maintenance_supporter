#!/usr/bin/env bash
# Preflight — the exact CI gates as ONE command (roadmap regression guard 4).
#
# "Local green ≠ CI green" kept biting because each gate had to be remembered
# and typed individually (mypy flags, the ruff pin, the coverage command).
# This replicates the Tests workflow's checks in CI order-of-cost:
#
#   1. ruff        (container — same pinned version CI installs)
#   2. tsc         (frontend-src, --noEmit; baseline 0, blocking)
#   3. mypy        (container, the exact CI invocation incl. mypy.ini)
#   4. esbuild     (bundle must build; content-hashed chunks stay identical
#                   when sources are unchanged, so no tree noise)
#   5. wtr         (frontend unit tests)
#   6. pytest      (container, the exact CI command incl. coverage gate;
#                   ~8 min — skip with PREFLIGHT_SKIP_PYTEST=1 for quick loops)
#
# NOT covered: the CI E2E-lifecycle job (needs a throwaway HA + xvfb; run
# e2e/live-overflow-sweep.mjs and the relevant live-*.mjs scripts instead)
# and hassfest/HACS validation (the Validate workflow).
#
# GOTCHA (memory 2026-07-18): after many back-to-back suite runs a fatigued
# ha-maint container can lose xdist coverage-worker data and read 0.2–0.5 %
# LOW. If the coverage gate fails in untouched files: docker restart ha-maint
# and re-run before trusting the number.
#
# Usage:  bash scripts/preflight.sh            # everything
#         PREFLIGHT_SKIP_PYTEST=1 bash scripts/preflight.sh

set -u
cd "$(dirname "$0")/.."

FAILED=()
step() {
  local name="$1"; shift
  echo ""
  echo "── ${name} ──────────────────────────────────────────"
  if "$@"; then
    echo "✔ ${name}"
  else
    echo "✘ ${name}"
    FAILED+=("${name}")
  fi
}

in_container() { docker exec ha-maint sh -c "cd /config && $*"; }

step "ruff (pinned, CI scope)" \
  in_container "ruff check custom_components/maintenance_supporter/ tests/"

step "tsc --noEmit" \
  bash -c 'cd custom_components/maintenance_supporter/frontend-src && npx tsc --noEmit'

# mypy is WARNING-ONLY: CI installs the LATEST HA (via
# pytest-homeassistant-custom-component) while the container pins the image's
# HA — identical mypy versions still disagree on HA's own type surface. A ⚠
# here needs CI confirmation before you chase it; CI stays authoritative.
step_warn() {
  local name="$1"; shift
  echo ""
  echo "── ${name} ──────────────────────────────────────────"
  if "$@"; then echo "✔ ${name}"; else echo "⚠ ${name} (warning-only — confirm against CI)"; fi
}
step_warn "mypy (CI invocation; container HA may lag CI's)" \
  in_container "python -m mypy custom_components/maintenance_supporter/ --config-file mypy.ini"

step "esbuild" \
  bash -c 'cd custom_components/maintenance_supporter/frontend-src && node esbuild.mjs'

step "web-test-runner" \
  bash -c 'cd custom_components/maintenance_supporter/frontend-src && npm test'

if [ "${PREFLIGHT_SKIP_PYTEST:-0}" != "1" ]; then
  # Coverage reads systematically LOWER in the container than in CI: CI
  # installs `holidays`, so the Workday loop-safety tests RUN there instead
  # of skipping (plus env differences). Measured baseline 2026-07-26: local
  # 97.54 % on a FRESH container while the same commit is green in CI.
  # Policy: test failures always fail; coverage < 97.5 % fails; the
  # 97.5–98 % band is a warning with CI staying authoritative. If coverage
  # drops in files you did not touch, suspect a FATIGUED container first
  # (docker restart ha-maint) — known to lose xdist worker data.
  echo ""
  echo "── pytest + coverage (CI command, ~8 min) ──────────────────────────"
  PYTEST_OUT=$(in_container "python -m pytest tests/ -n auto --dist loadfile --cov=custom_components/maintenance_supporter --cov-report=term-missing --cov-fail-under=98" 2>&1)
  PYTEST_RC=$?
  echo "$PYTEST_OUT" | tail -3
  COV=$(echo "$PYTEST_OUT" | grep -oE "Total coverage: [0-9.]+" | grep -oE "[0-9.]+" | tail -1)
  if [ "$PYTEST_RC" -eq 0 ]; then
    echo "✔ pytest + coverage"
  elif ! echo "$PYTEST_OUT" | grep -qE "^(FAILED|ERROR)|[0-9]+ (failed|error)"; then
    if [ -n "$COV" ] && awk "BEGIN{exit !($COV >= 97.5)}"; then
      echo "⚠ coverage ${COV}% is in the 97.5–98% band (CI authoritative — it runs the holidays-gated tests)"
    else
      echo "✘ coverage ${COV:-?}% below 97.5%"
      FAILED+=("coverage")
    fi
  else
    echo "✘ pytest (test failures)"
    FAILED+=("pytest")
  fi
else
  echo ""
  echo "── pytest SKIPPED (PREFLIGHT_SKIP_PYTEST=1) — run before pushing!"
fi

echo ""
if [ "${#FAILED[@]}" -gt 0 ]; then
  echo "PREFLIGHT FAILED: ${FAILED[*]}"
  exit 1
fi
echo "PREFLIGHT GREEN$([ "${PREFLIGHT_SKIP_PYTEST:-0}" = "1" ] && echo ' (pytest skipped)')"
