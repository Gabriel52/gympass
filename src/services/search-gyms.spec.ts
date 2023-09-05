import { InMemoryGymsRepository } from '@src/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { SearchGymsService } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsService
describe('Search Gyms Service', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsService(gymsRepository)
  })

  it('should be able to search for gyms ', async () => {
    await gymsRepository.create({
      title: 'Javascript Gym',
      description: 'A javascript gym',
      longitude: -23.5425113,
      latitude: -46.6541346,
      phone: '+55 (11) 98765-4321',
    })

    await gymsRepository.create({
      title: 'Typescript Gym',
      description: 'A typescript gym',
      longitude: -23.5425113,
      latitude: -46.6541346,
      phone: '+55 (11) 98765-4321',
    })

    const { gyms } = await sut.execute({ query: 'Javascript', page: 1 })

    await expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Javascript Gym' })])
  })

  it('should be able to fetch paginated check-in history', async () => {
    for (let count = 1; count <= 22; count++) {
      await gymsRepository.create({
        title: `this is random ${count}`,
        description: 'A typescript gym',
        longitude: -23.5425113,
        latitude: -46.6541346,
        phone: '+55 (11) 98765-4321',
      })
    }
    const { gyms } = await sut.execute({
      query: 'random',
      page: 2,
    })

    await expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'this is random 21' }),
      expect.objectContaining({ title: 'this is random 22' }),
    ])
  })
})
