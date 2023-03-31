import { app } from '@/main/config/app'
import env from '@/main/config/env'
import { sequelize, Account, Category } from '@/infra/database/postgres/entities'

import request from 'supertest'
import { sign } from 'jsonwebtoken'
import { RequiredFieldError } from '@/application/errors'
import { FieldInUseError } from '@/domain/errors'

describe('CategoryRoute', () => {
  let token: string
  const makeAccount = { firstName: 'any_name', lastName: 'any_last_name', email: 'any_email@gmail.com', password: 'any_password', birth: new Date(), phone: 'any_phone' }

  beforeAll(async () => {
    token = sign({ key: '1' }, env.secret)
  })

  beforeEach(async () => {
    await sequelize.sync({ force: true })
    await Account.create({ ...makeAccount, role: 'admin' })
  })

  afterAll(async () => {
    await sequelize.close()
  })

  describe('POST /category', () => {
    it('should return 204 on success', async () => {
      const { status, body } = await request(app)
        .post('/category')
        .set({ authorization: `Bearer: ${token}` })
        .send({ name: 'any_category', position: 1 })

      expect(status).toBe(204)
      expect(body).toBeTruthy()
    })

    it('should return 400 if any data is not supplied', async () => {
      const { status, body: { error } } = await request(app)
        .post('/category')
        .set({ authorization: `Bearer: ${token}` })
        .send({ name: 'any_name' })

      expect(status).toBe(400)
      expect(error).toBe(new RequiredFieldError('position').message)
    })

    it('should return 400 if category already exists', async () => {
      await Category.create({ name: 'any_name', position: 1 })
      const { status, body: { error } } = await request(app)
        .post('/category')
        .set({ authorization: `Bearer: ${token}` })
        .send({ name: 'any_name', position: 1 })

      expect(status).toBe(400)
      expect(error).toBe(new FieldInUseError('name or position').message)
    })
  })
})
