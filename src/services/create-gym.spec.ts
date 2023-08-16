import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@src/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymService } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymService
describe('Create Gym Service', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymService(gymsRepository)
  })

  it('should be able to create a new gym', async () => {
    const { gym } = await sut.execute({
      title: 'Javascript Gym',
      description: 'A javascript gym',
      longitude: -23.5425113,
      latitude: -46.6541346,
      phone: '+55 (11) 98765-4321',
    })
    expect(gym.id).toEqual(expect.any(String))
  })
})
