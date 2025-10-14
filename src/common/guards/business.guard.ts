import { CanActivate } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ClsService } from "nestjs-cls";
import { Business } from "src/business/entities/business.entity";
import { User } from "src/users/entities/user.entity";
import { BadRequestException_C, NotFoundException_C } from "../Custom/http-response";
import { ErrorList } from "../enums/error.enum";
import { BusinessService } from "src/business/business.service";
import { isEmpty } from "class-validator";

export class BusinessGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private clsService: ClsService,
		private businessService: BusinessService,
	) {}

	async canActivate(context: any): Promise<boolean> {
		const businessKey = this.reflector.getAllAndOverride<string>("isBusinessRequired", [context.getClass(), context.getHandler()]);
		if (!businessKey) return true;

		const business: Business = this.clsService.get("business");
		const user: User = this.clsService.get("user");
		const isPublic: boolean = this.clsService.get("isPublic");

		if (!isPublic) {
			if (isEmpty(business)) throw new BadRequestException_C(ErrorList.BusinessNotFound);
			if (isEmpty(user)) throw new BadRequestException_C(ErrorList.UserNotFound);

			const userExist = await this.businessService.userExist(business.id, user.id);

			if (!userExist) throw new NotFoundException_C(ErrorList.BusinessUserNotFound);
		}

		if (!business) throw new NotFoundException_C(ErrorList.BusinessNotFound);

		return true;
	}
}
