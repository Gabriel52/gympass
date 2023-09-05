import { Gym } from '@prisma/client'
import { IGymsRepository } from '@src/repositories/gyms-repository'

interface ISearchGymService {
  query: string
  page: number
}

interface ISearchGymServiceResponse {
  gyms: Gym[]
}

export class SearchGymsService {
  constructor(private gymsRepository: IGymsRepository) {}

  async execute({
    query,
    page,
  }: ISearchGymService): Promise<ISearchGymServiceResponse> {
    const gyms = await this.gymsRepository.searchManyByQuery(query, page)

    return {
      gyms,
    }
  }
}
