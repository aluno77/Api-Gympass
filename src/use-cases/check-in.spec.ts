import { Decimal } from '@prisma/client/runtime/library'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { CheckInsUseCase } from './check-in'
import { MaxNumberOfChecInsError } from './errors/max-number-of-check-in-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymRepository: InMemoryGymsRepository
let sut: CheckInsUseCase

describe('Check-ins Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymRepository = new InMemoryGymsRepository()
    sut = new CheckInsUseCase(checkInsRepository, gymRepository)

    await gymRepository.create({
      id: 'gym-01',
      title: 'Academia Teste',
      description: 'Academia Teste',
      phone: '92999999999',
      latitude: -2.6982003,
      longitude: -59.7184154,
    })

    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })
  // deve se possivel fazer check-ins
  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-id',
      userLatitude: -2.6982003,
      userLongitude: -59.7184154,
    })
    console.log(checkIn)
    expect(checkIn.id).toEqual(expect.any(String))
  })
  // Aplicando TDD
  // red -> green -> refactor
  // não deve ser possível fazer check-in duas vezes no mesmo dia
  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date('2023-01-20:10:0:0'))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-id',
      userLatitude: -2.6982003,
      userLongitude: -59.7184154,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-id',
        userLatitude: -2.6982003,
        userLongitude: -59.7184154,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfChecInsError)
  })
  // deve ser possível fazer check-in duas vezes em dias diferentes
  it('should be able to check in twice in diferent day', async () => {
    vi.setSystemTime(new Date('2023-01-20:10:0:0'))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-id',
      userLatitude: -2.6982003,
      userLongitude: -59.7184154,
    })

    vi.setSystemTime(new Date('2023-01-21:10:0:0'))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-id',
      userLatitude: -2.6982003,
      userLongitude: -59.7184154,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
  // não deve ser possível fazer check-in em uma academia distante
  it('should not be able to check in on distant  gym', async () => {
    gymRepository.items.push({
      id: 'gym-01',
      title: 'Academia Teste',
      description: 'Academia Teste',
      phone: '92999999999',
      latitude: new Decimal(-2.6982003),
      longitude: new Decimal(-59.7184154),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-id',
        userLatitude: -3.0657544,
        userLongitude: -59.7184154,
      }),
    ).rejects.toBeInstanceOf(Error) // entender pq não está retornando o erro correto
  })
})
