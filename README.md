# Maintenance Supporter

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/v/release/iluebbe/maintenance_supporter)](https://github.com/iluebbe/maintenance_supporter/releases)

A Home Assistant custom integration for tracking and managing maintenance tasks across your devices and equipment. Schedule time-based or sensor-triggered maintenance, get notifications when tasks are due, and keep a complete maintenance history — with adaptive scheduling that learns from your patterns.

## Features

### Task Management
- Create maintenance objects (devices, equipment, appliances) and assign tasks to them
- Six task types: cleaning, inspection, replacement, calibration, service, custom
- Three scheduling modes: **time-based** (interval in days), **sensor-based** (triggered by entity state), **manual**
- Task status tracking: OK, Due Soon, Overdue, Triggered
- Assign tasks to responsible Home Assistant users with per-user notification routing
- Checklists for multi-step procedures
- Task grouping for logical organization

### Sensor-Based Triggers
- **Threshold**: trigger when a sensor value exceeds or falls below a limit (with optional duration)
- **Counter**: trigger when accumulated value reaches a target (absolute or delta mode)
- **State change**: trigger after a number of state transitions (e.g., on/off cycles)
- **Runtime**: trigger after accumulated operating hours (e.g., 500h of compressor runtime)
- Automatic entity availability tracking with grace periods
- Repair issues for missing or unavailable trigger entities (replace / remove / dismiss)

### Adaptive Scheduling
- Learns from your maintenance history using Exponential Weighted Averaging (EWA)
- Weibull reliability analysis for failure prediction (after 5+ completions)
- Seasonal awareness with hemisphere detection and per-month multipliers
- Environmental correlation with external sensors (temperature, humidity, etc.)
- Sensor degradation rate analysis and threshold prediction
- User feedback loop (needed / not needed / not sure) to improve recommendations

### Notifications
- Configurable notification service (any `notify.*` service)
- Per-user notifications for tasks with a responsible user assigned
- Rate limiting per status level (due soon, overdue, triggered)
- Quiet hours support
- Notification bundling (group multiple due tasks into one message)
- Daily notification limits
- Mobile actionable notifications via Companion App: Complete, Skip, Snooze

### Budget Tracking
- Monthly and yearly maintenance budgets
- Cost tracking per task completion
- Budget alerts at configurable thresholds

### Data Management
- Export/import via JSON, YAML, CSV
- QR code generation for mobile quick-actions (print, download SVG)
- Complete maintenance history with cost, duration, and feedback tracking
- Integration diagnostics with PII redaction

### Frontend
- **Sidebar panel** with dashboard overview, object details, task history, and analytics
- **Lovelace card** for dashboard integration
- **Calendar** integration with status-emoji events
- Real-time updates via WebSocket subscription (no polling)
- User filter to show only your assigned tasks
- Localized UI: English, German, Dutch, French, Italian, Spanish

### WebSocket API
- 20+ commands for full CRUD operations on objects, tasks, and triggers
- Real-time subscription for live updates
- User assignment and listing
- Statistics, budget status, and interval analysis
- See [Architecture](docs/ARCHITECTURE.md) for the complete command reference

## Installation

### HACS (Recommended)

1. Open HACS in Home Assistant
2. Click the three dots menu (top right) and select **Custom repositories**
3. Add `https://github.com/iluebbe/maintenance_supporter` as an **Integration**
4. Search for "Maintenance Supporter" and install it
5. Restart Home Assistant

### Manual

1. Copy `custom_components/maintenance_supporter/` to your `config/custom_components/` directory
2. Restart Home Assistant

## Configuration

1. Go to **Settings > Devices & Services > Add Integration**
2. Search for "Maintenance Supporter"
3. Follow the setup wizard to configure global settings
4. Add maintenance objects and tasks through the sidebar panel or config flow

## Services

| Service | Description |
|---------|-------------|
| `maintenance_supporter.complete` | Mark a task as complete (with optional notes, cost, duration) |
| `maintenance_supporter.reset` | Reset a task's last performed date |
| `maintenance_supporter.skip` | Skip the current maintenance cycle |
| `maintenance_supporter.export_data` | Export all maintenance data |

## Entities

Each maintenance task creates:
- A **sensor** entity with state: `ok`, `due_soon`, `overdue`, or `triggered`
- Attributes include days until due, interval, last performed date, and trigger status

Each maintenance object creates:
- A **calendar** entity with events for upcoming maintenance dates

## Requirements

- Home Assistant 2025.1.0 or newer
- No external dependencies required

## License

MIT
