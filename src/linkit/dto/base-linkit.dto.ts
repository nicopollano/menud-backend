import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class BaseLinkitDTO {
	@IsString()
	@IsOptional()
	@ApiProperty()
	whatsapp: string;

	@IsString()
	@IsOptional()
	@ApiProperty()
	website: string;

	@IsString()
	@IsOptional()
	@ApiProperty()
	instagram: string;

	@IsString()
	@IsOptional()
	@ApiProperty()
	facebook: string;

	@IsString()
	@IsOptional()
	@ApiProperty()
	location: string;

	@IsString()
	@IsOptional()
	@ApiProperty()
	twitter: string;

	@IsString()
	@IsOptional()
	@ApiProperty()
	tiktok: string;

	@IsString()
	@IsOptional()
	@ApiProperty()
	linkedin: string;
}
