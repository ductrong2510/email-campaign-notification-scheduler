import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { TokenService } from 'src/shared/services/token.service'

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const accessToken = request.headers.authorization?.split(' ')[1]
    if (!accessToken) {
      throw new UnauthorizedException('Access Token không tồn tại')
    }
    try {
      const decodedAccessToken = await this.tokenService.validateAccessToken(accessToken)
      request.userId = decodedAccessToken.userId
      return true
    } catch {
      throw new UnauthorizedException('Access token không hợp lệ')
    }
  }
}
