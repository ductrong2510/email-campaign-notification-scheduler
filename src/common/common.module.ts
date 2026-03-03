import { Module } from '@nestjs/common'
import { AccessTokenGuard } from './guards/access-token.guard'
import { AuthenticationGuard } from './guards/authentication.guard'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import CustomZodValidationPipe from './pipes/custom-zod-validation.pipe'
import { ZodSerializerInterceptor } from 'nestjs-zod'
import { TransformInterceptor } from './interceptors/transform.interceptor'
import { GlobalExceptionFilter } from './filters/global-exception.filter'

@Module({
  providers: [
    AccessTokenGuard,
    AuthenticationGuard,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_PIPE,
      useClass: CustomZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class CommonModule {}
