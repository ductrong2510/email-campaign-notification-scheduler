import { createZodDto } from 'nestjs-zod'
import { CampaignStatus } from 'src/common/constants/campaign.constants'
import { PaginationQuerySchema } from 'src/common/schemas/request.schema'
import z from 'zod'

export const CampaignSchema = z.object({
  id: z.string(),
  title: z.string(),
  titleNormalized: z.string(),
  subject: z.string(),
  htmlContent: z.string(),
  status: z.enum(CampaignStatus),
  scheduledAt: z.coerce.date().nullable().default(null),
  userId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export const GetListCampaignSchema = z.object({
  campaigns: z.array(CampaignSchema),
})

export const CreateCampaignReqSchema = CampaignSchema.pick({
  title: true,
  subject: true,
  htmlContent: true,
  scheduledAt: true,
}).strict()

export const UpdateCampaignReqSchema = CampaignSchema.pick({
  title: true,
  subject: true,
  htmlContent: true,
  scheduledAt: true,
  status: true,
})
  .partial()
  .strict()

export const GetCampaignQuerySchema = PaginationQuerySchema.extend({
  status: z.enum(CampaignStatus).optional(),
  search: z.string().optional(),
}).strict()

export const StartCampaignReqSchema = CampaignSchema.pick({
  scheduledAt: true,
}).strict()

export type CampaignType = z.infer<typeof CampaignSchema>
export type GetListCampaignType = z.infer<typeof GetListCampaignSchema>
export type CreateCampaignReqType = z.infer<typeof CreateCampaignReqSchema>
export type UpdateCampaignReqType = z.infer<typeof UpdateCampaignReqSchema>
export type GetCampaignQueryType = z.infer<typeof GetCampaignQuerySchema>
export type StartCampaignReqType = z.infer<typeof StartCampaignReqSchema>

export class GetListCampaignResDto extends createZodDto(GetListCampaignSchema) {}
export class CreateCampaignReqDto extends createZodDto(CreateCampaignReqSchema) {}
export class UpdateCampaignReqDto extends createZodDto(UpdateCampaignReqSchema) {}
export class GetCampaignQueryDto extends createZodDto(GetCampaignQuerySchema) {}
export class StartCampaignReqDto extends createZodDto(StartCampaignReqSchema) {}
