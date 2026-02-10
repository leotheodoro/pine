import { FastifyReply, FastifyRequest } from 'fastify'

import { makeListAllPullRequestsService } from '../../../services/_factories/integrations/make-list-all-pull-requests-service'

export async function listAllPullRequestsController(
  request: FastifyRequest<{ Querystring: { includeCompleted?: string } }>,
  reply: FastifyReply
) {
  try {
    const userId = await request.getCurrentUserId()
    const includeCompleted = request.query.includeCompleted === 'true'

    const listAllPullRequestsService = makeListAllPullRequestsService()

    const result = await listAllPullRequestsService.execute({
      userId,
      includeCompleted,
    })

    return reply.status(200).send({
      pullRequests: result.pullRequests,
      summary: result.summary,
      ...(result.errors && { errors: result.errors }),
    })
  } catch (error) {
    return reply.status(500).send({
      message: 'Internal server error',
    })
  }
}
