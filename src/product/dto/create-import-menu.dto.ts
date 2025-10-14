import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { BaseImportProductsDTO } from "./base-import-menu.dto";

export class ImportProductsDTO extends BaseImportProductsDTO {
	@IsOptional()
	@Transform(({ value }) => Number(value))
	@ApiProperty({ example: "", required: false })
	categoryId: number;

	@IsOptional()
	@Transform(({ value }) => Number(value))
	@ApiProperty({ example: "", required: false })
	subCategoryId: number;

	/*
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @ApiProperty({ example: "", required: false })
    menuId: number;
    */
}

export class ImportProductsWithImagesDTO extends ImportProductsDTO {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ type: String, format: "binary", required: true })
	csv: string;
}
