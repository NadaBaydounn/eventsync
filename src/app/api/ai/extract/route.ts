import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { extractFromImage } from '@/lib/ai/client'
import { EXTRACTOR_SYSTEM_PROMPT, fillPromptTemplate } from '@/lib/ai/prompts'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { image, mediaType } = body as {
      image: string // base64
      mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
    }

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const systemPrompt = fillPromptTemplate(EXTRACTOR_SYSTEM_PROMPT, {
      TODAY: new Date().toISOString().split('T')[0],
    })

    const result = await extractFromImage(systemPrompt, image, mediaType)

    // Try to parse JSON from response
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const eventData = JSON.parse(jsonMatch[0])
        return NextResponse.json({ success: true, event: eventData })
      }
    } catch {
      // If parsing fails, return raw text
    }

    return NextResponse.json({ success: false, raw: result })
  } catch (error) {
    console.error('AI extract error:', error)
    return NextResponse.json({ error: 'Extraction failed' }, { status: 500 })
  }
}
