import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { CreateCampaignReqType, GetCampaignQueryType, UpdateCampaignReqType } from './campaigns.schema'
import { removeVietnameseTones } from 'src/common/helpers'
import { CampaignWhereInput } from 'generated/prisma/models'
import { EmailLogStatus, EmailLogStatusType } from 'src/common/constants/email-log.constants'

@Injectable()
export class CampaignsRepo {
  constructor(private readonly prismaService: PrismaService) {}

  findOne(where: CampaignWhereInput) {
    return this.prismaService.campaign.findFirst({
      where,
    })
  }

  create(data: CreateCampaignReqType & { userId: string }) {
    return this.prismaService.campaign.create({
      data: {
        ...data,
        titleNormalized: removeVietnameseTones(data.title),
      },
    })
  }

  async list(userId: string, query: GetCampaignQueryType) {
    const { page, limit } = query
    const skip = (page - 1) * limit
    const take = limit
    const where: CampaignWhereInput = {
      userId,
    }
    if (query.status) {
      where.status = query.status
    }
    if (query.search) {
      const normalizedKeyword = removeVietnameseTones(query.search)
      where.titleNormalized = {
        contains: normalizedKeyword,
      }
    }
    const [count, data] = await Promise.all([
      this.prismaService.campaign.count({
        where,
      }),
      this.prismaService.campaign.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take,
      }),
    ])
    return {
      data,
      page,
      limit,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
    }
  }

  update({ campaignId, userId }: { campaignId: string; userId: string }, data: UpdateCampaignReqType) {
    return this.prismaService.campaign.update({
      where: {
        id: campaignId,
        userId,
      },
      data: data.title ? { ...data, titleNormalized: removeVietnameseTones(data.title) } : data,
    })
  }

  delete({ campaignId, userId }: { campaignId: string; userId: string }) {
    return this.prismaService.campaign.deleteMany({
      where: {
        id: campaignId,
        userId,
      },
    })
  }

  async sendEmails({ campaignId, userId }: { campaignId: string; userId: string }) {
    const BATCH_SIZE = 500
    let skip = 0
    let hasMore = true

    const sentLog = await this.prismaService.emailLog.findMany({
      where: {
        campaignId,
        status: EmailLogStatus.SENT,
      },
      select: {
        subscriberId: true,
      },
    })
    const sentSubscriberIds = new Set(sentLog.map((item) => item.subscriberId))

    while (hasMore) {
      const subscribers = await this.prismaService.subscriber.findMany({
        where: {
          userId,
          isActive: true,
        },
        skip,
        take: BATCH_SIZE,
      })
      if (subscribers.length === 0) {
        hasMore = false
        break
      }

      const emailPromises = subscribers.map(async (subscriber) => {
        try {
          if (sentSubscriberIds.has(subscriber.id)) return
          // Giả lập gửi email
          await new Promise((resolve) => setTimeout(resolve, 2000))
          console.log(`Đã gửi email đến ${subscriber.name}`)
          await this.upsertEmailLog({ campaignId, subscriberId: subscriber.id, status: EmailLogStatus.SENT })
        } catch {
          await this.upsertEmailLog({ campaignId, subscriberId: subscriber.id, status: EmailLogStatus.FAILED })
        }
      })

      await Promise.allSettled(emailPromises)
      skip += BATCH_SIZE
    }
  }

  upsertEmailLog({
    campaignId,
    subscriberId,
    status,
  }: {
    campaignId: string
    subscriberId: string
    status: EmailLogStatusType
  }) {
    return this.prismaService.emailLog.upsert({
      where: {
        campaignId_subscriberId: {
          campaignId,
          subscriberId,
        },
      },
      create: {
        campaignId,
        subscriberId,
        status,
      },
      update: {
        status,
      },
    })
  }
}
