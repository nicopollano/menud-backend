import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UploadedFile,
	UseInterceptors,
	BadRequestException,
	Put,
	UploadedFiles,
	Version,
	Query,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto, CreateProductWithImageDto } from "./dto/create-product.dto";
import { UpdateProductDto, UpdateProductWithImageDto } from "./dto/update-product.dto";
import { Public } from "src/common/decorators/public.decorator";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { ErrorList } from "src/common/enums/error.enum";
import { BadRequestException_C } from "src/common/Custom/http-response";
import { validateDTO } from "src/common/tools/validate-dto.tool";
import { fileFilter } from "src/common/Custom/file-filter";
import { BranchRequired } from "src/common/decorators/branch.decorator";
import { BusinessRequired } from "src/common/decorators/business.decorator";
import { FilterProductParamsDTO } from "./dto/filter-product-params.dto";
import { ImportProductsDTO, ImportProductsWithImagesDTO } from "./dto/create-import-menu.dto";
import { ModuleName } from "src/common/decorators/module.decorator";
import { Permission } from "src/common/decorators/permission.decorator";

@ApiTags("Products")
@Controller("public/businesses/:businessid/branches/:branchid/products")
@ApiParam({ name: "businessid", example: "{{businessid}}", required: true, description: "Business ID" })
@ApiParam({ name: "branchid", example: "{{branchid}}", required: true, description: "Branch ID" })
@ApiBearerAuth("Authorization")
@BranchRequired()
@BusinessRequired()
@ModuleName("products")
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@ApiOperation({ summary: "Create a product" })
	@ApiBody({ type: CreateProductWithImageDto })
	@Post()
	@ApiConsumes("multipart/form-data")
	@UseInterceptors(FilesInterceptor("files", 4, { storage: memoryStorage(), fileFilter: fileFilter as any }))
	@Version("1")
	@Permission("create")
	async create(@UploadedFiles() files: Express.Multer.File[], @Body() createProductDto: CreateProductDto) {
		if (!files) throw new BadRequestException_C(ErrorList.UploadImageNotSupported);
		createProductDto = await validateDTO(createProductDto, CreateProductDto);

		const product = await this.productService.create(files, createProductDto);

		const { /* branch, */ ...productRest } = product;

		return productRest;
	}

	@ApiOperation({ summary: "Get all products" })
	@ApiQuery({ name: "search", required: false, type: String, description: "Filter by product name" })
	@ApiQuery({ name: "priceRange", required: false, type: String, description: "Filter by price range (format: min,max)" })
	@ApiQuery({ name: "categoryId", example: "{{categoryId}}", required: false, description: "Category ID" })
	@ApiQuery({ name: "subCategoryId", example: "{{subCategoryId}}", required: false, description: "Subcateogry ID" })
	@Public()
	@Get()
	@Version("1")
	@Permission("list")
	async findAll(@Query() filterProductParamsDTO: FilterProductParamsDTO) {
		const filterParamsDTO = await validateDTO(filterProductParamsDTO, FilterProductParamsDTO);
		/*
		if(filterDTO.categoryId){
		    return await this.productService.findByCat(filterParamsDTO.categoryId);
		}
		*/

		return await this.productService.findAll(filterProductParamsDTO);
	}

	@ApiOperation({ summary: "Get product by id" })
	@Public()
	@Get(":id")
	@Version("1")
	@Permission("view")
	async findOne(@Param("id") id: number) {
		const product = await this.productService.findOne(id);
		const { enabled, ...product_r } = product;
		return product_r;
	}

	@ApiOperation({ summary: "Update product by id" })
	@Patch(":id")
	@ApiConsumes("multipart/form-data")
	@ApiBody({ type: UpdateProductWithImageDto })
	@ApiParam({ name: "id", example: "{{id}}", required: true, description: "Product ID" })
	@UseInterceptors(FilesInterceptor("files", 4, { storage: memoryStorage(), fileFilter: fileFilter as any }))
	@Version("1")
	@Permission("update")
	async update(@UploadedFiles() files: Express.Multer.File[], @Param("id") id: number, @Body() updateProductDto: UpdateProductDto) {
		if (!files) throw new BadRequestException_C(ErrorList.UploadImageNotSupported);
		updateProductDto = await validateDTO(updateProductDto, UpdateProductDto);
		return await this.productService.update(files, id, updateProductDto);
	}

	@ApiOperation({ summary: "Delete product by id" })
	@Delete(":id")
	@ApiQuery({ name: "categoryId", required: false })
	@ApiQuery({ name: "subcategoryId", required: false })
	@Version("1")
	@Permission("delete")
	async remove(@Param("id") id: number, @Query("categoryId") categoryid: number, @Query("subcategoryId") subcategoryid: number) {
		return await this.productService.remove(id, categoryid, subcategoryid);
	}

	@Post("import")
	@ApiBody({ type: ImportProductsWithImagesDTO })
	@ApiConsumes("multipart/form-data")
	@UseInterceptors(
		FileInterceptor("csv", {
			fileFilter(req, file, callback) {
				const allowed = ["text/csv"];
				if (allowed.includes(file.mimetype)) callback(null, true);
				else callback(null, false);
			},
			storage: memoryStorage(),
		}),
	)
	@ApiOperation({ summary: "Import products" })
	async import(@UploadedFile() file: Express.Multer.File, @Body() createImportProducts: ImportProductsDTO) {
		const importProductsDTO = await validateDTO(createImportProducts, ImportProductsDTO);
		const importedProducts = await this.productService.import(file, importProductsDTO);

		const { branch, ...importedRest } = importedProducts;
		return importedRest;
	}
}
