import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { RefreshTokenType, RegisterReqType, UserType } from './auth.schema'
import { UserWhereUniqueInput } from 'generated/prisma/models'

@Injectable()
export class AuthRepo {
  constructor(private readonly prismaService: PrismaService) {}

  createUser(data: RegisterReqType): Promise<Omit<UserType, 'password'>> {
    return this.prismaService.user.create({
      data,
      omit: {
        password: true,
      },
    })
  }

  findUniqueUser(where: UserWhereUniqueInput): Promise<UserType | null> {
    return this.prismaService.user.findUnique({
      where,
    })
  }

  createRefreshToken(data: { token: string; userId: string; expiredAt: Date }): Promise<RefreshTokenType> {
    return this.prismaService.refreshToken.create({
      data,
    })
  }

  findRefreshToken(token: string): Promise<RefreshTokenType | null> {
    return this.prismaService.refreshToken.findUnique({
      where: {
        token,
      },
    })
  }

  deleteRefreshToken(token: string) {
    return this.prismaService.refreshToken.deleteMany({
      where: {
        token,
      },
    })
  }
}
