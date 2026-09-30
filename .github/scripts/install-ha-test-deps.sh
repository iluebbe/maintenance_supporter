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
#   minimum HA_MIN_PHT, the pht-cc release of the oldest core hacs.json
#           declares — a declared minimum nothing tests is a guess.
#
# holidays: the Workday integration's own dependency, so the real-`holidays`
# loop-safety tests (#87) run instead of skipping. voluptuous_serialize: HA
# 2026.9 stopped pulling it into the test env, but core still lazy-imports it
# for flow-schema serialization, which the options-flow test exercises.
set -euo pipefail
leg="${1:?usage: install-ha-test-deps.sh latest|stable|minimum}"
if [ "$leg" = "stable" ]; then
  pht="${HA_STABLE_PHT:?HA_STABLE_PHT is not set}"
elif [ "$leg" = "minimum" ]; then
  pht="${HA_MIN_PHT:?HA_MIN_PHT is not set}"
else
  pht=$(curl -sf --retry 3 https://pypi.org/pypi/pytest-homeassistant-custom-component/json \
    | python -c 'import json, sys; print(json.load(sys.stdin)["info"]["version"])')
fi
python -m pip install --quiet uv
uv pip install --system pytest pytest-cov pytest-xdist "pytest-homeassistant-custom-component==$pht" \
  mypy types-PyYAML babel pypdf holidays voluptuous_serialize
# hassil + home-assistant-intents: the Assist collision tests run our
# sentences next to Home Assistant's built-in ones, at exactly the versions
# this core's conversation integration pins (voice audit 2026-09-30).
conversation_reqs=$(python -c 'import json, pathlib, homeassistant.components as c; print(" ".join(json.loads((pathlib.Path(c.__path__[0]) / "conversation" / "manifest.json").read_text())["requirements"]))')
uv pip install --system $conversation_reqs
python -c 'import homeassistant.const as c; print("Home Assistant", c.__version__, "via pht-cc", "'"$pht"'")'
