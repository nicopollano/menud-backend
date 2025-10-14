import { ApiProperty } from "@nestjs/swagger";
import { BaseBusinessDTO } from "./base-business.dto";

export class BusinessesSummaryDTO {
	@ApiProperty({
		description: "Total number of businesses",
		example: 5,
		type: "number",
	})
	totalBusinesses: number;

	@ApiProperty({
		description: "Total number of branches accross all businesses",
		example: 3,
		type: "number",
	})
	totalBranches: number;
}

export class BusinessSummaryDTO {
	@ApiProperty({
		description: "Total number of branches for this specific business",
		example: 3,
		type: "number",
	})
	totalBranches: number;
}

export class BusinessWithSummaryDTO extends BaseBusinessDTO {
	@ApiProperty({
		description: "Summary of this specific business",
		type: BusinessSummaryDTO,
	})
	summary: BusinessSummaryDTO;
}
