import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CurrencyList } from "src/common/enums/currency.enum";
import { BaseBranchDTO } from "./base-branch.dto";

export class CreateBranchDTO extends BaseBranchDTO {
	@IsNotEmpty()
	name: string;

	@IsOptional()
	description: string;

	@IsOptional()
	phone: string;

	@IsOptional()
	address: string;

	@IsOptional()
	currency: CurrencyList;
}

export class CreateBranchWithLogoDTO extends CreateBranchDTO {
	@IsOptional()
	@IsString()
	@ApiProperty({ type: String, format: "binary", required: false })
	logo?: string;
}
