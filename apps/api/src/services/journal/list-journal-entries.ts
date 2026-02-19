import { JournalEntriesRepository } from '@/repositories/journal-entries-repository'

const DEFAULT_PAGE_SIZE = 20

export interface ListJournalEntriesServiceRequest {
  userId: string
  page: number
  pageSize?: number
}

export interface ListJournalEntriesServiceResponse {
  entries: Array<{
    id: string
    date: string
    content: string
    createdAt: Date
    updatedAt: Date
  }>
  nextPage: number | null
}

export class ListJournalEntriesService {
  constructor(private journalEntriesRepository: JournalEntriesRepository) {}

  async execute({
    userId,
    page,
    pageSize = DEFAULT_PAGE_SIZE,
  }: ListJournalEntriesServiceRequest): Promise<ListJournalEntriesServiceResponse> {
    const skip = page * pageSize
    const entries = await this.journalEntriesRepository.findManyByUserId(userId, {
      take: pageSize + 1,
      skip,
    })
    const hasMore = entries.length > pageSize
    const slice = hasMore ? entries.slice(0, pageSize) : entries
    const mapped = slice.map((entry) => {
      const dateOnly =
        entry.date instanceof Date ? entry.date.toISOString().slice(0, 10) : String(entry.date).slice(0, 10)
      return {
        id: entry.id,
        date: dateOnly,
        content: entry.content,
        createdAt: entry.created_at,
        updatedAt: entry.updated_at,
      }
    })
    return {
      entries: mapped,
      nextPage: hasMore ? page + 1 : null,
    }
  }
}
