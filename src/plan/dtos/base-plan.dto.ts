import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsString } from "class-validator";
import { PlanEnum } from "src/common/enums/plan.enum";

export class BasePlanDTO {
	@ApiProperty()
	@IsString()
	name: string;

	@ApiProperty()
	@IsString()
	description: string;

	@ApiProperty()
	@IsNumber()
	price: number;

	@ApiProperty()
	@IsNumber()
	maxUsers: number;

	@ApiProperty()
	@IsNumber()
	maxBusinesses: number;

	@ApiProperty()
	@IsNumber()
	maxMenus: number;

	@ApiProperty({ default: false })
	@IsNumber()
	hasProductManagement: boolean;

	@ApiProperty({ default: false })
	@IsNumber()
	hasCustomCategories: boolean;

	@ApiProperty({ default: false })
	@IsNumber()
	hasQrGenerator: boolean;

	@ApiProperty({ default: false })
	@IsNumber()
	hasLinkit: boolean;

	@ApiProperty({ default: false })
	@IsNumber()
	hasRoleSystem: boolean;

	@ApiProperty({ default: false })
	@IsNumber()
	hasAutomaticAlerts: boolean;

	@ApiProperty({ default: false })
	@IsNumber()
	hasAutomaticDarkMode: boolean;

	@ApiProperty({ default: false })
	@IsNumber()
	hasMultiLanguage: boolean;

	@ApiProperty({ default: false })
	@IsNumber()
	hasBackendPanel: boolean;

	@ApiProperty({ default: false })
	@IsNumber()
	hasPrioritySupport: boolean;

	@ApiProperty({ enum: PlanEnum, default: PlanEnum.BASIC })
	@IsEnum(PlanEnum)
	type: PlanEnum;
}
