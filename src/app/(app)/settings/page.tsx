'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'
import {
  User,
  Palette,
  Bell,
  Database,
  AlertTriangle,
  Sun,
  Moon,
  Monitor,
  Check,
  Download,
  Trash2,
  LogOut,
  Loader2,
  Sparkles,
} from 'lucide-react'

import { useAuth } from '@/lib/hooks/useAuth'
import { useEvents } from '@/lib/hooks/useEvents'
import { PRESET_COLORS, generateThemeVars } from '@/lib/utils/colors'
import { generateDemoEvents } from '@/lib/constants/demo-data'
import { exportCalendarToICS, exportEventsToCSV } from '@/lib/utils/export'
import { createClient } from '@/lib/supabase/client'
import { pageVariants } from '@/lib/constants/animations'
import { cn } from '@/lib/utils'
import type { NotificationPreferences } from '@/types/events'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'

const THEME_MODES = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
] as const

const REMINDER_OPTIONS = [
  { value: '1h', label: '1 hour before' },
  { value: '1d', label: '1 day before' },
  { value: '1w', label: '1 week before' },
] as const

export default function SettingsPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { user, profile, loading: authLoading, updateProfile, signOut } = useAuth()
  const { events, refetch } = useEvents()

  // Profile state
  const [fullName, setFullName] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)

  // Theme state
  const [selectedColor, setSelectedColor] = useState('#6366F1')

  // Notification state
  const [notifPrefs, setNotifPrefs] = useState<NotificationPreferences>({
    email: true,
    push: true,
    reminders: ['1h', '1d'],
  })
  const [savingNotifs, setSavingNotifs] = useState(false)

  // Data management state
  const [loadingDemo, setLoadingDemo] = useState(false)
  const [deletingAll, setDeletingAll] = useState(false)

  // Sync from profile
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '')
      setSelectedColor(profile.custom_color ?? '#6366F1')
      setNotifPrefs(
        profile.notification_preferences ?? {
          email: true,
          push: true,
          reminders: ['1h', '1d'],
        }
      )
    }
  }, [profile])

  const handleSaveProfile = async () => {
    setSavingProfile(true)
    try {
      await updateProfile({ full_name: fullName })
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleColorChange = async (hex: string) => {
    setSelectedColor(hex)
    // Apply CSS vars immediately
    const vars = generateThemeVars(hex)
    Object.entries(vars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value)
    })
    // Persist
    await updateProfile({ custom_color: hex })
    toast.success('Theme color updated!')
  }

  const handleSaveNotifications = async () => {
    setSavingNotifs(true)
    try {
      await updateProfile({ notification_preferences: notifPrefs })
      toast.success('Notification preferences saved!')
    } catch {
      toast.error('Failed to save preferences')
    } finally {
      setSavingNotifs(false)
    }
  }

  const toggleReminder = (value: string) => {
    setNotifPrefs((prev) => ({
      ...prev,
      reminders: prev.reminders.includes(value)
        ? prev.reminders.filter((r) => r !== value)
        : [...prev.reminders, value],
    }))
  }

  const handleLoadDemoData = async () => {
    if (!user) return
    const confirmed = window.confirm(
      'This will add 18 demo events to your calendar. Continue?'
    )
    if (!confirmed) return

    setLoadingDemo(true)
    try {
      const supabase = createClient()
      const demoEvents = generateDemoEvents(user.id)
      const { error } = await supabase.from('events').insert(demoEvents)
      if (error) throw error
      toast.success('Demo data loaded! Check your calendar.')
      refetch()
    } catch {
      toast.error('Failed to load demo data')
    } finally {
      setLoadingDemo(false)
    }
  }

  const handleDeleteAllEvents = async () => {
    if (!user) return
    const confirmed = window.confirm(
      'Are you sure? This will permanently delete ALL your events. This cannot be undone.'
    )
    if (!confirmed) return

    setDeletingAll(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('created_by', user.id)
      if (error) throw error
      toast.success('All events deleted')
      refetch()
    } catch {
      toast.error('Failed to delete events')
    } finally {
      setDeletingAll(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  if (authLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 p-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="enter"
      className="mx-auto max-w-2xl space-y-6 p-6"
    >
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your profile, appearance, and preferences.
        </p>
      </div>

      {/* Profile Section */}
      <section className="rounded-xl border bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold">Profile</h2>
        </div>

        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={profile?.avatar_url ?? undefined}
              alt={profile?.full_name ?? 'User'}
            />
            <AvatarFallback className="text-lg">
              {(profile?.full_name?.[0] ?? profile?.email?.[0] ?? 'U').toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profile?.email ?? ''}
                disabled
                className="opacity-60"
              />
            </div>
            <Button
              size="sm"
              onClick={handleSaveProfile}
              disabled={savingProfile}
            >
              {savingProfile && (
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              )}
              Save Profile
            </Button>
          </div>
        </div>
      </section>

      {/* Appearance Section */}
      <section className="rounded-xl border bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <Palette className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold">Appearance</h2>
        </div>

        {/* Theme Mode */}
        <div className="mb-5">
          <Label className="mb-2 block text-xs text-muted-foreground">
            Theme Mode
          </Label>
          <div className="flex gap-2">
            {THEME_MODES.map((mode) => {
              const Icon = mode.icon
              const isActive = theme === mode.value
              return (
                <button
                  key={mode.value}
                  onClick={() => setTheme(mode.value)}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-2 rounded-lg border-2 px-3 py-2.5 text-sm font-medium transition-all',
                    isActive
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-transparent bg-muted/50 text-muted-foreground hover:bg-muted'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {mode.label}
                </button>
              )
            })}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Custom Color */}
        <div>
          <Label className="mb-2 block text-xs text-muted-foreground">
            Accent Color
          </Label>
          <div className="grid grid-cols-6 gap-3">
            {PRESET_COLORS.map((color) => (
              <button
                key={color.hex}
                onClick={() => handleColorChange(color.hex)}
                className={cn(
                  'group relative flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-110',
                  selectedColor === color.hex &&
                    'ring-2 ring-offset-2 ring-offset-background'
                )}
                style={{
                  backgroundColor: color.hex,
                  ...(selectedColor === color.hex
                    ? { ringColor: color.hex }
                    : {}),
                }}
                title={color.name}
              >
                {selectedColor === color.hex && (
                  <Check className="h-4 w-4 text-white" />
                )}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Selected: {PRESET_COLORS.find((c) => c.hex === selectedColor)?.name ?? 'Custom'}
          </p>
        </div>

        <Separator className="my-4" />

        {/* Live Preview */}
        <div>
          <Label className="mb-2 block text-xs text-muted-foreground">
            Preview
          </Label>
          <div className="rounded-lg border bg-background p-4">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${selectedColor}20` }}
              >
                <Sparkles
                  className="h-5 w-5"
                  style={{ color: selectedColor }}
                />
              </div>
              <div>
                <p className="text-sm font-medium">Theme Preview</p>
                <p className="text-xs text-muted-foreground">
                  This is how your accent color looks
                </p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: selectedColor }}
              >
                Primary Button
              </button>
              <button
                className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                style={{ color: selectedColor, borderColor: `${selectedColor}40` }}
              >
                Outline Button
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Notifications Section */}
      <section className="rounded-xl border bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold">Notifications</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Email Notifications</p>
              <p className="text-xs text-muted-foreground">
                Receive event reminders via email
              </p>
            </div>
            <Switch
              checked={notifPrefs.email}
              onCheckedChange={(checked) =>
                setNotifPrefs((prev) => ({ ...prev, email: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Push Notifications</p>
              <p className="text-xs text-muted-foreground">
                Get browser push notifications
              </p>
            </div>
            <Switch
              checked={notifPrefs.push}
              onCheckedChange={(checked) =>
                setNotifPrefs((prev) => ({ ...prev, push: checked }))
              }
            />
          </div>

          <Separator />

          <div>
            <p className="mb-2 text-sm font-medium">Default Reminders</p>
            <div className="flex flex-wrap gap-2">
              {REMINDER_OPTIONS.map((opt) => {
                const active = notifPrefs.reminders.includes(opt.value)
                return (
                  <button
                    key={opt.value}
                    onClick={() => toggleReminder(opt.value)}
                    className={cn(
                      'rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'border bg-muted/50 text-muted-foreground hover:bg-muted'
                    )}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          <Button
            size="sm"
            onClick={handleSaveNotifications}
            disabled={savingNotifs}
          >
            {savingNotifs && (
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            )}
            Save Preferences
          </Button>
        </div>
      </section>

      {/* Data Management Section */}
      <section className="rounded-xl border bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <Database className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold">Data Management</h2>
        </div>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleLoadDemoData}
            disabled={loadingDemo}
          >
            {loadingDemo ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {loadingDemo ? 'Loading...' : 'Load Demo Data'}
          </Button>
          <p className="text-xs text-muted-foreground">
            Add 18 sample events to explore the app with realistic data.
          </p>

          <Separator />

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => exportCalendarToICS(events)}
              disabled={events.length === 0}
            >
              <Download className="h-3.5 w-3.5" />
              Export .ics
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => exportEventsToCSV(events)}
              disabled={events.length === 0}
            >
              <Download className="h-3.5 w-3.5" />
              Export .csv
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Export your {events.length} event{events.length !== 1 ? 's' : ''} to
            calendar or spreadsheet format.
          </p>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="rounded-xl border border-red-200 bg-card p-5 dark:border-red-900/50">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <h2 className="text-sm font-semibold text-red-500">Danger Zone</h2>
        </div>

        <div className="space-y-3">
          <Button
            variant="destructive"
            size="sm"
            className="gap-2"
            onClick={handleDeleteAllEvents}
            disabled={deletingAll || events.length === 0}
          >
            {deletingAll ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            Delete All Events
          </Button>
          <p className="text-xs text-muted-foreground">
            Permanently delete all {events.length} events. This cannot be
            undone.
          </p>

          <Separator />

          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
            onClick={handleSignOut}
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </Button>
        </div>
      </section>
    </motion.div>
  )
}
