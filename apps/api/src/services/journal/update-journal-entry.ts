import { JournalEntriesRepository } from '@/repositories/journal-entries-repository'

export interface UpdateJournalEntryServiceRequest {
  id: string
  content: string
}

export interface UpdateJournalEntryServiceResponse {
  entry: {
    id: string
    date: string
    content: string
    createdAt: Date
    updatedAt: Date
  }
}

export class UpdateJournalEntryService {
  constructor(private journalEntriesRepository: JournalEntriesRepository) {}

  async execute({ id, content }: UpdateJournalEntryServiceRequest): Promise<UpdateJournalEntryServiceResponse> {
    const entry = await this.journalEntriesRepository.update(id, content)
    const dateOnly = entry.date instanceof Date ? entry.date.toISOString().slice(0, 10) : String(entry.date).slice(0, 10)
    return {
      entry: {
        id: entry.id,
        date: dateOnly,
        content: entry.content,
        createdAt: entry.created_at,
        updatedAt: entry.updated_at,
      },
    }
  }
}
