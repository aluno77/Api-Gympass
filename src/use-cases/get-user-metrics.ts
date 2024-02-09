import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface GetUserMetrcisUseCaseRequest {
  userId: string
}

interface GetUserMetrcisUseCaseResponse {
  checkInsCount: number
}

export class GetUserMetrcisUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetrcisUseCaseRequest): Promise<GetUserMetrcisUseCaseResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId)

    return {
      checkInsCount,
    }
  }
}
