import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";
import { BadRequestException_C } from "src/common/Custom/http-response";
import { ErrorList } from "src/common/enums/error.enum";

export class FilterProductParamsDTO {
	@IsNumber()
	@IsOptional()
	@ApiProperty({ example: 1, required: false })
	@Transform(({ value }) => Number(value))
	categoryId?: number;

	@IsNumber()
	@IsOptional()
	@ApiProperty({ example: 1, required: false })
	@Transform(({ value }) => Number(value))
	menuId?: number;

	@IsNumber()
	@IsOptional()
	@ApiProperty({ example: 1, required: false })
	@Transform(({ value }) => Number(value))
	subcategoryId?: number;

	@IsString()
	@IsOptional()
	@Transform(({ value }) => Number(value))
	search?: string;

	@IsArray()
	@IsNumber({}, { each: true })
	@Transform(({ value }) => {
		const array = value.split(",").map(Number);
		if (array.length !== 2 || array.some(isNaN)) {
			throw new BadRequestException_C(ErrorList.ProductFilterArrayPriceRangeLength);
		}
		return array;
	})
	@IsOptional()
	priceRange: [number, number];
}
