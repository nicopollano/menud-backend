import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsObject, ValidateIf } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { ToBoolean } from "src/common/tools/to-boolean.tool";

export class BaseProductDto {
	@ApiProperty({ example: "Product name" })
	@IsString()
	name: string;

	@ApiProperty({ example: 100, required: false })
	@IsNumber()
	@Transform(({ value }) => Number(value))
	discountedPrice: number;

	@ApiProperty({ example: "Product description", required: false })
	@IsString()
	description: string;

	@ApiProperty({ example: 100 })
	@IsNumber()
	@Transform(({ value }) => Number(value))
	price: number;

	@ApiProperty({ example: 1 })
	@IsNumber()
	@Transform(({ value }) => Number(value))
	categoryId: number;

	@ApiProperty({ example: 1 })
	@IsNumber()
	@Transform(({ value }) => Number(value))
	subcategoryId: number;

	@IsBoolean()
	@ToBoolean()
	@IsOptional()
	@ApiProperty({ example: true })
	enabled: boolean;
}
