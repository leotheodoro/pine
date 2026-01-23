import { FastifyReply, FastifyRequest } from 'fastify'

import { prisma } from '@/lib/prisma'
import { UserNotFoundError } from '@/services/_errors/user-not-found-error'

export async function profileController(request: FastifyRequest, reply: FastifyReply) {
  const userId = await request.getCurrentUserId()

  const user = await prisma.user.findUnique({
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      avatar_url: true,
    },
    where: { id: userId },
  })

  if (!user) {
    throw new UserNotFoundError()
  }

  return reply.send({ user })
}
