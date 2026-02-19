import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeCreateJournalEntryService } from '@/services/_factories/journal/make-create-journal-entry-service'

export async function createJournalEntryController(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD'),
    content: z.string().min(1, 'content cannot be empty'),
  })
  const { date: dateStr, content } = bodySchema.parse(request.body)
  const userId = await request.getCurrentUserId()
  const date = new Date(dateStr + 'T00:00:00.000Z')

  const createJournalEntryService = makeCreateJournalEntryService()
  const { entry } = await createJournalEntryService.execute({ userId, date, content })

  return reply.status(201).send({ entry })
}
