import { Gym, Prisma } from '@prisma/client'

import { FindManyNearbyParams, IGymsRepository } from '../gyms-repository'
import { randomUUID } from 'node:crypto'
import { PAGINATION_LIMIT } from '@src/const'
import { getDistanceBetweenCoordinates } from '@src/utils/get-distance-between-coordinate'

export class InMemoryGymsRepository implements IGymsRepository {
  public items: Gym[] = []

  async findById(id: string): Promise<Gym | null> {
    const gym = this.items.find((item) => item.id === id)
    if (!gym) {
      return null
    }
    return gym
  }

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = {
      id: data.id ?? randomUUID(),
      description: data.description ?? null,
      title: data.title,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    }
    this.items.push(gym)
    return gym
  }

  async searchManyByQuery(query: string, page: number): Promise<Gym[]> {
    return this.items
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * PAGINATION_LIMIT, page * PAGINATION_LIMIT * 20)
  }

  async findManyNearby({
    latitude,
    longitude,
  }: FindManyNearbyParams): Promise<Gym[]> {
    console.log('------findNearby ----------------------')
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude, longitude },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        },
      )
      console.log(distance)
      return distance < 0.1 // 10km
    })
  }
}
