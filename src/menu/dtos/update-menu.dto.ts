import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsEmpty, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { BaseMenuDTO } from "./base-menu.dto";

export class UpdateMenuDTO extends PartialType(BaseMenuDTO) {
	@IsEmpty()
	enabled: boolean;
}

export class UpdateMenuWithImagesDTO extends UpdateMenuDTO {
	@IsOptional()
	@IsString()
	@ApiProperty({ type: String, format: "binary", required: false })
	logo: string;

	@IsOptional()
	@IsString()
	@ApiProperty({ type: String, format: "binary", required: false })
	front: string;
}
