import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeListJournalEntriesService } from '@/services/_factories/journal/make-list-journal-entries-service'

export async function listJournalEntriesController(
  request: FastifyRequest<{ Querystring: { page?: string; pageSize?: string } }>,
  reply: FastifyReply
) {
  const querySchema = z.object({
    page: z.coerce.number().int().min(0).default(0),
    pageSize: z.coerce.number().int().min(1).max(50).default(20),
  })
  const { page, pageSize } = querySchema.parse(request.query)
  const userId = await request.getCurrentUserId()

  const listJournalEntriesService = makeListJournalEntriesService()
  const result = await listJournalEntriesService.execute({ userId, page, pageSize })

  return reply.status(200).send(result)
}
