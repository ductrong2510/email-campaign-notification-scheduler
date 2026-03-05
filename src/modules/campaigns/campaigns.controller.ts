import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { CampaignsService } from './campaigns.service'
import {
  CreateCampaignReqDto,
  GetCampaignQueryDto,
  StartCampaignReqDto,
  UpdateCampaignReqDto,
} from './campaigns.schema'
import { UserId } from 'src/common/decorators/user-id.decorator'
import { ResponseMessage } from 'src/common/decorators/response-message.decorator'

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @ResponseMessage('Lấy danh sách campaign thành công')
  @Get()
  list(@UserId() userId: string, @Query() query: GetCampaignQueryDto) {
    return this.campaignsService.list(userId, query)
  }

  @ResponseMessage('Tạo campaign thành công')
  @Post()
  create(@UserId() userId: string, @Body() body: CreateCampaignReqDto) {
    return this.campaignsService.create(userId, body)
  }

  @ResponseMessage('Cập nhật campaign thành công')
  @Patch(':id')
  update(@UserId() userId: string, @Body() body: UpdateCampaignReqDto, @Param('id') campaignId: string) {
    return this.campaignsService.update({ campaignId, userId }, body)
  }

  @ResponseMessage('Xóa campaign thành công')
  @Delete(':id')
  delete(@UserId() userId: string, @Param('id') campaignId: string) {
    return this.campaignsService.delete({ campaignId, userId })
  }

  @ResponseMessage('Gửi campaign thành công')
  @Post(':id/send')
  startCampaign(@UserId() userId: string, @Body() body: StartCampaignReqDto, @Param('id') campaignId: string) {
    return this.campaignsService.startEmailCampaign({
      userId,
      scheduledAt: body.scheduledAt,
      campaignId,
    })
  }
}
