import { describe, expect, it } from 'vitest'
import { RegisterService } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@src/repositories/in-memory/in-memory-users-tepository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register Service', () => {
  it('should be able to register a user', async () => {
    const userRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(userRepository)
    const password = '123424'
    const { user } = await registerService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password,
    })
    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const userRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(userRepository)
    const password = '123424'
    const { user } = await registerService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password,
    })
    const isPasswordCorrectlyHashed = await compare(
      password,
      user.password_hash,
    )
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it("shouldn't be able to register a user with same email", async () => {
    const userRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(userRepository)
    const email = 'johndoe@example.com'
    await registerService.execute({
      name: 'John Doe',
      email,
      password: '124324324324',
    })
    await expect(() =>
      registerService.execute({
        name: 'John Doe',
        email,
        password: '124324324324',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
