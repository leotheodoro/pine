import { api } from '@/lib/ky'

import type { JournalEntry } from './get-journal-entry'

interface UpdateJournalEntryResponse {
  entry: JournalEntry
}

export async function updateJournalEntry(id: string, content: string): Promise<UpdateJournalEntryResponse> {
  const result = await api.patch(`journal/${id}`, { json: { content } }).json<UpdateJournalEntryResponse>()
  return result
}
