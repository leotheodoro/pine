import { Prisma, User } from 'generated'

export interface UsersRepository {
  create(data: Prisma.UserUncheckedCreateInput): Promise<User>
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  update(id: string, data: Prisma.UserUncheckedUpdateInput): Promise<User>
  deleteById(id: string): Promise<void>
}
