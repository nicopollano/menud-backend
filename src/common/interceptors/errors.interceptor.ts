import { CallHandler, ExecutionContext, Injectable, NestInterceptor, HttpException, HttpStatus } from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			catchError((error) => {
				const status = error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
				return throwError(
					() =>
						new HttpException(
							{
								statusCode: status,
								message: error.message || "Internal server error",
							},
							status,
						),
				);
			}),
		);
	}
}
