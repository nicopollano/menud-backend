import { ApiProperty } from "@nestjs/swagger";

export class ProfileSummaryDTO {
	@ApiProperty({
		description: "Total number of businesses for the user",
		example: 5,
		type: "number",
	})
	totalBusinesses: number;

	@ApiProperty({
		description: "Total number of branches across all businesses for the user",
		example: 12,
		type: "number",
	})
	totalBranches: number;

	@ApiProperty({
		description: "Total number of menus across all branches for the user",
		example: 24,
		type: "number",
	})
	totalMenus: number;
}
