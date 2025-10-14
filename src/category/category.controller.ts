import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Put, Version, Query } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto, CreateCategoryWithImageDto } from "./dto/create-category.dto";
import { UpdateCategoryBodyDTO, UpdateCategoryDto } from "./dto/update-category.dto";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { BadRequestException_C, NotFoundException_C } from "src/common/Custom/http-response";
import { ErrorList } from "src/common/enums/error.enum";
import { validateDTO } from "src/common/tools/validate-dto.tool";
import { fileInterceptor } from "src/common/interceptors/file.interceptor";
import { BusinessRequired } from "src/common/decorators/business.decorator";
import { BranchRequired } from "src/common/decorators/branch.decorator";
import { instanceToPlain } from "class-transformer";
import { Category } from "./entities/category.entity";
import { FilterFindAllDTO } from "./dto/filter-findAll.dto";
import { ModuleName } from "src/common/decorators/module.decorator";
import { Permission } from "src/common/decorators/permission.decorator";

@ApiTags("Categories")
@Controller("public/businesses/:businessid/branches/:branchid/categories")
@ApiParam({ name: "businessid", example: "{{businessid}}", required: true, description: "Business ID" })
@ApiParam({ name: "branchid", example: "{{branchid}}", required: true, description: "Branch ID" })
@ApiBearerAuth("Authorization")
@BusinessRequired()
@BranchRequired()
@ModuleName("categories")
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@ApiOperation({ summary: "Create a category" })
	@ApiConsumes("multipart/form-data")
	@ApiBody({ type: CreateCategoryWithImageDto })
	@Post()
	@UseInterceptors(FileInterceptor("file", fileInterceptor))
	@Version("1")
	@Permission("create")
	async create(@UploadedFile() file: Express.Multer.File, @Body() createCategoryDto: CreateCategoryDto) {
		createCategoryDto = await validateDTO(createCategoryDto, CreateCategoryDto);
		const category = await this.categoryService.create(file, createCategoryDto);

		const { menu, ...categoryRest } = category;
		return categoryRest;
	}

	@ApiOperation({ summary: "Find all categories" })
	@Get()
	@ApiQuery({ name: "menuId", required: false, type: Number, description: "Filter by menu ID" })
	@Version("1")
	@Permission("list")
	async findAll(@Query() filter: FilterFindAllDTO) {
		const filterValidated = await validateDTO(filter, FilterFindAllDTO);
		const categories: Category[] = instanceToPlain(await this.categoryService.findAll(filterValidated)) as Category[];

		return categories;
	}

	@Get(":id")
	@ApiOperation({ summary: "Find selected category" })
	@Version("1")
	@Permission("view")
	async findOne(@Param("id") id: string) {
		return await this.categoryService.findOne(+id);
	}

	@ApiOperation({ summary: "Update selected fields of categories" })
	@Patch(":id")
	@ApiParam({ name: "id", example: "{{id}}", required: true, description: "Category ID" })
	@ApiConsumes("multipart/form-data")
	@ApiBody({ type: UpdateCategoryBodyDTO })
	@ApiConsumes("multipart/form-data")
	@UseInterceptors(FileInterceptor("file", fileInterceptor))
	@Version("1")
	@Permission("update")
	async update(@UploadedFile() file: Express.Multer.File, @Param("id") id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
		updateCategoryDto = await validateDTO(updateCategoryDto, UpdateCategoryDto);
		return await this.categoryService.update(id, updateCategoryDto, file);
	}

	@Delete(":id")
	@ApiOperation({ summary: "Delete category" })
	@Version("1")
	@Permission("delete")
	async remove(@Param("id") id: string) {
		return await this.categoryService.remove(+id);
	}
}
