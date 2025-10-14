import { PartialType } from "@nestjs/swagger"
import { BasePlanDTO } from "./base-plan.dto"

export class UpdatePlanDTO extends PartialType(BasePlanDTO) {}