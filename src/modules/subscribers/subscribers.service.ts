import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common'
import { SubscribersRepo } from './subscribers.repo'
import { CreateSubcriberBulkReqType, CreateSubcriberReqType, UpdateSubcriberReqType } from './subscribers.schema'
import {
  isForeignKeyConstraintPrismaError,
  isNotFoundPrismaError,
  isUniqueConstraintPrismaError,
} from 'src/common/helpers'
import { SharedSubscriberRepo } from 'src/shared/repositories/shared-subscribers.repo'
import { GetSubcribersQueryType } from 'src/common/schemas/subscribers.schema'

@Injectable()
export class SubscribersService {
  constructor(
    private readonly subscribersRepo: SubscribersRepo,
    private readonly sharedSubscriberRepo: SharedSubscriberRepo,
  ) {}

  async createOne(userId: string, data: CreateSubcriberReqType) {
    try {
      const result = await this.subscribersRepo.createOne(userId, data)
      return result
    } catch (error) {
      if (isForeignKeyConstraintPrismaError(error)) {
        throw new NotFoundException('Admin User không tồn tại')
      }
      if (isUniqueConstraintPrismaError(error)) {
        throw new ConflictException('Email đã tồn tại')
      }
      throw error
    }
  }

  async createBulk(userId: string, body: CreateSubcriberBulkReqType) {
    const result = await this.subscribersRepo.createMany(userId, body.subcribers)
    return {
      added: result.count,
    }
  }

  list(userId: string, query: GetSubcribersQueryType) {
    return this.sharedSubscriberRepo.list(userId, query)
  }

  async update({ subscriberId, userId, data }: { subscriberId: string; userId: string; data: UpdateSubcriberReqType }) {
    const subscriber = await this.subscribersRepo.findUnique({ id: subscriberId })
    if (!subscriber) {
      throw new NotFoundException('Subcriber không tồn tại')
    }
    if (subscriber.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền thao tác trên dữ liệu này')
    }
    return this.subscribersRepo.update(subscriberId, data)
  }

  async delete({ subscriberId, userId }: { subscriberId: string; userId: string }) {
    try {
      await this.subscribersRepo.delete({ subscriberId, userId })
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new NotFoundException('Subcriber không tồn tại')
      }
      throw error
    }
  }
}
