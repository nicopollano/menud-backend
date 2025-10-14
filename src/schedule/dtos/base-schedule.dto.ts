import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmpty, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateNested, IsEnum } from "class-validator";
import { Days } from "src/common/enums/days.enum";
import { ToBoolean } from "src/common/tools/to-boolean.tool";

export class BaseScheduleDTO {
	@IsString()
	@IsOptional()
	@ApiProperty({ example: "2025-08-25 19:00" })
	openTime: string;

	@IsString()
	@IsOptional()
	@ApiProperty({ example: "2025-08-25 20:00" })
	closeTime: string;

	@IsEnum(Days, { each: true })
	@IsOptional()
	@ApiProperty({ example: [Days.Monday, Days.Tuesday] })
	days: Days[];

	@IsBoolean()
	@ToBoolean()
	@IsOptional()
	@ApiProperty({ example: true, required: false })
	enabled: boolean;
}
