import Link from 'next/link'
import { CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      {/* Decorative blobs */}
      <div className="absolute -left-32 top-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -right-32 bottom-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <span className="text-7xl" role="img" aria-label="Calendar">
          🗓️
        </span>

        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold">
            Page Not Found
          </h1>
          <p className="mt-2 max-w-md text-muted-foreground">
            This event must have been cancelled! Or maybe you took a wrong turn.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Button asChild className="gap-2">
            <Link href="/calendar">
              <CalendarDays className="h-4 w-4" />
              Back to Calendar
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground">
            or{' '}
            <Link href="/" className="font-medium text-primary hover:underline">
              Go to homepage
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
