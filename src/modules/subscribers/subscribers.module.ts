import { Module } from '@nestjs/common'
import { SubscribersController } from './subscribers.controller'
import { SubscribersService } from './subscribers.service'
import { SubscribersRepo } from './subscribers.repo'

@Module({
  controllers: [SubscribersController],
  providers: [SubscribersService, SubscribersRepo],
})
export class SubscribersModule {}
