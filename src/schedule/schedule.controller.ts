import { Body, Controller, Delete, Get, Param, Patch, Post, Version } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ScheduleService } from "./schedule.service";
import { validateDTO } from "src/common/tools/validate-dto.tool";
import { BranchRequired } from "src/common/decorators/branch.decorator";
import { BusinessRequired } from "src/common/decorators/business.decorator";
import { ModuleName } from "src/common/decorators/module.decorator";
import { Permission } from "src/common/decorators/permission.decorator";
import { UpdateScheduleDTO } from "./dtos/update-schedule.dto";
import { CreateScheduleDTO } from "./dtos/create-schedule.dto";
import { BaseScheduleDTO } from "./dtos/base-schedule.dto";

@Controller("public/businesses/:businessid/branches/:branchid/schedules")
@ApiParam({ name: "businessid", example: "{{businessid}}", required: true, description: "Business ID" })
@ApiParam({ name: "branchid", example: "{{branchid}}", required: true, description: "Branch ID" })
@ApiBearerAuth("Authorization")
@ApiTags("Schedule")
@BranchRequired()
@BusinessRequired()
export class ScheduleController {
	constructor(private scheduleService: ScheduleService) {}

	@Get()
	@ApiOperation({ summary: "Get all schedules" })
	@Version("1")
	@Permission("list")
	async findAll() {
		return await this.scheduleService.findAll();
	}

	@Get(":id")
	@ApiOperation({ summary: "Get a schedule" })
	@Version("1")
	@Permission("list")
	async findOne(@Param("id") id: number) {
		return await this.scheduleService.findOne(id);
	}

	/*@Post()
    @ApiOperation({ summary: "Create a schedule"})
    @Version('1')
    @Permission("create")
    @ApiBody({ type: [CreateScheduleDTO] })
    async create(@Body() create: CreateScheduleDTO[]){
        create = await validateDTO(create, CreateScheduleDTO);
        return await this.scheduleService.create(create);
    }*/

	@Patch()
	@ApiOperation({ summary: "Update a schedule" })
	@Version("1")
	@Permission("update")
	@ApiBody({ type: [UpdateScheduleDTO] })
	async update(@Body() update: UpdateScheduleDTO[]) {
		const updateValidated = await validateDTO(update, UpdateScheduleDTO);
		return await this.scheduleService.update(updateValidated);
	}

	/*@Delete(":id")
    @ApiOperation({ summary: "Create a schedule"})
    @Version('1')
    @Permission("delete")
    async delete(@Param("id") id: number){
        return await this.scheduleService.delete(id);
    }*/
}
