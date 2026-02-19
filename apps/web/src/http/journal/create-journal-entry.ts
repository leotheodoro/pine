import { api } from '@/lib/ky'

import type { JournalEntry } from './get-journal-entry'

interface CreateJournalEntryResponse {
  entry: JournalEntry
}

export async function createJournalEntry(date: string, content: string): Promise<CreateJournalEntryResponse> {
  const result = await api.post('journal', { json: { date, content } }).json<CreateJournalEntryResponse>()
  return result
}
