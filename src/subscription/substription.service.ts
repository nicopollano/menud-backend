import { forwardRef, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Subscription } from "src/subscription/entities/subscription.entity";
import { Repository } from "typeorm";
import { CreateSubscriptionDTO } from "./dtos/create-subscription.dto";
import { UsersService } from "src/users/users.service";
import { User } from "src/users/entities/user.entity";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { NotFoundException_C } from "src/common/Custom/http-response";
import { ErrorList } from "src/common/enums/error.enum";
import { BusinessService } from "src/business/business.service";
import { UpdateSubscriptionDTO } from "./dtos/update-subscription.dto";
import { ClsService } from "nestjs-cls";
import { PlanService } from "src/plan/plan.service";
import { BillingStatusEnum } from "src/common/enums/billing-status.dto";
import { BillingCycleEnum } from "src/common/enums/billin-cycle.enum";

@Injectable()
export class SubscriptionService {
	constructor(
		@InjectRepository(Subscription) private subscriptionRepository: Repository<Subscription>,
		@Inject(forwardRef(() => UsersService)) private userService: UsersService,
		@Inject(forwardRef(() => BusinessService)) private businessService: BusinessService,
		@Inject(forwardRef(() => PlanService)) private planService: PlanService,
		private readonly clsService: ClsService,
	) {}

	async create(createSubscription: CreateSubscriptionDTO) {
		const { billingCycle, planId } = createSubscription;
		const user = this.clsService.get("user");

		const plan = await this.planService.findOne(planId);
		const subscription = await this.subscriptionRepository.create({
			plan,
			maxBusinesses: plan.maxBusinesses, 
			maxMenus: plan.maxMenus,
			maxUsers: plan.maxUsers,
			billingCycle,
			user,
			billingStatus: BillingStatusEnum.ACTIVE,
		});

		if (!subscription) throw new NotFoundException_C("Cannot create subscription");

		return await this.subscriptionRepository.save(subscription);
	}

	async findOne(id: number) {
		const subscription = await this.subscriptionRepository.findOne({ where: { id }, relations: { plan: true }, order: { id: "ASC" } });

		if (!subscription) throw new NotFoundException_C(ErrorList.SubscriptionNotFound);

		return subscription;
	}

	async findAll() {
		const subscriptions = await this.subscriptionRepository.find({
			relations: { plan: true },
			order: { id: "ASC" },
		});

		if (!subscriptions) throw new NotFoundException_C(ErrorList.SubscriptionNotFound);

		return subscriptions;
	}

	async findByUserId(userId: number) {
		const subscription = await this.subscriptionRepository.findOne({ where: { user: { id: userId } }, relations: { plan: true } });

		if (!subscription) throw new NotFoundException_C(ErrorList.SubscriptionNotFound);

		return subscription;
	}

	async update(id: number, updateSubscriptionDto: UpdateSubscriptionDTO) {
		const subscription = await this.findOne(id);

		let available_until = new Date(Date.now());
		available_until = new Date(available_until.setDate(available_until.getDate()));

		subscription.available_until = available_until;

		await this.subscriptionRepository.save(subscription);

		return subscription;
	}

	async remove(id: number) {
		const subscription = await this.findOne(id);

		if (!subscription) throw new NotFoundException_C(ErrorList.SubscriptionNotFound);

		return await this.subscriptionRepository.softRemove(subscription);
	}

	async createBasicSubscription(){
		const plan = await this.planService.getBasicPlan();
		const subscription = await this.subscriptionRepository.create({
			plan,
			maxBusinesses: plan.maxBusinesses,
			maxMenus: plan.maxMenus,
			maxUsers: plan.maxUsers,
			billingCycle: BillingCycleEnum.MONTHLY,
			billingStatus: BillingStatusEnum.ACTIVE,
		});

		if (!subscription) throw new NotFoundException_C("Cannot create subscription");

		return await this.subscriptionRepository.save(subscription);
	}
}
