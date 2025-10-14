import { Transform } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional } from "class-validator";
import { ToBoolean } from "src/common/tools/to-boolean.tool";

export class FilterFindAllDTO {
	@IsOptional()
	@IsNumber()
	@Transform(({ value }) => Number(value))
	menuId: number;

	@IsOptional()
	@ToBoolean()
	@IsBoolean()
	enabled?: boolean;
}
