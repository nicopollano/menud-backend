import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { BaseSubcategoryDto } from "./base-subcategory.dto";

export class UpdateSubcategoryDto extends PartialType(BaseSubcategoryDto) {}

export class UpdateSubcategoryBodyDTO extends UpdateSubcategoryDto {
	@ApiProperty({ type: String, format: "binary", example: "Category image", required: false })
	@IsString()
	@IsNotEmpty()
	file: string;
}
