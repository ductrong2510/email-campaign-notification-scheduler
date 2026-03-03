import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator'

export interface Response<T> {
  statusCode: number
  message: string
  data?: T
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private readonly reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse()
        const statusCode = response.statusCode
        const message =
          this.reflector.getAllAndOverride<string | undefined>(RESPONSE_MESSAGE_KEY, [
            context.getHandler(),
            context.getClass(),
          ]) || 'Thành công!'

        const result: Response<T> = { statusCode, message }
        if (data !== null && data !== undefined) {
          result.data = data
        }
        return result
      }),
    )
  }
}
