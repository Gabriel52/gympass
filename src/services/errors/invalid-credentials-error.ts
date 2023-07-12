export class UserInvalidCredentialsError extends Error {
  constructor() {
    super('user does not exist, invalid credentials')
  }
}
