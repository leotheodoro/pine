import { JournalEntry } from 'generated'

export interface JournalEntriesRepository {
  create(data: { userId: string; date: Date; content: string }): Promise<JournalEntry>
  update(id: string, content: string): Promise<JournalEntry>
  delete(id: string): Promise<void>
  findById(id: string): Promise<JournalEntry | null>
  findByUserAndDate(userId: string, date: Date): Promise<JournalEntry[]>
  findManyByUserId(
    userId: string,
    options: { take: number; skip: number }
  ): Promise<JournalEntry[]>
}
