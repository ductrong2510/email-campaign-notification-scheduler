import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { SubscribersService } from './subscribers.service'
import { UserId } from 'src/common/decorators/user-id.decorator'
import { ResponseMessage } from 'src/common/decorators/response-message.decorator'
import {
  CreateSubcriberBulkReqDto,
  CreateSubcriberReqDto,
  GetSubscriberResDto,
  GetSubscribersResDto,
  UpdateSubcriberReqDto,
} from './subscribers.schema'
import { ZodSerializerDto } from 'nestjs-zod'
import { GetSubcribersQueryDto } from 'src/common/schemas/subscribers.schema'

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @ResponseMessage('Lấy danh sách subscriber thành công')
  @ZodSerializerDto(GetSubscribersResDto)
  @Get()
  list(@UserId() userId: string, @Query() query: GetSubcribersQueryDto) {
    return this.subscribersService.list(userId, query)
  }

  @ResponseMessage('Tạo subscriber thành công')
  @ZodSerializerDto(GetSubscriberResDto)
  @Post()
  createOne(@UserId() userId: string, @Body() body: CreateSubcriberReqDto) {
    return this.subscribersService.createOne(userId, body)
  }

  @ResponseMessage('Tạo hàng loạt subscriber thành công')
  @Post('bulk')
  createBulk(@UserId() userId: string, @Body() body: CreateSubcriberBulkReqDto) {
    return this.subscribersService.createBulk(userId, body)
  }

  @ResponseMessage('Cập nhật subscriber thành công')
  @ZodSerializerDto(GetSubscriberResDto)
  @Patch(':id')
  update(@UserId() userId: string, @Body() body: UpdateSubcriberReqDto, @Param('id') subscriberId: string) {
    return this.subscribersService.update({
      userId,
      subscriberId,
      data: body,
    })
  }

  @ResponseMessage('Xóa subscriber thành công')
  @Delete(':id')
  delete(@UserId() userId: string, @Param('id') subscriberId: string) {
    return this.subscribersService.delete({
      userId,
      subscriberId,
    })
  }
}
