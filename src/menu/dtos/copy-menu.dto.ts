import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";
import { execArgv } from "process";

export class CopyMenuDTO {
	@IsNotEmpty()
	@IsNumber()
	@ApiProperty({ example: 1, required: true })
	toBranchId: number;
}
