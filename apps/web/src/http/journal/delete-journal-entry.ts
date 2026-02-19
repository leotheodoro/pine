import { api } from '@/lib/ky'

export async function deleteJournalEntry(id: string): Promise<void> {
  await api.delete(`journal/${id}`)
}
