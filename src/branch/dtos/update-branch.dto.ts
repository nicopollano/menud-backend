import { ApiProperty, PartialType } from "@nestjs/swagger";
import { BaseBranchDTO } from "./base-branch.dto";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CurrencyList } from "src/common/enums/currency.enum";

export class UpdateBranchDTO extends PartialType(BaseBranchDTO) {
	@IsOptional()
	@ApiProperty({ required: false })
	@IsEnum(CurrencyList)
	currency?: CurrencyList;
}

export class UpdateBranchWithLogoDTO extends UpdateBranchDTO {
	@IsOptional()
	@IsString()
	@ApiProperty({ type: String, format: "binary", required: false })
	logo?: string;
}
