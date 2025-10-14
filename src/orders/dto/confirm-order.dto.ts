import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { OrderProduct } from "src/order-product/entities/order-product.entity";
import { Table } from "src/tables/entities/table.entity";

class ConfirmOrderDtoOld {
	@ApiProperty({ type: Number, description: "orderid" })
	@IsNotEmpty()
	@IsNumber()
	id: number;

	@ApiProperty({ type: String, description: "name" })
	@IsString()
	name: string;

	/*
  @ApiProperty({ type: Number, description: 'total' })
  @IsNotEmpty()
  total: number;
  */

	@ApiProperty({ type: String, description: "paymentMethod" })
	@IsString()
	paymentMethod: String;
}
