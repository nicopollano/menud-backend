import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class MoveBranchDTO {
	@IsNumber()
	@IsNotEmpty()
	@ApiProperty({ required: true })
	toBusinessId: number;
}
