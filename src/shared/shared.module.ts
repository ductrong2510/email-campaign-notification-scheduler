import { Global, Module } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { TokenService } from './services/token.service'
import { JwtModule } from '@nestjs/jwt'
import { HashingService } from './services/hashing.service'
import { SharedSubscriberRepo } from './repositories/shared-subscribers.repo'

const sharedServices = [PrismaService, TokenService, HashingService, SharedSubscriberRepo]

@Global()
@Module({
  providers: sharedServices,
  exports: sharedServices,
  imports: [JwtModule],
})
export class SharedModule {}
