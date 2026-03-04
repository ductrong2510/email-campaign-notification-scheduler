import { Module } from '@nestjs/common'
import { AccessTokenGuard } from './guards/access-token.guard'
import { AuthenticationGuard } from './guards/authentication.guard'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import CustomZodValidationPipe from './pipes/custom-zod-validation.pipe'
import { ZodSerializerInterceptor } from 'nestjs-zod'
import { TransformInterceptor } from './interceptors/transform.interceptor'
import { GlobalExceptionFilter } from './filters/global-exception.filter'
import { BullModule } from '@nestjs/bullmq'
import envConfig from 'src/config/envConfig'

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
  imports: [
    BullModule.forRoot({
      connection: {
        url: envConfig.REDIS_URL,
      },
      skipVersionCheck: true,
      defaultJobOptions: {
        removeOnComplete: 3,
        removeOnFail: 6,
        backoff: 2000,
        attempts: 3,
      },
    }),
  ],
})
export class CommonModule {}
