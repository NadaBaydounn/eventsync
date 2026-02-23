'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { CalendarDays, UserPlus, Eye, EyeOff, RefreshCw, Check, X } from 'lucide-react'
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

function generateStrongPassword(): string {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lower = 'abcdefghijklmnopqrstuvwxyz'
  const digits = '0123456789'
  const special = '!@#$%^&*_-+='
  const all = upper + lower + digits + special
  const required = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    digits[Math.floor(Math.random() * digits.length)],
    special[Math.floor(Math.random() * special.length)],
  ]
  const remaining = Array.from({ length: 12 }, () =>
    all[Math.floor(Math.random() * all.length)]
  )
  return [...required, ...remaining]
    .sort(() => Math.random() - 0.5)
    .join('')
}

function getPasswordStrength(password: string): {
  score: number
  label: string
  color: string
} {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { score, label: 'Very Weak', color: 'bg-destructive' }
  if (score === 2) return { score, label: 'Weak', color: 'bg-orange-500' }
  if (score === 3) return { score, label: 'Fair', color: 'bg-amber-500' }
  if (score === 4) return { score, label: 'Strong', color: 'bg-green-500' }
  return { score, label: 'Very Strong', color: 'bg-emerald-500' }
}

const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
  { label: 'One special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirm_password: '',
    },
  })

  const passwordValue = watch('password') || ''
  const strength = useMemo(() => getPasswordStrength(passwordValue), [passwordValue])

  function handleGeneratePassword() {
    const generated = generateStrongPassword()
    setValue('password', generated, { shouldValidate: true })
    setValue('confirm_password', generated, { shouldValidate: true })
    setShowPassword(true)
    setShowConfirm(true)
    toast.success('Strong password generated and auto-filled!')
  }

  async function onSubmit(values: RegisterValues) {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const fullName = `${values.first_name} ${values.last_name}`
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: { full_name: fullName },
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
                  {/* First Name + Last Name */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        type="text"
                        placeholder="John"
                        autoComplete="given-name"
                        aria-invalid={!!errors.first_name}
                        {...register('first_name')}
                      />
                      {errors.first_name && (
                        <p className="text-xs text-destructive">
                          {errors.first_name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        type="text"
                        placeholder="Doe"
                        autoComplete="family-name"
                        aria-invalid={!!errors.last_name}
                        {...register('last_name')}
                      />
                      {errors.last_name && (
                        <p className="text-xs text-destructive">
                          {errors.last_name.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
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

                  {/* Password */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <button
                        type="button"
                        onClick={handleGeneratePassword}
                        className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Generate
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Strong password"
                        autoComplete="new-password"
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

                    {/* Password Strength Bar */}
                    {passwordValue.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="flex flex-1 gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div
                                key={i}
                                className={cn(
                                  'h-1.5 flex-1 rounded-full transition-colors',
                                  i < strength.score ? strength.color : 'bg-muted'
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">
                            {strength.label}
                          </span>
                        </div>

                        {/* Password Requirements Checklist */}
                        <div className="grid grid-cols-1 gap-0.5">
                          {PASSWORD_RULES.map((rule) => {
                            const passes = rule.test(passwordValue)
                            return (
                              <div
                                key={rule.label}
                                className={cn(
                                  'flex items-center gap-1.5 text-xs transition-colors',
                                  passes ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                                )}
                              >
                                {passes ? (
                                  <Check className="h-3 w-3" />
                                ) : (
                                  <X className="h-3 w-3" />
                                )}
                                {rule.label}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {errors.password && (
                      <p className="text-xs text-destructive">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirm_password"
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Repeat your password"
                        autoComplete="new-password"
                        className="pr-10"
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
