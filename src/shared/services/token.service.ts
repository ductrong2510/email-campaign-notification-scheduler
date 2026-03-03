import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import envConfig from 'src/config/envConfig'
import type { StringValue } from 'ms'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  signAccessToken(userId: string) {
    return this.jwtService.signAsync(
      { userId, uuid: uuidv4() },
      {
        secret: envConfig.ACCESS_TOKEN_SECRET,
        expiresIn: envConfig.ACCESS_TOKEN_EXPIRES_IN as StringValue,
        algorithm: 'HS256',
      },
    )
  }

  signRefreshToken(userId: string) {
    return this.jwtService.signAsync(
      { userId, uuid: uuidv4() },
      {
        secret: envConfig.REFRESH_TOKEN_SECRET,
        expiresIn: envConfig.REFRESH_TOKEN_EXPIRES_IN as StringValue,
        algorithm: 'HS256',
      },
    )
  }

  validateAccessToken(token: string) {
    return this.jwtService.verifyAsync(token, {
      secret: envConfig.ACCESS_TOKEN_SECRET,
    })
  }

  validateRefreshToken(token: string) {
    return this.jwtService.verifyAsync(token, {
      secret: envConfig.REFRESH_TOKEN_SECRET,
    })
  }
}
