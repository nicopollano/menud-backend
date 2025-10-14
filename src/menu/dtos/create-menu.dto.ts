import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, isNotEmpty, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
import { TypographyList } from "src/common/enums/typography.enum";
import { BaseMenuDTO } from "./base-menu.dto";

export class CreateMenuDTO extends BaseMenuDTO {
	@IsNotEmpty()
	name: string;

	@IsOptional()
	typography: TypographyList;

	/*
    @IsNotEmpty()
    @Transform(({value})=> {
        if(typeof value === "string")
            return JSON.parse(value);
        return value;
    })
    schedules: CreateScheduleDTO[];
    */
}

export class CreateMenuWithImagesDTO extends CreateMenuDTO {
	@IsOptional()
	@IsString()
	@ApiProperty({ type: String, format: "binary", required: false })
	logo: string;

	@IsOptional()
	@IsString()
	@ApiProperty({ type: String, format: "binary", required: false })
	cover: string;

	@IsOptional()
	@IsString()
	@ApiProperty({ type: String, format: "binary", required: false })
	csv: string;
}
