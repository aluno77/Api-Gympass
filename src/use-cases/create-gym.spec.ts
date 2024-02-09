import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  // deve ser capaz de criar uma academia
  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'gym-01',
      description: 'Descrição da academia teste',
      phone: '123456789',
      latitude: -2.6982003,
      longitude: -59.7184154,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
