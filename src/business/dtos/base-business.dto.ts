import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
import { ToBoolean } from "src/common/tools/to-boolean.tool";

export class BaseBusinessDTO {
	/*
    @IsNotEmpty()
    @IsNumber()
    user_id: number;
    */

	@IsString()
	@ApiProperty({ example: "MacDonals" })
	name: string;

	@IsString()
	@ApiProperty({ example: "0800555112", required: false })
	phone: string;

	@IsString()
	@ApiProperty({ example: "Lopez y plomo 115", required: false })
	address: string;

	@IsString()
	@ApiProperty({ example: "Cordoba", required: false })
	location: string;

	@IsString()
	@ApiProperty({ example: "Argentina", required: false })
	country: string;

	@IsString()
	@ApiProperty({ required: false })
	description: string;

	@IsBoolean()
	@ToBoolean()
	@IsOptional()
	@ApiProperty({ example: true, required: false })
	enabled: boolean;
}
