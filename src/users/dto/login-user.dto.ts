import { IsEmpty, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CreateUserDto } from "./create-user.dto";
import { ApiProperty, OmitType } from "@nestjs/swagger";

export class LoginUserDTO {
	@IsString()
	@IsOptional()
	@ApiProperty({ example: "nico_pollano@hotmail.com", required: false })
	email?: string;

	@IsString()
	@IsOptional()
	@ApiProperty({ example: "password" })
	password?: string;

	@IsNotEmpty({ message: "Password is required if email is provided" })
	validatePasswordIfEmail() {
		if (this.email && !this.password) {
			throw new Error("Password is required if email is provided");
		}
	}

	@IsOptional()
	@IsString()
	@ApiProperty({ required: false })
	singinToken?: string;
}
