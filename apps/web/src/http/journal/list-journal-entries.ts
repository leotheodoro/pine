import { api } from '@/lib/ky'

export interface JournalEntryItem {
  id: string
  date: string
  content: string
  createdAt: string
  updatedAt: string
}

interface ListJournalEntriesResponse {
  entries: JournalEntryItem[]
  nextPage: number | null
}

export async function listJournalEntries(page: number, pageSize = 20): Promise<ListJournalEntriesResponse> {
  const result = await api
    .get('journal/entries', { searchParams: { page: String(page), pageSize: String(pageSize) } })
    .json<ListJournalEntriesResponse>()
  return result
}
