'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import {
  CalendarDays,
  LayoutDashboard,
  CalendarRange,
  Settings,
  Users,
  Sparkles,
  Bell,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Plus,
  LogOut,
  Search,
  Menu,
  X,
} from 'lucide-react'

import { useAppStore } from '@/lib/store'
import { useAuth } from '@/lib/hooks/useAuth'
import { useKeyboard } from '@/lib/hooks/useKeyboard'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import { sidebarVariants } from '@/lib/constants/animations'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AIChatPanel } from '@/components/ai/AIChatPanel'
import { CommandPalette } from '@/components/layout/CommandPalette'

const NAV_ITEMS = [
  { href: '/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/events', label: 'Events', icon: CalendarRange },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/team', label: 'Team', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
]

function getInitials(name: string | null, email: string | null): string {
  if (name) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  return (email?.[0] ?? 'U').toUpperCase()
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { profile, loading: authLoading, signOut } = useAuth()
  const {
    sidebarCollapsed,
    toggleSidebar,
    toggleAIChat,
    toggleCommandPalette,
  } = useAppStore()

  const isMobile = useMediaQuery('(max-width: 768px)')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useKeyboard({
    'mod+k': toggleCommandPalette,
    'mod+/': toggleAIChat,
    'mod+n': () => router.push('/events/new'),
  })

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  const handleNavClick = () => {
    if (isMobile) setMobileMenuOpen(false)
  }

  // Shared sidebar content — used in both desktop and mobile
  const sidebarContent = (collapsed: boolean) => (
    <>
      {/* Sidebar Header */}
      <div className="flex h-14 items-center justify-between border-b px-4">
        {!collapsed && (
          <Link
            href="/calendar"
            className="flex items-center gap-2"
            onClick={handleNavClick}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <CalendarDays className="h-4 w-4 text-primary" />
            </div>
            <span className="font-[family-name:var(--font-display)] text-lg font-bold">
              <span className="bg-gradient-to-r from-primary to-primary/60 text-gradient">
                EventSync
              </span>
            </span>
          </Link>
        )}
        {collapsed && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <CalendarDays className="h-4 w-4 text-primary" />
          </div>
        )}
        {isMobile ? (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
            className="shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={toggleSidebar}
            className={cn('shrink-0', collapsed && 'hidden')}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* New Event Button */}
      <div className="px-3 pt-4 pb-2">
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="mx-auto flex w-full bg-gradient-to-r from-primary to-primary/80"
                onClick={() => {
                  router.push('/events/new')
                  handleNavClick()
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">New Event</TooltipContent>
          </Tooltip>
        ) : (
          <Button
            className="w-full gap-2 bg-gradient-to-r from-primary to-primary/80"
            onClick={() => {
              router.push('/events/new')
              handleNavClick()
            }}
          >
            <Plus className="h-4 w-4" />
            New Event
          </Button>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon

          const linkContent = (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className={cn(
                'relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId={isMobile ? 'sidebar-active-mobile' : 'sidebar-active'}
                  className="absolute inset-0 rounded-lg bg-primary/10"
                  transition={{
                    type: 'spring',
                    stiffness: 350,
                    damping: 30,
                  }}
                />
              )}
              <Icon className="relative h-4 w-4 shrink-0" />
              {!collapsed && (
                <span className="relative truncate">{item.label}</span>
              )}
            </Link>
          )

          if (collapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            )
          }

          return <div key={item.href}>{linkContent}</div>
        })}
      </nav>

      <Separator />

      {/* Bottom Section */}
      <div className="space-y-2 px-3 py-3">
        {/* AI Chat Button */}
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  toggleAIChat()
                  handleNavClick()
                }}
                className="mx-auto flex w-full"
              >
                <Sparkles className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">AI Chat</TooltipContent>
          </Tooltip>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() => {
              toggleAIChat()
              handleNavClick()
            }}
          >
            <Sparkles className="h-4 w-4" />
            AI Chat
          </Button>
        )}

        {/* User Section */}
        {authLoading ? (
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            {!collapsed && (
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            )}
          </div>
        ) : (
          <div
            className={cn(
              'flex items-center gap-3 rounded-lg px-2 py-2',
              collapsed && 'justify-center'
            )}
          >
            <Avatar size="default">
              <AvatarImage
                src={profile?.avatar_url ?? undefined}
                alt={profile?.full_name ?? 'User'}
              />
              <AvatarFallback>
                {getInitials(profile?.full_name ?? null, profile?.email ?? null)}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {profile?.full_name ?? 'User'}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {profile?.email}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <motion.aside
          variants={sidebarVariants}
          initial={false}
          animate={sidebarCollapsed ? 'collapsed' : 'expanded'}
          className="relative flex flex-col border-r bg-card/50 backdrop-blur-sm overflow-hidden"
        >
          {sidebarContent(sidebarCollapsed)}
        </motion.aside>
      )}

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobile && mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Sidebar */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r bg-card shadow-2xl"
            >
              {sidebarContent(false)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
          {/* Mobile hamburger */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}

          {/* Desktop sidebar toggle (visible when collapsed) */}
          {!isMobile && sidebarCollapsed && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={toggleSidebar}
              aria-label="Expand sidebar"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}

          {/* Search */}
          <button
            onClick={toggleCommandPalette}
            className="flex h-9 flex-1 items-center gap-2 rounded-lg border bg-muted/50 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted sm:flex-none sm:w-64"
          >
            <Search className="h-4 w-4" />
            <span>Search...</span>
            <kbd className="ml-auto hidden rounded bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground shadow-sm sm:inline-block">
              ⌘K
            </kbd>
          </button>

          <div className="flex-1 hidden sm:block" />

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Notification Bell */}
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Button>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label="User menu"
              >
                <Avatar size="sm">
                  <AvatarImage
                    src={profile?.avatar_url ?? undefined}
                    alt={profile?.full_name ?? 'User'}
                  />
                  <AvatarFallback className="text-[10px]">
                    {getInitials(profile?.full_name ?? null, profile?.email ?? null)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>
                <p className="text-sm font-medium">
                  {profile?.full_name ?? 'User'}
                </p>
                <p className="text-xs font-normal text-muted-foreground">
                  {profile?.email}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {children}
        </main>
      </div>

      {/* Global Overlays */}
      <AIChatPanel />
      <CommandPalette />
    </div>
  )
}
