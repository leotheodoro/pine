import { FastifyInstance } from 'fastify'

import { usersRoutes } from './users/route'

export async function routes(app: FastifyInstance) {
  app.register(usersRoutes)
}
