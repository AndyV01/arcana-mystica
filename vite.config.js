import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function apiDevPlugin() {
  // cache por handler (mejora performance en dev)
  const handlers = {}

  async function getHandler(path) {
    if (!handlers[path]) {
      const mod = await import(path)
      handlers[path] = mod.default
    }
    return handlers[path]
  }

  function createResponseAdapter(res) {
    return {
      status(code) {
        res.statusCode = code
        return this
      },
      json(payload) {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(payload))
      }
    }
  }

  return {
    name: 'api-dev-middleware',
    apply: 'serve',
    configureServer(server) {

      // ─── GENERATE READING ─────────────────────────────────────────────
      server.middlewares.use('/api/generate-reading', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        let rawBody = ''
        req.on('data', chunk => rawBody += chunk)

        req.on('end', async () => {
          try {
            req.body = rawBody ? JSON.parse(rawBody) : {}
            const handler = await getHandler('./api/generate-reading.js')
            await handler(req, createResponseAdapter(res))
          } catch (error) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: error.message }))
          }
        })
      })

      // ─── CHECK CREDITS ────────────────────────────────────────────────
      server.middlewares.use('/api/check-credits', async (req, res) => {
        try {
          const url = new URL(req.url, 'http://localhost')
          req.query = Object.fromEntries(url.searchParams)

          const handler = await getHandler('./api/check-credits.js')
          await handler(req, createResponseAdapter(res))
        } catch (error) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: error.message }))
        }
      })
      // ─── CREATE PREFERENCE ─────────────────────────────────────
      server.middlewares.use('/api/create-preference', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        let rawBody = ''
        req.on('data', chunk => rawBody += chunk)

        req.on('end', async () => {
          try {
            req.body = rawBody ? JSON.parse(rawBody) : {}

            const handler = await getHandler('./api/create-preference.js')
            await handler(req, createResponseAdapter(res))

          } catch (error) {
            console.error("create-preference error:", error)
            res.statusCode = 500
            res.end(JSON.stringify({ error: error.message }))
          }
        })
      })
      // ─── USE CREDIT ───────────────────────────────────────────────────
      server.middlewares.use('/api/use-credit', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        let rawBody = ''
        req.on('data', chunk => rawBody += chunk)

        req.on('end', async () => {
          try {
            req.body = rawBody ? JSON.parse(rawBody) : {}

            const handler = await getHandler('./api/use-credit.js')
            await handler(req, createResponseAdapter(res))
          } catch (error) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: error.message }))
          }
        })
      })

    }
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  process.env = {
    ...process.env,
    ...env
  }

  return {
    plugins: [react(), apiDevPlugin()],
    base: './'
  }
})
