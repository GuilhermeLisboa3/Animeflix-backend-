import { JwtAdapter } from '@/infra/gateways'

import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

describe('JwtAdapter', () => {
  let fakeJwt: jest.Mocked<typeof jwt>
  let secret: string
  let sut: JwtAdapter

  beforeAll(() => {
    secret = 'any_secret'
    fakeJwt = jwt as jest.Mocked<typeof jwt>
  })

  beforeEach(() => {
    sut = new JwtAdapter(secret)
  })

  describe('generate', () => {
    let key: string

    beforeAll(() => {
      key = 'any_key'
      fakeJwt.sign.mockImplementation(() => 'any_token')
    })

    it('should call sign with correct input', async () => {
      await sut.generate({ key })

      expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn: '1d' })
      expect(fakeJwt.sign).toHaveBeenCalledTimes(1)
    })

    it('should rethrow if sign throw', async () => {
      const error = new Error('jwt_error')
      fakeJwt.sign.mockImplementationOnce(() => { throw error })

      const promise = sut.generate({ key })

      await expect(promise).rejects.toThrow(error)
    })

    it('should return token on success', async () => {
      const accessToken = await sut.generate({ key })

      expect(accessToken).toBe('any_token')
    })
  })
})
