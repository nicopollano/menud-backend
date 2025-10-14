import { Controller, Get, Version } from "@nestjs/common";
import { PlanService } from "./plan.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Public } from "src/common/decorators/public.decorator";

@Controller("public/plans")
@ApiTags("Plan")
@ApiBearerAuth("Authorization")
export class PlanController {
	constructor(private readonly planService: PlanService) {}

	@Get()
	@Version("1")
	@Public()
	@ApiOperation({ summary: "Retrieve all plans" })
	async findAll() {
		return await this.planService.findAll();
	}

	@Get("summary")
	@Version("1")
	@ApiOperation({ summary: "Retrieve a summary of plans" })
	@Public()
	async getSummary() {
		return this.planService.getSummary();
	}
}
