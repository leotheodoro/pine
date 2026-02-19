import { FastifyInstance } from 'fastify'

import { createJournalEntryController } from '../../controllers/journal/create-journal-entry-controller'
import { deleteJournalEntryController } from '../../controllers/journal/delete-journal-entry-controller'
import { getJournalEntryController } from '../../controllers/journal/get-journal-entry-controller'
import { listJournalEntriesController } from '../../controllers/journal/list-journal-entries-controller'
import { updateJournalEntryController } from '../../controllers/journal/update-journal-entry-controller'
import { auth } from '../../middlewares/auth'
import { verifyJWT } from '../../middlewares/verify-jwt'

export async function journalRoutes(app: FastifyInstance) {
  await app.register(auth)
  app.get('/journal/entries', { onRequest: [verifyJWT] }, listJournalEntriesController)
  app.get('/journal', { onRequest: [verifyJWT] }, getJournalEntryController)
  app.post('/journal', { onRequest: [verifyJWT] }, createJournalEntryController)
  app.patch('/journal/:id', { onRequest: [verifyJWT] }, updateJournalEntryController)
  app.delete('/journal/:id', { onRequest: [verifyJWT] }, deleteJournalEntryController)
}
