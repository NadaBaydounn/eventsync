'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { CalendarDays, UserPlus, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { registerSchema, type RegisterValues } from '@/lib/validators/event'
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

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      confirm_password: '',
    },
  })

  async function onSubmit(values: RegisterValues) {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: { full_name: values.full_name },
        },
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success('Account created! Welcome to EventSync.')
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
              Create your account to get started
            </p>
          </motion.div>

          {/* Register Card */}
          <motion.div variants={staggerItem}>
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Create an account</CardTitle>
                <CardDescription>
                  Fill in your details to join EventSync
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      type="text"
                      placeholder="John Doe"
                      autoComplete="name"
                      aria-invalid={!!errors.full_name}
                      {...register('full_name')}
                    />
                    {errors.full_name && (
                      <p className="text-xs text-destructive">
                        {errors.full_name.message}
                      </p>
                    )}
                  </div>

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
                        placeholder="At least 6 characters"
                        autoComplete="new-password"
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

                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirm_password"
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Repeat your password"
                        autoComplete="new-password"
                        aria-invalid={!!errors.confirm_password}
                        {...register('confirm_password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        tabIndex={-1}
                        aria-label={showConfirm ? 'Hide password' : 'Show password'}
                      >
                        {showConfirm ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirm_password && (
                      <p className="text-xs text-destructive">
                        {errors.confirm_password.message}
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
                        Creating account...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        Create account
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="justify-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="font-medium text-primary hover:underline"
                  >
                    Sign in
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
