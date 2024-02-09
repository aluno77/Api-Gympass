import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repositoty'

import { CheckInsUseCase } from '../check-in'

export function makeCheckInUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const checkInsRepository = new PrismaCheckInsRepository()

  const useCase = new CheckInsUseCase(checkInsRepository, gymsRepository)

  return useCase
}
