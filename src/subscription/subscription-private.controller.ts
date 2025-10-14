import { Body, Controller, Delete, Get, Param, Patch, Post, Version } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiProperty, ApiTags } from "@nestjs/swagger";
import { CreateSubscriptionDTO } from "./dtos/create-subscription.dto";
import { SubscriptionService } from "./substription.service";
import { Public } from "src/common/decorators/public.decorator";
import { validateDTO } from "src/common/tools/validate-dto.tool";
import { UpdateSubscriptionDTO } from "./dtos/update-subscription.dto";

@Controller("private/subscriptions")
@ApiTags("Subscriptions")
@ApiBearerAuth("Authorization")
export class SubscriptionPrivateController {
	constructor(private subscriptionService: SubscriptionService) {}

	@Post()
	@Version("1")
	@ApiOperation({ summary: "Create a new subscription" })
	async create(@Body() createUserPlanDto: CreateSubscriptionDTO) {
		const { user, ...subscriptionRest } = await this.subscriptionService.create(createUserPlanDto);
		return subscriptionRest;
	}

	@Get()
	@Version("1")
	@ApiOperation({ summary: "Get all subscriptions" })
	async findAll() {
		const subscriptions = await this.subscriptionService.findAll();
		return subscriptions.map(({ user, ...subscriptionRest }) => subscriptionRest);
	}

	@Get(":id")
	@Version("1")
	@ApiOperation({ summary: "Get a subscription by ID" })
	async findOne(@Param("id") id: number) {
		const { user, ...subscriptionRest } = await this.subscriptionService.findOne(id);
		return subscriptionRest;
	}

	@Patch(":id")
	@Version("1")
	@ApiOperation({ summary: "Update a subscription by ID" })
	async update(@Param("id") id: number, @Body() updateSubscriptionDTO: UpdateSubscriptionDTO) {
		const { user, ...subscriptionRest } = await this.subscriptionService.update(id, updateSubscriptionDTO);
		return subscriptionRest;
	}

	@Delete(":id")
	@Version("1")
	@ApiOperation({ summary: "Delete a subscription by ID" })
	async delete(@Param("id") id: number) {
		const { user, ...subscriptionRest } = await this.subscriptionService.remove(id);
		return subscriptionRest;
	}
}
