import { Prisma, Repository } from '../../../generated/client'
import { prisma } from '../../lib/prisma'
import { RepositoriesRepository } from '../repositories-repository'

export class PrismaRepositoriesRepository implements RepositoriesRepository {
  async findByUserId(userId: string): Promise<Repository[]> {
    return prisma.repository.findMany({
      where: {
        user_id: userId,
      },
    })
  }

  async create(data: Prisma.RepositoryUncheckedCreateInput): Promise<Repository> {
    return prisma.repository.create({
      data,
    })
  }

  async deleteById(id: string): Promise<void> {
    await prisma.repository.delete({
      where: {
        id,
      },
    })
  }
}
