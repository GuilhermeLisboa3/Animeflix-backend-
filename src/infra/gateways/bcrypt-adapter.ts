import { HashComparer, HashGenerator } from '@/domain/contracts/gateways'

import bcrypt from 'bcrypt'

export class BcryptAdapter implements HashGenerator {
  constructor (private readonly salt: number) {}

  async generate ({ plaintext }: HashGenerator.Input): Promise<HashGenerator.Output> {
    return await bcrypt.hash(plaintext, this.salt)
  }

  async comparer ({ plaintext, digest }: HashComparer.Input): Promise<void> {
    await bcrypt.compare(plaintext, digest)
  }
}
