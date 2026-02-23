'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  Link2,
  Copy,
  Check,
  ExternalLink,
  Download,
  QrCode,
  Eye,
  Loader2,
} from 'lucide-react'

import { useAuth } from '@/lib/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { generateQRCode, buildShareURL } from '@/lib/utils/qrcode'
import {
  getGoogleCalendarURL,
  getOutlookCalendarURL,
  exportEventToICS,
} from '@/lib/utils/export'
import type { Event, ShareLink } from '@/types/events'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ShareDialogProps {
  event: Event
  open: boolean
  onOpenChange: (open: boolean) => void
}

function getExpirationDate(
  value: 'never' | '1d' | '7d' | '30d'
): string | null {
  if (value === 'never') return null
  const days = value === '1d' ? 1 : value === '7d' ? 7 : 30
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

export function ShareDialog({ event, open, onOpenChange }: ShareDialogProps) {
  const { user } = useAuth()
  const supabase = createClient()

  const [shareLink, setShareLink] = useState<ShareLink | null>(null)
  const [shareURL, setShareURL] = useState<string | null>(null)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [expiresIn, setExpiresIn] = useState<'never' | '1d' | '7d' | '30d'>(
    'never'
  )

  const loadExistingLink = useCallback(async () => {
    if (!user || !open) return
    setLoading(true)
    try {
      const { data } = await supabase
        .from('share_links')
        .select('*')
        .eq('target_id', event.id)
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (data) {
        const link = data as ShareLink
        setShareLink(link)
        const url = buildShareURL(link.token)
        setShareURL(url)
        const qr = await generateQRCode(url)
        setQrCode(qr)
      }
    } catch {
      // No existing link — that's fine
    } finally {
      setLoading(false)
    }
  }, [user, open, event.id, supabase])

  useEffect(() => {
    if (open) {
      loadExistingLink()
    } else {
      // Reset state when closing
      setShareLink(null)
      setShareURL(null)
      setQrCode(null)
      setCopied(false)
    }
  }, [open, loadExistingLink])

  const handleGenerateLink = async () => {
    if (!user) return
    setGenerating(true)
    try {
      const { data, error } = await supabase
        .from('share_links')
        .insert({
          scope: 'single_event',
          target_id: event.id,
          created_by: user.id,
          permissions: 'view',
          expires_at: getExpirationDate(expiresIn),
        })
        .select()
        .single()

      if (error) throw error

      const link = data as ShareLink
      setShareLink(link)
      const url = buildShareURL(link.token)
      setShareURL(url)
      const qr = await generateQRCode(url)
      setQrCode(qr)
      toast.success('Share link created!')
    } catch {
      toast.error('Failed to generate share link')
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = async () => {
    if (!shareURL) return
    try {
      await navigator.clipboard.writeText(shareURL)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  const handleDownloadQR = () => {
    if (!qrCode) return
    const link = document.createElement('a')
    link.href = qrCode
    link.download = `${event.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-qr.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            Share Event
          </DialogTitle>
          <DialogDescription>{event.title}</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : shareURL ? (
          <div className="space-y-4">
            {/* Link Display */}
            <div>
              <Label className="mb-1.5 text-xs text-muted-foreground">
                Share Link
              </Label>
              <div className="flex gap-2">
                <Input
                  value={shareURL}
                  readOnly
                  className="text-xs"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCopy}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* QR Code */}
            {qrCode && (
              <div className="flex flex-col items-center gap-3">
                <div className="rounded-xl border bg-white p-3">
                  <img
                    src={qrCode}
                    alt="QR Code"
                    className="h-48 w-48"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={handleDownloadQR}
                >
                  <QrCode className="h-3.5 w-3.5" />
                  Download QR Code
                </Button>
              </div>
            )}

            <Separator />

            {/* Stats */}
            {shareLink && (
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Eye className="h-3.5 w-3.5" />
                Viewed {shareLink.view_count} time
                {shareLink.view_count !== 1 ? 's' : ''}
              </div>
            )}

            <Separator />

            {/* Add to Calendar */}
            <div>
              <Label className="mb-2 block text-xs text-muted-foreground">
                Add to Calendar
              </Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() =>
                    window.open(getGoogleCalendarURL(event), '_blank')
                  }
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Google Calendar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() =>
                    window.open(getOutlookCalendarURL(event), '_blank')
                  }
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Outlook
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => exportEventToICS(event)}
                >
                  <Download className="h-3.5 w-3.5" />
                  .ics File
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            {/* Expiration Picker */}
            <div>
              <Label className="mb-1.5 text-xs text-muted-foreground">
                Link Expiration
              </Label>
              <Select
                value={expiresIn}
                onValueChange={(v) =>
                  setExpiresIn(v as 'never' | '1d' | '7d' | '30d')
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never expires</SelectItem>
                  <SelectItem value="1d">Expires in 1 day</SelectItem>
                  <SelectItem value="7d">Expires in 7 days</SelectItem>
                  <SelectItem value="30d">Expires in 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full gap-2"
              onClick={handleGenerateLink}
              disabled={generating}
            >
              {generating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Link2 className="h-4 w-4" />
              )}
              {generating ? 'Generating...' : 'Generate Share Link'}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Anyone with the link can view this event and RSVP.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
