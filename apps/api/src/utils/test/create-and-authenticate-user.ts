import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

import { prisma } from '@/lib/prisma'

function generateRandomWord(length = 5): string {
  const letters = 'abcdefghijklmnopqrstuvwxyz'
  return Array.from({ length })
    .map(() => letters[Math.floor(Math.random() * letters.length)])
    .join('')
}

export async function createAndAuthenticateUser(app: FastifyInstance): Promise<{ token: string }> {
  const randomUsername = generateRandomWord()
  const randomEmail = `${randomUsername}@example.com`

  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: randomEmail,
      password_hash: await hash('123456', 6),
      username: randomUsername,
    },
  })

  const authResponse = await request(app.server).post('/authenticate').send({
    email: randomEmail,
    password: '123456',
  })

  const { token } = authResponse.body

  return {
    token,
  }
}
