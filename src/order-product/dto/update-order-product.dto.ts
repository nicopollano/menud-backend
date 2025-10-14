import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CreateOrderProductDto } from "./create-order-product.dto";

export class UpdateOrderProductDto {
	@ApiProperty({ type: Number, description: "quantity" })
	@IsNumber()
	@IsNotEmpty()
	quantity: number;

	@ApiProperty({ type: String, description: "note" })
	@IsString()
	@IsNotEmpty()
	note: String;
}
