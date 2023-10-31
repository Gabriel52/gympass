import { PrismaCheckInsRepository } from '@src/repositories/prisma/prisma-check-ins-repository'
import { ValidateService } from '../validate-check-in'

export function makeValidateCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const service = new ValidateService(checkInsRepository)

  return service
}
