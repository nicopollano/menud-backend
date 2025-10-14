import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
import { BaseCategoryDto } from "./base-category.dto";

export class CreateCategoryDto extends BaseCategoryDto {
	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	menuId: number;

	@IsOptional()
	description: string;
}

export class CreateCategoryWithImageDto extends CreateCategoryDto {
	@ApiProperty({ type: String, format: "binary", example: "Category image", required: false })
	@IsString()
	@IsNotEmpty()
	file: string;
}
