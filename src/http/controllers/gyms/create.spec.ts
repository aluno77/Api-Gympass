import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createAuthenticateUse } from '@/utils/test/create-authenticate-use'

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a gym', async () => {
    const { token } = await createAuthenticateUse(app, true)

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Descrição da academia teste',
        phone: '123456789',
        latitude: -2.6982003,
        longitude: -59.7184154,
      })

    expect(response.statusCode).toEqual(201)
  })
})
