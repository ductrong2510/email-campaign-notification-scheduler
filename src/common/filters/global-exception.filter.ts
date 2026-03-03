import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { Request, Response } from 'express'
import { ZodSerializationException } from 'nestjs-zod'
import { ZodError as ZodErrorV4 } from 'zod/v4'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message: string | string[] = 'Đã có lỗi hệ thống xảy ra. Vui lòng thử lại sau!'
    let errorType = 'Internal Server Error'
    let validationDetails: any = null

    if (exception instanceof ZodSerializationException) {
      const zodError = exception.getZodError()
      if (zodError instanceof ZodErrorV4) {
        this.logger.error(`ZodSerializationException: ${zodError.message}`)
      }
      status = exception.getStatus()
      errorType = 'Zod Serialization Error'
      message = exception.message
    } else if (exception instanceof HttpException) {
      status = exception.getStatus()
      const exceptionResponse = exception.getResponse() as any

      if (typeof exceptionResponse === 'object') {
        errorType = exceptionResponse.error || exception.name

        // Xử lý lỗi từ Zod Validation
        if (
          Array.isArray(exceptionResponse.message) &&
          exceptionResponse.message.length > 0 &&
          typeof exceptionResponse.message[0] === 'object'
        ) {
          message = 'Dữ liệu đầu vào không hợp lệ!'
          validationDetails = exceptionResponse.message
        } else {
          message = exceptionResponse.message || exception.message
        }
      } else {
        message = exceptionResponse
        errorType = exception.name
      }
    } else if (exception instanceof Error) {
      message = exception.message
      this.logger.error(`[${request.method}] ${request.url}`, exception.stack)
    }

    const jsonResponse: any = {
      statusCode: status,
      message,
      error: errorType,
      timestamp: new Date().toISOString(),
      path: request.url,
    }

    if (validationDetails) {
      jsonResponse.validationDetails = validationDetails
    }

    response.status(status).json(jsonResponse)
  }
}
