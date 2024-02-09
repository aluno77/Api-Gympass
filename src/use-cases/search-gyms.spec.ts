import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })
  // deve ser capaz de buscar histórico de check-in
  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'javaScript Gym',
      description: 'Descrição da academia teste',
      phone: '123456789',
      latitude: -2.6982003,
      longitude: -59.7184154,
    })

    await gymsRepository.create({
      title: 'typeScript Gym',
      description: 'Descrição da academia teste',
      phone: '123456789',
      latitude: -2.6982003,
      longitude: -59.7184154,
    })

    const { gyms } = await sut.execute({
      query: 'javaScript',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'javaScript Gym' })])
  })
  //
  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `javaScript Gym ${i}`,
        description: 'Descrição da academia teste',
        phone: '123456789',
        latitude: -2.6982003,
        longitude: -59.7184154,
      })
    }

    const { gyms } = await sut.execute({
      query: 'javaScript',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'javaScript Gym 21' }),
      expect.objectContaining({ title: 'javaScript Gym 22' }),
    ])
  })
})
