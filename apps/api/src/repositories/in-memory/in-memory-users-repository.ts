import { randomUUID } from 'crypto'
import { Prisma, User } from 'generated'

import { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = []

  async findByEmail(email: string) {
    const user = this.users.find((user) => user.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async create(data: Prisma.UserUncheckedCreateInput) {
    const user: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      username: data.username,
      avatar_url: data.avatar_url ?? null,
      created_at: new Date(),

      bitbucket_email: null,
      bitbucket_api_token: null,
      bitbucket_workspace: null,
      azure_devops_org: null,
      azure_devops_pat: null,
      azure_devops_project: null,
    }

    this.users.push(user)

    return user
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === id)

    if (!user) {
      return null
    }

    return user
  }

  async update(id: string, data: Prisma.UserUncheckedCreateInput): Promise<User> {
    const userIndex = this.users.findIndex((user) => user.id === id)

    if (userIndex === -1) {
      throw new Error('User not found')
    }

    const currentUser = this.users[userIndex]

    const updatedUser = {
      ...currentUser,
      name: data.name ?? currentUser.name,
      email: data.email ?? currentUser.email,
      password_hash: data.password_hash ?? currentUser.password_hash,
      username: data.username ?? currentUser.username,
      avatar_url: data.avatar_url ?? currentUser.avatar_url,
      bitbucket_email: data.bitbucket_email ?? currentUser.bitbucket_email,
      bitbucket_api_token: data.bitbucket_api_token ?? currentUser.bitbucket_api_token,
      bitbucket_workspace: data.bitbucket_workspace ?? currentUser.bitbucket_workspace,
      azure_devops_org: data.azure_devops_org ?? currentUser.azure_devops_org,
      azure_devops_pat: data.azure_devops_pat ?? currentUser.azure_devops_pat,
      azure_devops_project: data.azure_devops_project ?? currentUser.azure_devops_project,
    }

    this.users[userIndex] = updatedUser

    return updatedUser
  }

  async deleteById(id: string): Promise<void> {
    this.users = this.users.filter((user) => user.id !== id)
  }
}
