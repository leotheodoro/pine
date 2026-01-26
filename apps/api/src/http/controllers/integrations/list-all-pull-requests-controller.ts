import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeListAllPullRequestsService } from '../../../services/_factories/integrations/make-list-all-pull-requests-service'

export async function listAllPullRequestsController(request: FastifyRequest, reply: FastifyReply) {
  const listAllPullRequestsQuerySchema = z.object({
    bitbucketWorkspace: z.string().optional(),
    bitbucketRepoSlug: z.string().optional(),
    azureProject: z.string().optional(),
    azureRepoId: z.string().optional(),
    azureTop: z.coerce.number().max(200).optional(),
  })

  const { bitbucketWorkspace, bitbucketRepoSlug, azureProject, azureRepoId, azureTop } =
    listAllPullRequestsQuerySchema.parse(request.query)

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
          workspace: bitbucketWorkspace,
          repoSlug: bitbucketRepoSlug,
        },
      }),
      ...(azureProject &&
        azureRepoId && {
          azure: {
            project: azureProject,
            repoId: azureRepoId,
            top: azureTop,
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
