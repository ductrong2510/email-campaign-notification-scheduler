import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import {
  CreateSubcriberReqType,
  GetSubcribersQueryType,
  SubcriberType,
  UpdateSubcriberReqType,
} from './subscribers.schema'
import { SubscriberWhereInput, SubscriberWhereUniqueInput } from 'generated/prisma/models'
import { removeVietnameseTones } from 'src/common/helpers'

@Injectable()
export class SubscribersRepo {
  constructor(private readonly prismaService: PrismaService) {}

  findUnique(where: SubscriberWhereUniqueInput): Promise<SubcriberType | null> {
    return this.prismaService.subscriber.findUnique({
      where,
    })
  }

  async list(userId: string, query: GetSubcribersQueryType) {
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

  createOne(userId: string, data: CreateSubcriberReqType) {
    return this.prismaService.subscriber.create({
      data: {
        ...data,
        nameNormalized: removeVietnameseTones(data.name),
        userId,
      },
    })
  }

  createMany(userId: string, data: CreateSubcriberReqType[]) {
    return this.prismaService.subscriber.createMany({
      data: data.map((item) => {
        return {
          ...item,
          nameNormalized: removeVietnameseTones(item.name),
          userId,
        }
      }),
      skipDuplicates: true,
    })
  }

  update(subscriberId: string, data: UpdateSubcriberReqType) {
    return this.prismaService.subscriber.update({
      where: {
        id: subscriberId,
      },
      data,
    })
  }

  delete({ subscriberId, userId }: { subscriberId: string; userId: string }) {
    return this.prismaService.subscriber.delete({
      where: {
        id: subscriberId,
        userId,
      },
    })
  }
}
