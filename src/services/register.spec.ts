import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterService } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@src/repositories/in-memory/in-memory-users-repository'

import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let userRepository: InMemoryUsersRepository
let sut: RegisterService
describe('Register Service', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new RegisterService(userRepository)
  })

  it('should be able to register a user', async () => {
    const password = '123424'
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password,
    })
    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const password = '123424'
    const { user } = await sut.execute({
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
    const email = 'johndoe@example.com'
    await sut.execute({
      name: 'John Doe',
      email,
      password: '124324324324',
    })
    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email,
        password: '124324324324',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
