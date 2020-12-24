import {
  Authentication,
  AuthenticationModel,
  HashComparer,
  TokenGenerator,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository
} from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly tokenGenerator: TokenGenerator
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository

  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    tokenGenerator: TokenGenerator,
    updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth (authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (!account) return null

    const validPassword = await this.hashComparer.compare(authentication.password, account.password)
    if (!validPassword) return null

    const accessToken = await this.tokenGenerator.generate(account.id)
    await this.updateAccessTokenRepository.update(account.id, accessToken)

    return accessToken
  }
}
