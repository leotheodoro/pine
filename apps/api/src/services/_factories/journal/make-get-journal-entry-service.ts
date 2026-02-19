import { PrismaJournalEntriesRepository } from '@/repositories/prisma/prisma-journal-entries-repository'

import { GetJournalEntryService } from '../../journal/get-journal-entry'

export function makeGetJournalEntryService() {
  const journalEntriesRepository = new PrismaJournalEntriesRepository()
  return new GetJournalEntryService(journalEntriesRepository)
}
