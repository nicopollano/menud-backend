import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
import { BaseSubcategoryDto } from "./base-subcategory.dto";

export class CreateSubcategoryDTO extends BaseSubcategoryDto {
	@IsNotEmpty()
	name: string;

	@IsOptional()
	description: string;

	@IsNotEmpty()
	categoryId: number;
}

export class CreateSubcategoryWithImageDTO extends CreateSubcategoryDTO {
	@ApiProperty({ type: String, format: "binary", example: "Subcategory image", required: false })
	@IsString()
	@IsOptional()
	files: string;
}
