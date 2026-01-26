import { FastifyInstance } from 'fastify'

import { authenticateController } from '@/http/controllers/users/authenticate'
import { createUserController } from '@/http/controllers/users/create-user-controller'
import { profileController } from '@/http/controllers/users/profile'
import { updateUserController } from '@/http/controllers/users/update-user-controller'
import { auth } from '@/http/middlewares/auth'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', createUserController)
  app.post('/authenticate', authenticateController)

  app.register(auth).get('/profile', { onRequest: [verifyJWT] }, profileController)
  app.put('/users', { onRequest: [verifyJWT] }, updateUserController)
}
