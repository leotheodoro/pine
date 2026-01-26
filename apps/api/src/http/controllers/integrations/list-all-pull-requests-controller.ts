import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeListAllPullRequestsService } from '../../../services/_factories/integrations/make-list-all-pull-requests-service'

export async function listAllPullRequestsController(request: FastifyRequest, reply: FastifyReply) {
  const listAllPullRequestsQuerySchema = z.object({
    bitbucketRepoSlug: z.string().optional(),
    azureProject: z.string().optional(),
    azureRepoId: z.string().optional(),
  })

  const { bitbucketRepoSlug, azureProject, azureRepoId } = listAllPullRequestsQuerySchema.parse(request.query)

  if (!bitbucketRepoSlug && !azureProject) {
    return reply.status(400).send({
      message: 'At least one integration must be specified (Bitbucket or Azure DevOps)',
    })
  }

  if (bitbucketRepoSlug && !azureProject && !azureRepoId) {
    // Bitbucket only
  } else if (!bitbucketRepoSlug && azureProject && azureRepoId) {
    // Azure only
  } else if (bitbucketRepoSlug && azureProject && azureRepoId) {
    // Both
  } else {
    return reply.status(400).send({
      message: 'Invalid parameter combination. Provide complete information for each integration.',
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
      ...(azureProject &&
        azureRepoId && {
          azure: {
            project: azureProject,
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
