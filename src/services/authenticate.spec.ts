import { describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@src/repositories/in-memory/in-memory-users-tepository'
import { AuthenticateService } from './authenticate'
import { hash } from 'bcryptjs'
import { AMOUNT_OF_TIME_TO_GENERATE_HASE } from '@src/const'
import { UserInvalidCredentialsError } from './errors/invalid-credentials-error'

describe('Authenticate Service', () => {
  it('should be able to authenticate', async () => {
    const userRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateService(userRepository)
    const password = '123424'
    const passwordHash = await hash(password, AMOUNT_OF_TIME_TO_GENERATE_HASE)
    await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: passwordHash,
    })

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password,
    })
    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    const userRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateService(userRepository)
    const password = '123424'

    expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password,
      }),
    ).rejects.toBeInstanceOf(UserInvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const userRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateService(userRepository)
    const password = '123424'
    const wrongPassword = '123421'
    const passwordHash = await hash(
      wrongPassword,
      AMOUNT_OF_TIME_TO_GENERATE_HASE,
    )
    await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: passwordHash,
    })
    expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password,
      }),
    ).rejects.toBeInstanceOf(UserInvalidCredentialsError)
  })
})
