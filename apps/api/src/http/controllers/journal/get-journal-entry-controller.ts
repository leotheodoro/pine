import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeGetJournalEntryService } from '@/services/_factories/journal/make-get-journal-entry-service'

export async function getJournalEntryController(
  request: FastifyRequest<{ Querystring: { date?: string } }>,
  reply: FastifyReply
) {
  const querySchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD'),
  })
  const { date: dateStr } = querySchema.parse(request.query)
  const userId = await request.getCurrentUserId()
  const date = new Date(dateStr + 'T00:00:00.000Z')

  const getJournalEntryService = makeGetJournalEntryService()
  const { entries } = await getJournalEntryService.execute({ userId, date })

  return reply.status(200).send({ entries })
}
