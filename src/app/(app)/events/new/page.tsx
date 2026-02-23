'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
  MapPin,
  Link2,
  DollarSign,
  Loader2,
  ChevronLeft,
  Video,
  Globe,
  ChevronDown,
} from 'lucide-react'

import { useEvents } from '@/lib/hooks/useEvents'
import {
  EVENT_THEMES,
  getEventTheme,
} from '@/lib/constants/event-themes'
import {
  pageVariants,
  eventAnimations,
} from '@/lib/constants/animations'
import { eventFormSchema } from '@/lib/validators/event'
import type { EventFormData } from '@/types/events'
import { getDefaultEventTimes } from '@/lib/utils/dates'
import { EVENT_TYPES, EVENT_STATUSES, PRIORITIES, VISIBILITIES } from '@/types/events'
import type { EventType } from '@/types/events'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

/* ─── Theme-specific extra fields per event type ─── */
const THEME_FIELDS: Record<
  EventType,
  Array<{ id: string; label: string; placeholder: string; type: 'text' | 'textarea' }>
> = {
  party: [
    { id: 'dress_code', label: 'Dress Code', placeholder: 'Casual, Semi-formal, Costume...', type: 'text' },
    { id: 'theme_party', label: 'Party Theme', placeholder: 'e.g., 80s Night, Tropical...', type: 'text' },
    { id: 'byob', label: 'Food & Drinks', placeholder: 'BYOB, Catered, Potluck...', type: 'text' },
  ],
  educational: [
    { id: 'instructor', label: 'Instructor / Speaker', placeholder: 'Name of instructor or speaker', type: 'text' },
    { id: 'materials', label: 'Materials Needed', placeholder: 'Notebook, laptop, textbook...', type: 'text' },
    { id: 'topic', label: 'Topic / Subject', placeholder: 'What will be covered?', type: 'text' },
  ],
  trip: [
    { id: 'destination', label: 'Destination', placeholder: 'Where are you going?', type: 'text' },
    { id: 'transportation', label: 'Transportation', placeholder: 'Flight, car, train...', type: 'text' },
    { id: 'packing_notes', label: 'Packing Notes', placeholder: 'What to pack...', type: 'textarea' },
  ],
  business: [
    { id: 'agenda', label: 'Meeting Agenda', placeholder: 'Key discussion points...', type: 'textarea' },
    { id: 'dress_code', label: 'Dress Code', placeholder: 'Business casual, formal...', type: 'text' },
    { id: 'attendees_expected', label: 'Expected Attendees', placeholder: 'Number of attendees', type: 'text' },
  ],
  sports: [
    { id: 'sport_type', label: 'Sport / Activity', placeholder: 'Basketball, yoga, running...', type: 'text' },
    { id: 'fitness_level', label: 'Fitness Level', placeholder: 'Beginner, Intermediate, Advanced', type: 'text' },
    { id: 'equipment', label: 'Equipment Needed', placeholder: 'Bring your own mat, shoes...', type: 'text' },
  ],
  concert: [
    { id: 'artist', label: 'Artist / Band', placeholder: 'Who is performing?', type: 'text' },
    { id: 'venue_name', label: 'Venue Name', placeholder: 'Name of the venue', type: 'text' },
    { id: 'ticket_info', label: 'Ticket Info', placeholder: 'Price, where to buy...', type: 'text' },
  ],
  dining: [
    { id: 'restaurant', label: 'Restaurant Name', placeholder: 'Name of the restaurant', type: 'text' },
    { id: 'cuisine', label: 'Cuisine Type', placeholder: 'Italian, Japanese, Mexican...', type: 'text' },
    { id: 'dietary_notes', label: 'Dietary Restrictions', placeholder: 'Vegetarian, gluten-free...', type: 'text' },
  ],
  birthday: [
    { id: 'celebrant', label: 'Who is the Birthday For?', placeholder: 'Name of the birthday person', type: 'text' },
    { id: 'turning_age', label: 'Turning Age', placeholder: 'How old are they turning?', type: 'text' },
    { id: 'gift_ideas', label: 'Gift Ideas', placeholder: 'What do they want?', type: 'text' },
    { id: 'surprise', label: 'Is It a Surprise?', placeholder: 'Yes / No', type: 'text' },
  ],
  tech: [
    { id: 'tech_stack', label: 'Tech Stack / Tools', placeholder: 'React, Python, AWS...', type: 'text' },
    { id: 'project_link', label: 'Project / Repo Link', placeholder: 'https://github.com/...', type: 'text' },
    { id: 'prerequisites', label: 'Prerequisites', placeholder: 'Install Node.js, bring laptop...', type: 'text' },
  ],
  health: [
    { id: 'doctor_name', label: 'Doctor / Provider', placeholder: 'Dr. Smith, City Clinic...', type: 'text' },
    { id: 'appointment_type', label: 'Appointment Type', placeholder: 'Checkup, specialist, dental...', type: 'text' },
    { id: 'fasting', label: 'Preparation Notes', placeholder: 'Fasting required, bring ID...', type: 'text' },
  ],
  art: [
    { id: 'medium', label: 'Art Medium', placeholder: 'Painting, pottery, photography...', type: 'text' },
    { id: 'supplies', label: 'Supplies Needed', placeholder: 'Brushes, canvas, camera...', type: 'text' },
    { id: 'skill_level', label: 'Skill Level', placeholder: 'Beginner-friendly, advanced...', type: 'text' },
  ],
  wedding: [
    { id: 'couple_names', label: 'Couple Names', placeholder: 'Sarah & John', type: 'text' },
    { id: 'dress_code', label: 'Dress Code', placeholder: 'Black tie, cocktail attire...', type: 'text' },
    { id: 'registry_link', label: 'Gift Registry', placeholder: 'https://registry.com/...', type: 'text' },
    { id: 'rsvp_deadline', label: 'RSVP Deadline', placeholder: 'RSVP by date...', type: 'text' },
  ],
  volunteer: [
    { id: 'organization', label: 'Organization', placeholder: 'Name of the organization', type: 'text' },
    { id: 'role', label: 'Volunteer Role', placeholder: 'What will you be doing?', type: 'text' },
    { id: 'requirements', label: 'Requirements', placeholder: 'Background check, waiver...', type: 'text' },
  ],
  general: [],
}

export default function NewEventPage() {
  return (
    <Suspense>
      <NewEventForm />
    </Suspense>
  )
}

function NewEventForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { createEvent } = useEvents()
  const [selectedType, setSelectedType] = useState<EventType>('general')
  const [eventMode, setEventMode] = useState<'onsite' | 'online' | 'hybrid'>('onsite')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tagsInput, setTagsInput] = useState('')
  const [themeFields, setThemeFields] = useState<Record<string, string>>({})
  const [showDetails, setShowDetails] = useState(false)

  const theme = getEventTheme(selectedType)
  const defaultTimes = getDefaultEventTimes()
  const dateParam = searchParams.get('date')

  const form = useForm({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      description: null,
      event_type: 'general',
      start_time: dateParam ? `${dateParam}T09:00` : defaultTimes.start,
      end_time: dateParam ? `${dateParam}T10:00` : defaultTimes.end,
      all_day: false,
      location: null,
      virtual_link: null,
      status: 'upcoming',
      priority: 'normal',
      visibility: 'private',
      budget: null,
      tags: [],
    },
  })

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form

  const allDay = watch('all_day')

  const handleTypeSelect = (type: EventType) => {
    setSelectedType(type)
    setValue('event_type', type)
    setThemeFields({})
    setShowDetails(THEME_FIELDS[type].length > 0)
  }

  const handleModeChange = (mode: string) => {
    const m = mode as 'onsite' | 'online' | 'hybrid'
    setEventMode(m)
    if (m === 'online') setValue('location', null)
    if (m === 'onsite') setValue('virtual_link', null)
  }

  const onSubmit = async (values: Record<string, unknown>) => {
    setIsSubmitting(true)
    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      // Merge theme-specific fields into metadata
      const metadata: Record<string, unknown> = {}
      const activeFields = THEME_FIELDS[selectedType]
      if (activeFields.length > 0) {
        const filled = Object.fromEntries(
          Object.entries(themeFields).filter(([, v]) => v.trim() !== '')
        )
        if (Object.keys(filled).length > 0) {
          metadata.theme_details = filled
        }
      }

      const result = await createEvent({
        ...(values as unknown as EventFormData),
        tags,
        metadata,
      })
      if (result) {
        if (selectedType === 'party' || selectedType === 'birthday') {
          const confetti = (await import('canvas-confetti')).default
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
          await new Promise((r) => setTimeout(r, 800))
        }
        router.push('/calendar')
      }
    } catch {
      toast.error('Failed to create event. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const activeThemeFields = THEME_FIELDS[selectedType]
  const animationVariant = eventAnimations[theme.animation] ?? eventAnimations.fadeSlide

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className="mx-auto max-w-2xl px-4 py-8"
    >
      {/* Back button */}
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </button>

      {/* Page Title */}
      <div className="mb-6">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Create Event
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Plan something amazing
        </p>
      </div>

      {/* Themed Form Wrapper */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedType}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-2xl border-2 p-6 shadow-sm"
          style={{
            borderColor: `${theme.primaryColor}40`,
            background: `linear-gradient(135deg, ${theme.primaryColor}08 0%, transparent 50%)`,
          }}
        >
          {/* Floating animated emoji — top-right */}
          <motion.div
            variants={animationVariant}
            animate="animate"
            className="pointer-events-none absolute right-6 top-4 select-none text-6xl opacity-15"
          >
            {theme.emoji}
          </motion.div>

          {/* Second floating emoji — bottom-left */}
          <motion.div
            variants={animationVariant}
            animate="animate"
            className="pointer-events-none absolute -bottom-2 -left-2 select-none text-5xl opacity-10"
            style={{ animationDelay: '0.5s' }}
          >
            {theme.emoji}
          </motion.div>

          {/* Gradient blob */}
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full opacity-15 blur-3xl"
            style={{ backgroundColor: theme.primaryColor }}
          />
          <div
            className="pointer-events-none absolute -bottom-16 -left-16 h-32 w-32 rounded-full opacity-10 blur-3xl"
            style={{ backgroundColor: theme.primaryColor }}
          />

          <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-5">
            {/* ─── Event Type Dropdown ─── */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Event Type</Label>
              <Select value={selectedType} onValueChange={(v) => handleTypeSelect(v as EventType)}>
                <SelectTrigger
                  className="w-full text-left"
                  style={{
                    borderColor: `${theme.primaryColor}30`,
                  }}
                >
                  <SelectValue>
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{theme.emoji}</span>
                      <span>{theme.label}</span>
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((type) => {
                    const t = EVENT_THEMES[type]
                    return (
                      <SelectItem key={type} value={type}>
                        <span className="flex items-center gap-2">
                          <span>{t.emoji}</span>
                          <span>{t.label}</span>
                        </span>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* ─── Theme description ─── */}
            <div
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm"
              style={{
                backgroundColor: `${theme.primaryColor}10`,
                color: theme.primaryColor,
              }}
            >
              <span className="text-lg">{theme.emoji}</span>
              <span className="font-medium">{theme.formDecoration}</span>
            </div>

            <Separator style={{ backgroundColor: `${theme.primaryColor}20` }} />

            {/* ─── Title ─── */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="What's the event called?"
                autoFocus
                aria-invalid={!!errors.title}
                style={{ borderColor: errors.title ? undefined : `${theme.primaryColor}20` }}
                {...register('title')}
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              )}
            </div>

            {/* ─── Description ─── */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Add details about this event..."
                rows={3}
                style={{ borderColor: `${theme.primaryColor}20` }}
                {...register('description')}
              />
            </div>

            {/* ─── All Day Toggle ─── */}
            <div className="flex items-center gap-3">
              <Controller
                name="all_day"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="all_day"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="all_day">All day event</Label>
            </div>

            {/* ─── Date/Time Row ─── */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_time">Start *</Label>
                <Input
                  id="start_time"
                  type={allDay ? 'date' : 'datetime-local'}
                  aria-invalid={!!errors.start_time}
                  style={{ borderColor: `${theme.primaryColor}20` }}
                  {...register('start_time')}
                />
                {errors.start_time && (
                  <p className="text-xs text-destructive">{errors.start_time.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_time">End *</Label>
                <Input
                  id="end_time"
                  type={allDay ? 'date' : 'datetime-local'}
                  aria-invalid={!!errors.end_time}
                  style={{ borderColor: `${theme.primaryColor}20` }}
                  {...register('end_time')}
                />
                {errors.end_time && (
                  <p className="text-xs text-destructive">{errors.end_time.message}</p>
                )}
              </div>
            </div>

            {/* ─── Event Mode Dropdown ─── */}
            <div className="space-y-2">
              <Label>Event Mode</Label>
              <Select value={eventMode} onValueChange={handleModeChange}>
                <SelectTrigger
                  className="w-full"
                  style={{ borderColor: `${theme.primaryColor}30` }}
                >
                  <SelectValue>
                    <span className="flex items-center gap-2">
                      {eventMode === 'onsite' && <><MapPin className="h-4 w-4" /> On-site</>}
                      {eventMode === 'online' && <><Video className="h-4 w-4" /> Online</>}
                      {eventMode === 'hybrid' && <><Globe className="h-4 w-4" /> Hybrid</>}
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onsite">
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> On-site
                    </span>
                  </SelectItem>
                  <SelectItem value="online">
                    <span className="flex items-center gap-2">
                      <Video className="h-4 w-4" /> Online
                    </span>
                  </SelectItem>
                  <SelectItem value="hybrid">
                    <span className="flex items-center gap-2">
                      <Globe className="h-4 w-4" /> Hybrid
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ─── Location (on-site / hybrid) ─── */}
            {(eventMode === 'onsite' || eventMode === 'hybrid') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="Add a location"
                    className="pl-9"
                    style={{ borderColor: `${theme.primaryColor}20` }}
                    {...register('location')}
                  />
                </div>
              </motion.div>
            )}

            {/* ─── Virtual Link (online / hybrid) ─── */}
            {(eventMode === 'online' || eventMode === 'hybrid') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <Label htmlFor="virtual_link">Virtual Link</Label>
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="virtual_link"
                    type="url"
                    placeholder="https://zoom.us/j/..."
                    className="pl-9"
                    style={{ borderColor: `${theme.primaryColor}20` }}
                    {...register('virtual_link')}
                  />
                </div>
              </motion.div>
            )}

            {/* ─── Status / Priority / Visibility ─── */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {EVENT_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PRIORITIES.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Visibility</Label>
                <Controller
                  name="visibility"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VISIBILITIES.map((v) => (
                          <SelectItem key={v} value={v}>
                            {v.charAt(0).toUpperCase() + v.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* ─── Tags ─── */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="party, outdoor, family (comma-separated)"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                style={{ borderColor: `${theme.primaryColor}20` }}
              />
            </div>

            {/* ─── Budget ─── */}
            <div className="space-y-2">
              <Label htmlFor="budget">Budget</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="budget"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-9"
                  style={{ borderColor: `${theme.primaryColor}20` }}
                  {...register('budget', {
                    setValueAs: (v: string) => (v === '' ? null : parseFloat(v)),
                  })}
                />
              </div>
            </div>

            {/* ─── Theme-Specific Fields ─── */}
            {activeThemeFields.length > 0 && (
              <>
                <Separator style={{ backgroundColor: `${theme.primaryColor}20` }} />
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setShowDetails(!showDetails)}
                    className="flex w-full items-center justify-between text-sm font-semibold"
                    style={{ color: theme.primaryColor }}
                  >
                    <span className="flex items-center gap-2">
                      <span>{theme.emoji}</span>
                      {theme.label.split(' / ')[0]} Details
                    </span>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        showDetails && 'rotate-180'
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {showDetails && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-3 overflow-hidden"
                      >
                        {activeThemeFields.map((field) => (
                          <div key={field.id} className="space-y-1.5">
                            <Label htmlFor={`theme_${field.id}`} className="text-sm">
                              {field.label}
                            </Label>
                            {field.type === 'textarea' ? (
                              <Textarea
                                id={`theme_${field.id}`}
                                placeholder={field.placeholder}
                                rows={2}
                                value={themeFields[field.id] ?? ''}
                                onChange={(e) =>
                                  setThemeFields((prev) => ({
                                    ...prev,
                                    [field.id]: e.target.value,
                                  }))
                                }
                                style={{ borderColor: `${theme.primaryColor}20` }}
                              />
                            ) : (
                              <Input
                                id={`theme_${field.id}`}
                                placeholder={field.placeholder}
                                value={themeFields[field.id] ?? ''}
                                onChange={(e) =>
                                  setThemeFields((prev) => ({
                                    ...prev,
                                    [field.id]: e.target.value,
                                  }))
                                }
                                style={{ borderColor: `${theme.primaryColor}20` }}
                              />
                            )}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}

            <Separator style={{ backgroundColor: `${theme.primaryColor}20` }} />

            {/* ─── Submit ─── */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-white transition-opacity hover:opacity-90"
              style={{
                backgroundColor: theme.primaryColor,
                borderColor: theme.primaryColor,
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>{theme.emoji}</span>
                  Create {theme.label.split(' / ')[0]}
                </span>
              )}
            </Button>
          </form>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
