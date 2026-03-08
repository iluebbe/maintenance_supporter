# Changelog

All notable changes to Maintenance Supporter are documented in this file.

## [1.0.10] - 2026-03-08

### Fixed
- NFC tag empty string bypass: empty strings now normalised to `null`, preventing duplicate empty tags from bypassing uniqueness validation
- CSV import silent failures: failed object imports now reported in response with per-object error details (`errors` array)
- Budget cost type validation: non-numeric `cost` values in history entries no longer crash the budget endpoint
- Percentile calculation: replaced truncation with proper linear interpolation in entity analyzer
- Silent exception swallowing in NFC tag listing: added logging for tag registry errors
- TypeScript type gap: added `interval_anchor` to `TaskRow` interface and removed unnecessary `as any` cast

### Added
- 100 new tests across 12 new test files (coverage 94% → 96%, 1243 → 1343 tests)

## [1.0.9] - 2026-03-08

### Changed
- Removed CSV Export / CSV Import buttons from sidebar panel (import/export remains available via WebSocket API)

### Fixed
- Remove hardcoded tokens from tracked files
- Add missing return type annotations for mypy strict mode
- Prevent notification burst on HA restart
- Make calendar entity visible by default in HA calendar panel

### Added
- `seed_recorder.py`: 13 months of hourly recorder data for sparkline charts
- Auto-update of `configuration.yaml` initial values from seed data
- 51 new integration tests (entity removal, concurrent operations, error recovery, restart resilience, calendar)

## [1.0.6] - 2026-03-06

### Fixed
- Orphaned group references when deleting objects or tasks (all three deletion paths)
- State change trigger false positives on unavailable → same-state recovery
- Counter trigger baseline not persisted when initialized from state change event
- Task dialog not clearing trigger_config / interval_days when switching schedule type

### Added
- 10 new tests covering all 4 fixes (group cleanup, trigger edge cases)
- Coverage reporting in CI pipeline (`pytest-cov`)

## [1.0.5] - 2026-03-05

### Fixed
- Sensor stale attributes after reset; compound `trigger_value` reporting
- Timezone safety for date comparisons across all modules
- Trigger state loss on HA restart; compound merge logic
- Runtime drift when entity becomes unavailable mid-accumulation
- UI interval anchor selection not persisting

## [1.0.4] - 2026-03-04

### Added
- NFC "unlinked" badge in task header for tasks without NFC tags

### Fixed
- Empty meta card guard; unused import cleanup

## [1.0.3] - 2026-03-03

### Added
- Task meta display (manufacturer, model, area) in detail view
- NFC tag dropdown selector in task dialog
- `tags/list` WebSocket endpoint

### Fixed
- Compound proxy evaluation; state_change fallback path
- Adaptive validation edge cases; sparkline rendering
- Timezone bugs in date computations; data consistency gaps

## [1.0.2] - 2026-03-02

### Added
- Binary sensor platform (`device_class: problem`) — ON when overdue or triggered
- Interval anchoring (completion-based vs. planned-date)
- Entity attribute introspection for trigger setup

## [1.0.1] - 2026-03-01

### Fixed
- Trigger persistence on HA restart; prediction cap overflow
- Progress bar and QR code UX improvements

## [1.0.0] - 2026-02-28

### Added
- QR codes with embedded icons for mobile quick-actions
- NFC tag management in panel UI
- Browser back-button navigation within panel views
- Responsive mobile layout
- Merged Overview and Analysis tabs

### Fixed
- XSS in QR print view; deep-link hardening
- 12 backend + frontend bugs from comprehensive audit
- Security hardening across all input paths

## [0.3.17] - 2026-02-20

### Fixed
- French translation: month abbreviation "Aoû" → "Août"

## [0.3.16] - 2026-02-19

### Fixed
- Trigger cooldown after completion not resetting properly
- Confirm dialog UX improvements
- Batch statistics computation edge cases

## [0.3.15] - 2026-02-18

### Fixed
- Backend state-loss and race conditions
- Frontend lifecycle bugs in LitElement components

## [0.3.14] - 2026-02-17

### Fixed
- 12 frontend panel bug fixes (dialogs, navigation, rendering)
- Data consistency fixes; sensor predictor numerical stability

## [0.3.13] - 2026-02-16

### Added
- Global settings update and test notification via WebSocket

## [0.3.12] - 2026-02-15

### Fixed
- Trigger summary key; calendar locale formatting
- Diagnostics multi-entity display; store legacy merge

## [0.3.11] - 2026-02-14

### Added
- Custom task icons (any `mdi:*` icon via HA icon picker)
- NFC tag linking for task completion

### Fixed
- Notification delivery bug

## [0.3.10] - 2026-02-13

### Improved
- Budget + calendar caching for performance
- Robust notification parsing; instance-scoped registration

### Added
- Compound + repairs legacy fallback tests (16 tests)
- Legacy coordinator fallback path tests (7 tests)

## [0.3.9] - 2026-02-12

### Fixed
- mypy --strict errors in storage, sensor, __init__

## [0.3.8] - 2026-02-11

### Added
- Store and migration test suites (41 tests)
- Store migration logic; improved sensor attributes; async export

## [0.3.7] - 2026-02-10

### Added
- Quality Scale Gold compliance documentation

## [0.3.6] - 2026-02-09

### Added
- Comprehensive test suite — 95% coverage
- mypy --strict compliance

## [0.3.5] - 2026-02-08

### Added
- Go-back navigation for all config flow and options flow forms

## [0.3.4] - 2026-02-07

### Added
- Entity pre-population in trigger setup
- Compound trigger step translations

## [0.3.3] - 2026-02-06

### Added
- Back navigation in config flow
- Compound trigger detail view
- Options flow descriptions

## [0.3.2] - 2026-02-05

### Improved
- Config flow UX improvements

### Fixed
- Missing exceptions translations across all languages

## [0.3.0] - 2026-02-03

### Added
- Multi-entity triggers for all trigger types (any/all entity logic)
- Compound triggers with AND/OR logic
- Selective entity removal from multi-entity triggers

## [0.2.4] - 2026-02-01

### Added
- Configurable ON states for runtime trigger

## [0.2.1] - 2026-01-29

### Added
- Dutch, French, Italian, Spanish translations (backend + frontend)
- Notify service validation in config flow + test notification button

### Fixed
- Notification shows "?" instead of days when value is 0

## [0.2.0] - 2026-01-27

### Added
- Runtime trigger type for tracking accumulated operating hours
- Improved analysis tab empty state messages

### Fixed
- Manifest validation errors for HACS/hassfest compliance

## [0.1.0] - 2026-01-20

### Added
- Initial release
- Time-based and sensor-based maintenance scheduling
- Threshold, counter, and state change trigger types
- Adaptive scheduling with EWA, Weibull analysis, seasonal awareness
- Notification system with rate limiting and quiet hours
- Budget tracking
- Sidebar panel + Lovelace card
- Calendar integration
- Export/import (JSON, YAML, CSV)
- 6 task types, 20+ object templates
- English and German translations
