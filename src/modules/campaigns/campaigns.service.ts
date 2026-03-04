import { Injectable, NotFoundException } from '@nestjs/common'
import { CampaignsRepo } from './campaigns.repo'
import { CreateCampaignReqType, GetCampaignQueryType, UpdateCampaignReqType } from './campaigns.schema'
import { isNotFoundPrismaError } from 'src/common/helpers'
import { InjectQueue } from '@nestjs/bullmq'
import { Queue } from 'bullmq'
import { CampaignStatus } from 'src/common/constants/campaign.constants'

@Injectable()
export class CampaignsService {
  constructor(
    private readonly campaignsRepo: CampaignsRepo,
    @InjectQueue('email') private readonly emailQueue: Queue,
  ) {}

  list(userId: string, query: GetCampaignQueryType) {
    return this.campaignsRepo.list(userId, query)
  }

  create(userId: string, data: CreateCampaignReqType) {
    return this.campaignsRepo.create({ ...data, userId })
  }

  async update({ campaignId, userId }: { campaignId: string; userId: string }, data: UpdateCampaignReqType) {
    try {
      const result = await this.campaignsRepo.update({ campaignId, userId }, data)
      return result
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new NotFoundException('Campaign không tồn tại')
      }
      throw error
    }
  }

  async delete({ campaignId, userId }: { campaignId: string; userId: string }) {
    try {
      await this.campaignsRepo.delete({ campaignId, userId })
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new NotFoundException('Campaign không tồn tại')
      }
      throw error
    }
  }

  async startEmailCampaign({
    campaignId,
    userId,
    scheduledAt,
  }: {
    campaignId: string
    userId: string
    scheduledAt: Date | null
  }) {
    const campaign = await this.campaignsRepo.findOne({ id: campaignId, userId })
    if (!campaign) {
      throw new NotFoundException('Campaign không tồn tại')
    }
    const now = Date.now()
    let delay = 0
    if (campaign.scheduledAt && campaign.scheduledAt.getTime() > now) {
      delay = campaign.scheduledAt.getTime() - now
    }
    if (scheduledAt) {
      delay = scheduledAt.getTime() > now ? scheduledAt.getTime() - now : 0
      await this.campaignsRepo.update(
        { campaignId, userId },
        { scheduledAt: scheduledAt.getTime() >= now ? scheduledAt : new Date() },
      )
    }
    await this.emailQueue.add(
      'email',
      {
        campaignId,
        userId,
      },
      {
        delay,
      },
    )
    return await this.campaignsRepo.update({ campaignId, userId }, { status: CampaignStatus.PENDING })
  }
}
