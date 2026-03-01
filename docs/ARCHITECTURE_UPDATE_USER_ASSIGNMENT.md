# ARCHITECTURE.md Update - Responsible User Assignment Feature

## Summary

Added comprehensive documentation for the **Responsible User Assignment** feature to ARCHITECTURE.md. This feature allows assigning Home Assistant users as responsible persons for maintenance tasks, with dedicated notification capabilities.

## Changes Made

### 1. High-Level Architecture Diagram
- Updated WS API count from "18+ commands" to "20+ commands"
- Added "user assignment" to WS API capabilities
- Added "user-specific" to Notification Manager features
- Added "user filter" to Frontend Panel views

### 2. New Section: "Responsible User Assignment"
Location: After "Notification System" section

**Content includes:**
- **Data Model**: `responsible_user_id` field in MaintenanceTask
- **Features**: 6 key capabilities (selection, notifications, fallback, UI display, filtering, calendar)
- **Notification Flow**: Detailed flowchart showing how user-specific notifications work
- **WebSocket API Extensions**: 3 new/extended commands
  - `task/assign_user` - Assign/unassign user
  - `tasks/by_user` - List tasks by user
  - Extended `task/create` and `task/update` to accept `responsible_user_id`
- **Frontend Components**: 4 new UI elements
  - User Selector Dialog
  - Task Card Badge
  - Filter Dropdown
  - Assignment History
- **Use Cases**: 5 real-world scenarios demonstrating value

### 3. Updated Sections

**WebSocket API Table:**
- Added "User Assignment" category with `task/assign_user`
- Added `tasks/by_user` to Read category
- Updated total count to "20+ commands"

**File Structure:**
- Updated `maintenance_task.py` description to include "responsible user"

**Panel Views:**
- Added "user filter" to Overview
- Added "responsible user badges" to Object Detail
- Added "responsible user display" to Task Detail

**Dialogs:**
- Added "responsible user assignment" to Task create/edit
- Added new "User selection" dialog

**Extensibility:**
- Added 4-point guide for implementing user assignment extensions

**Version:**
- Updated from 0.1.0 to 0.2.0 (matches current development state)

## Feature Documentation Structure

```
## Responsible User Assignment
├── Data Model (Python code example)
├── Features (6 bullet points)
├── Notification Flow (flowchart)
├── WebSocket API Extensions (TypeScript code examples)
├── Frontend Components (4 components)
└── Use Cases (5 scenarios)
```

## Technical Details Documented

### Notification Flow
```
Task becomes due
  └─> Check responsible_user_id
      ├─> If set: Send to user's notification services
      │   └─> Log separately from global notifications
      └─> If not set: Use global notification settings
      └─> Apply quiet hours, bundling, daily limits per user
```

### Data Integration Points
- **hass.auth**: User registry for user lookup and validation
- **NotificationManager**: Extended to handle per-user notification routing
- **Coordinator**: Task data includes user assignment
- **WebSocket**: New commands for user operations
- **Frontend**: User selector, filters, badges

## Implementation Guidance

The documentation provides clear implementation paths:
1. **Backend**: Add `responsible_user_id` to task model, extend notification logic
2. **API**: Implement 3 new/extended WS commands
3. **Frontend**: Create user selector component, add filtering, display badges
4. **Testing**: Unit tests for user assignment, notification routing, API commands

## Benefits Documented

**For Users:**
- Clear responsibility tracking
- Targeted notifications (no spam for irrelevant tasks)
- Workload distribution visibility
- Multi-user household support

**For Developers:**
- Clear API contract
- Integration with HA's user system
- Extensible notification system
- Well-defined data model

## File Location

[ARCHITECTURE.md](C:\Users\ilueb\OneDrive\Programming\maintenance-dev\ARCHITECTURE.md)

## Next Steps for Implementation

1. **Data Model**: Add `responsible_user_id: str | None` to `MaintenanceTask` class
2. **WebSocket**: Implement `task/assign_user` and `tasks/by_user` handlers
3. **Notifications**: Extend `NotificationManager.schedule_notifications()` to check user assignment
4. **Frontend**: Create user selector component using HA's user registry API
5. **UI**: Add user badge to task cards and user filter to overview
6. **Tests**: Add test coverage for user assignment and notification routing
