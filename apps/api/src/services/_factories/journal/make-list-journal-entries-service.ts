import { PrismaJournalEntriesRepository } from '@/repositories/prisma/prisma-journal-entries-repository'

import { ListJournalEntriesService } from '../../journal/list-journal-entries'

export function makeListJournalEntriesService() {
  const journalEntriesRepository = new PrismaJournalEntriesRepository()
  return new ListJournalEntriesService(journalEntriesRepository)
}
