import { ExecutionContext } from "@nestjs/common";
import { ClsService } from "nestjs-cls";
import { Business } from "src/business/entities/business.entity";
import { SubscriptionService } from "src/subscription/substription.service";
import { BillingStatusEnum } from "../enums/billing-status.dto";
import { Subscription } from "src/subscription/entities/subscription.entity";
import { User } from "src/users/entities/user.entity";
import { Reflector } from "@nestjs/core";
import { SubscriptionAction } from "../decorators/subscription.decorator";
import { BusinessService } from "src/business/business.service";
import { BranchService } from "src/branch/branch.service";
import { BadRequestException_C } from "../Custom/http-response";
import { ErrorList } from "../enums/error.enum";
import { SubscriptionActionsEnum } from "../enums/subscription-action.enum";

export class SubscriptionGuard {
	constructor(
		private readonly subscriptionService: SubscriptionService,
		private readonly businessService: BusinessService,
		private readonly branchService: BranchService,
		private readonly reflector: Reflector,
		private readonly clsService: ClsService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const subscriptionAction: SubscriptionActionsEnum = this.reflector.get<SubscriptionActionsEnum>(
			"subscriptionAction",
			context.getHandler(),
		) as SubscriptionActionsEnum;

		if (!subscriptionAction) return true;

		const business: Business = this.clsService.get("business");
		const user: User = this.clsService.get("user");

		if (!business && !user) return false;

		const subscriptionId = user?.subscription?.id ?? business?.subscription?.id;

		if (!subscriptionId) throw new BadRequestException_C(ErrorList.SubscriptionNotFound);

		const subscription = await this.subscriptionService.findOne(subscriptionId);

		if (
			!subscription ||
			subscription.billingStatus !== BillingStatusEnum.ACTIVE ||
			!subscription.available_until ||
			subscription.available_until < new Date()
		) {
			return false;
		}

		const totalBranches = business ? await this.branchService.countByBusinessId(business.id) : 0;
		const totalBusinesses = await this.businessService.count(user.id);
		switch (SubscriptionActionsEnum[subscriptionAction] as unknown as SubscriptionActionsEnum) {
			case SubscriptionActionsEnum.BUSINESS_CREATE:
				if (totalBusinesses >= subscription.maxBusinesses) throw new BadRequestException_C(ErrorList.SubscriptionMaxBusinessReached);
				break;

			case SubscriptionActionsEnum.BUSINESS_OWNER_CREATE:
			case SubscriptionActionsEnum.BRANCH_MEMBER_CREATE:
				const totaBranchesUser = await this.branchService.branchMemberCount(business.id);
				const totalBranchesUserWithoutOwner = totaBranchesUser - totalBranches;
				const totalBusinessOwners = await this.businessService.businessOwnerCount(business.id);
				const totalUsers = totalBranchesUserWithoutOwner + totalBusinessOwners;
				if (totalUsers >= subscription.maxUsers) throw new BadRequestException_C(ErrorList.SubscriptionMaxUsersReached);
				break;

			case SubscriptionActionsEnum.MENU_CREATE:
				if ((await this.branchService.totalMenus(business.id)) >= subscription.maxMenus)
					throw new BadRequestException_C(ErrorList.SubscriptionMaxMenusReached);
				break;

			case SubscriptionActionsEnum.LINKIT_CREATE:
			case SubscriptionActionsEnum.LINKIT_UPDATE:
				if (!subscription.plan.hasLinkit) throw new BadRequestException_C(ErrorList.SubscriptionLinkitNotAllowed);
				break;

			default:
				break;
		}

		return true;
	}
}
