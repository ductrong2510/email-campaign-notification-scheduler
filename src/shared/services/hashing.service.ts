import { Injectable } from '@nestjs/common'
import { compare, hash } from 'bcrypt'

const SALT_ROUNDS = 10

@Injectable()
export class HashingService {
  hash(password: string) {
    return hash(password, SALT_ROUNDS)
  }
  compare(password: string, hashedPassword: string) {
    return compare(password, hashedPassword)
  }
}
