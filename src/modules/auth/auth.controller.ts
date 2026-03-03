import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import {
  LoginReqDto,
  LoginResDto,
  LogoutReqDto,
  RefreshTokenReqDto,
  RegisterReqDto,
  RegisterResDto,
} from './auth.schema'
import { Public } from 'src/common/decorators/public.decorator'
import { ResponseMessage } from 'src/common/decorators/response-message.decorator'
import { ZodSerializerDto } from 'nestjs-zod'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @ResponseMessage('Đăng ký tài khoản thành công')
  @ZodSerializerDto(RegisterResDto)
  register(@Body() body: RegisterReqDto) {
    return this.authService.register(body)
  }

  @Post('login')
  @Public()
  @ResponseMessage('Đăng nhập thành công')
  @ZodSerializerDto(LoginResDto)
  login(@Body() body: LoginReqDto) {
    return this.authService.login(body)
  }

  @Post('refresh-token')
  @Public()
  @ResponseMessage('Refresh token thành công')
  refreshToken(@Body() body: RefreshTokenReqDto) {
    return this.authService.refreshToken(body.refreshToken)
  }

  @Post('logout')
  @Public()
  @ResponseMessage('Đăng xuất thành công')
  async logout(@Body() body: LogoutReqDto) {
    await this.authService.logout(body.refreshToken)
  }
}
