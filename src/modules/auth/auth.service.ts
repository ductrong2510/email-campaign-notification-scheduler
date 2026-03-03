import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthRepo } from './auth.repo'
import { LoginReqType, RegisterReqType } from './auth.schema'
import { HashingService } from 'src/shared/services/hashing.service'
import { isUniqueConstraintPrismaError } from 'src/common/helpers'
import { TokenService } from 'src/shared/services/token.service'
import ms, { StringValue } from 'ms'
import envConfig from 'src/config/envConfig'
import { JsonWebTokenError } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepo: AuthRepo,
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
  ) {}

  async generateTokens(userId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken(userId),
      this.tokenService.signRefreshToken(userId),
    ])
    await this.authRepo.createRefreshToken({
      token: refreshToken,
      userId,
      expiredAt: new Date(Date.now() + ms(envConfig.REFRESH_TOKEN_EXPIRES_IN as StringValue)),
    })
    return {
      accessToken,
      refreshToken,
    }
  }

  async register(data: RegisterReqType) {
    try {
      const hashedPassword = await this.hashingService.hash(data.password)
      const user = await this.authRepo.createUser({
        ...data,
        password: hashedPassword,
      })
      return user
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw new ConflictException('Email đã tồn tại')
      }
      throw error
    }
  }

  async login(data: LoginReqType) {
    const { email, password } = data
    const user = await this.authRepo.findUniqueUser({ email })
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác')
    }
    const isMatchedPassword = await this.hashingService.compare(password, user.password)
    if (!isMatchedPassword) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác')
    }
    const tokens = await this.generateTokens(user.id)
    return tokens
  }

  async refreshToken(token: string) {
    try {
      await this.tokenService.validateRefreshToken(token)
      const refreshTokenInDb = await this.authRepo.findRefreshToken(token)
      if (!refreshTokenInDb) {
        throw new UnauthorizedException('Refresh token không hợp lệ.')
      }
      const userId = refreshTokenInDb.userId
      await this.authRepo.deleteRefreshToken(token)
      const tokens = await this.generateTokens(userId)
      return tokens
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Refresh token không hợp lệ')
      }
      throw error
    }
  }

  async logout(refreshToken: string) {
    await this.authRepo.deleteRefreshToken(refreshToken)
  }
}
