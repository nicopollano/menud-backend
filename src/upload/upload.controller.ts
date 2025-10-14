import { BadRequestException, Controller, forwardRef, Inject, Param, Post, Query, UploadedFile, UseInterceptors, Version } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { memoryStorage, diskStorage } from "multer";
import { Public } from "src/common/decorators/public.decorator";
import { BadRequestException_C, InternalServerErrorException_C } from "src/common/Custom/http-response";
import { UploadService } from "./upload.service";
import { BranchService } from "src/branch/branch.service";
import { BusinessService } from "src/business/business.service";
import { ClsService } from "nestjs-cls";

@ApiBearerAuth("Authorization")
@ApiTags("Uploads")
@Controller("private/businesses/upload")
export class UploadController {
	constructor(
		private uploadService: UploadService,
		@Inject(forwardRef(() => BranchService)) private branchService: BranchService,
		@Inject(forwardRef(() => BusinessService)) private businessService: BusinessService,
		private clsService: ClsService,
	) {}

	@Public()
	@Post(":subfolder")
	@ApiConsumes("multipart/form-data")
	@ApiBody({
		schema: {
			type: "object",
			properties: {
				file: {
					type: "string",
					format: "binary",
				},
			},
		},
	})
	@UseInterceptors(
		FileInterceptor("file", {
			fileFilter(req, file, callback) {
				const allowed = ["image/jpeg", "image/png", "image/jpg"];
				if (allowed.includes(file.mimetype)) {
					callback(null, true);
				}
				callback(null, false);
			},
			storage: memoryStorage(),
		}),
	)
	@Version("1")
	@ApiQuery({ name: "businessId" })
	@ApiQuery({ name: "branchId" })
	async uploadImage(
		@Query("businessId") businessId: number,
		@Query("branchId") branchId: number,
		@UploadedFile() file: Express.Multer.File,
		@Param("subfolder") subfolder: string,
	) {
		const business = await this.businessService.findOne(businessId);
		const branch = await this.branchService.findOne(branchId);

		this.clsService.set("branch", branch);
		this.clsService.set("business", business);
		return await this.uploadService.uploadImage(file, subfolder);
	}

	@Public()
	@UseInterceptors(
		FileInterceptor("file", {
			storage: memoryStorage(),
		}),
	)
	@ApiConsumes("multipart/form-data")
	@ApiBody({
		schema: {
			type: "object",
			properties: {
				file: {
					type: "string",
					format: "binary",
				},
			},
		},
	})
	@Post("csv")
	async uploadCSV(@UploadedFile() file: Express.Multer.File) {
		const data = await this.uploadService.processCsv(file);
		return data;
	}
}
