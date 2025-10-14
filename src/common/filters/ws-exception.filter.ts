import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { HttpErrorByCode } from "@nestjs/common/utils/http-error-by-code.util";
import { BaseWsExceptionFilter, WsException } from "@nestjs/websockets";

@Catch(WsException)
export class WsExceptionsFilter extends BaseWsExceptionFilter {
	catch(exception: WsException, host: ArgumentsHost) {
		const ctx = host.switchToWs();
		const response = ctx.getClient();
		const status = exception.getError();

		let error;
		try {
			error = JSON.parse(exception.message);
		} catch {
			error = {
				code: status,
				message: exception.message,
			};
		}
		response.emit("exception", {
			statusCode: "-",
			data: null,
			error: error,
		});
	}
}
