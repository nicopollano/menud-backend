import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";
import { BasePromotionDTO } from "./base-promotion.dto";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { ToBoolean } from "src/common/tools/to-boolean.tool";

export class UpdatePromotionDTO extends PartialType(BasePromotionDTO) {
	@IsString()
	@ApiProperty({ example: "25% descuento con QR" })
	title: string;

	@IsString()
	@ApiProperty({ example: "pagando mas llevas menos" })
	description: string;

	@IsBoolean()
	@ToBoolean()
	@IsOptional()
	@ApiProperty({ example: true })
	enabled: boolean;
}

export class UpdatePromotionWithImageDTO extends UpdatePromotionDTO {
	@IsString()
	@IsOptional()
	@ApiProperty({ type: "string", format: "binary" })
	image: string;
}
