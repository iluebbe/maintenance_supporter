# Update: v1.0.19

Quick update — **v1.0.19** is out with a fix that matters if you're running (or planning to upgrade to) **HA 2026.3+**.

## HA 2026.3+ Dialog Compatibility

HA 2026.3 introduced a breaking change to `ha-dialog` internals — dialog titles and action buttons moved from dedicated slots into the content area. This caused Maintenance Supporter's dialogs (task editing, QR codes, confirmations, etc.) to render without titles or buttons on 2026.3+. **v1.0.19 fixes this** — dialogs now render correctly on both older HA versions and 2026.3+.

If you updated HA to 2026.3 and noticed broken dialogs in the panel, this is the fix.

## Minimum HA Version Corrected to 2025.7.0

The previously listed minimum of HA 2025.1.0 was wrong — the integration uses `StaticPathConfig` and `async_register_static_paths`, which were introduced in HA 2025.7. On older versions, the integration would crash on load. The manifest and docs now correctly state **2025.7.0** as the minimum. If you're on 2025.7+ you're fine; no action needed.

## Code Quality

Test suite is at **1,416 tests** with 96% coverage. v1.0.18 also cleaned up test internals (no user-facing changes).

## How to Update

1. Open **HACS** > **Integrations**
2. Find Maintenance Supporter and click **Update** (or hit the three-dot menu > "Recheck repositories" if you don't see it yet)
3. **Restart Home Assistant**

That's it. As always — bug reports and feature requests welcome on [GitHub Issues](https://github.com/iluebbe/maintenance_supporter/issues).
