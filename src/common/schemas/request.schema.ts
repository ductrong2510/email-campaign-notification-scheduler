import { createZodDto } from 'nestjs-zod'
import z from 'zod'

export const PaginationQuerySchema = z
  .object({
    page: z.coerce.number().positive().optional().default(1),
    limit: z.coerce.number().positive().optional().default(10),
  })
  .strict()

export type PaginationQueryType = z.infer<typeof PaginationQuerySchema>

export class PaginationQueryDto extends createZodDto(PaginationQuerySchema) {}
