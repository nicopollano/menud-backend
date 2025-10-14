import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { JwtService } from "@nestjs/jwt";
import { BadRequestException_C, UnauthorizedException_C } from "../Custom/http-response";
import { ErrorList } from "../enums/error.enum";
import { UsersService } from "src/users/users.service";
import { ClsService } from "nestjs-cls";
import { IS_INVITATION_TOKEN_KEY } from "../decorators/invitation-token-access.decorator";
import { isNotEmpty } from "class-validator";

@Injectable()
export class PublicGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private clsService: ClsService,
		private jwtService: JwtService,
		private userService: UsersService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler());
		const isInvitationToken = this.reflector.get<boolean>(IS_INVITATION_TOKEN_KEY, context.getHandler());
		this.clsService.set("isPublic", isPublic);

		if (isPublic) {
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const token = request.headers.authorization?.split(" ")[1];

		if (!token) throw new UnauthorizedException_C(ErrorList.TokenNotProvided);

		try {
			const decodedToken = this.jwtService.verify(token, { ignoreExpiration: true });

			if (decodedToken.exp && decodedToken.exp < Date.now() / 1000) throw new UnauthorizedException_C(ErrorList.TokenExpired);
			if (decodedToken.sub === undefined || decodedToken.version === undefined || decodedToken.reg === undefined) {
				throw new UnauthorizedException_C(ErrorList.TokenInvalid);
			}
			if (decodedToken) {
				if (!decodedToken.reg && !isInvitationToken === true) throw new UnauthorizedException_C(ErrorList.AuthInvitationToken);
				if (decodedToken.reg !== true && !decodedToken.version) throw new BadRequestException_C(ErrorList.TokenExpired);
				const user = await this.userService.findOneRaw(decodedToken.sub);
				this.clsService.set("user", user);
				return true;
			}
		} catch (error) {
			//console.error("Token verification failed:", error);
			throw error;
		}

		return false;
	}
}
