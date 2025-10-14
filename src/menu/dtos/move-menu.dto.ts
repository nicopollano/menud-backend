import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class MoveMenuDTO {
	@IsNotEmpty()
	@IsNumber()
	@ApiProperty({ example: 1, required: true })
	toBranchId: number;
}
