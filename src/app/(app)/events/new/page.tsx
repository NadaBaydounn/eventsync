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
  Check,
} from 'lucide-react'

import { useEvents } from '@/lib/hooks/useEvents'
import {
  EVENT_THEMES,
  getEventTheme,
} from '@/lib/constants/event-themes'
import {
  pageVariants,
  staggerContainer,
  staggerItem,
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tagsInput, setTagsInput] = useState('')

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
  }

  const onSubmit = async (values: Record<string, unknown>) => {
    setIsSubmitting(true)
    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const result = await createEvent({ ...(values as unknown as EventFormData), tags })
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Event Type Selector */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Event Type</Label>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-4 gap-2 sm:grid-cols-7"
          >
            {EVENT_TYPES.map((type) => {
              const t = EVENT_THEMES[type]
              const isSelected = selectedType === type
              return (
                <motion.button
                  key={type}
                  variants={staggerItem}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => handleTypeSelect(type)}
                  className={cn(
                    'relative flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all duration-200',
                    isSelected
                      ? 'shadow-md'
                      : 'border-transparent bg-muted/50 hover:bg-muted'
                  )}
                  style={
                    isSelected
                      ? {
                          borderColor: t.primaryColor,
                          backgroundColor: `${t.primaryColor}15`,
                        }
                      : undefined
                  }
                  aria-label={t.label}
                  aria-pressed={isSelected}
                >
                  <span className="text-xl">{t.emoji}</span>
                  <span
                    className={cn(
                      'text-center text-[10px] font-medium leading-tight',
                      isSelected
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    )}
                  >
                    {t.label.split(' / ')[0]}
                  </span>
                  {isSelected && (
                    <motion.div
                      layoutId="type-selected-indicator"
                      className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full"
                      style={{ backgroundColor: t.primaryColor }}
                    >
                      <Check className="h-2.5 w-2.5 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              )
            })}
          </motion.div>
        </div>

        {/* Animated Theme Banner */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedType}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'flex items-center gap-3 rounded-xl p-4',
              theme.bgTint,
              theme.bgTintDark
            )}
          >
            <motion.span
              key={`emoji-${selectedType}`}
              variants={
                eventAnimations[theme.animation] ??
                eventAnimations.fadeSlide
              }
              animate="animate"
              className="text-3xl"
            >
              {theme.emoji}
            </motion.span>
            <div>
              <p className="font-semibold">{theme.label}</p>
              <p className="text-sm text-muted-foreground">
                {theme.formDecoration}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        <Separator />

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="What's the event called?"
              autoFocus
              aria-invalid={!!errors.title}
              {...register('title')}
            />
            {errors.title && (
              <p className="text-xs text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add details about this event..."
              rows={3}
              {...register('description')}
            />
          </div>

          {/* All Day Toggle */}
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

          {/* Date/Time Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time">Start *</Label>
              <Input
                id="start_time"
                type={allDay ? 'date' : 'datetime-local'}
                aria-invalid={!!errors.start_time}
                {...register('start_time')}
              />
              {errors.start_time && (
                <p className="text-xs text-destructive">
                  {errors.start_time.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_time">End *</Label>
              <Input
                id="end_time"
                type={allDay ? 'date' : 'datetime-local'}
                aria-invalid={!!errors.end_time}
                {...register('end_time')}
              />
              {errors.end_time && (
                <p className="text-xs text-destructive">
                  {errors.end_time.message}
                </p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="location"
                placeholder="Add a location"
                className="pl-9"
                {...register('location')}
              />
            </div>
          </div>

          {/* Virtual Link */}
          <div className="space-y-2">
            <Label htmlFor="virtual_link">Virtual Link</Label>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="virtual_link"
                type="url"
                placeholder="https://zoom.us/j/..."
                className="pl-9"
                {...register('virtual_link')}
              />
            </div>
          </div>

          {/* Status / Priority / Visibility Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
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
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
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
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
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

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="party, outdoor, family (comma-separated)"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>

          {/* Budget */}
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
                {...register('budget', {
                  setValueAs: (v: string) =>
                    v === '' ? null : parseFloat(v),
                })}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Submit */}
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
  )
}
