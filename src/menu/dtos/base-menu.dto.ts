import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf, ValidateNested } from "class-validator";
import { TypographyList } from "src/common/enums/typography.enum";
import { ToBoolean } from "src/common/tools/to-boolean.tool";
import { CreateScheduleDTO } from "src/schedule/dtos/create-schedule.dto";
import { Schedule } from "src/schedule/entities/schedule.entity";

export class BaseMenuDTO {
	@IsString()
	@ApiProperty({ example: "" })
	name: string;

	@IsString()
	@ApiProperty({ example: "", required: false })
	@IsOptional()
	description: string;

	@IsEnum(TypographyList)
	@IsOptional()
	@ApiProperty({ enum: TypographyList, example: TypographyList.poppins, required: false })
	typography: TypographyList;

	@IsBoolean()
	@ToBoolean()
	@IsOptional()
	@ApiProperty({ example: true, required: false })
	enabled: boolean;

	/*
    @ApiProperty({ type: () => [BaseScheduleDTO] })
    @ValidateNested({ each: true })
    @Type(() => BaseScheduleDTO)
    schedules: BaseScheduleDTO[];
    */
}
