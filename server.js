import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const require = createRequire(import.meta.url)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const jsonServer = require('json-server')
const cors = require('cors')

const server = jsonServer.create()
const router = jsonServer.router(join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults({
  static: './dist'
})

const port = process.env.PORT || 3001

// Enable CORS for all origins
server.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))

// Handle preflight requests
server.options('*', cors())

server.use(middlewares)

// Add /api prefix for all routes
server.use('/api', router)

// Also serve routes without prefix for backward compatibility
server.use(router)

server.listen(port, '0.0.0.0', () => {
  console.log(`🚀 JSON Server is running on port ${port}`)
  console.log(`📦 API endpoints:`)
  console.log(`   - http://localhost:${port}/api/users`)
  console.log(`   - http://localhost:${port}/api/stats`)
  console.log(`   - http://localhost:${port}/api/campaigns`)
  console.log(`   - http://localhost:${port}/api/products`)
  console.log(`   - http://localhost:${port}/api/teamRankings`)
  console.log(`   - http://localhost:${port}/api/competitors`)
  console.log(`   - http://localhost:${port}/api/categories`)
})
