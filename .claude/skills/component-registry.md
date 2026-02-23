# Component Registry

## Layout Components
| Component | Path | Description |
|-----------|------|-------------|
| AppShell | `components/layout/AppShell.tsx` | Main app shell with sidebar + topbar |
| Sidebar | (inside AppShell) | Collapsible nav with Framer Motion |
| Topbar | (inside AppShell) | Search, theme toggle, user menu |

## Event Components
| Component | Path | Description |
|-----------|------|-------------|
| EventCommandCenter | `components/events/host/` | Host's management dashboard |
| AttendeeEventView | `components/events/attendee/` | Attendee's preparation hub |
| PublicEventPage | `components/events/viewer/` | Public share link page |
| EventHeroCard | `components/events/shared/` | Themed event header card |
| EventQRCode | `components/events/shared/` | QR code display |
| AddToCalendarMenu | `components/events/shared/` | Google/Outlook/Apple/.ics |
| EventRoleBadge | `components/events/shared/` | Host/Co-host/Attendee badge |

## Host Components
| Component | Path | Description |
|-----------|------|-------------|
| GuestManager | `components/events/host/` | Guest list + RSVP tracking |
| TaskBoard | `components/events/host/` | Planning checklist |
| BudgetTracker | `components/events/host/` | Expense tracking |
| TimelineEditor | `components/events/host/` | Day-of schedule |
| AnnouncementComposer | `components/events/host/` | Post updates |
| PhotoGallery | `components/events/host/` | Shared photos |

## Attendee Components
| Component | Path | Description |
|-----------|------|-------------|
| RSVPToggle | `components/events/attendee/` | Quick status change |
| PrepChecklist | `components/events/attendee/` | Preparation tasks |
| AISuggestions | `components/events/attendee/` | What to wear/bring |
| WhoIsGoing | `components/events/attendee/` | Attendee list |
| PostEventReflection | `components/events/attendee/` | Rate + reflect |

## Dashboard Components
| Component | Path | Description |
|-----------|------|-------------|
| StatsCards | `components/dashboard/` | Animated stat counters |
| EventsByTypeChart | `components/dashboard/` | Donut/pie chart |
| MonthlyTimeline | `components/dashboard/` | Area chart |
| UpcomingList | `components/dashboard/` | Next 5 events |

## AI Components
| Component | Path | Description |
|-----------|------|-------------|
| AIChatPanel | `components/ai/` | Slide-out chat panel |
| AIMessageBubble | `components/ai/` | Chat message with typing |
| ImageImportDialog | `components/ai/` | Upload image → extract event |

## shadcn/ui (Installed)
button, card, input, label, textarea, select, dialog, dropdown-menu, popover, tabs, badge, avatar, separator, scroll-area, sheet, skeleton, switch, tooltip, command, calendar, form, checkbox, radio-group, progress, alert-dialog
