import { CheckIn, Prisma } from '@prisma/client'
import { ICheckInsService } from '../check-ins-repository'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'
import { PAGINATION_LIMIT } from '@src/const'

export class InMemoryCheckInsRepository implements ICheckInsService {
  public items: CheckIn[] = []

  async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('day')
    const endOfTheDay = dayjs(date).endOf('day')

    const checkInOnSameDate = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

      return checkIn.user_id === userId && isOnSameDate
    })
    if (!checkInOnSameDate) {
      return null
    }
    return checkInOnSameDate
  }

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn: CheckIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }
    this.items.push(checkIn)
    console.log(checkIn)
    return checkIn
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    return this.items
      .filter((item) => item.user_id === userId)
      .slice((page - 1) * PAGINATION_LIMIT, page * PAGINATION_LIMIT)
  }

  async countByUserId(userId: string): Promise<number> {
    return this.items.filter((item) => item.user_id === userId).length
  }
}
