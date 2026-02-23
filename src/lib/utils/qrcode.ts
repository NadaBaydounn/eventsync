import QRCode from 'qrcode'

/**
 * Generate a QR code as a data URL (base64 PNG).
 */
export async function generateQRCode(
  url: string,
  options?: { width?: number; darkColor?: string; lightColor?: string }
): Promise<string> {
  return QRCode.toDataURL(url, {
    width: options?.width || 256,
    margin: 2,
    color: {
      dark: options?.darkColor || '#000000',
      light: options?.lightColor || '#FFFFFF',
    },
    errorCorrectionLevel: 'M',
  })
}

/**
 * Generate a QR code as an SVG string (for crisp rendering at any size).
 */
export async function generateQRCodeSVG(url: string): Promise<string> {
  return QRCode.toString(url, {
    type: 'svg',
    margin: 2,
    errorCorrectionLevel: 'M',
  })
}

/**
 * Build the full share URL for an event or calendar.
 */
export function buildShareURL(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/share/${token}`
}

/**
 * Build the RSVP URL for an invitation.
 */
export function buildRSVPURL(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/invite/${token}`
}

/**
 * Build a poll URL.
 */
export function buildPollURL(pollId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/poll/${pollId}`
}
