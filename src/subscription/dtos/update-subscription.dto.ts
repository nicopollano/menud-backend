import { ApiProperty, PartialType } from "@nestjs/swagger";
import { BaseSubscriptionDTO } from "./base-subscription.dto";
import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateSubscriptionDTO extends PartialType(BaseSubscriptionDTO) {}