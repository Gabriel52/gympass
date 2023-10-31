import { PrismaUsersRepository } from '@src/repositories/prisma/prisma-users-repository'
import { GetUserProfileService } from '../get-user-profile'

export function makeGetUserProfileUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()
  const service = new GetUserProfileService(prismaUsersRepository)

  return service
}
