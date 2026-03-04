import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { CreateSubscriberReqType, SubscriberType, UpdateSubscriberReqType } from './subscribers.schema'
import { SubscriberWhereUniqueInput } from 'generated/prisma/models'
import { removeVietnameseTones } from 'src/common/helpers'

@Injectable()
export class SubscribersRepo {
  constructor(private readonly prismaService: PrismaService) {}

  findUnique(where: SubscriberWhereUniqueInput): Promise<SubscriberType | null> {
    return this.prismaService.subscriber.findUnique({
      where,
    })
  }

  createOne(userId: string, data: CreateSubscriberReqType) {
    return this.prismaService.subscriber.create({
      data: {
        ...data,
        nameNormalized: removeVietnameseTones(data.name),
        userId,
      },
    })
  }

  createMany(userId: string, data: CreateSubscriberReqType[]) {
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

  update(subscriberId: string, data: UpdateSubscriberReqType) {
    return this.prismaService.subscriber.update({
      where: {
        id: subscriberId,
      },
      data: data.name ? { ...data, nameNormalized: removeVietnameseTones(data.name) } : data,
    })
  }

  delete({ subscriberId, userId }: { subscriberId: string; userId: string }) {
    return this.prismaService.subscriber.deleteMany({
      where: {
        id: subscriberId,
        userId,
      },
    })
  }
}
