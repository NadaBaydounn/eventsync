# Skill: Testing & Quality Assurance

## Manual Testing Checklist

### Auth Flow
- [ ] Register with new email → profile created → redirect to /calendar
- [ ] Login with existing email → session created → redirect to /calendar
- [ ] Invalid credentials → error toast shown
- [ ] Sign out → redirect to /login
- [ ] Access /calendar without auth → redirect to /login

### Event CRUD
- [ ] Create event with all fields → saved to DB → appears on calendar
- [ ] Edit event → changes persisted → reflected in all views
- [ ] Delete event → removed from DB → removed from calendar
- [ ] Event type selection → theme changes (colors, emoji, animation)

### Calendar
- [ ] Month/week/day/list views render correctly
- [ ] Events color-coded by type
- [ ] Click event → navigates to detail page
- [ ] Click empty slot → navigates to new event with date pre-filled

### AI Features
- [ ] Chat panel opens/closes
- [ ] Send message → Gemini responds with streamed text
- [ ] "Add dinner Friday 7pm" → event creation offered
- [ ] Image upload → event data extracted

### Share Links
- [ ] Generate share link → unique URL created
- [ ] Open share URL logged out → public page renders
- [ ] RSVP from public page → saved to DB
- [ ] QR code displays and is scannable

### Theme
- [ ] Dark/light/system toggle works
- [ ] Custom color → entire app re-themes
- [ ] Theme persists across page navigations

## TypeScript Quality
```bash
# Check for type errors
npx tsc --noEmit

# Check for lint errors
npm run lint
```

## Build Verification
```bash
# Full production build
npm run build

# Test production locally
npm start
```
