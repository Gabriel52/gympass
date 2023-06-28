import { prismaObject } from '@src/lib/prisma'
import { hash } from 'bcryptjs'

interface IRegisterService {
  name: string
  email: string
  password: string
}

export class RegisterService {
  constructor(private usersRepository: any) {}

  async execute({ name, email, password }: IRegisterService) {
    const AMOUNT_OF_TIME_TO_GENERATE_HASE = 3
    const passwordHash = await hash(password, AMOUNT_OF_TIME_TO_GENERATE_HASE)
    const userAlreadyExists = await prismaObject.user.findUnique({
      where: {
        email,
      },
    })

    if (userAlreadyExists) {
      throw new Error(`User ${userAlreadyExists} is already registered`)
    }
    const data = {
      name,
      email,
      password_hash: passwordHash,
    }
    await this.usersRepository.create(data)
  }
}
