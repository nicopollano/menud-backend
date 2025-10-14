import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
import { BaseBusinessDTO } from "./base-business.dto";

export class CreateBusinessDTO extends BaseBusinessDTO {
	/*
    @IsNotEmpty()
    @IsNumber()
    user_id: number;
    */

	@IsNotEmpty()
	name: string;

	@IsOptional()
	phone: string;

	@IsOptional()
	address: string;

	@IsOptional()
	location: string;

	@IsOptional()
	country: string;

	@IsOptional()
	description: string;
}

export class CreateBusinessDTOWithImage extends CreateBusinessDTO {
	@IsOptional()
	@IsString()
	@ApiProperty({ type: "string", format: "binary", required: false })
	logo?: string;
}
