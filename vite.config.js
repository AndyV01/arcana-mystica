import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function apiDevPlugin() {
  let cachedHandler = null

  async function getHandler() {
    if (!cachedHandler) {
      const mod = await import('./api/generate-reading.js')
      cachedHandler = mod.default
    }

    return cachedHandler
  }

  return {
    name: 'api-dev-middleware',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/generate-reading', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        let rawBody = ''
        req.on('data', chunk => {
          rawBody += chunk
        })

        req.on('end', async () => {
          try {
            req.body = rawBody ? JSON.parse(rawBody) : {}
          } catch {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Invalid JSON body' }))
            return
          }

          const responseAdapter = {
            status(code) {
              res.statusCode = code
              return this
            },
            json(payload) {
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(payload))
            }
          }

          try {
            const handler = await getHandler()
            await handler(req, responseAdapter)
          } catch (error) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: error.message }))
          }
        })
      })
    }
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Disponibiliza variables de .env/.env.local para el handler en dev.
  process.env = {
    ...process.env,
    ...env
  }

  return {
    plugins: [react(), apiDevPlugin()],
    base: './'
  }
})
