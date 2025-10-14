import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber } from "class-validator";
import { BillingCycleEnum } from "src/common/enums/billin-cycle.enum";
import { BillingStatusEnum } from "src/common/enums/billing-status.dto";

export class BaseSubscriptionDTO {
	@IsNumber()
	@ApiProperty()
	planId: number;

	@IsEnum(BillingCycleEnum)
	@ApiProperty({ enum: BillingCycleEnum })
	billingCycle: BillingCycleEnum;
}
