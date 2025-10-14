import { CallHandler, ExecutionContext, forwardRef, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { decode } from "jsonwebtoken";
import { ClsService } from "nestjs-cls";
import { Observable } from "rxjs";
import { UsersService } from "src/users/users.service";
import {} from "typeorm";
@Injectable()
export class UserInterceptor implements NestInterceptor {
	constructor(
		private clsService: ClsService,
		@Inject(forwardRef(() => UsersService)) private userService: UsersService,
	) {}

	async intercept(context: ExecutionContext, next: CallHandler<any>) {
		try {
			const role = this.clsService.get("role");
			const request = context.switchToHttp().getRequest();
			this.clsService.set("domain", request.headers.origin);
			const token = request.headers?.authorization?.split(" ")[1];
			if (!token) return next.handle();
			const decoded_token: any = decode(token);

			const user = await this.userService.findOneRaw(decoded_token.sub ?? null);

			return next.handle();
		} catch {
			return next.handle();
		}
	}
}
