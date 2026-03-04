import z from 'zod'
import { PaginationQuerySchema } from './request.schema'
import { createZodDto } from 'nestjs-zod'

export const GetSubcribersQuerySchema = PaginationQuerySchema.extend({
  isActive: z.coerce.boolean().optional(),
  search: z.string().optional(),
}).strict()

export type GetSubcribersQueryType = z.infer<typeof GetSubcribersQuerySchema>

export class GetSubcribersQueryDto extends createZodDto(GetSubcribersQuerySchema) {}
