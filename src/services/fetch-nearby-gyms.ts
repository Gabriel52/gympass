import { Gym } from '@prisma/client'
import { IGymsRepository } from '@src/repositories/gyms-repository'

interface IFetchNearbyGymsRequest {
  userLatitude: number
  userLongitude: number
}

interface IFetchNearbyGymsResponse {
  gyms: Gym[]
}

export class FetchNearbyGymsService {
  constructor(private gymsRepository: IGymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: IFetchNearbyGymsRequest): Promise<IFetchNearbyGymsResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })
    console.log(gyms)
    return {
      gyms,
    }
  }
}
