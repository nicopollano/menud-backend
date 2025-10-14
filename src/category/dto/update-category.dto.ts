import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { BaseCategoryDto } from "./base-category.dto";

export class UpdateCategoryDto extends PartialType(BaseCategoryDto) {}

export class UpdateCategoryBodyDTO extends UpdateCategoryDto {
	@ApiProperty({ type: String, format: "binary", example: "Category image", required: false })
	@IsString()
	@IsOptional()
	file: string;
}
