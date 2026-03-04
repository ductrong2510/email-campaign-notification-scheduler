import { createZodDto } from 'nestjs-zod'
import { PaginationQuerySchema } from 'src/common/schemas/request.schema'
import { GetListSchema } from 'src/common/schemas/response.schema'
import z from 'zod'

export const SubscriberSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  nameNormalized: z.string(),
  isActive: z.boolean(),
  userId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export const GetSubscriberResSchema = SubscriberSchema.omit({
  nameNormalized: true,
})

export const GetSubscribersResSchema = GetListSchema.extend({
  data: z.array(GetSubscriberResSchema),
})

export const CreateSubscriberReqSchema = SubscriberSchema.pick({
  email: true,
  name: true,
}).strict()

export const CreateSubscriberBulkReqSchema = z
  .object({
    Subscribers: z.array(CreateSubscriberReqSchema),
  })
  .strict()

export const UpdateSubscriberReqSchema = SubscriberSchema.pick({
  email: true,
  name: true,
  isActive: true,
})
  .partial()
  .strict()

export type SubscriberType = z.infer<typeof SubscriberSchema>
export type CreateSubscriberReqType = z.infer<typeof CreateSubscriberReqSchema>
export type CreateSubscriberBulkReqType = z.infer<typeof CreateSubscriberBulkReqSchema>
export type UpdateSubscriberReqType = z.infer<typeof UpdateSubscriberReqSchema>
export type GetSubscribersResType = z.infer<typeof GetSubscribersResSchema>
export type GetSubscriberResType = z.infer<typeof GetSubscriberResSchema>

export class CreateSubscriberReqDto extends createZodDto(CreateSubscriberReqSchema) {}
export class CreateSubscriberBulkReqDto extends createZodDto(CreateSubscriberBulkReqSchema) {}
export class UpdateSubscriberReqDto extends createZodDto(UpdateSubscriberReqSchema) {}
export class GetSubscribersResDto extends createZodDto(GetSubscribersResSchema) {}
export class GetSubscriberResDto extends createZodDto(GetSubscriberResSchema) {}
