import { Controller, Body, Param, Post, Get, Put, Delete, Version, Patch } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { CreatePlanDTO } from "./dtos/create-plan.dto";
import { UpdatePlanDTO } from "./dtos/update-plan.dto";
import { PlanService } from "./plan.service";
import { ModuleName } from "src/common/decorators/module.decorator";
import { Permission } from "src/common/decorators/permission.decorator";

@Controller("private/plans")
@ApiTags("Plan")
@ApiBearerAuth("Authorization")
@ModuleName("plans")
export class PlanPrivateController {
	constructor(private readonly planService: PlanService) {}

	@Post()
	@Version("1")
	@ApiOperation({ summary: "Create a new plan" })
	@Permission("create")
	async create(@Body() createPlanDTO: CreatePlanDTO) {
		return this.planService.create(createPlanDTO);
	}

	@Get()
	@Version("1")
	@ApiOperation({ summary: "Retrieve all plans" })
	@Permission("list")
	async findAll() {
		return this.planService.findAll();
	}

	@Get(":id")
	@Version("1")
	@ApiOperation({ summary: "Retrieve a plan by ID" })
	@Permission("view")
	async findOne(@Param("id") id: number) {
		return this.planService.findOne(id);
	}

	@Patch(":id")
	@Version("1")
	@ApiOperation({ summary: "Update a plan by ID" })
	@Permission("update")
	async update(@Param("id") id: number, @Body() updatePlanDTO: UpdatePlanDTO) {
		return this.planService.update(id, updatePlanDTO);
	}

	@Delete(":id")
	@Version("1")
	@ApiOperation({ summary: "Delete a plan by ID" })
	@Permission("delete")
	async remove(@Param("id") id: number) {
		return this.planService.remove(id);
	}
}
