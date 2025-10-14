import { ApiProperty } from "@nestjs/swagger";
import { BaseBranchDTO } from "./base-branch.dto";

export class BranchesSummaryDTO {
	@ApiProperty({
		description: "Total number of branches in the business",
		example: 3,
		type: "number",
	})
	totalBranches: number;

	@ApiProperty({
		description: "Total number of menus across all branches",
		example: 8,
		type: "number",
	})
	totalMenus: number;
}

export class BranchSummaryDTO {
	@ApiProperty({
		description: "Total number of menus for this specific branch",
		example: 3,
		type: "number",
	})
	totalMenus: number;
}

export class BranchWithSummaryDTO extends BaseBranchDTO {
	@ApiProperty({
		description: "Summary of this specific branch",
		type: BranchSummaryDTO,
	})
	summary: BranchSummaryDTO;
}
