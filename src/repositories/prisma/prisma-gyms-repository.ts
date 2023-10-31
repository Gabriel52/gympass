import { Gym, Prisma } from '@prisma/client'
import { FindManyNearbyParams, IGymsRepository } from '../gyms-repository'
import { prismaObject } from '@src/lib/prisma'
import { MAX_DISTANCE_IN_KILOMETERS_TO_DO_CHECK_IN } from '@src/const'

const MAGIC_NUMBER_TO_TRANSFORM_VALUE_INTO_KILOMETERS = 100

export class PrismaGymsRepository implements IGymsRepository {
  async findById(id: string) {
    const gym = await prismaObject.gym.findUnique({
      where: { id },
    })
    return gym
  }

  async searchManyByQuery(query: string, page: number) {
    const gyms = await prismaObject.gym.findMany({
      where: { title: { contains: query } },
      take: 20,
      skip: (page - 1) * 20,
    })
    return gyms
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = await prismaObject.gym.create({
      data,
    })
    return gym
  }

  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    console.log({
      teste:
        MAX_DISTANCE_IN_KILOMETERS_TO_DO_CHECK_IN *
        MAGIC_NUMBER_TO_TRANSFORM_VALUE_INTO_KILOMETERS,
    })
    const gyms = await prismaObject.$queryRaw<Gym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= $${
      MAX_DISTANCE_IN_KILOMETERS_TO_DO_CHECK_IN *
      MAGIC_NUMBER_TO_TRANSFORM_VALUE_INTO_KILOMETERS
    }
    `
    return gyms
  }
}
