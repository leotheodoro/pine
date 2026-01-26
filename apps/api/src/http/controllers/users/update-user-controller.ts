import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { UserNotFoundError } from '@/services/_errors/user-not-found-error'
import { makeUpdateUserService } from '@/services/_factories/users/make-update-user-service'

export async function updateUserController(request: FastifyRequest, reply: FastifyReply) {
  const userId = await request.getCurrentUserId()

  const updateUserBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(3),
    username: z.string(),
    avatar_url: z.string().optional(),
    bitbucket_email: z.string().optional(),
    bitbucket_api_token: z.string().optional(),
    bitbucket_workspace: z.string().optional(),
    azure_devops_org: z.string().optional(),
    azure_devops_pat: z.string().optional(),
    azure_devops_project: z.string().optional(),
    repositories: z
      .array(
        z.object({
          provider: z.enum(['bitbucket', 'azure']),
          identifier: z.string(),
        })
      )
      .optional(),
  })

  const {
    name,
    email,
    password,
    username,
    avatar_url,
    bitbucket_email,
    bitbucket_api_token,
    bitbucket_workspace,
    azure_devops_org,
    azure_devops_pat,
    azure_devops_project,
    repositories,
  } = updateUserBodySchema.parse(request.body)

  try {
    const updateUserService = makeUpdateUserService()

    const { user } = await updateUserService.execute({
      id: userId,
      name,
      email,
      password,
      username,
      avatar_url,
      bitbucket_email,
      bitbucket_api_token,
      bitbucket_workspace,
      azure_devops_org,
      azure_devops_pat,
      azure_devops_project,
      repositories,
    })

    return reply.status(201).send(user)
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return reply.status(404).send({ message: 'User not found' })
    }

    return reply.status(500).send({ message: 'Internal server error' })
  }
}
