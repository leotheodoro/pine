import { PrismaJournalEntriesRepository } from '@/repositories/prisma/prisma-journal-entries-repository'

import { DeleteJournalEntryService } from '../../journal/delete-journal-entry'

export function makeDeleteJournalEntryService() {
  const journalEntriesRepository = new PrismaJournalEntriesRepository()
  return new DeleteJournalEntryService(journalEntriesRepository)
}
