import { CheckIn } from '@prisma/client'
import { ICheckInsService } from '@src/repositories/check-ins-repository'
import { IGymsRepository } from '@src/repositories/gyms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { getDistanceBetweenCoordinates } from '@src/utils/get-distance-between-coordinate'
import { MAX_DISTANCE_IN_KILOMETERS_TO_DO_CHECK_IN } from '@src/const'

interface CheckInServiceResponse {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface CheckInServiceRequest {
  checkIn: CheckIn
}

export class CheckInService {
  constructor(
    private checkInsRepository: ICheckInsService,
    private gymsRepository: IGymsRepository,
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInServiceResponse): Promise<CheckInServiceRequest> {
    const gym = await this.gymsRepository.findById(gymId)
    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )

    if (distance > MAX_DISTANCE_IN_KILOMETERS_TO_DO_CHECK_IN) {
      throw new Error()
    }

    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDate) {
      throw new Error('')
    }

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })
    return { checkIn }
  }
}
