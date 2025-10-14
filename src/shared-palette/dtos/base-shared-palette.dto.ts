import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";
import { ToBoolean } from "src/common/tools/to-boolean.tool";

export class BaseSharedPaletteDTO {
	@IsString()
	@ApiProperty({ example: "1" })
	color1: string;

	@IsString()
	@ApiProperty({ example: "1" })
	color2: string;

	@IsString()
	@ApiProperty({ example: "1" })
	color3: string;

	@IsBoolean()
	@IsOptional()
	@ToBoolean()
	@ApiProperty({ example: true })
	enabled: boolean;
}
