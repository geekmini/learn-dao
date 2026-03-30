import { createServer } from 'node:http'
import { config } from 'dotenv'

config({ path: '.env.local' })
config()

const PORT = 3000

createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.method === 'POST' && req.url === '/api/chat') {
    const chunks: Buffer[] = []
    for await (const chunk of req) chunks.push(chunk as Buffer)
    const body = JSON.parse(Buffer.concat(chunks).toString())

    const handler = (await import('../api/chat.js')).default
    const request = new Request(`http://localhost:${PORT}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const response = await handler(request)

    res.writeHead(response.status, {
      'Content-Type': response.headers.get('content-type') || 'text/plain',
      'Access-Control-Allow-Origin': '*',
    })

    if (response.body) {
      const reader = response.body.getReader()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        res.write(value)
      }
    }
    res.end()
  } else {
    res.writeHead(404)
    res.end('Not found')
  }
}).listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`)
})
