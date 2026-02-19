import { PrismaJournalEntriesRepository } from '@/repositories/prisma/prisma-journal-entries-repository'

import { CreateJournalEntryService } from '../../journal/create-journal-entry'

export function makeCreateJournalEntryService() {
  const journalEntriesRepository = new PrismaJournalEntriesRepository()
  return new CreateJournalEntryService(journalEntriesRepository)
}
