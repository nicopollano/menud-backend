import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateIf } from "class-validator";
import { ToBoolean } from "src/common/tools/to-boolean.tool";

export class BasePaletteDTO {
	@IsString()
	@ApiProperty({ example: "#FFFFFF" })
	color1: string;

	@IsString()
	@ApiProperty({ example: "#FFFFFF" })
	color2: string;

	@IsString()
	@ApiProperty({ example: "#FFFFFF" })
	color3: string;

	@IsBoolean()
	@ToBoolean()
	@IsOptional()
	@ApiProperty({ example: true, required: false })
	enabled: boolean;
}
