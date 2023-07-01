import { Prisma, User } from '@prisma/client'
import { prismaObject } from '@src/lib/prisma'
import { IUsersRepository } from '../users-repository'

export class PrismaUsersRepository implements IUsersRepository {
  async findByEmail(email: string): Promise<User | null> {
    const userByEmail = await prismaObject.user.findUnique({
      where: {
        email,
      },
    })
    return userByEmail
  }

  async create(data: Prisma.UserCreateInput) {
    const user = await prismaObject.user.create({
      data,
    })

    return user
  }
}
