import { Prisma, User } from 'generated'

import { prisma } from '@/lib/prisma'

import { UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
  async create(data: Prisma.UserUncheckedCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    return user
  }

  async update(id: string, data: Prisma.UserUncheckedUpdateInput) {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data,
    })

    return user
  }

  async deleteById(id: string) {
    await prisma.user.delete({
      where: {
        id,
      },
    })
  }
}
