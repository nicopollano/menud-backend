import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors, Version } from "@nestjs/common";
import { BusinessService } from "./business.service";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateBusinessDTO, CreateBusinessDTOWithImage } from "./dtos/create-business.dto";
import { UpdateBusinessDTO, UpdateBusinessDTOWithImage } from "./dtos/update-business.dto";
import { validateDTO } from "src/common/tools/validate-dto.tool";
import { NotFoundException_C } from "src/common/Custom/http-response";
import { ErrorList } from "src/common/enums/error.enum";
import { ClsService } from "nestjs-cls";
import { User } from "src/users/entities/user.entity";
import { FileInterceptor } from "@nestjs/platform-express";
import { fileInterceptor } from "src/common/interceptors/file.interceptor";
import { instanceToPlain } from "class-transformer";
import { Business } from "./entities/business.entity";
import { ModuleName } from "src/common/decorators/module.decorator";
import { Permission } from "src/common/decorators/permission.decorator";
import { Permissive } from "src/common/decorators/permissive.decorator";
import { BusinessSitemapDTO } from "./dtos/business-sitemap.dto";
import { Public } from "src/common/decorators/public.decorator";
import { SubscriptionAction } from "src/common/decorators/subscription.decorator";

@ApiTags("Businesses")
@ApiBearerAuth("Authorization")
@Controller("public/businesses")
@ModuleName("businesses")
export class BusinessController {
	constructor(
		private businessService: BusinessService,
		private clsService: ClsService,
	) {}

	@Get("summary")
	@ApiOperation({ summary: "Get businesses summary" })
	@Version("1")
	@Permission("summary")
	@Permissive()
	async getBusinessesSummary() {
		const user = this.clsService.get("user");
		if (!user) throw new NotFoundException_C(ErrorList.UserNotFound);

		return await this.businessService.getSummaryByUserId(user.id);
	}

	@Get(":id")
	@ApiOperation({ summary: "Find a Business" })
	@Version("1")
	@Permission("view")
	@Permissive()
	async findOne(@Param("id") id: number) {
		const user: User = this.clsService.get("user");
		const business: Business = await this.businessService.findOne(id, user.id);
		const { businessOwners, ...businessFiltered } = business;
		return businessFiltered;
	}

	@Post()
	@ApiOperation({ summary: "Create a Business" })
	@ApiConsumes("multipart/form-data")
	@ApiBody({ type: CreateBusinessDTOWithImage })
	@UseInterceptors(FileInterceptor("logo", fileInterceptor))
	@Version("1")
	@Permissive()
	@Permission("create")
	@SubscriptionAction("BUSINESS_CREATE")
	async create(@UploadedFile() logo: Express.Multer.File, @Body() createBusiness: CreateBusinessDTO) {
		const createBusinessDTO = await validateDTO(createBusiness, CreateBusinessDTO);
		const business = await this.businessService.create(logo, createBusinessDTO);
		const { businessOwners, ...businessFiltered } = business;
		return businessFiltered;
	}

	@Patch(":id")
	@ApiOperation({ summary: "Update a Business" })
	@ApiConsumes("multipart/form-data")
	@ApiParam({
		name: "id",
		example: "{{id}}",
		required: true,
		description: "Business ID",
	})
	@ApiBody({ type: UpdateBusinessDTOWithImage })
	@UseInterceptors(FileInterceptor("logo", fileInterceptor))
	@Version("1")
	@Permission("update")
	async update(@UploadedFile() logo: Express.Multer.File, @Param("id") id: number, @Body() updateBusiness: UpdateBusinessDTO) {
		const updateBusinessDTO = await validateDTO(updateBusiness, UpdateBusinessDTO);
		const user: User = this.clsService.get("user");
		const business = await this.businessService.update(id, logo, updateBusinessDTO, user.id);
		const { businessOwners, ...businessFiltered } = business;

		return businessFiltered;
	}

	@Delete(":id")
	@ApiOperation({ summary: "Delete a Business" })
	@Version("1")
	@Permission("delete")
	async delete(@Param("id") id: number) {
		const user: User = this.clsService.get("user");
		const business = await this.businessService.delete(id, user.id);
		const { businessOwners, ...businessFiltered } = business;
		return businessFiltered;
	}

	@Get()
	@ApiOperation({ summary: "Get all businesses" })
	@Version("1")
	@Permission("list")
	@Permissive()
	async findAll() {
		const user = this.clsService.get("user");
		if (!user) throw new NotFoundException_C(ErrorList.UserNotFound);

		return await this.businessService.findAllByUserId(user.id);
	}
}

@ApiTags("Businesses SEO")
@Controller("businesses")
export class BusinessSeoController {
	constructor(private businessService: BusinessService) {}

	@Get("sitemap")
	@Public()
	@ApiOperation({
		summary: "Get businesses sitemap data",
		description: "Returns enabled businesses with id and name for sitemap generation and SEO",
	})
	@ApiResponse({
		status: 200,
		description: "List of enabled businesses for sitemap",
		type: [BusinessSitemapDTO],
	})
	@Version("1")
	async getBusinessesSitemap(): Promise<BusinessSitemapDTO[]> {
		return await this.businessService.findAllForSitemap();
	}
}

@ApiTags("Businesses")
@ApiBearerAuth("Authorization")
@Controller("private/businesses")
export class BusinessControllerPrivate {
	constructor(private businessService: BusinessService) {}

	@Get()
	@ApiOperation({ summary: "Get all businesses" })
	@Version("1")
	async findAll() {
		const businesses = instanceToPlain(await this.businessService.findAll(null, true));
		const businessFiltered = businesses.map(({ businessOwners, branches, ...rest }) => rest);
		const totalBranches = businesses.reduce((acc, business) => {
			return acc + business.summary.totalBranches;
		}, 0);
		return {
			...businessFiltered,
			summary: {
				totalBranches,
				totalBusinesses: businessFiltered.length,
			},
		};
	}

	@Get(":id")
	@ApiOperation({ summary: "Find a Business" })
	@Version("1")
	async findOne(@Param("id") id: number) {
		const business: Business = instanceToPlain(await this.businessService.findOne(id)) as Business;
		const { businessOwners, ...businessFiltered } = business;
		return businessFiltered;
	}

	@Post()
	@ApiOperation({ summary: "Create a Business" })
	@ApiBody({ type: CreateBusinessDTOWithImage })
	@ApiConsumes("multipart/form-data")
	@UseInterceptors(FileInterceptor("logo", fileInterceptor))
	@Version("1")
	async create(@UploadedFile() logo: Express.Multer.File, @Body() createBusiness: CreateBusinessDTO) {
		const createBusinessDTO = await validateDTO(createBusiness, CreateBusinessDTO);
		const business = await this.businessService.create(logo, createBusinessDTO, false);
		const { businessOwners, ...businessFiltered } = business;
		return businessFiltered;
	}

	@Patch(":id")
	@ApiOperation({ summary: "Update a Business" })
	@ApiParam({
		name: "id",
		example: "{{id}}",
		required: true,
		description: "Business ID",
	})
	@ApiConsumes("multipart/form-data")
	@ApiBody({ type: UpdateBusinessDTOWithImage })
	@UseInterceptors(FileInterceptor("logo", fileInterceptor))
	@Version("1")
	async update(@UploadedFile() logo: Express.Multer.File, @Param("id") id: number, @Body() updateBusiness: UpdateBusinessDTO) {
		const updateBusinessDTO = await validateDTO(updateBusiness, UpdateBusinessDTO);

		const business = await this.businessService.update(id, logo, updateBusinessDTO);
		const { businessOwners, ...businessFiltered } = business;

		return businessFiltered;
	}

	@Delete(":id")
	@ApiOperation({ summary: "Delete a Business" })
	@Version("1")
	async delete(@Param("id") id: number) {
		const business = await this.businessService.delete(id);
		const { businessOwners, ...businessFiltered } = business;
		return businessFiltered;
	}
}
