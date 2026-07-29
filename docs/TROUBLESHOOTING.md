# Troubleshooting & Known Limitations

## Troubleshooting

### Trigger Not Activating

1. Verify the `trigger_entity` is correct — check **Developer Tools > States** for the entity ID, and confirm the source entity has a usable state there
2. Check per-entity availability (`available`, `unavailable`, `missing`, `startup`) — this is the `trigger_entity_state` live value shown on the task in the panel (it comes from the WebSocket `subscribe` feed, not from a sensor attribute). `startup` is the 5-minute grace period after a Home Assistant restart: the source integration may not have published its states yet, so nothing is flagged as missing until the grace period is over — wait it out before troubleshooting further
3. For threshold triggers with `trigger_for_minutes` > 0, the condition must hold continuously for that duration
4. For compound triggers, check each sub-condition's status individually on the task in the panel

### Notifications Not Arriving

1. Verify `notifications_enabled` is `true` and `notify_service` is set to a valid service (e.g., `notify.mobile_app_phone`)
2. Check quiet hours — notifications are suppressed between `quiet_hours_start` and `quiet_hours_end`
3. Check `max_notifications_per_day` — set to 0 for unlimited
4. Use **Test Notification** in the global options to verify the service works
5. Check the per-status enable toggles (`notify_due_soon_enabled`, etc.)

### Sidebar Panel Not Visible

1. Ensure `panel_enabled` is `true` in global settings (it defaults to `true`)
2. **No restart needed** — the panel is registered / unregistered the moment the option changes. If the sidebar entry is still missing, reload the page first
3. Clear browser cache (Ctrl+Shift+F5) — a cached frontend is the usual reason the entry doesn't appear

### Dashboard Strategy: "Timeout waiting for strategy element ll-strategy-dashboard-maintenance-supporter to be registered"

Symptom: the strategy entry shows up under **Settings → Dashboards → Add dashboard → Community dashboards**, but clicking it does nothing or throws the timeout error in the browser console.

Cause: the browser cached the old `index.html` from before the integration was updated, so it still references the old strategy module URL.

Fix: **hard-reload the browser** (`Ctrl+Shift+F5` or `Cmd+Shift+R` on macOS). This drops the cached HTML and loads the current strategy bundle. A regular `F5` is not enough — the browser will reuse the cached page.

### Mobile Action Buttons Missing

1. Enable action buttons in **Notification Actions** settings (`action_complete_enabled`, etc.)
2. Verify you are using the HA Companion App (action buttons require the mobile app notification platform)

### Damaged Storage File

Each object stores its dynamic state (history, last-performed dates, trigger
runtime) in `.storage/maintenance_supporter.<entry_id>`. If such a file is
damaged — hand-edited, truncated by a crash, or restored incompletely — the
integration still boots: syntactically broken files are quarantined by Home
Assistant itself, and structurally wrong content (wrong-typed sections) is
dropped with a warning in the log. Affected tasks degrade to "never
performed" instead of failing the whole object; task configuration itself is
unaffected (it lives in the config entry, not this file).

### Debug Logging

Add to `configuration.yaml` and restart:

```yaml
logger:
  logs:
    custom_components.maintenance_supporter: debug
```


## Known Limitations

- **Adaptive scheduling**: EWA requires 2+ completions, suggestions appear after 3+, Weibull analysis requires 5+ completions, seasonal adjustment requires 6+ months of history spread across different months
- **Sensor prediction**: Degradation rate analysis requires 10+ hourly recorder data points (approximately 10+ hours of data)
- **Runtime trigger**: Accumulated hours are persisted every 5 minutes. Up to 5 minutes of runtime may be lost on an unclean shutdown or crash
- **Compound triggers**: No nesting — a compound trigger cannot contain another compound trigger as a condition
- **Threshold debounce**: `trigger_for_minutes` timers are persisted and restored across HA restarts; however, the remaining duration is computed from wall-clock time, so large NTP jumps could cause premature or delayed triggering
- **Budget tracking**: Numeric values only — the currency symbol is set in **General Settings** (1.4.9+, previously under Budget Settings; default: €). **18 currencies** supported (1.4.8+; NZD in 2.25): EUR, USD, GBP, JPY, CHF, CAD, AUD, NZD, CNY, INR, BRL, CZK, PLN, RUB, SEK, NOK, DKK, UAH
- **Spare parts** (2.23+): a "Buy …" task only creates itself when the part has **auto-create buy task** enabled, a **reorder threshold** set, and a **tracked stock** (a part without a stock value is a catalog-only entry — its stock sensor reads `unavailable` by design). Each part is owned by one object, but a task on **any** object can draw on it (2.44+) — pick it under *Parts from other objects* in the task dialog, and the one stock, threshold and "Buy …" reminder serve everyone. Two objects only keep independent stocks if you deliberately give each its own part
- **History pruning**: Maximum 500 history entries per task. When the limit is reached, sensor-trigger noise (trigger activated/cleared entries) is dropped first, oldest-first — completions, skips and resets are only pruned when the history is full of real actions
- **Duplicate completions**: two Complete actions for the same task arriving within 30 seconds (e.g. two household members tapping at once) are treated as one real-world action — one history entry, one rotation step. A deliberate second completion later than that counts normally, and a reset or skip in between always re-arms immediately
- **Panel visibility**: Changing the `panel_enabled` toggle takes effect immediately (no restart required)


## Uninstalling

1. Go to **Settings > Devices & Services > Maintenance Supporter**
2. Click the three-dot menu on each object entry and the global entry, then select **Delete**
3. Remove the `custom_components/maintenance_supporter/` directory from your HA config folder
4. Restart Home Assistant

> **Note:** Recorder history (entity state history in the HA database) is not automatically removed. To purge it, use the `recorder.purge_entities` service targeting this integration's entities (in the UI you can pick the Maintenance Supporter device or select the entities directly — they follow the `sensor.<object>_<task>` naming described under [Entity naming](#entity-naming)).

**Reinstalling later** is a documented fresh start: re-adding the integration
(even in the same Home Assistant run, without a restart) gives a clean install
— nothing from the previous life is restored. To carry your data across,
export it (Settings → Export in the panel) before uninstalling and import the
file after reinstalling; the export round-trips objects, tasks, history and
document metadata completely.
