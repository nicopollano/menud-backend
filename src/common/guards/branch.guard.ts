import { CanActivate } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ClsService } from "nestjs-cls";
import { Branch } from "src/branch/entities/branch.entity";
import { Business } from "src/business/entities/business.entity";
import { BusinessGuard } from "./business.guard";
import { BadRequestException_C, NotFoundException_C } from "../Custom/http-response";
import { ErrorList } from "../enums/error.enum";
import { BranchService } from "src/branch/branch.service";
export class BranchGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private clsService: ClsService,
	) {}

	canActivate(context: any): boolean {
		const branchKey = this.reflector.getAllAndOverride<string>("isBranchRequired", [context.getClass(), context.getHandler()]);
		if (!branchKey) return true;

		const branch: Branch = this.clsService.get("branch");
		const business: Business = this.clsService.get("business");

		if (!branch) throw new NotFoundException_C(ErrorList.BranchNotFound);

		if (branch.business.id != business.id) throw new BadRequestException_C(ErrorList.BranchNotFound);

		return true;
	}
}
