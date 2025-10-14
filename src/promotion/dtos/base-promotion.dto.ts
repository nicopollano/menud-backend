import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsString, IsEnum, IsNotEmpty } from "class-validator";
import { Days } from "src/common/enums/days.enum";
import { ToBoolean } from "src/common/tools/to-boolean.tool";

export class BasePromotionDTO {
	@IsNumber()
	@ApiProperty()
	menuId: number;

	@IsString()
	@ApiProperty({ example: "25% descuento con QR" })
	title: string;

	@IsString()
	@ApiProperty({ example: "pagando mas llevas menos" })
	description: string;

	@IsNumber({}, { each: true })
	@ApiProperty({ type: Number, isArray: true, example: [1, 2, 3] })
	@Transform(({ value }) => {
		if (typeof value === "string") {
			try {
				return JSON.parse(value).map(Number);
			} catch {
				const cleaned = value.replace(/\[|\]/g, "");
				return cleaned.split(",").map(Number);
			}
		}
		return value;
	})
	productIds: number[];

	@IsOptional()
	@IsBoolean()
	@ToBoolean()
	@ApiProperty({ example: true, required: false })
	enabled?: boolean;

	@IsString()
	@ApiProperty({ example: "2025-08-25 19:00" })
	fromTime: string;

	@IsString()
	@ApiProperty()
	toTime: string;

	@IsEnum(Days, { each: true })
	@ApiProperty({ type: Number, isArray: true, example: [Days.Monday, Days.Tuesday] })
	@Transform(({ value }) => {
		if (typeof value === "string") {
			try {
				return JSON.parse(value).map(Number);
			} catch {
				const cleaned = value.replace(/\[|\]/g, "");
				return cleaned.split(",").map(Number);
			}
		}
		return value;
	})
	days: Days[];
}
