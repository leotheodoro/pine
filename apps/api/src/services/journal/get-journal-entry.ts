import { JournalEntriesRepository } from '@/repositories/journal-entries-repository'

export interface GetJournalEntryServiceRequest {
  userId: string
  date: Date
}

export interface GetJournalEntryServiceResponse {
  entries: Array<{
    id: string
    date: string
    content: string
    createdAt: Date
    updatedAt: Date
  }>
}

export class GetJournalEntryService {
  constructor(private journalEntriesRepository: JournalEntriesRepository) {}

  async execute({ userId, date }: GetJournalEntryServiceRequest): Promise<GetJournalEntryServiceResponse> {
    const entries = await this.journalEntriesRepository.findByUserAndDate(userId, date)
    return {
      entries: entries.map((entry) => {
        const dateOnly = entry.date instanceof Date ? entry.date.toISOString().slice(0, 10) : String(entry.date).slice(0, 10)
        return {
          id: entry.id,
          date: dateOnly,
          content: entry.content,
          createdAt: entry.created_at,
          updatedAt: entry.updated_at,
        }
      }),
    }
  }
}
