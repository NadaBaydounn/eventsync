import { Inter, JetBrains_Mono } from 'next/font/google'
import localFont from 'next/font/local'

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

// Cal Sans — use Plus Jakarta Sans as a reliable Google Font fallback
// (Cal Sans would need to be self-hosted; for competition speed, use this)
import { Plus_Jakarta_Sans } from 'next/font/google'

export const displayFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})
