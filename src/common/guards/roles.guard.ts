import { CanActivate, Catch, ExecutionContext, HttpException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { UsersService } from "src/users/users.service";
import { RoleKey } from "../enums/role.enum";
import { ROLE_KEY } from "../decorators/role.decorator";
import { UnauthorizedException_C } from "../Custom/http-response";
import { ErrorList } from "../enums/error.enum";
import { decode } from "jsonwebtoken";
import { ClsService } from "nestjs-cls";

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private userService: UsersService,
		private clsService: ClsService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const requiredRoles = this.reflector.getAllAndOverride<RoleKey[]>(ROLE_KEY, [context.getHandler(), context.getClass()]);
		return true;
		if (!requiredRoles) return true;
		const authorizationHeader = context.switchToHttp().getRequest().headers.authorization;

		if (!authorizationHeader && !requiredRoles.some((role) => role == "any")) throw new UnauthorizedException_C(ErrorList.AuthUnauthorizedRole);
		if (!authorizationHeader) return true;
		const token = authorizationHeader.split(" ")[1];
		const user: any = decode(token);

		const userId = user.sub;

		const userFromDb = await this.userService.findOne(userId);
		const userPermission = userFromDb.role;

		if (!user || !userPermission) throw new UnauthorizedException_C(ErrorList.AuthUnauthorizedRole);

		this.clsService.set("role", userPermission);

		if (
			requiredRoles.some((role) => {
				if (role == "any") return true;
				return userPermission.includes(role);
			})
		)
			return true;
		else throw new UnauthorizedException_C(ErrorList.AuthUnauthorizedRole);
	}
}
