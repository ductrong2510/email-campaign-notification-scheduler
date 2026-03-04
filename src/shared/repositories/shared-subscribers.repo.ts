import { Injectable } from '@nestjs/common'
import { PrismaService } from '../services/prisma.service'
import { SubscriberWhereInput } from 'generated/prisma/models'
import { removeVietnameseTones } from 'src/common/helpers'
import { GetSubscribersQueryType } from 'src/common/schemas/subscribers.schema'

@Injectable()
export class SharedSubscriberRepo {
  constructor(private readonly prismaService: PrismaService) {}

  async list(userId: string, query: GetSubscribersQueryType) {
    const { page, limit } = query
    const skip = (page - 1) * limit
    const take = limit
    const where: SubscriberWhereInput = {
      userId,
    }
    if (query.isActive) {
      where.isActive = query.isActive
    }
    if (query.search) {
      const normalizedKeyword = removeVietnameseTones(query.search)
      where.OR = [
        {
          nameNormalized: {
            contains: normalizedKeyword,
          },
        },
        {
          email: {
            contains: normalizedKeyword,
            mode: 'insensitive',
          },
        },
      ]
    }
    const [count, data] = await Promise.all([
      this.prismaService.subscriber.count({
        where,
      }),
      this.prismaService.subscriber.findMany({
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
}
