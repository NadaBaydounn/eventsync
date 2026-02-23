import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  CalendarDays,
  Sparkles,
  Palette,
  Users,
  Share2,
  BarChart3,
  ArrowRight,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'

const EVENT_EMOJIS = [
  '🎉', '📚', '✈️', '💼', '🏋️', '🎵', '🍽️', '🎂',
  '💻', '🏥', '🎨', '💒', '🤝', '📅',
]

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI Chat Assistant',
    description:
      'Create events with natural language. Ask anything about your schedule.',
    gradient: 'from-purple-500 to-blue-500',
  },
  {
    icon: Palette,
    title: '14 Event Themes',
    description:
      'From parties to weddings, each type has unique colors, emojis, and animations.',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: Users,
    title: 'Host & Attendee Views',
    description:
      'Hosts manage guests and budgets. Attendees get preparation checklists.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Share2,
    title: 'Smart Sharing',
    description:
      'Share events with beautiful public pages, QR codes, and calendar integration.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: BarChart3,
    title: 'Dashboard Analytics',
    description:
      'Track your events with charts, stats, and completion rates.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: CalendarDays,
    title: 'Calendar Views',
    description:
      'Full-featured calendar with drag, drop, and multiple view modes.',
    gradient: 'from-indigo-500 to-violet-500',
  },
]

export default async function LandingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/calendar')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-20">
        {/* Decorative blobs */}
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute left-1/2 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative z-10 flex max-w-3xl flex-col items-center text-center">
          {/* Logo */}
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <CalendarDays className="h-8 w-8 text-primary" />
          </div>

          {/* Title */}
          <h1 className="font-[family-name:var(--font-display)] text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              EventSync
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-xl font-medium text-muted-foreground sm:text-2xl">
            AI-Powered Event Scheduling
          </p>

          {/* Description */}
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            The smartest way to plan, track, and share events. 14 themed event
            types, AI chat assistant, beautiful dashboards, and seamless
            sharing.
          </p>

          {/* Emoji Parade */}
          <div className="mt-8 w-full max-w-md overflow-hidden rounded-full border bg-card/50 py-3">
            <div
              className="flex gap-4 whitespace-nowrap"
              style={{
                animation: 'marquee 20s linear infinite',
                width: 'max-content',
              }}
            >
              {[...EVENT_EMOJIS, ...EVENT_EMOJIS].map((emoji, i) => (
                <span
                  key={i}
                  className="text-2xl"
                  role="img"
                  aria-hidden="true"
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="gap-2 bg-gradient-to-r from-primary to-primary/80 px-8 text-base"
            >
              <Link href="/register">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 text-base">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-card/30 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold">
              Everything you need
            </h2>
            <p className="mt-2 text-muted-foreground">
              A complete event management platform, powered by AI.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="group rounded-xl border bg-card p-6 transition-shadow hover:shadow-lg"
                >
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient}`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-8">
        <div className="mx-auto max-w-5xl text-center">
          <div className="flex items-center justify-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            <span className="font-[family-name:var(--font-display)] font-semibold">
              EventSync
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Built with Next.js, Supabase, and Google Gemini AI
          </p>
        </div>
      </footer>

      {/* Marquee animation keyframes */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
