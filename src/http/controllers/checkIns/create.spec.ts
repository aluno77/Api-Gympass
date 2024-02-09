import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAuthenticateUse } from '@/utils/test/create-authenticate-use'

describe('Create check-in(e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able to create check-in', async () => {
    const { token } = await createAuthenticateUse(app)

    const gym = await prisma.gym.create({
      data: {
        title: 'JavaScript Gym',
        description: 'Descrição da academia teste',
        phone: '123456789',
        latitude: -2.6982003,
        longitude: -59.7184154,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -2.6982003,
        longitude: -59.7184154,
      })

    expect(response.statusCode).toEqual(201)
  })
})
