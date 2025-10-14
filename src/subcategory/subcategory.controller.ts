import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UploadedFile, UseInterceptors, Version } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { SubcategoryService } from "./subcategory.service";
import { UpdateSubcategoryBodyDTO, UpdateSubcategoryDto } from "./dtos/update-subcategory.dto";
import { ErrorList } from "src/common/enums/error.enum";
import { validateDTO } from "src/common/tools/validate-dto.tool";
import { CreateSubcategoryDTO, CreateSubcategoryWithImageDTO } from "./dtos/create-subcategory.dto";
import { BranchRequired } from "src/common/decorators/branch.decorator";
import { BusinessRequired } from "src/common/decorators/business.decorator";
import { FilterSubcategoryDTO } from "./dtos/filter-subcategory.dto";
import { ModuleName } from "src/common/decorators/module.decorator";
import { Permission } from "src/common/decorators/permission.decorator";

@ApiTags("Subcategories")
@Controller("public/businesses/:businessid/branches/:branchid/subcategories")
@ApiParam({ name: "businessid", example: "{{businessid}}", required: true, description: "Business ID" })
@ApiParam({ name: "branchid", example: "{{branchid}}", required: true, description: "Branch ID" })
@ApiBearerAuth("Authorization")
@BranchRequired()
@BusinessRequired()
@ModuleName("subcategories")
export class SubcategoryController {
	constructor(private subcategoryService: SubcategoryService) {}

	@ApiOperation({ summary: "Create a subcategory" })
	@ApiConsumes("multipart/form-data")
	@ApiBody({ type: CreateSubcategoryWithImageDTO })
	@Post()
	@UseInterceptors(
		FileInterceptor("file", {
			fileFilter(req, file, callback) {
				const allowed = ["image/png", "image/jpeg", "image/jpg"];
				if (allowed.includes(file.mimetype)) callback(null, true);
				else callback(null, false);
			},
			storage: memoryStorage(),
		}),
	)
	@Version("1")
	@Permission("create")
	async create(@UploadedFile() file: Express.Multer.File, @Body() createSubategoryDto: CreateSubcategoryDTO) {
		createSubategoryDto.categoryId = Number(createSubategoryDto.categoryId);
		const validatedData = await validateDTO(createSubategoryDto, CreateSubcategoryDTO);
		return await this.subcategoryService.create(file, validatedData);
	}

	@ApiOperation({ summary: "Get one subcategories" })
	@Get(":id")
	@Version("1")
	@Permission("view")
	async findOne(@Param("id") id: number) {
		return await this.subcategoryService.findOne(id);
	}

	@ApiOperation({ summary: "Update selected fields of categories" })
	@Patch(":id")
	@ApiBody({ type: UpdateSubcategoryBodyDTO })
	@ApiParam({ name: "id", example: "{{id}}", required: true, description: "Subcategory ID" })
	@ApiConsumes("multipart/form-data")
	@UseInterceptors(
		FileInterceptor("file", {
			fileFilter(req, file, callback) {
				const allowed = ["image/png", "image/jpeg", "image/jpg"];
				if (allowed.includes(file.mimetype)) callback(null, true);
				else {
					callback(new Error(JSON.stringify(ErrorList.UploadImageNotSupported)), false);
				}
			},
			storage: memoryStorage(),
		}),
	)
	@Version("1")
	@Permission("update")
	async update(@UploadedFile() file: Express.Multer.File, @Param("id") id: number, @Body() updateCategoryDto: UpdateSubcategoryDto) {
		const validatedData = await validateDTO(updateCategoryDto, UpdateSubcategoryDto);
		return this.subcategoryService.update(id, validatedData, file);
	}

	@ApiOperation({ summary: "Delete one subcategory" })
	@Delete(":id")
	@Version("1")
	@Permission("delete")
	async delete(@Param("id") id: number) {
		return await this.subcategoryService.delete(id);
	}

	@Get()
	@Version("1")
	@ApiOperation({ summary: "Get all subcategories" })
	@ApiQuery({ name: "menuId", type: String, required: false })
	@ApiQuery({ name: "categoryId", type: String, required: false })
	@Permission("list")
	async findAll(@Query() filter: FilterSubcategoryDTO) {
		return await this.subcategoryService.findAllWithFilter(filter);
	}
}
