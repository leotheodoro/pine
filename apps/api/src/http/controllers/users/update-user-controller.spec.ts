import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/http/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Update User (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to update an user', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server).put('/users').set('Authorization', `Bearer ${token}`).send({
      name: 'Updated User',
      email: 'updateduser@example.com',
      username: 'updateduser',
      password: '123456',
      avatar_url: 'https://example.com/avatar.png',
      bitbucket_email: 'updateduser@bitbucket.org',
      bitbucket_api_token: '123456',
      bitbucket_workspace: 'updateduser',
      azure_devops_org: 'updateduser',
      azure_devops_pat: '123456',
      azure_devops_project: 'updateduser',
    })

    expect(response.statusCode).toEqual(201)
    expect(response.body.id).toEqual(expect.any(String))
    expect(response.body.name).toEqual('Updated User')
    expect(response.body.email).toEqual('updateduser@example.com')
    expect(response.body.username).toEqual('updateduser')
    expect(response.body.avatar_url).toEqual('https://example.com/avatar.png')
    expect(response.body.bitbucket_email).toEqual('updateduser@bitbucket.org')
    expect(response.body.bitbucket_api_token).toEqual('123456')
    expect(response.body.bitbucket_workspace).toEqual('updateduser')
    expect(response.body.azure_devops_org).toEqual('updateduser')
    expect(response.body.azure_devops_pat).toEqual('123456')
  })
})
