import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ValidateDayPromotionDTO {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ example: "2025-08-25 19:00" })
	fromTime: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({ example: "2025-08-25 20:00" })
	toTime: string;

	@IsNotEmpty()
	@IsNumber()
	@ApiProperty({ example: 1 })
	menuId: number;

	/* @IsNotEmpty()
	@IsNumber({}, { each: true })
	@ApiProperty()
	days: number[]; */
}
