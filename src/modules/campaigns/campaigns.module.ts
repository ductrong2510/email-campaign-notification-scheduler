import { Module } from '@nestjs/common'
import { CampaignsController } from './campaigns.controller'
import { CampaignsService } from './campaigns.service'
import { BullModule } from '@nestjs/bullmq'
import { CampaignsRepo } from './campaigns.repo'
import { CampaignComsumer } from './campaigns.consumer'

@Module({
  controllers: [CampaignsController],
  providers: [CampaignsService, CampaignsRepo, CampaignComsumer],
  imports: [BullModule.registerQueue({ name: 'email' })],
})
export class CampaignsModule {}
