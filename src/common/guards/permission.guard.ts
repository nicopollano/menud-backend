import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { UsersService } from "src/users/users.service";
import { PERMISSION_KEY } from "../decorators/permission.decorator";
import { decode } from "jsonwebtoken";
import { BadRequestException_C, UnauthorizedException_C } from "../Custom/http-response";
import { ErrorList } from "../enums/error.enum";
import { Actions, ActionTypes } from "../enums/actions.enum";
import { MODULE_KEY } from "../decorators/module.decorator";
import { ModuleEnum, ModuleKey } from "../enums/modules.enum";
import { ClsService } from "nestjs-cls";
import { Business } from "src/business/entities/business.entity";
import { Branch } from "src/branch/entities/branch.entity";
import { PERMISSIVE_KEY } from "../decorators/permissive.decorator";
import { BranchMember } from "src/member/entities/branch_member.entity";
import { BusinessService } from "src/business/business.service";
import { Action } from "rxjs/internal/scheduler/Action";
import { RoleEnum } from "../enums/role.enum";
import { GlobalRole } from "../enums/global-role.enum";

@Injectable()
export class PermissionGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private userService: UsersService,
		private clsService: ClsService,
		private businessService: BusinessService,
	) {}

	async canActivate(context: ExecutionContext) {
		const permissionKey = this.reflector.getAllAndOverride<ActionTypes>(PERMISSION_KEY, [context.getClass(), context.getHandler()]);
		const moduleKey = this.reflector.getAllAndOverride<ModuleKey>(MODULE_KEY, [context.getClass(), context.getHandler()]);
		const permissiveKey = this.reflector.get<boolean>(PERMISSIVE_KEY, context.getHandler());

		if (!moduleKey) return true;
		if (!permissionKey) return true;
		if (permissiveKey) return true;

		const clsBusiness: Business = this.clsService.get("business");
		const branch: Branch = this.clsService.get("branch");

		const business = clsBusiness ? await this.businessService.findOne(clsBusiness.id, undefined, true, true) : null;

		const authorizationHeader = context.switchToHttp().getRequest().headers.authorization;

		if (!authorizationHeader) throw new UnauthorizedException_C(ErrorList.AuthUnauthorizedPermission);

		const token = authorizationHeader.split(" ")[1];
		const user: any = decode(token);
		const userId = user.sub;

		const userIsSuperAdmin = await this.userService.isSuperAdmin(userId);

		if (userIsSuperAdmin) return true;

		if(await this.userService.isSubscriptionOwner(userId, business?.id, branch?.id)) return true;

		const permission = await this.userService.getUserPermissions(userId, moduleKey[0] as ModuleEnum);

		const branchMember: BranchMember =
			branch?.branchMembers?.find((bM) => bM?.user?.id == userId) ||
			business?.branches?.map((branch) => branch.branchMembers?.find((bM) => bM?.user?.id == userId)).find((bM) => bM !== undefined);
		const businessOwner = business?.businessOwners?.find((bO) => bO?.user?.id == userId);

		if (!branchMember && !businessOwner) throw new UnauthorizedException_C(ErrorList.AuthUnauthorizedPermission);

		if (!permission) throw new UnauthorizedException_C(ErrorList.AuthUnauthorizedPermission);

		const userPermissions = permission.find((permission) => {
			const a = permission.module == moduleKey;
			const b =
				!!branchMember &&
				!!permission.branchMember &&
				permission.branchMember.id === branchMember.id &&
				(branch ? permission.branchMember.branch?.id === branch?.id : true);
			const c =
				!!businessOwner &&
				!!permission.businessOwner &&
				permission.businessOwner.id === businessOwner.id &&
				permission.businessOwner.business?.id === business?.id;

			return a && (b || c);
		})?.actions;

		if (userPermissions?.some((permission) => permission === permissionKey[0])) return true;
		else throw new UnauthorizedException_C(ErrorList.AuthUnauthorizedPermission);
	}
}
