import { ApiExtraModels, ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateProductDto } from "./create-product.dto";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";
import { BaseProductDto } from "./base-product.dto";
import { ToBoolean } from "src/common/tools/to-boolean.tool";

export class UpdateProductDto extends PartialType(BaseProductDto) {}

@ApiExtraModels(CreateProductDto)
export class UpdateProductWithImageDto extends UpdateProductDto {
	@ApiProperty({ type: [String], format: "binary", required: false })
	@IsString()
	@IsNotEmpty()
	files: Express.Multer.File[];
}
