import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { BasePromotionDTO } from "./base-promotion.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class CreatePromotionDTO extends BasePromotionDTO {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({ example: "25% descuento con QR" })
	title: string;

	@IsNumber()
	@ApiProperty()
	@IsNotEmpty()
	@Transform(({ value }) => Number(value))
	menuId: number;

	@IsString()
	@IsOptional()
	@ApiProperty({ example: "pagando mas llevas menos", required: false })
	description: string;

	@IsNumber({}, { each: true })
	@ApiProperty({ type: [Number], example: [1, 2, 3] })
	productIds: number[];

	@IsString()
	@IsNotEmpty()
	@ApiProperty({ example: "2025-08-25 19:00" })
	fromTime: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({ example: "2025-08-25 20:00" })
	toTime: string;
}

export class CreatePromotionWithImageDTO extends CreatePromotionDTO {
	@IsString()
	@IsOptional()
	@ApiProperty({ type: "string", format: "binary", required: false })
	image: string;
}
