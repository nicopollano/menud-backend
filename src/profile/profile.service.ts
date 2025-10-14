import { Injectable } from "@nestjs/common";
import { ClsService } from "nestjs-cls";
import { BusinessService } from "src/business/business.service";
import { BranchService } from "src/branch/branch.service";
import { MenuService } from "src/menu/menu.service";
import { User } from "src/users/entities/user.entity";
import { NotFoundException_C } from "src/common/Custom/http-response";
import { ErrorList } from "src/common/enums/error.enum";
import { ProfileSummaryDTO } from "./dtos/profile-summary.dto";
import { SubscriptionService } from "src/subscription/substription.service";

@Injectable()
export class ProfileService {
	constructor(
		private readonly businessService: BusinessService,
		private readonly branchService: BranchService,
		private readonly subscriptionService: SubscriptionService,
		private readonly clsService: ClsService,
	) {}

	async getSummary(): Promise<ProfileSummaryDTO> {
		const user: User = this.clsService.get("user");
		if (!user) throw new NotFoundException_C(ErrorList.UserNotFound);

		const businessesSummary = await this.businessService.getSummaryByUserId(user.id);

		const userBusinessesRaw = await this.businessService.findAll(user.id);

		let totalMenus = 0;
		for (const business of userBusinessesRaw) {
			const branchesSummary = await this.branchService.getSummaryByBusinessId(business.id);
			totalMenus += branchesSummary.totalMenus;
		}

		return {
			totalBusinesses: businessesSummary.totalBusinesses,
			totalBranches: businessesSummary.totalBranches,
			totalMenus: totalMenus,
		};
	}

	async getSubscription() {
		const user: User = this.clsService.get("user");
		if (!user) throw new NotFoundException_C(ErrorList.UserNotFound);

		return await this.subscriptionService.findByUserId(user.id);
	}
}
