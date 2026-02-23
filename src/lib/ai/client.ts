import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

/**
 * Send a chat message to Gemini and get a response.
 * Server-side only!
 */
export async function chat(
  systemPrompt: string,
  messages: ChatMessage[],
  options?: { maxTokens?: number; temperature?: number }
): Promise<string> {
  const chatSession = model.startChat({
    history: messages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
    generationConfig: {
      maxOutputTokens: options?.maxTokens || 1024,
      temperature: options?.temperature || 0.7,
    },
    systemInstruction: systemPrompt,
  })

  const lastMessage = messages[messages.length - 1]
  const result = await chatSession.sendMessage(lastMessage.content)
  return result.response.text()
}

/**
 * Send an image to Gemini for event extraction (Vision/OCR).
 * Server-side only! Gemini 2.0 Flash has native vision — FREE.
 */
export async function extractFromImage(
  systemPrompt: string,
  imageBase64: string,
  mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' = 'image/jpeg'
): Promise<string> {
  const result = await model.generateContent([
    systemPrompt + '\n\nExtract the event information from this image. Return only valid JSON.',
    {
      inlineData: {
        data: imageBase64,
        mimeType: mediaType,
      },
    },
  ])

  return result.response.text()
}

/**
 * Stream a chat response (for the AI chat panel).
 * Returns a ReadableStream for server-sent events.
 */
export async function streamChat(
  systemPrompt: string,
  messages: ChatMessage[]
): Promise<ReadableStream> {
  const chatSession = model.startChat({
    history: messages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
    generationConfig: {
      maxOutputTokens: 1024,
      temperature: 0.7,
    },
    systemInstruction: systemPrompt,
  })

  const lastMessage = messages[messages.length - 1]
  const result = await chatSession.sendMessageStream(lastMessage.content)
  const encoder = new TextEncoder()

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of result.stream) {
          const text = chunk.text()
          if (text) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
            )
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      } catch (error) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`)
        )
        controller.close()
      }
    },
  })
}

/**
 * Simple one-shot generation (no chat history).
 * For planning, suggestions, checklists, etc.
 */
export async function generate(
  prompt: string,
  systemPrompt?: string
): Promise<string> {
  const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt
  const result = await model.generateContent(fullPrompt)
  return result.response.text()
}
