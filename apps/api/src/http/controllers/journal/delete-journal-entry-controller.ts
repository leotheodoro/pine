import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeDeleteJournalEntryService } from '@/services/_factories/journal/make-delete-journal-entry-service'

export async function deleteJournalEntryController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })
  const { id } = paramsSchema.parse(request.params)

  const deleteJournalEntryService = makeDeleteJournalEntryService()
  await deleteJournalEntryService.execute({ id })

  return reply.status(204).send()
}
