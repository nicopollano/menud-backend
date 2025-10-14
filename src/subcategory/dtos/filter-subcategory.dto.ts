import { IsOptional } from "class-validator";
import { BaseFilterSubcategoryDTO } from "./base-filter-subcategory,dto";
import { Transform } from "class-transformer";

export class FilterSubcategoryDTO extends BaseFilterSubcategoryDTO {
	@IsOptional()
	@Transform(({ value }) => Number(value))
	menuId?: number;

	@IsOptional()
	@Transform(({ value }) => Number(value))
	categoryId?: number;
}
