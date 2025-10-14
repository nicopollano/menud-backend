import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class DeleteOrderProductDto {
	@ApiProperty({ type: Number, description: "orderProductId" })
	@IsNumber()
	@IsNotEmpty()
	orderProductId: number;
}
