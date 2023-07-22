import { IUsersRepository } from '@src/repositories/users-repository'
import { User } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetUserServiceResponse {
  userId: string
}

interface GetUserServiceRequest {
  user: User
}

export class GetUserProfileService {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    userId,
  }: GetUserServiceResponse): Promise<GetUserServiceRequest> {
    const userAlreadyExist = await this.usersRepository.findById(userId)

    if (!userAlreadyExist) {
      throw new ResourceNotFoundError()
    }

    return { user: userAlreadyExist }
  }
}
