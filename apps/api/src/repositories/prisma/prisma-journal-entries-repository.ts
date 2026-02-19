import { prisma } from '@/lib/prisma'

import { JournalEntriesRepository } from '../journal-entries-repository'

export class PrismaJournalEntriesRepository implements JournalEntriesRepository {
  async create(data: { userId: string; date: Date; content: string }) {
    const entry = await prisma.journalEntry.create({
      data: {
        user_id: data.userId,
        date: data.date,
        content: data.content,
      },
    })
    return entry
  }

  async update(id: string, content: string) {
    const entry = await prisma.journalEntry.update({
      where: { id },
      data: { content },
    })
    return entry
  }

  async delete(id: string) {
    await prisma.journalEntry.delete({
      where: { id },
    })
  }

  async findById(id: string) {
    const entry = await prisma.journalEntry.findUnique({
      where: { id },
    })
    return entry
  }

  async findByUserAndDate(userId: string, date: Date) {
    const entries = await prisma.journalEntry.findMany({
      where: {
        user_id: userId,
        date,
      },
      orderBy: { created_at: 'asc' },
    })
    return entries
  }

  async findManyByUserId(userId: string, options: { take: number; skip: number }) {
    const entries = await prisma.journalEntry.findMany({
      where: { user_id: userId },
      orderBy: { date: 'desc' },
      take: options.take,
      skip: options.skip,
    })
    return entries
  }
}
