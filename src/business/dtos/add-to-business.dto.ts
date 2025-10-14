import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class AddToBusinessDTO {
	@IsNumber()
	@IsNotEmpty()
	@ApiProperty({ example: 1 })
	businessId: number;

	@IsNumber()
	@IsNotEmpty()
	@ApiProperty({ example: 1 })
	userId: number;
}
