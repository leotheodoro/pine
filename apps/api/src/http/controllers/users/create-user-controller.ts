import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { UserAlreadyExistsError } from '@/services/_errors/user-already-exists-error'
import { makeCreateUserService } from '@/services/_factories/users/make-create-user-service'

export async function createUserController(request: FastifyRequest, reply: FastifyReply) {
  const createUserBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(3),
    username: z.string(),
  })

  const { name, email, password, username } = createUserBodySchema.parse(request.body)

  try {
    const createUserService = makeCreateUserService()

    const { user } = await createUserService.execute({
      name,
      email,
      password,
      username,
    })

    return reply.status(201).send(user)
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: 'User already exists with this email' })
    }

    return reply.status(500).send({ message: 'Internal server error' })
  }
}
