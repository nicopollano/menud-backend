import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, isNotEmpty, IsOptional, IsString } from "class-validator";
import { ToBoolean } from "src/common/tools/to-boolean.tool";

export class CreateTableDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({ example: 1 })
	nro_mesa: string;

	@IsBoolean()
	@ToBoolean()
	@IsNotEmpty()
	@IsOptional()
	enabled: boolean;
}
