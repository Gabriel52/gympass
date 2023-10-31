import { FetchUserCheckInsHistoryService } from '../fetch-member-check-ins-history'
import { PrismaCheckInsRepository } from '@src/repositories/prisma/prisma-check-ins-repository'

export function makeFetchUserCheckInsHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const service = new FetchUserCheckInsHistoryService(checkInsRepository)

  return service
}
