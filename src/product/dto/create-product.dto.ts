import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsObject, ValidateIf } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { BaseProductDto } from "./base-product.dto";

export class CreateProductDto extends BaseProductDto {
	@IsNotEmpty()
	name: string;

	@IsOptional()
	@ApiProperty({ required: false })
	discountedPrice: number;

	@IsOptional()
	@ApiProperty({ required: false })
	categoryId: number;

	@IsOptional()
	@ApiProperty({ required: false })
	subcategoryId: number;

	@IsOptional()
	@ApiProperty({ required: false })
	description: string;

	@IsNotEmpty()
	price: number;
}

export class CreateProductWithImageDto extends CreateProductDto {
	@ApiProperty({ type: [String], format: "binary" })
	@IsNotEmpty({ message: "file is required" })
	files: Express.Multer.File[];
}
