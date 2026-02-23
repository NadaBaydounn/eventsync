import chroma from 'chroma-js'

export interface ColorPalette {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
  950: string
}

/**
 * Generate a full color palette from a single hex color.
 * Uses perceptual color science (OKLCH) for beautiful, accessible results.
 */
export function generatePalette(hex: string): ColorPalette {
  const base = chroma(hex)
  const hue = base.get('hsl.h') || 0
  const sat = base.get('hsl.s')

  // Generate shades from light → dark using HSL with consistent hue
  const shades: [number, number][] = [
    [50, 0.97],   // Lightest
    [100, 0.94],
    [200, 0.86],
    [300, 0.76],
    [400, 0.62],
    [500, 0.50],  // Mid — close to input
    [600, 0.42],
    [700, 0.35],
    [800, 0.25],
    [900, 0.18],
    [950, 0.10],  // Darkest
  ]

  const palette: Record<number, string> = {}
  shades.forEach(([shade, lightness]) => {
    // Desaturate at extremes for natural look
    const adjustedSat = lightness > 0.9 || lightness < 0.15
      ? sat * 0.6
      : lightness > 0.8 || lightness < 0.2
        ? sat * 0.8
        : sat
    palette[shade] = chroma.hsl(hue, adjustedSat, lightness).hex()
  })

  return palette as unknown as ColorPalette
}

/**
 * Determine if text should be white or black on a given background.
 * Uses WCAG 2.1 contrast ratio.
 */
export function getContrastText(bgHex: string): 'white' | 'black' {
  const luminance = chroma(bgHex).luminance()
  return luminance > 0.35 ? 'black' : 'white'
}

/**
 * Generate CSS custom properties from a color for the theme system.
 * Apply these to :root or a container element.
 */
export function generateThemeVars(hex: string): Record<string, string> {
  const palette = generatePalette(hex)

  return {
    '--color-primary-50': palette[50],
    '--color-primary-100': palette[100],
    '--color-primary-200': palette[200],
    '--color-primary-300': palette[300],
    '--color-primary-400': palette[400],
    '--color-primary-500': palette[500],
    '--color-primary-600': palette[600],
    '--color-primary-700': palette[700],
    '--color-primary-800': palette[800],
    '--color-primary-900': palette[900],
    '--color-primary-950': palette[950],
    // For Tailwind/shadcn HSL values
    '--primary': hexToHslString(palette[600]),
    '--primary-foreground': getContrastText(palette[600]) === 'white' ? '0 0% 100%' : '0 0% 0%',
    '--accent': hexToHslString(palette[100]),
    '--accent-foreground': hexToHslString(palette[900]),
    '--ring': hexToHslString(palette[400]),
  }
}

/**
 * Convert hex to "H S% L%" format for CSS custom properties (shadcn style).
 */
function hexToHslString(hex: string): string {
  const [h, s, l] = chroma(hex).hsl()
  return `${Math.round(h || 0)} ${Math.round((s || 0) * 100)}% ${Math.round((l || 0) * 100)}%`
}

/**
 * Preset color options for the theme picker.
 */
export const PRESET_COLORS = [
  { name: 'Indigo', hex: '#6366F1' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Cyan', hex: '#06B6D4' },
  { name: 'Teal', hex: '#14B8A6' },
  { name: 'Green', hex: '#22C55E' },
  { name: 'Amber', hex: '#F59E0B' },
  { name: 'Orange', hex: '#F97316' },
  { name: 'Rose', hex: '#F43F5E' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Purple', hex: '#A855F7' },
  { name: 'Violet', hex: '#8B5CF6' },
  { name: 'Slate', hex: '#64748B' },
] as const
