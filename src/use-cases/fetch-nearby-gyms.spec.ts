import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })
  // deve ser capaz de buscar academias próximas
  it('should be able to fetch nearby to gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: 'Descrição da academia teste',
      phone: '123456789',
      latitude: -3.0709846,
      longitude: -60.0333795,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: 'Descrição da academia teste',
      phone: '123456789',
      latitude: -2.6982003,
      longitude: -59.7184154,
    })

    const { gyms } = await sut.execute({
      userLatitude: -3.0709846,
      userLongitude: -60.0333795,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
