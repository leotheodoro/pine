import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { FindUserByIdService } from './find-user-by-id'

let usersRepository: InMemoryUsersRepository
let sut: FindUserByIdService

describe('Fetch Users Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new FindUserByIdService(usersRepository)
  })

  it('should be able to find user by id', async () => {
    const user = await usersRepository.create({
      name: 'John doe',
      email: 'johndoe@example.com',
      password_hash: '123456',
      username: 'johndoe',
    })

    const { user: foundUser } = await sut.execute({ id: user.id })

    expect(foundUser?.id).toEqual(user.id)
  })
})
