import { PrismaJournalEntriesRepository } from '@/repositories/prisma/prisma-journal-entries-repository'

import { UpdateJournalEntryService } from '../../journal/update-journal-entry'

export function makeUpdateJournalEntryService() {
  const journalEntriesRepository = new PrismaJournalEntriesRepository()
  return new UpdateJournalEntryService(journalEntriesRepository)
}
