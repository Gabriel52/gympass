import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@src/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { AMOUNT_OF_TIME_TO_GENERATE_HASE } from '@src/const'
import { GetUserProfileService } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let userRepository: InMemoryUsersRepository
let sut: GetUserProfileService
describe('Get user profile service', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileService(userRepository)
  })
  it('should be able to get user profile', async () => {
    const { id } = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('23213213', AMOUNT_OF_TIME_TO_GENERATE_HASE),
    })

    const { user } = await sut.execute({
      userId: id,
    })
    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('John Doe')
  })

  it('should not be able to get profile with wrong id', async () => {
    expect(() =>
      sut.execute({
        userId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
