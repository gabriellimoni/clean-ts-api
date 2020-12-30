import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccessDeniedError } from '../errors'
import { forbidden, ok, serverError } from '../helpers/http/http-helper'
import { Middleware, HttpRequest, HttpResponse } from '../protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const returnForbidden = (): HttpResponse => forbidden(new AccessDeniedError())

      const accessToken = httpRequest.headers?.['x-access-token']
      if (!accessToken) return returnForbidden()

      const account = await this.loadAccountByToken.load(accessToken, this.role)
      if (!account) return returnForbidden()

      return ok({
        accountId: account.id
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
