import { CheckIn } from '@prisma/client'
import { ICheckInsService } from '@src/repositories/check-ins-repository'

interface FetchUserCheckInsHistoryResponse {
  userId: string
}

interface FetchUserCheckInsHistoryRequest {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryService {
  constructor(private checkInsRepository: ICheckInsService) {}

  async execute({
    userId,
  }: FetchUserCheckInsHistoryResponse): Promise<FetchUserCheckInsHistoryRequest> {
    const checkIns = await this.checkInsRepository.findManyByUserId(userId)
    console.log(`service: ${userId}`, checkIns)
    return { checkIns }
  }
}
