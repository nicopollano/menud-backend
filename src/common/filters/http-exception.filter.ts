import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from "@nestjs/common";
import { HttpErrorByCode } from "@nestjs/common/utils/http-error-by-code.util";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const status = exception.getStatus();
		let error;
		try {
			error = JSON.parse(exception.message);
		} catch {
			error = {
				code: HttpErrorByCode[status].name,
				message: exception.message,
			};
		}

		response.status(status).json({
			statusCode: status,
			error,
			data: null,
		});
	}
}
