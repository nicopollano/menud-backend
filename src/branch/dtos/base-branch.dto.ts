import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CurrencyList } from "src/common/enums/currency.enum";
import { ToBoolean } from "src/common/tools/to-boolean.tool";

export class BaseBranchDTO {
	@ApiProperty({ example: "MacDonals" })
	@IsString()
	name: string;

	@ApiProperty({ required: false })
	@IsString()
	description: string;

	@ApiProperty({ example: "3533440212", required: false })
	@IsString()
	phone: string;

	@ApiProperty({ example: "Bvl. Puente 555", required: false })
	@IsString()
	address: string;

	@ApiProperty({ example: "Cordoba", required: false })
	@IsOptional()
	@IsString()
	location: string;

	@ApiProperty({ example: "Argentina", required: false })
	@IsOptional()
	@IsString()
	country: string;

	@ApiProperty({ enum: CurrencyList, example: CurrencyList.ARS, required: false })
	@IsEnum(CurrencyList)
	currency: CurrencyList;

	@IsBoolean()
	@ToBoolean()
	@IsOptional()
	@ApiProperty({ example: true, required: false })
	enabled: boolean;
}
