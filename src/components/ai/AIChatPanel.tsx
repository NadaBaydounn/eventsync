'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
  Sparkles,
  X,
  Send,
  Loader2,
  CalendarPlus,
} from 'lucide-react'

import { useAppStore } from '@/lib/store'
import { useEvents } from '@/lib/hooks/useEvents'
import { getEventTheme } from '@/lib/constants/event-themes'
import { slideInRight } from '@/lib/constants/animations'
import { formatRelative } from '@/lib/utils/dates'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface EventAction {
  action: 'create_event'
  data: {
    title: string
    event_type?: string
    start_time?: string
    end_time?: string
    location?: string
    description?: string
  }
}

function extractEventAction(text: string): EventAction | null {
  const jsonMatch = text.match(/```json\s*([\s\S]*?)```/)
  if (!jsonMatch) return null
  try {
    const parsed = JSON.parse(jsonMatch[1].trim())
    if (parsed.action === 'create_event' && parsed.data?.title) {
      return parsed as EventAction
    }
  } catch {
    // not valid JSON
  }
  return null
}

function removeJsonBlock(text: string): string {
  return text.replace(/```json\s*[\s\S]*?```/, '').trim()
}

export function AIChatPanel() {
  const { aiChatOpen, setAIChatOpen } = useAppStore()
  const { upcomingEvents, createEvent } = useEvents()

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [creatingEvent, setCreatingEvent] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (aiChatOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [aiChatOpen])

  const buildEventContext = useCallback(() => {
    if (upcomingEvents.length === 0) return 'No upcoming events.'
    return upcomingEvents
      .slice(0, 10)
      .map(
        (e) =>
          `- ${e.title} (${e.event_type}) — ${formatRelative(e.start_time)}${e.location ? ` at ${e.location}` : ''}`
      )
      .join('\n')
  }, [upcomingEvents])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || streaming) return

    const userMsg: Message = { role: 'user', content: text }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setStreaming(true)

    // Add empty assistant message for streaming
    const assistantMsg: Message = { role: 'assistant', content: '' }
    setMessages([...updatedMessages, assistantMsg])

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          eventContext: buildEventContext(),
        }),
      })

      if (!res.ok) {
        throw new Error('Chat request failed')
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error('No stream reader')

      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              if (parsed.text) {
                fullText += parsed.text
                setMessages((prev) => {
                  const updated = [...prev]
                  updated[updated.length - 1] = {
                    role: 'assistant',
                    content: fullText,
                  }
                  return updated
                })
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: "Sorry, I couldn't process that request. Please try again.",
        }
        return updated
      })
    } finally {
      setStreaming(false)
    }
  }

  const handleCreateEvent = async (action: EventAction) => {
    setCreatingEvent(true)
    try {
      const result = await createEvent({
        title: action.data.title,
        event_type: (action.data.event_type as never) || 'general',
        start_time: action.data.start_time || new Date().toISOString(),
        end_time:
          action.data.end_time ||
          new Date(Date.now() + 3600000).toISOString(),
        location: action.data.location,
        description: action.data.description,
      })
      if (result) {
        toast.success(`Event "${action.data.title}" created!`)
      }
    } catch {
      toast.error('Failed to create event')
    } finally {
      setCreatingEvent(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <AnimatePresence>
      {aiChatOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
            onClick={() => setAIChatOpen(false)}
          />

          {/* Panel */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l bg-background/95 shadow-2xl backdrop-blur-md"
          >
            {/* Gradient top border */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500" />

            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold">AI Assistant</h2>
                  <p className="text-[11px] text-muted-foreground">
                    Powered by Gemini
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setAIChatOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin">
              {messages.length === 0 && (
                <div className="flex flex-col items-center gap-3 py-16 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10">
                    <Sparkles className="h-7 w-7 text-purple-500" />
                  </div>
                  <h3 className="text-sm font-semibold">
                    How can I help?
                  </h3>
                  <p className="max-w-xs text-xs text-muted-foreground">
                    Ask me to create events, search your calendar, or get
                    planning tips.
                  </p>
                  <div className="mt-2 flex flex-wrap justify-center gap-2">
                    {[
                      'Add a team meeting tomorrow at 2pm',
                      'What events do I have this week?',
                      'Plan a birthday party',
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => {
                          setInput(suggestion)
                          setTimeout(() => inputRef.current?.focus(), 0)
                        }}
                        className="rounded-full border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => {
                const isUser = msg.role === 'user'
                const eventAction =
                  !isUser ? extractEventAction(msg.content) : null
                const displayText = eventAction
                  ? removeJsonBlock(msg.content)
                  : msg.content
                const isStreaming =
                  streaming && i === messages.length - 1 && !isUser

                return (
                  <div
                    key={i}
                    className={cn(
                      'mb-3 flex',
                      isUser ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                        isUser
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      {displayText || (isStreaming && (
                        <span className="inline-flex items-center gap-1">
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0ms]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:150ms]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:300ms]" />
                        </span>
                      ))}

                      {/* Event Action Card */}
                      {eventAction && (
                        <div className="mt-3 rounded-xl border bg-background p-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {getEventTheme(
                                (eventAction.data.event_type as never) ||
                                  'general'
                              ).emoji}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-foreground">
                                {eventAction.data.title}
                              </p>
                              {eventAction.data.start_time && (
                                <p className="text-xs text-muted-foreground">
                                  {new Date(
                                    eventAction.data.start_time
                                  ).toLocaleDateString(undefined, {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                  })}
                                </p>
                              )}
                            </div>
                          </div>
                          {eventAction.data.location && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              {eventAction.data.location}
                            </p>
                          )}
                          <Button
                            size="sm"
                            className="mt-2 w-full gap-2"
                            disabled={creatingEvent}
                            onClick={() => handleCreateEvent(eventAction)}
                          >
                            {creatingEvent ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <CalendarPlus className="h-3 w-3" />
                            )}
                            Create Event
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t px-4 py-3">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything..."
                  disabled={streaming}
                  className="flex-1 rounded-lg border bg-muted/50 px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:bg-background focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />
                <Button
                  size="icon"
                  disabled={!input.trim() || streaming}
                  onClick={sendMessage}
                  className="shrink-0"
                >
                  {streaming ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
                Press Enter to send · Cmd+/ to toggle
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
