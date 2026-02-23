# Skill: AI Integration (Google Gemini)

## Architecture
- All AI calls go through API routes (server-side only)
- Client components call `/api/ai/chat` or `/api/ai/extract`
- The Gemini client is at `src/lib/ai/client.ts`
- System prompts are at `src/lib/ai/prompts/index.ts`

## Available AI Functions

### chat() — Multi-turn conversation
```tsx
import { chat } from "@/lib/ai/client"
const response = await chat(systemPrompt, messages, { temperature: 0.7 })
```

### streamChat() — Streaming responses (for chat panel)
```tsx
import { streamChat } from "@/lib/ai/client"
const stream = await streamChat(systemPrompt, messages)
return new Response(stream, { headers: { "Content-Type": "text/event-stream" } })
```

### extractFromImage() — Vision/OCR
```tsx
import { extractFromImage } from "@/lib/ai/client"
const result = await extractFromImage(systemPrompt, base64Image, "image/jpeg")
```

### generate() — One-shot generation
```tsx
import { generate } from "@/lib/ai/client"
const plan = await generate("Plan a birthday party for 20 people", PLANNER_SYSTEM_PROMPT)
```

## System Prompts
- `CHATBOT_SYSTEM_PROMPT` — Natural language event creation, app navigation
- `EXTRACTOR_SYSTEM_PROMPT` — Image/PDF → structured event JSON
- `PLANNER_SYSTEM_PROMPT` — Event planning (checklist, budget, logistics)
- `SUGGESTER_SYSTEM_PROMPT` — What to wear, bring, prepare
- `VOICE_PARSER_SYSTEM_PROMPT` — Speech transcript → event data
- `DAILY_BRIEFING_PROMPT` — Morning briefing generation

## Template Variables
```tsx
import { fillPromptTemplate } from "@/lib/ai/prompts"
const prompt = fillPromptTemplate(CHATBOT_SYSTEM_PROMPT, {
  TODAY: new Date().toISOString().split("T")[0],
  EVENTS_CONTEXT: JSON.stringify(userEvents),
})
```

## Client-Side Streaming Pattern
```tsx
const response = await fetch("/api/ai/chat", {
  method: "POST",
  body: JSON.stringify({ messages, eventContext }),
})
const reader = response.body.getReader()
const decoder = new TextDecoder()
while (true) {
  const { done, value } = await reader.read()
  if (done) break
  const chunk = decoder.decode(value)
  // Parse SSE: "data: {"text": "..."}\n\n"
}
```

## Free Tier Limits
- 15 requests per minute
- 1,500 requests per day
- 1M tokens per minute
- Vision support included
