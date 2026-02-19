import { api } from '@/lib/ky'

export interface JournalEntry {
  id: string
  date: string
  content: string
  createdAt: string
  updatedAt: string
}

interface GetJournalEntryResponse {
  entries: JournalEntry[]
}

export async function getJournalEntry(date: string): Promise<GetJournalEntryResponse> {
  const result = await api.get('journal', { searchParams: { date } }).json<GetJournalEntryResponse>()
  return result
}
