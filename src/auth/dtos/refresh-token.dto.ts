import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenDTO {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({ example: "{{token}}", required: true, description: "Refresh Token" })
	refreshToken: string;
}
