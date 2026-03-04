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
    return this.prismaService.campaign.delete({
      where: {
        id: campaignId,
        userId,
      },
    })
  }

  async sendEmails({ campaignId, userId }: { campaignId: string; userId: string }) {
    const subscribers = await this.prismaService.subscriber.findMany({
      where: {
        userId,
      },
    })
    for (const subscriber of subscribers) {
      const emailLog = await this.prismaService.emailLog.findUnique({
        where: {
          campaignId_subscriberId: {
            campaignId,
            subscriberId: subscriber.id,
          },
        },
      })
      if (emailLog && emailLog.status === EmailLogStatus.SENT) continue
      try {
        // Giả lập gửi email
        await new Promise((resolve) => setTimeout(resolve, 2000))
        console.log(`Đã gửi email đến ${subscriber.name}`)
        await this.upsertEmailLog({ campaignId, subscriberId: subscriber.id, status: EmailLogStatus.SENT })
      } catch {
        await this.upsertEmailLog({ campaignId, subscriberId: subscriber.id, status: EmailLogStatus.FAILED })
      }
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
