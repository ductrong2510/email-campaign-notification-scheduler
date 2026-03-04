import z from 'zod'
import { PaginationQuerySchema } from './request.schema'
import { createZodDto } from 'nestjs-zod'

export const GetSubscribersQuerySchema = PaginationQuerySchema.extend({
  isActive: z.coerce.boolean().optional(),
  search: z.string().optional(),
}).strict()

export type GetSubscribersQueryType = z.infer<typeof GetSubscribersQuerySchema>

export class GetSubscribersQueryDto extends createZodDto(GetSubscribersQuerySchema) {}
