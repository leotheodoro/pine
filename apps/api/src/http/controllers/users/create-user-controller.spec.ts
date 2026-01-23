import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/http/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Create User (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server).post('/users').set('Authorization', `Bearer ${token}`).send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      username: 'johndoe',
      password: '123456',
    })

    expect(response.statusCode).toEqual(201)
    expect(response.body.id).toEqual(expect.any(String))
  })
})
