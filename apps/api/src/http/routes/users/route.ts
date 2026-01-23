import { FastifyInstance } from 'fastify'

import { authenticateController } from '@/http/controllers/users/authenticate'
import { createUserController } from '@/http/controllers/users/create-user-controller'
import { profileController } from '@/http/controllers/users/profile'
import { auth } from '@/http/middlewares/auth'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function usersRoutes(app: FastifyInstance) {
  app.post(
    '/users',
    {
      onRequest: [verifyJWT],
    },
    createUserController
  )

  app.post('/authenticate', authenticateController)
  app.register(auth).get('/profile', { onRequest: [verifyJWT] }, profileController)
}
