import { Prisma, Repository } from '../../../generated/client'
import { randomUUID } from 'node:crypto'
import { RepositoriesRepository } from '../repositories-repository'

export class InMemoryRepositoriesRepository implements RepositoriesRepository {
  public items: Repository[] = []

  async findByUserId(userId: string): Promise<Repository[]> {
    return this.items.filter((item) => item.user_id === userId)
  }

  async create(data: Prisma.RepositoryUncheckedCreateInput): Promise<Repository> {
    const repository: Repository = {
      id: randomUUID(),
      provider: data.provider,
      identifier: data.identifier,
      user_id: data.user_id,
      created_at: new Date(),
    }

    this.items.push(repository)

    return repository
  }

  async deleteById(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index !== -1) {
      this.items.splice(index, 1)
    }
  }
}
