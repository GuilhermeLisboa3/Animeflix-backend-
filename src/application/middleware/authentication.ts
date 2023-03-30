import { forbidden, HttpResponse, ok, serverError, unauthorized } from '@/application/helpers'
import { AuthenticationError, InsuficientPermissionError } from '@/domain/errors'
import { Authorize } from '@/domain/usecases/account'

type HttpRequest = { authorization: string }

export class AuthenticationMiddleware {
  constructor (
    private readonly authorize: Authorize,
    private readonly role?: string
  ) {}

  async handle ({ authorization }: HttpRequest): Promise<HttpResponse | undefined> {
    try {
      if (!authorization) return unauthorized()
      const accessToken = authorization.split(' ')[1]
      const accountId = await this.authorize({ accessToken, role: this.role })
      return ok(accountId)
    } catch (error) {
      if (error instanceof AuthenticationError) return unauthorized()
      if (error instanceof InsuficientPermissionError) return forbidden()
      return serverError(error)
    }
  }
}
