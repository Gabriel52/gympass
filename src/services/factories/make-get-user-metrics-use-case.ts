import { GetUsersMetricsService } from '../get-users-metrics'
import { PrismaCheckInsRepository } from '@src/repositories/prisma/prisma-check-ins-repository'

export function makeGetUserMetricsUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const service = new GetUsersMetricsService(checkInsRepository)

  return service
}
