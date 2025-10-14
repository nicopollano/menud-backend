import { IsString, IsNotEmpty, IsNumber, IsOptional, isString, ValidateIf } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { BaseUserDTO } from "./base-user.dto";

export class CreateUserDto extends BaseUserDTO {
	@IsNotEmpty()
	email: string;

	@IsNotEmpty()
	password: string;

	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	surname: string;

	@IsNotEmpty()
	phone: string;
}
