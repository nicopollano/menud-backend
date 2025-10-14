import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors, Version } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { BranchService } from "./branch.service";
import { CreateBranchDTO, CreateBranchWithLogoDTO } from "./dtos/create-branch.dto";
import { Roles } from "src/common/decorators/role.decorator";
import { Public } from "src/common/decorators/public.decorator";
import { UpdateBranchDTO, UpdateBranchWithLogoDTO } from "./dtos/update-branch.dto";
import { validateDTO } from "src/common/tools/validate-dto.tool";
import { BusinessRequired } from "src/common/decorators/business.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { fileInterceptor } from "src/common/interceptors/file.interceptor";
import { instanceToPlain } from "class-transformer";
import { ModuleName } from "src/common/decorators/module.decorator";
import { Permission } from "src/common/decorators/permission.decorator";
import { CopyBranchDTO } from "./dtos/copy-branch.dto";
import { MoveBranchDTO } from "./dtos/move-branch.dto";
import { BranchRequired } from "src/common/decorators/branch.decorator";
import { ScheduleDaysAdapter } from "src/common/adapters/schedule-days.adapt";

@ApiTags("Branches")
@Controller()
@ApiBearerAuth("Authorization")
@ModuleName("branches")
export class BranchController {
	constructor(private branchService: BranchService) {}

	@Get("public/businesses/:businessid/branches/summary")
	@ApiParam({
		name: "businessid",
		example: "{{businessid}}",
		required: true,
		description: "Business ID",
	})
	@ApiOperation({ summary: "Get branches summary" })
	@BusinessRequired()
	@Version("1")
	@Permission("summary")
	async getBranchesSummary(@Param("businessid") businessid: number) {
		return await this.branchService.getSummaryByBusinessId(businessid);
	}

	@Get("public/businesses/:businessid/branches")
	@ApiParam({
		name: "businessid",
		example: "{{businessid}}",
		required: true,
		description: "Business ID",
	})
	@ApiOperation({ summary: "Find all branch of a business" })
	@BusinessRequired()
	@Version("1")
	@Permission("list")
	async findAll(@Param("businessid") businessId: number) {
		return await this.branchService.findAllByBusinessId(businessId);
	}

	@Get("public/branches/slugs")
	@ApiOperation({ summary: "Find all slugs" })
	@Version("1")
	@Public()
	async findAllSlugs() {
		const branch = await this.branchService.findAllSlugs();
		return branch;
	}

	@Public()
	@Get("public/branches/:id")
	@ApiParam({ name: "id", example: "{{id}}", required: true, description: "Branch id" })
	@ApiOperation({ summary: "Find one branch of a business by slug" })
	@Version("1")
	async findOneById(@Param("id") id: number) {
		const branch = await this.branchService.findOneByIdFiltered(id);
		const { branchMembers, ...branchesFiltered } = branch;
		return branchesFiltered;
	}

	/*async findAllBySlug(@Param("branchSlug") branchSlug: string) {
		const branch = await this.branchService.findOneBySlugFiltered(branchSlug);
		const { branchMembers, ...branchesFiltered } = branch;
		return branchesFiltered;
	}*/

	@Get("public/businesses/:businessid/branches/:branchid")
	@ApiParam({
		name: "businessid",
		example: "{{businessid}}",
		required: true,
		description: "Business ID",
	})
	@ApiParam({
		name: "branchid",
		example: "{{branchid}}",
		required: true,
		description: "Branch ID",
	})
	@ApiOperation({ summary: "Find one branch of a business" })
	@BusinessRequired()
	@BranchRequired()
	@Version("1")
	@Permission("view")
	async findOne(@Param("branchid") branchid: number) {
		const branch = await this.branchService.findOne(branchid);
		const { branchMembers, menus, ...branchesFiltered } = branch;
		return {
			...branchesFiltered,
			schedules: ScheduleDaysAdapter(branch.schedules),
		};
	}

	@Post("public/businesses/:businessid/branches")
	@UseInterceptors(FileInterceptor("logo", fileInterceptor))
	@ApiConsumes("multipart/form-data")
	@ApiParam({
		name: "businessid",
		example: "{{businessid}}",
		required: true,
		description: "Business ID",
	})
	@ApiBody({ type: CreateBranchWithLogoDTO })
	@ApiOperation({ summary: "Create a branch" })
	@BusinessRequired()
	@Version("1")
	@Permission("create")
	async create(@UploadedFile() logo: Express.Multer.File, @Body() createBranch: CreateBranchDTO) {
		const createBranchDTO = await validateDTO(createBranch, CreateBranchDTO);
		const { business, ...branch } = await this.branchService.create(logo, createBranchDTO);
		return {
			...branch,
			schedules: ScheduleDaysAdapter(branch.schedules),
		};
	}

	@Patch("public/businesses/:businessid/branches/:id")
	@UseInterceptors(FileInterceptor("logo", fileInterceptor))
	@ApiConsumes("multipart/form-data")
	@ApiBody({ type: UpdateBranchWithLogoDTO })
	@ApiParam({
		name: "businessid",
		example: "{{businessid}}",
		required: true,
		description: "Business ID",
	})
	@ApiOperation({ summary: "Update values of branch" })
	@BusinessRequired()
	@Version("1")
	@Permission("update")
	async update(@UploadedFile() logo: Express.Multer.File, @Param("id") id: number, @Body() updateBranch: UpdateBranchDTO) {
		const updateBranchDTO = await validateDTO(updateBranch, UpdateBranchDTO);
		const { business, ...branch } = await this.branchService.update(id, logo, updateBranchDTO);

		return {
			...branch,
			schedules: ScheduleDaysAdapter(branch.schedules),
		};
	}

	@Delete("public/businesses/:businessid/branches/:id")
	@ApiParam({
		name: "businessid",
		example: "{{businessid}}",
		required: true,
		description: "Business ID",
	})
	@ApiOperation({ summary: "Delete a branch" })
	@BusinessRequired()
	@Version("1")
	@Permission("delete")
	async delete(@Param("id") branchid: number) {
		const { business, ...branch } = await this.branchService.delete(branchid);
		return {
			...branch,
			schedules: ScheduleDaysAdapter(branch.schedules),
		};
	}

	@Post("public/businesses/:businessid/branches/:branchId/copy")
	@ApiBody({ type: CopyBranchDTO })
	@ApiOperation({ summary: "Copy a branch" })
	@ApiParam({
		name: "businessid",
		example: "{{businessid}}",
		required: true,
		description: "Business ID",
	})
	@BusinessRequired()
	@BranchRequired()
	@Version("1")
	@Permission("copy")
	async copy(@Param("branchId") id: number, @Body() copyBranchDTO: CopyBranchDTO) {
		const { business, ...branch } = await this.branchService.copy(id, copyBranchDTO);
		return {
			...branch,
			schedules: ScheduleDaysAdapter(branch.schedules),
		};
	}

	@Post("public/businesses/:businessid/branches/:branchId/move")
	@ApiBody({ type: MoveBranchDTO })
	@ApiParam({
		name: "businessid",
		example: "{{businessid}}",
		required: true,
		description: "Business ID",
	})
	@ApiOperation({ summary: "Move a branch" })
	@BusinessRequired()
	@BranchRequired()
	@Version("1")
	@Permission("move")
	async move(@Param("branchId") id: number, @Body() moveBranchDTO: MoveBranchDTO) {
		const { business, ...branch } = await this.branchService.move(id, moveBranchDTO);
		return {
			...branch,
			schedules: ScheduleDaysAdapter(branch.schedules),
		};
	}
}

@ApiTags("Branches")
@Controller("private/branches")
@ApiBearerAuth("Authorization")
export class BranchControllerPrivate {
	constructor(private branchService: BranchService) {}

	@Get()
	@ApiOperation({ summary: "findAll" })
	@Version("1")
	async findAll() {
		return this.branchService.findAllSuperAdmin();
	}

	@Get(":id")
	@ApiOperation({ summary: "findOne" })
	@Version("1")
	async findOne(@Param("id") id: number) {
		return this.branchService.findOneSuperAdmin(id);
	}

	@Delete("private/businesses/:businessid/branches/:id")
	@ApiParam({
		name: "businessid",
		example: "{{businessid}}",
		required: true,
		description: "Business ID",
	})
	@ApiOperation({ summary: "Delete a branch" })
	@BusinessRequired()
	@Version("1")
	async delete(@Param("id") branchid: number) {
		return await this.branchService.delete(branchid);
	}

	@Post("private/businesses/:businessid/branches")
	@UseInterceptors(FileInterceptor("logo", fileInterceptor))
	@ApiConsumes("multipart/form-data")
	@ApiParam({
		name: "businessid",
		example: "{{businessid}}",
		required: true,
		description: "Business ID",
	})
	@ApiBody({ type: CreateBranchWithLogoDTO })
	@ApiOperation({ summary: "Create a branch" })
	@BusinessRequired()
	@Version("1")
	async create(@UploadedFile() logo: Express.Multer.File, @Body() createBranch: CreateBranchDTO) {
		const createBranchDTO = await validateDTO(createBranch, CreateBranchDTO);
		return await this.branchService.create(logo, createBranchDTO, false);
	}

	@Patch("private/businesses/:businessid/branches/:id")
	@ApiBody({ type: UpdateBranchWithLogoDTO })
	@UseInterceptors(FileInterceptor("logo", fileInterceptor))
	@ApiParam({
		name: "businessid",
		example: "{{businessid}}",
		required: true,
		description: "Business ID",
	})
	@ApiOperation({ summary: "Update values of branch" })
	@BusinessRequired()
	@Version("1")
	async update(@UploadedFile() logo: Express.Multer.File, @Param("id") id: number, @Body() updateBranch: UpdateBranchDTO) {
		const updateBranchDTO = await validateDTO(updateBranch, UpdateBranchDTO);
		return await this.branchService.update(id, logo, updateBranchDTO);
	}
}
