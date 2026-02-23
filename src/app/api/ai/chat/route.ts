import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { streamChat, type ChatMessage } from '@/lib/ai/client'
import { CHATBOT_SYSTEM_PROMPT, fillPromptTemplate } from '@/lib/ai/prompts'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const body = await req.json()
    const { messages, eventContext } = body as {
      messages: ChatMessage[]
      eventContext?: string
    }

    // Build system prompt with context
    const systemPrompt = fillPromptTemplate(CHATBOT_SYSTEM_PROMPT, {
      TODAY: new Date().toISOString().split('T')[0],
      EVENTS_CONTEXT: eventContext || 'No events loaded.',
    })

    // Stream response
    const stream = await streamChat(systemPrompt, messages)

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('AI chat error:', error)
    return new Response(
      JSON.stringify({ error: 'AI service error' }),
      { status: 500 }
    )
  }
}
