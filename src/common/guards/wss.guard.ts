import { Injectable, CanActivate, ExecutionContext, Inject, forwardRef } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Socket } from "socket.io";
import { wsResponse } from "../Custom/ws-response";
import { BadRequestException_C } from "../Custom/http-response";
import { ErrorList } from "../enums/error.enum";
import { ClsService } from "nestjs-cls";
import { BranchService } from "src/branch/branch.service";
import { UsersService } from "src/users/users.service";

@Injectable()
export class WsJwtGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		@Inject(forwardRef(() => ClsService)) private clsService: ClsService,
		@Inject(forwardRef(() => BranchService)) private branchService: BranchService,
		@Inject(forwardRef(() => UsersService)) private userService: UsersService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		try {
			const data = context.switchToWs().getData();
			const token = data.headers.authorization;
			if (!token) {
				wsResponse(context.switchToWs().getClient(), new BadRequestException_C(ErrorList.TokenNotProvided), true);
				return false;
			}
			try {
				const status = this.jwtService.verify(token);
				return !!status;
			} catch (e) {
				wsResponse(context.switchToWs().getClient(), new BadRequestException_C(ErrorList.TokenInvalid), true);
				return false;
			}
		} catch {
			wsResponse(context.switchToWs().getClient(), new BadRequestException_C(ErrorList.AuthVerificatonTokenError), true);
			return false;
		}
	}
}
