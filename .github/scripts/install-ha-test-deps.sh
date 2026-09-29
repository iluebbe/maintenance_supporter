#!/usr/bin/env bash
# The Home Assistant test + type-check environment for one CI leg (#144).
#
#   latest  the newest pytest-homeassistant-custom-component, pinned EXACTLY:
#           it pins the newest core, betas included, which is how breaking
#           changes surface here before they reach a user. Pinned so that a
#           resolver unable to install it fails loudly instead of quietly
#           settling on an older core (pip's python_requires filtering once
#           type-checked against stale stubs that way).
#   stable  HA_STABLE_PHT, the pht-cc release matching the current stable core.
#
# holidays: the Workday integration's own dependency, so the real-`holidays`
# loop-safety tests (#87) run instead of skipping. voluptuous_serialize: HA
# 2026.9 stopped pulling it into the test env, but core still lazy-imports it
# for flow-schema serialization, which the options-flow test exercises.
set -euo pipefail
leg="${1:?usage: install-ha-test-deps.sh latest|stable}"
if [ "$leg" = "stable" ]; then
  pht="${HA_STABLE_PHT:?HA_STABLE_PHT is not set}"
else
  pht=$(curl -sf --retry 3 https://pypi.org/pypi/pytest-homeassistant-custom-component/json \
    | python -c 'import json, sys; print(json.load(sys.stdin)["info"]["version"])')
fi
python -m pip install --quiet uv
uv pip install --system pytest pytest-cov pytest-xdist "pytest-homeassistant-custom-component==$pht" \
  mypy babel pypdf holidays voluptuous_serialize
python -c 'import homeassistant.const as c; print("Home Assistant", c.__version__, "via pht-cc", "'"$pht"'")'
