import { Prisma, Repository } from '../../generated/client'

export interface RepositoriesRepository {
  findByUserId(userId: string): Promise<Repository[]>
  create(data: Prisma.RepositoryUncheckedCreateInput): Promise<Repository>
  deleteById(id: string): Promise<void>
  deleteManyByUserId(userId: string): Promise<void>
  createMany(data: Prisma.RepositoryUncheckedCreateInput[]): Promise<void>
}
