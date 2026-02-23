'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { CalendarDays, LogIn, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { loginSchema, type LoginValues } from '@/lib/validators/event'
import { pageVariants, staggerContainer, staggerItem } from '@/lib/constants/animations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  useEffect(() => {
    if (searchParams.get('error') === 'auth_failed') {
      toast.error('Authentication failed. Please try again.')
    }
  }, [searchParams])

  async function onSubmit(values: LoginValues) {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success('Welcome back!')
      router.push('/calendar')
      router.refresh()
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      {/* Decorative gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        className="relative z-10 w-full max-w-md"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {/* Brand */}
          <motion.div variants={staggerItem} className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <CalendarDays className="h-7 w-7 text-primary" />
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold">
              <span className="bg-gradient-to-r from-primary to-primary/60 text-gradient">
                EventSync
              </span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              AI-powered event scheduling
            </p>
          </motion.div>

          {/* Login Card */}
          <motion.div variants={staggerItem}>
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Welcome back</CardTitle>
                <CardDescription>
                  Sign in to your account to continue
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      aria-invalid={!!errors.email}
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        className="pr-10"
                        aria-invalid={!!errors.password}
                        {...register('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        tabIndex={-1}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-destructive">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className={cn('w-full', isLoading && 'opacity-80')}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                        Signing in...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <LogIn className="h-4 w-4" />
                        Sign in
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="justify-center">
                <p className="text-sm text-muted-foreground">
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/register"
                    className="font-medium text-primary hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
