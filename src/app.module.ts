import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './modules/auth/auth.module'
import { SharedModule } from './shared/shared.module'
import { CommonModule } from './common/common.module'
import { SubscribersModule } from './modules/subscribers/subscribers.module';

@Module({
  imports: [AuthModule, SharedModule, CommonModule, SubscribersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
