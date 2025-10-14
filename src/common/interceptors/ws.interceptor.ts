import { CallHandler, ExecutionContext, forwardRef, HttpException, HttpStatus, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { decode } from "jsonwebtoken";
import { ClsService } from "nestjs-cls";
import { catchError, Observable, throwError } from "rxjs";
import { BranchService } from "src/branch/branch.service";
import { UsersService } from "src/users/users.service";

@Injectable()
export class WebSocketInterceptor implements NestInterceptor {
	constructor(
		private clsService: ClsService,
		private branchService: BranchService,
		@Inject(forwardRef(() => UsersService)) private userService: UsersService,
	) {}

	async intercept(context: ExecutionContext, next: CallHandler<any>) {
		const data = context.switchToWs().getData();
		const token = data.headers.authorization;
		const decoded: any = decode(token);
		const status: Observable<any> = await new Promise((resolve, reject) => {
			this.clsService.run(async () => {
				const branch = await this.branchService.findOne(decoded.branch ?? null);
				const user = await this.userService.findOneRaw(decoded.sub ?? null);
				this.clsService.set("branch", branch);
				this.clsService.set("user", user);
				this.clsService.set("business", user.businessOwners);
				Object.assign(data, data.body);
				delete data.headers;
				delete data.body;
				resolve(
					next.handle().pipe(
						catchError((err) => {
							const status = err instanceof HttpException ? err.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
							return throwError(() => {
								new WsException({
									statusCode: status,
									message: err.message || "Internal server error",
								});
							});
						}),
					),
				);
			});
		});
		return status;
	}
}
