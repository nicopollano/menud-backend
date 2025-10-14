import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";
import { ToBoolean } from "src/common/tools/to-boolean.tool";

export class BaseCategoryDto {
	@ApiProperty({ example: "Category name", required: true })
	@IsString()
	name: string;

	@ApiProperty({ example: 1, required: true, type: Number })
	@IsNumber()
	@Transform(({ value }) => Number(value))
	menuId: number;

	@ApiProperty({ example: "Category description", required: false })
	@IsString()
	description: string;

	@ToBoolean()
	@IsBoolean()
	@IsOptional()
	@ApiProperty({ example: true, type: Boolean, required: false })
	enabled?: boolean;
}
