import { streamText } from 'ai'
import { createAnthropic } from '@ai-sdk/anthropic'

export const config = {
  runtime: 'edge',
}

interface IncomingMessage {
  role: string
  content?: string
  parts?: Array<{ type: string; text?: string }>
}

function convertMessages(messages: IncomingMessage[]) {
  return messages
    .filter((m) => m.role !== 'system')
    .map((m) => {
      const textFromParts = m.parts
        ?.filter((p) => p.type === 'text')
        .map((p) => p.text ?? '')
        .join('')
      const content = textFromParts || m.content || ''
      return {
        role: m.role as 'user' | 'assistant',
        content,
      }
    })
}

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const { messages, systemPrompt, apiKey, model } = await req.json()

  if (!apiKey) {
    return new Response(JSON.stringify({ error: '请先设置 API Key' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const anthropic = createAnthropic({ apiKey })

  const result = streamText({
    model: anthropic(model || 'claude-sonnet-4-6'),
    system: systemPrompt,
    messages: convertMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}
