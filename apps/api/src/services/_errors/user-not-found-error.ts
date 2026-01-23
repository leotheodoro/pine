export class UserNotFoundError extends Error {
  constructor() {
    super('User already exists')
  }
}
