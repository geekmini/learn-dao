import { describe, it, expect } from 'vitest'
import handler from '../../../api/chat'

const API_KEY = process.env.ANTHROPIC_API_KEY

describe('/api/chat handler', () => {
  it('should reject non-POST requests', async () => {
    const req = new Request('http://localhost/api/chat', { method: 'GET' })
    const res = await handler(req)
    expect(res.status).toBe(405)
  })

  it('should return 401 when authToken is missing', async () => {
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [],
        systemPrompt: '',
        apiKey: '',
        model: 'claude-sonnet-4-6',
      }),
    })
    const res = await handler(req)
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toBe('请先登录')
  })
})

const describeIfApiKey = API_KEY ? describe : describe.skip

describeIfApiKey('Real API call (requires ANTHROPIC_API_KEY)', () => {
  it('should stream a response from Claude', async () => {
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: '用一句话解释什么是道。',
          },
        ],
        systemPrompt: '你是正一派道教导师，用中文简短回答。',
        apiKey: API_KEY,
        model: 'claude-sonnet-4-6',
      }),
    })

    const res = await handler(req)
    expect(res.status).toBe(200)
    expect(res.body).not.toBeNull()

    const reader = res.body!.getReader()
    const chunks: string[] = []

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(new TextDecoder().decode(value))
    }

    const fullResponse = chunks.join('')
    expect(fullResponse.length).toBeGreaterThan(0)
    // Verify stream contains actual message content, not just error
    expect(fullResponse).not.toContain('"type":"error"')
  }, 30_000)
})
