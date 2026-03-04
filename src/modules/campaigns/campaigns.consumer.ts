import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { CampaignsRepo } from './campaigns.repo'
import { CampaignStatus, CampaignStatusType } from 'src/common/constants/campaign.constants'

@Processor('email')
export class CampaignComsumer extends WorkerHost {
  constructor(private readonly campaignsRepo: CampaignsRepo) {
    super()
  }

  async process(job: Job<{ campaignId: string; userId: string }, any, string>) {
    await this.campaignsRepo.sendEmails(job.data)
  }

  @OnWorkerEvent('active')
  async onActive(job: Job) {
    console.log(`${job.id} đã active`)
    await this.campaignsRepo.update(job.data, { status: CampaignStatus.PROCESSING })
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: Job) {
    console.log(`${job.id} đã complete`)
    await this.campaignsRepo.update(job.data, { status: CampaignStatus.COMPLETED })
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job) {
    console.log(`${job.id} đã fail`)
    await this.campaignsRepo.update(job.data, { status: CampaignStatus.FAILED })
  }
}
