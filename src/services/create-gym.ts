import { Gym } from '@prisma/client'
import { IGymsRepository } from '@src/repositories/gyms-repository'

interface ICreateGymService {
  title: string
  description?: string | null
  phone: string | null
  latitude: number
  longitude: number
}

interface ICreateGymServiceResponse {
  gym: Gym
}

export class CreateGymService {
  constructor(private gymsRepository: IGymsRepository) {}

  async execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: ICreateGymService): Promise<ICreateGymServiceResponse> {
    const gym = await this.gymsRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude,
    })

    return {
      gym,
    }
  }
}
