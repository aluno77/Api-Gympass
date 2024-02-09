import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createAuthenticateUse } from '@/utils/test/create-authenticate-use'

describe('Nearby Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAuthenticateUse(app, true)
    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Descrição da academia teste',
        phone: '123456789',
        latitude: -3.0709846,
        longitude: -60.0333795,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TypeScript Gym',
        description: 'Descrição da academia teste',
        phone: '123456789',
        latitude: -2.6982003,
        longitude: -59.7184154,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -3.0709846,
        longitude: -60.0333795,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'JavaScript Gym',
      }),
    ])
  })
})
