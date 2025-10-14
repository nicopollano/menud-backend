import { IsNotEmpty, isNumber, IsNumber, IsOptional, IsString } from "class-validator";
import { CreateBusinessDTO } from "./create-business.dto";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { BaseBusinessDTO } from "./base-business.dto";

export class UpdateBusinessDTO extends PartialType(BaseBusinessDTO) {}

export class UpdateBusinessDTOWithImage extends UpdateBusinessDTO {
	@IsOptional()
	@IsString()
	@ApiProperty({ type: "string", format: "binary", required: false })
	logo?: string;
}
