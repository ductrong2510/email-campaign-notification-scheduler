import { createZodDto } from 'nestjs-zod'
import { PaginationQuerySchema } from 'src/common/schemas/request.schema'
import { GetListSchema } from 'src/common/schemas/response.schema'
import z from 'zod'

export const SubcriberSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  nameNormalized: z.string(),
  isActive: z.boolean(),
  userId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export const GetSubscriberResSchema = SubcriberSchema.omit({
  nameNormalized: true,
})

export const GetSubscribersResSchema = GetListSchema.extend({
  data: z.array(GetSubscriberResSchema),
})

export const CreateSubcriberReqSchema = SubcriberSchema.pick({
  email: true,
  name: true,
}).strict()

export const CreateSubcriberBulkReqSchema = z
  .object({
    subcribers: z.array(CreateSubcriberReqSchema),
  })
  .strict()

export const UpdateSubcriberReqSchema = SubcriberSchema.pick({
  email: true,
  name: true,
  isActive: true,
})
  .partial()
  .strict()

export type SubcriberType = z.infer<typeof SubcriberSchema>
export type CreateSubcriberReqType = z.infer<typeof CreateSubcriberReqSchema>
export type CreateSubcriberBulkReqType = z.infer<typeof CreateSubcriberBulkReqSchema>
export type UpdateSubcriberReqType = z.infer<typeof UpdateSubcriberReqSchema>
export type GetSubscribersResType = z.infer<typeof GetSubscribersResSchema>
export type GetSubscriberResType = z.infer<typeof GetSubscriberResSchema>

export class CreateSubcriberReqDto extends createZodDto(CreateSubcriberReqSchema) {}
export class CreateSubcriberBulkReqDto extends createZodDto(CreateSubcriberBulkReqSchema) {}
export class UpdateSubcriberReqDto extends createZodDto(UpdateSubcriberReqSchema) {}
export class GetSubscribersResDto extends createZodDto(GetSubscribersResSchema) {}
export class GetSubscriberResDto extends createZodDto(GetSubscriberResSchema) {}
