import { IsNotEmpty, IsOptional, IsString, ValidateIf } from "class-validator";
import { BasePaletteDTO } from "./base-palette.dto";
import { Transform } from "class-transformer";

export class CreatePaletteDTO extends BasePaletteDTO {
	@IsNotEmpty()
	menuId: number;

	@IsOptional()
	color1: string;

	@IsOptional()
	color2: string;

	@IsOptional()
	color3: string;

	@IsOptional()
	enabled: boolean;
}
