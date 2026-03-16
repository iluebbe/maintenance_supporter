# Update: v1.0.20

Small update — a few things happened since the original post.

## Notifications (v1.0.20)

Annoying one first: tapping "Complete" or "Skip" on a notification worked, but the notification itself wouldn't go away. Now it does — action buttons dismiss the notification properly.

Tapping the notification now also opens the task directly in the panel (browser + Companion App deep-link), and you won't get a duplicate reminder right after completing/skipping from a notification.

## HA 2026.3 Dialog Fix (v1.0.19)

If you're on HA 2026.3 and dialogs looked broken (no title, no buttons) — that's fixed since v1.0.19. HA changed the dialog internals, took me a bit to catch it.

Also: the minimum HA version was wrong in the manifest (said 2025.1.0, should've been **2025.7.0**). Corrected now. If you're on 2025.7+ you're good.

## Misc

- **Portuguese** is in since v1.0.17 (7 languages now)
- 1,421 tests, 96% coverage

## Update

1. **HACS** → **Integrations** → find Maintenance Supporter → **Update**
2. **Restart HA**

(If HACS doesn't show the update yet: three-dot menu → "Recheck repositories")

Bug reports / feature requests: [GitHub Issues](https://github.com/iluebbe/maintenance_supporter/issues)
