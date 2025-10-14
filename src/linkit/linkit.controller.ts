import { Controller, Get, Post, Body, Patch, Param, Delete, Version } from "@nestjs/common";
import { LinkitService } from "./linkit.service";
import { CreateLinkitDTO } from "./dto/create-linkit.dto";
import { UpdateLinkitDTO } from "./dto/update-linkit.dto";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { ModuleName } from "src/common/decorators/module.decorator";
import { BusinessRequired } from "src/common/decorators/business.decorator";
import { Public } from "src/common/decorators/public.decorator";
import { validateDTO } from "src/common/tools/validate-dto.tool";
import { SubscriptionAction } from "src/common/decorators/subscription.decorator";
import { Permission } from "src/common/decorators/permission.decorator";
import { Permissive } from "src/common/decorators/permissive.decorator";

@Controller("public/businesses/:businessId/linkits")
@ApiParam({ name: "businessId", required: true })
@ApiTags("Linkit")
@ApiBearerAuth("Authorization")
@ModuleName("linkits")
@BusinessRequired()
export class LinkitController {
	constructor(private readonly linkitService: LinkitService) {}

	@Post()
	@Version("1")
	@Permission("create")
	@SubscriptionAction("LINKIT_CREATE")
	async create(@Body() createLinkitDto: CreateLinkitDTO) {
		const createLinkitValidated = await validateDTO(createLinkitDto, CreateLinkitDTO);
		const linkit = await this.linkitService.create(createLinkitValidated);
		const { business, ...linkitFiltered } = linkit;
		return linkitFiltered;
	}

	@Get()
	@Version("1")
	@Public()
	@Permissive()
	async findAll() {
		const linkits = await this.linkitService.findAll();
		return linkits[0];
	}

	// summary endpoint removido, ahora está en linkit-summary.controller.ts

	@Get("summary")
	@Version("1")
	@Public()
	@Permissive()
	async summary() {
		return await this.linkitService.summary();
	}

	@Get(":id")
	@Version("1")
	@Permission("view")
	async findOne(@Param("id") id: number) {
		const linkit = await this.linkitService.findOne(id);
		const { business, ...linkitFiltered } = linkit;
		return linkitFiltered;
	}

	@Patch(":id")
	@Version("1")
	@Permission("update")
	@SubscriptionAction("LINKIT_UPDATE")
	async update(@Param("id") id: number, @Body() updateLinkitDto: UpdateLinkitDTO) {
		const upadteLinkitValidated = await validateDTO(updateLinkitDto, UpdateLinkitDTO);
		const linkit = await this.linkitService.update(id, upadteLinkitValidated);
		const { business, ...linkitFiltered } = linkit;
		return linkitFiltered;
	}

	@Delete(":id")
	@Version("1")
	@Permission("delete")
	async remove(@Param("id") id: number) {
		const linkit = await this.linkitService.remove(id);
		const { business, ...linkitFiltered } = linkit;
		return linkitFiltered;
	}
}
