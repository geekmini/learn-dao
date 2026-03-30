import { streamText } from 'ai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createClient } from '@supabase/supabase-js'

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

  const { messages, systemPrompt, apiKey, model, authToken } = await req.json()

  if (!authToken) {
    return new Response(JSON.stringify({ error: '请先登录' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseServiceKey) {
    return new Response(JSON.stringify({ error: '服务器配置错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
    global: { headers: { Authorization: `Bearer ${authToken}` } },
  })
  const { error } = await adminClient.auth.getUser()
  if (error) {
    return new Response(JSON.stringify({ error: '登录已过期，请重新登录' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

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
