import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import { BaseUserDTO } from "./base-user.dto";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserDTO extends PartialType(BaseUserDTO) {
	@IsString()
	@IsOptional()
	@ApiProperty({ example: "nico_pollano@hotmail.com", required: false })
	email: string;

	@IsString()
	@IsOptional()
	@ApiProperty({ required: false })
	password: string;

	@IsString()
	@IsOptional()
	@ApiProperty({ required: false })
	oldPassword: string;

	@IsString()
	@IsOptional()
	@ApiProperty({ required: false })
	name: string;

	@IsString()
	@IsOptional()
	@ApiProperty({ required: false })
	surname: string;

	@IsString()
	@IsOptional()
	@ApiProperty({ required: false })
	phone: string;
}
