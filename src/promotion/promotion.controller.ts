import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors, Version } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiProperty, ApiQuery, ApiTags } from "@nestjs/swagger";
import { BranchRequired } from "src/common/decorators/branch.decorator";
import { BusinessRequired } from "src/common/decorators/business.decorator";
import { UpdatePromotionDTO, UpdatePromotionWithImageDTO } from "./dtos/update-promotion.dto";
import { PromotionService } from "./promotion.service";
import { CreatePromotionDTO, CreatePromotionWithImageDTO } from "./dtos/create-promotion.dto";
import { Public } from "src/common/decorators/public.decorator";
import { ModuleName } from "src/common/decorators/module.decorator";
import { Permission } from "src/common/decorators/permission.decorator";
import { ValidateDayPromotionDTO } from "./dtos/validate-day.dto";
import { validateDTO } from "src/common/tools/validate-dto.tool";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { fileInterceptor } from "src/common/interceptors/file.interceptor";
import { Multer } from "multer";
import { Schedule } from "src/schedule/entities/schedule.entity";
import { Permissive } from "src/common/decorators/permissive.decorator";

@ApiTags("Promotions")
@ApiBearerAuth("Authorization")
@BranchRequired()
@BusinessRequired()
@Controller("public/businesses/:businessid/branches/:branchid/promotions")
@ApiParam({ name: "businessid", example: "{{businessid}}", required: true, description: "Business ID" })
@ApiParam({ name: "branchid", example: "{{branchid}}", required: true, description: "Branch ID" })
@ModuleName("promotions")
export class PromotionController {
	constructor(private promotionService: PromotionService) {}

	@Get()
	@Version("1")
	@ApiOperation({ summary: "Find all promotions" })
	@ApiQuery({ name: "menuId", required: false })
	@Permission("list")
	async findAll(@Query("menuId") menuId: number) {
		const promotions = await this.promotionService.findAll(menuId);
		const promotionsFiltered = promotions.map(({ ...promotionRest }) => promotionRest);
		return promotionsFiltered;
	
	}

	@Post("available-days")
	@Version("1")
	@ApiOperation({ summary: "Validate promotion day" })
	@Public()
	@Permission("availableDays")
	async availableDay(@Body() validateDayPromotionDTO: ValidateDayPromotionDTO) {
		const validateDayValidated = await validateDTO(validateDayPromotionDTO, ValidateDayPromotionDTO);
		return await this.promotionService.validateDay(validateDayValidated);
	}

	@Get("summary")
	@Version("1")
	@ApiOperation({ summary: "Get promotion summary" })
	@Permission("summary")
	@ApiQuery({ name: "menuId", required: false })
	async summary(@Query("menuId") menuId: number) {
		try{
		return this.promotionService.summary(menuId);
	}catch(error){
		console.error(error);
		throw error;	
	}
	}

	@Get(":id")
	@Version("1")
	@ApiOperation({ summary: "Find one promotion" })
	@ApiParam({ name: "id" })
	@Permission("view")
	async findOne(@Param("id") promotionId: number) {
		const promotion = await this.promotionService.findOne(promotionId);
		const { ...promotionRest } = promotion;
		return promotionRest;
	}

	@Post()
	@Version("1")
	@ApiOperation({ summary: "Create promotion" })
	@ApiBody({ type: CreatePromotionWithImageDTO })
	@Permission("create")
	@ApiConsumes("multipart/form-data")
	@UseInterceptors(FileInterceptor("image", fileInterceptor))
	async create(@UploadedFile() image: Express.Multer.File, @Body() createPromotionDto: CreatePromotionDTO) {
		const validatedPromotion = await validateDTO(createPromotionDto, CreatePromotionDTO);
		const promotion = await this.promotionService.create(image, validatedPromotion);
		const { schedule, ...promotionRest } = promotion;
		const { branch, ...restSchedule } = schedule;
		promotion.schedule = restSchedule as Schedule;
		return { ...promotionRest, schedule: promotion.schedule };
	}

	@Patch(":id")
	@Version("1")
	@ApiOperation({ summary: "Update promotion" })
	@ApiParam({ name: "id" })
	@ApiBody({ type: UpdatePromotionWithImageDTO })
	@ApiConsumes("multipart/form-data")
	@Permission("update")
	@UseInterceptors(FileInterceptor("image", fileInterceptor))
	async update(@Param("id") id: number, @UploadedFile() image: Express.Multer.File, @Body() updatePromotionDTO: UpdatePromotionDTO) {
		const validatedPromotion = await validateDTO(updatePromotionDTO, UpdatePromotionDTO);
		const promotion = await this.promotionService.update(id, image, validatedPromotion);
		const { ...promotionRest } = promotion;
		return promotionRest;
	}

	@Delete(":id")
	@Version("1")
	@ApiOperation({ summary: "Delete promotion" })
	@ApiParam({ name: "id" })
	@Permission("delete")
	async delete(@Param("id") promotionId: number) {
		const promotion = await this.promotionService.delete(promotionId);
		const { ...promotionRest } = promotion;
		return promotionRest;
	}
}
