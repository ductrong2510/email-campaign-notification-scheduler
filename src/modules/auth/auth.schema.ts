import { createZodDto } from 'nestjs-zod'
import z from 'zod'

export const UserSchema = z.object({
  id: z.string(),
  email: z.email(),
  password: z.string(),
  name: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export const RefreshTokenSchema = z.object({
  token: z.string(),
  userId: z.string(),
  expiredAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export const RegisterReqSchema = UserSchema.pick({
  email: true,
  name: true,
})
  .extend({
    password: z.string().min(6),
  })
  .strict()

export const LoginReqSchema = UserSchema.pick({
  email: true,
})
  .extend({
    password: z.string().min(6),
  })
  .strict()

const RegisterResSchema = UserSchema.omit({
  password: true,
})

const LoginResSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})

export const RefreshTokenReqSchema = z
  .object({
    refreshToken: z.string(),
  })
  .strict()

export const LogoutReqSchema = RefreshTokenReqSchema

export type UserType = z.infer<typeof UserSchema>
export type RefreshTokenType = z.infer<typeof RefreshTokenSchema>
export type RegisterReqType = z.infer<typeof RegisterReqSchema>
export type LoginReqType = z.infer<typeof LoginReqSchema>
export type RefreshTokenReqType = z.infer<typeof RefreshTokenReqSchema>

export class RegisterReqDto extends createZodDto(RegisterReqSchema) {}
export class LoginReqDto extends createZodDto(LoginReqSchema) {}
export class RegisterResDto extends createZodDto(RegisterResSchema) {}
export class LoginResDto extends createZodDto(LoginResSchema) {}
export class RefreshTokenReqDto extends createZodDto(RefreshTokenReqSchema) {}
export class LogoutReqDto extends createZodDto(LogoutReqSchema) {}
