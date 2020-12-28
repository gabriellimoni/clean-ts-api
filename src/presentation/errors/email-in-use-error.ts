export class EmailInUseError extends Error {
  constructor () {
    super('The received mail in already in use')
    this.name = 'EmailInUseError'
  }
}
