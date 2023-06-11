export class InvalidCheckInError extends Error {
  constructor() {
    super('Invalid check-in in the same day!')
  }
}
