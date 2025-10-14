import { ApiOperation, ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CreateBusinessDTO } from "src/business/dtos/create-business.dto";
import { BaseSubscriptionDTO } from "./base-subscription.dto";

export class CreateSubscriptionDTO extends BaseSubscriptionDTO {}
