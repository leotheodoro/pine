import { FastifyInstance } from 'fastify'

import { integrationsRoutes } from './integrations'
import { journalRoutes } from './journal'
import { usersRoutes } from './users/route'

export async function routes(app: FastifyInstance) {
  app.register(usersRoutes)
  app.register(integrationsRoutes)
  app.register(journalRoutes)
}
