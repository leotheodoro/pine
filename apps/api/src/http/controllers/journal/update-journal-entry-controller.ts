import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeUpdateJournalEntryService } from '@/services/_factories/journal/make-update-journal-entry-service'

export async function updateJournalEntryController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })
  const bodySchema = z.object({
    content: z.string().min(1, 'content cannot be empty'),
  })
  const { id } = paramsSchema.parse(request.params)
  const { content } = bodySchema.parse(request.body)

  const updateJournalEntryService = makeUpdateJournalEntryService()
  const { entry } = await updateJournalEntryService.execute({ id, content })

  return reply.status(200).send({ entry })
}
