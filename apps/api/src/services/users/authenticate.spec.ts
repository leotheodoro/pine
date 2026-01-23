import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { InvalidCredentialsError } from '../_errors/invalid-credentials-error'
import { AuthenticateService } from './authenticate'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateService

describe('Authenticate Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateService(usersRepository)
  })

  it('should be able to authenticate', async () => {
    const passwordHash = await hash('123456', 6)
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: passwordHash,
      username: 'johndoe',
    })

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateService(usersRepository)

    await expect(() =>
      sut.execute({
        email: 'wrongemail@example.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateService(usersRepository)

    const passwordHash = await hash('123456', 6)
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: passwordHash,
      username: 'johndoe',
    })

    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: 'wrong-password',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
