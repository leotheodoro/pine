import { FastifyInstance } from 'fastify'

import { listAllPullRequestsController } from '../../controllers/integrations/list-all-pull-requests-controller'
import { auth } from '../../middlewares/auth'
import { verifyJWT } from '../../middlewares/verify-jwt'

export async function integrationsRoutes(app: FastifyInstance) {
  app.register(auth).get(
    '/integrations/pull-requests',
    {
      onRequest: [verifyJWT],
    },
    listAllPullRequestsController
  )
}
