import { IUsersRepository } from '@src/repositories/users-repository'
import { UserInvalidCredentialsError } from './errors/invalid-credentials-error'
import { compare } from 'bcryptjs'
import { User } from '@prisma/client'

interface AuthenticateServiceResponse {
  email: string
  password: string
}

interface AuthenticateServiceRequest {
  user: User
}

export class AuthenticateService {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateServiceResponse): Promise<AuthenticateServiceRequest> {
    const userAlreadyExist = await this.usersRepository.findByEmail(email)

    if (!userAlreadyExist) {
      throw new UserInvalidCredentialsError()
    }
    const doesPasswordMatches = await compare(
      password,
      userAlreadyExist.password_hash,
    )
    if (!doesPasswordMatches) {
      throw new UserInvalidCredentialsError()
    }

    return { user: userAlreadyExist }
  }
}
