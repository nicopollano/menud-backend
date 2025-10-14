import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class BaseFilterSubcategoryDTO {
	@IsNumber()
	@ApiProperty({ example: 1, required: false })
	menuId?: number;

	@IsNumber()
	@ApiProperty({ example: 1, required: false })
	categoryId?: number;
}
