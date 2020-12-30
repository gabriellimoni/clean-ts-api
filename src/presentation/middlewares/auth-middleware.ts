import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccessDeniedError } from '../errors'
import { forbidden, ok } from '../helpers/http/http-helper'
import { Middleware, HttpRequest, HttpResponse } from '../protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const returnForbidden = (): HttpResponse => forbidden(new AccessDeniedError())

    const accessToken = httpRequest.headers?.['x-access-token']
    if (!accessToken) return returnForbidden()

    const account = await this.loadAccountByToken.load(accessToken)
    if (!account) return returnForbidden()

    return ok({
      accountId: account.id
    })
  }
}
