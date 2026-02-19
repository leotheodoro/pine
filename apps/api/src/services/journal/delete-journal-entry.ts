import { JournalEntriesRepository } from '@/repositories/journal-entries-repository'

export interface DeleteJournalEntryServiceRequest {
  id: string
}

export class DeleteJournalEntryService {
  constructor(private journalEntriesRepository: JournalEntriesRepository) {}

  async execute({ id }: DeleteJournalEntryServiceRequest): Promise<void> {
    await this.journalEntriesRepository.delete(id)
  }
}
