# Update: v1.0.21

Quick patch — one fix and some infrastructure cleanup.

## Threshold Timer Restart Recovery (v1.0.21)

The `trigger_for_minutes` timer on threshold triggers now survives HA restarts. Previously, if your HVAC airflow had been below threshold for 25 of the required 30 minutes and HA restarted, the timer would reset to zero. Now the exceeded-since timestamp is persisted — after restart, the trigger either fires immediately (if enough time has passed) or resumes the timer with the remaining duration.

## Misc

- `hass.is_running` guards prevent store writes during shutdown
- mypy CI fixed for Python 3.14 namespace-package resolution
- 1,429 tests, 96% coverage

## Update

1. **HACS** → **Integrations** → find Maintenance Supporter → **Update**
2. **Restart HA**

(If HACS doesn't show the update yet: three-dot menu → "Recheck repositories")

Bug reports / feature requests: [GitHub Issues](https://github.com/iluebbe/maintenance_supporter/issues)
