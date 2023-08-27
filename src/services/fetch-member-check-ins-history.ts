import { CheckIn } from '@prisma/client'
import { ICheckInsService } from '@src/repositories/check-ins-repository'

interface FetchUserCheckInsHistoryResponse {
  userId: string
  page: number
}

interface FetchUserCheckInsHistoryRequest {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryService {
  constructor(private checkInsRepository: ICheckInsService) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckInsHistoryResponse): Promise<FetchUserCheckInsHistoryRequest> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    )
    return { checkIns }
  }
}
