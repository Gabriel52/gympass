import { InMemoryGymsRepository } from '@src/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchNearbyGymsService } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsService
describe('Fetch Nearby Gyms Service', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsService(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: 'A javascript gym',
      latitude: -23.5425113,
      longitude: -46.6541346,
      phone: '+55 (11) 98765-4321',
    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: 'A typescript gym',
      latitude: -23.6446714,
      longitude: -46.8021887,
      phone: '+55 (11) 98765-4321',
    })

    const { gyms } = await sut.execute({
      userLatitude: -23.5425113,
      userLongitude: -46.6541346,
    })
    await expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
