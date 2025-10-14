import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
import { ToBoolean } from "src/common/tools/to-boolean.tool";

export class BaseSubcategoryDto {
	@ApiProperty({ example: "Subcategory name", required: true })
	@IsString()
	name: string;

	@ApiProperty({ example: "Sin arroz pero con arroz", required: false })
	@IsString()
	description: string;

	@ApiProperty({ example: "category id", required: true })
	@IsNumber()
	categoryId: number;

	@IsBoolean()
	@ToBoolean()
	@IsOptional()
	@ApiProperty({ example: true, required: false })
	enabled?: boolean;
}
