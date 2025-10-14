import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Put, UploadedFiles, UseInterceptors, Version } from "@nestjs/common";
import { MenuService } from "./menu.service";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { fileInterceptor } from "src/common/interceptors/file.interceptor";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { CreateMenuDTO, CreateMenuWithImagesDTO } from "./dtos/create-menu.dto";
import { UpdateMenuDTO, UpdateMenuWithImagesDTO } from "./dtos/update-menu.dto";
import { validateDTO } from "src/common/tools/validate-dto.tool";
import { BranchRequired } from "src/common/decorators/branch.decorator";
import { BusinessRequired } from "src/common/decorators/business.decorator";
import { instanceToPlain } from "class-transformer";
import { Menu } from "./entities/menu.entity";
import { UpdateMenuVisibilityDTO } from "./dtos/update-menu-status.dto";
import { ModuleName } from "src/common/decorators/module.decorator";
import { Permission } from "src/common/decorators/permission.decorator";
import { Public } from "src/common/decorators/public.decorator";
import { CopyMenuDTO } from "./dtos/copy-menu.dto";
import { MoveMenuDTO } from "./dtos/move-menu.dto";
import { BadRequestException_C } from "src/common/Custom/http-response";
import { ErrorList } from "src/common/enums/error.enum";
import { MenuRequired } from "src/common/decorators/menu.decorator";
import { SubscriptionAction } from "src/common/decorators/subscription.decorator";

@Controller("public/businesses/:businessid/branches/:branchid/menus")
@ApiParam({ name: "businessid", example: "{{businessid}}", required: true, description: "Business ID" })
@ApiParam({ name: "branchid", example: "{{branchid}}", required: true, description: "Branch ID" })
@ApiTags("Menus")
@ApiBearerAuth("Authorization")
@BranchRequired()
@BusinessRequired()
@ModuleName("menus")
export class MenuController {
	constructor(private menuService: MenuService) {}

	@Get("summary")
	@ApiOperation({ summary: "Get menus summary" })
	@Version("1")
	@Permission("summary")
	async getMenusSummary() {
		return await this.menuService.getSummary();
	}

	@Put(":id/visibility")
	@ApiOperation({ summary: "Enable or disable a menu" })
	@Version("1")
	async updateEnable(@Param("id") id: number, @Body() updateMenuVisibility: UpdateMenuVisibilityDTO) {
		const visibilityDTO = await validateDTO(updateMenuVisibility, UpdateMenuVisibilityDTO);
		return await this.menuService.updateVisibility(id, updateMenuVisibility.visibility);
	}

	@Post()
	@ApiOperation({ summary: "Create a menu" })
	@ApiBody({ type: CreateMenuWithImagesDTO })
	@ApiConsumes("multipart/form-data")
	@UseInterceptors(FileFieldsInterceptor([{ name: "cover" }, { name: "logo" }], fileInterceptor))
	@Version("1")
	@Permission("create")
	@SubscriptionAction("MENU_CREATE")
	async create(@UploadedFiles() files: { cover: Express.Multer.File[]; logo: Express.Multer.File[] }, @Body() createMenu: CreateMenuDTO) {
		const createMenuDTO = await validateDTO(createMenu, CreateMenuDTO);
		const menu = await this.menuService.create(files.cover?.[0] ?? null, files.logo?.[0] ?? null, createMenuDTO);
		const {
			branch: { branchMembers, business, ...branchRest },
			...menuRest
		} = menu;
		const result = { ...menuRest, branch: branchRest };
		return result;
	}

	@Patch(":id")
	@ApiOperation({ summary: "Update existing menu values" })
	@ApiBody({ type: UpdateMenuWithImagesDTO })
	@ApiConsumes("multipart/form-data")
	@UseInterceptors(FileFieldsInterceptor([{ name: "cover" }, { name: "logo" }], fileInterceptor))
	@Version("1")
	@Permission("update")
	async update(
		@UploadedFiles() files: { cover: Express.Multer.File[]; logo: Express.Multer.File[] },
		@Param("id") id: number,
		@Body() updateMenu: UpdateMenuDTO,
	) {
		const updateMenuDTO = await validateDTO(updateMenu, UpdateMenuDTO);
		return await this.menuService.update(files.cover?.[0] ?? null, files.logo?.[0] ?? null, id, updateMenuDTO);
	}

	@Get()
	@ApiOperation({ summary: "Find all menus" })
	@Version("1")
	@Permission("list")
	async findAll() {
		const menus = instanceToPlain(await this.menuService.findAll()) as Menu[];
		return menus;
	}

	@Get(":id")
	@ApiOperation({ summary: "Find one menu" })
	@Version("1")
	@Permission("view")
	async findOne(@Param("id") id: number) {
		const menu = await this.menuService.findOne(id);
		const { promotions, ...menuRest } = instanceToPlain(menu);
		return {
			...menuRest,
			promotion: promotions?.length > 0 ? promotions[0] : null,
		};
	}

	@Delete("/:id")
	@ApiOperation({ summary: "Delete a menu" })
	@Version("1")
	@Permission("delete")
	async delete(@Param("id") id: number) {
		return await this.menuService.delete(id);
	}

	@Post(":menuId/copy")
	@Version("1")
	@Permission("copy")
	@MenuRequired()
	@SubscriptionAction("MENU_CREATE")
	async copy(@Param("menuId") id: number, @Body() copyDTO: CopyMenuDTO) {
		const copyDTOValidated = await validateDTO(copyDTO, CopyMenuDTO);
		return await this.menuService.copy(id, copyDTO);
	}

	@Post(":menuId/move")
	@Version("1")
	@Permission("move")
	@MenuRequired()
	async move(@Param("menuId") id: number, @Body() moveDTO: MoveMenuDTO) {
		const moveDTOValidated = await validateDTO(moveDTO, MoveMenuDTO);
		return await this.menuService.move(id, moveDTOValidated);
	}
}
