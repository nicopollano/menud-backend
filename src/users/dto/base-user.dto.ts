import { IsString, IsNotEmpty, IsNumber, IsOptional, isString, ValidateIf } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class BaseUserDTO {
	@IsString()
	email: string;

	@IsString()
	password: string;

	@IsString()
	name: string;

	@IsString()
	surname: string;

	@IsString()
	phone: string;
}
