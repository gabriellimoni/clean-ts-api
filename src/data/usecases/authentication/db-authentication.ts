import {
  Authentication,
  AuthenticationModel,
  HashComparer,
  Encrypter,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository
} from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) { }

  async auth (authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email)
    if (!account) return null

    const validPassword = await this.hashComparer.compare(authentication.password, account.password)
    if (!validPassword) return null

    const accessToken = await this.tokenGenerator.encrypt(account.id)
    await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)

    return accessToken
  }
}
