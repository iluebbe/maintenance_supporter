# Security policy

## Reporting a vulnerability

If you find a security issue, **please do not open a public GitHub issue.**

Use [GitHub's private vulnerability reporting](https://github.com/iluebbe/maintenance_supporter/security/advisories/new) instead. That keeps the report private until a fix is ready, and lets me coordinate a release.

If you can't use that channel, you can email `iluebbe@gmail.com` with `[Maintenance Supporter security]` in the subject.

## What counts as a security issue

This integration runs inside a user's Home Assistant instance with admin privileges. Anything that would let an attacker:

- Bypass HA's auth on a WebSocket command of this integration
- Persist data they shouldn't be able to (config-entry pollution, store bloat)
- Cause HA to crash or hang via crafted input
- Leak data from outside this integration's domain
- Execute arbitrary code via a config-flow / WS payload

…is in scope. Bugs in the demo/seed scripts (`scripts/seed_history.py` etc.) are out of scope — those run only in dev environments.

## Response timeline

I'll acknowledge a private report within 7 days and aim to ship a fix within 30 days for medium-severity issues, faster for critical ones. If the issue is in a downstream library (HA core, voluptuous, etc.) I'll redirect to the right project and note that in the response.

## Hardening already in place

For context, the integration already includes (as of v1.0.39 onwards):

- Length caps and range limits on every WebSocket input string
- `interval_days` upper bound (max 3650) to prevent `timedelta` overflow
- CSV / JSON import sanitisation (formula-injection prefix, malformed-row drop, length caps)
- Defensive truncation in every config-flow save handler (`helpers/sanitize.py`)
- Strict allow-list for trigger config + global settings keys
- `_check_nfc_tag_duplicate` for cross-task NFC collision
- `_is_safe_url` rejects `javascript:` etc. for documentation_url

## Versions covered

Only the latest published version. Older versions are not patched.
