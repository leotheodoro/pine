import { FastifyInstance } from 'fastify'
import { fastifyPlugin } from 'fastify-plugin'

import { NotAuthorizedError } from '@/services/_errors/not-authorized-error'

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.decorateRequest('getCurrentUserId')

  app.addHook('preHandler', async (request) => {
    request.getCurrentUserId = async () => {
      try {
        const { sub } = await request.jwtVerify<{ sub: string }>()

        return sub
      } catch (error) {
        throw new NotAuthorizedError()
      }
    }
  })
})
