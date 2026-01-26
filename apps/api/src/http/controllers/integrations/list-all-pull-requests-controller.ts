import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeListAllPullRequestsService } from '../../../services/_factories/integrations/make-list-all-pull-requests-service'

export async function listAllPullRequestsController(request: FastifyRequest, reply: FastifyReply) {
  const listAllPullRequestsQuerySchema = z.object({
    bitbucketRepoSlug: z.string().optional(),
    azureRepoId: z.string().optional(),
  })

  const { bitbucketRepoSlug, azureRepoId } = listAllPullRequestsQuerySchema.parse(request.query)

  if (!bitbucketRepoSlug && !azureRepoId) {
    return reply.status(400).send({
      message: 'At least one integration must be specified (bitbucketRepoSlug or azureRepoId)',
    })
  }

  try {
    const userId = await request.getCurrentUserId()

    const listAllPullRequestsService = makeListAllPullRequestsService()

    const result = await listAllPullRequestsService.execute({
      userId,
      ...(bitbucketRepoSlug && {
        bitbucket: {
          repoSlug: bitbucketRepoSlug,
        },
      }),
      ...(azureRepoId && {
        azure: {
          repoId: azureRepoId,
        },
      }),
    })

    return reply.status(200).send({
      count: result.pullRequests.length,
      pullRequests: result.pullRequests,
      sources: result.sources,
      ...(result.errors && { errors: result.errors }),
    })
  } catch (error) {
    return reply.status(500).send({
      message: 'Internal server error',
    })
  }
}
