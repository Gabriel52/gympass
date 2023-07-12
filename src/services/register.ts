import { IUsersRepository } from '@src/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { User } from '@prisma/client'
import { AMOUNT_OF_TIME_TO_GENERATE_HASE } from '@src/const'

interface IRegisterService {
  name: string
  email: string
  password: string
}

interface IRegisterServiceResponse {
  user: User
}

export class RegisterService {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: IRegisterService): Promise<IRegisterServiceResponse> {
    const passwordHash = await hash(password, AMOUNT_OF_TIME_TO_GENERATE_HASE)
    const userAlreadyExists = await this.usersRepository.findByEmail(email)

    if (userAlreadyExists) {
      throw new UserAlreadyExistsError()
    }
    const data = {
      name,
      email,
      password_hash: passwordHash,
    }
    const user = await this.usersRepository.create(data)
    return { user }
  }
}
