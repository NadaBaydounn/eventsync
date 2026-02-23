# Skill: Design System & UI Guidelines

## Color System
- Primary: Indigo (#6366F1) — customizable by user
- Background: White (light) / #0a0a0a (dark)
- Cards: White (light) / #111111 (dark)
- Muted: #f5f5f5 (light) / #262626 (dark)
- Destructive: Red (#ef4444)

## Typography
- **Headings**: Plus Jakarta Sans (font-heading)
- **Body**: Inter (font-sans)
- **Code**: JetBrains Mono (font-mono)
- Scale: text-xs(12) → text-sm(14) → text-base(16) → text-lg(18) → text-xl(20) → text-2xl(24) → text-3xl(30)

## Spacing
- Cards: p-6 (24px padding)
- Sections: space-y-6 (24px gap)
- List items: space-y-2 or space-y-4
- Page padding: px-6 py-8
- Sidebar width: 256px (collapsed: 64px)

## Border Radius
- Cards: rounded-xl (12px)
- Buttons: rounded-lg (8px)
- Inputs: rounded-md (6px)
- Badges: rounded-full
- Avatars: rounded-full

## Shadows
- Cards: shadow-sm hover:shadow-md
- Modals: shadow-xl
- Dropdowns: shadow-lg
- Floating buttons: shadow-lg hover:shadow-xl

## Animation Guidelines
- Page transitions: 300ms ease
- Hover effects: 200ms
- Modal enter: spring (stiffness 300, damping 30)
- Sidebar collapse: spring (stiffness 400, damping 40)
- Stagger children: 60ms delay
- Don't animate everything — be intentional

## Glassmorphism (used sparingly)
```css
.glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(24px);
}
```

## Responsive Breakpoints
- Mobile: < 768px (sidebar hidden, stack layout)
- Tablet: 768px - 1024px (sidebar collapsed)
- Desktop: > 1024px (full sidebar)

## Accessibility
- All interactive elements keyboard-focusable
- Color contrast: WCAG AA minimum
- Use `getContrastText()` from colors.ts for text on colored backgrounds
- Alt text on images
- aria-label on icon-only buttons
