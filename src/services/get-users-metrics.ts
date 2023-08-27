import { ICheckInsService } from '@src/repositories/check-ins-repository'

interface GetUsersMetricsResponse {
  userId: string
}

interface GetUsersMetricsRequest {
  checkInsCount: number
}

export class GetUsersMetricsService {
  constructor(private checkInsRepository: ICheckInsService) {}

  async execute({
    userId,
  }: GetUsersMetricsResponse): Promise<GetUsersMetricsRequest> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId)
    return { checkInsCount }
  }
}
