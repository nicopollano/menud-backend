import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ToBoolean } from "src/common/tools/to-boolean.tool";
/*
export class CreateOrderDtoOld {
  @ApiProperty({ type: String, description: 'name' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: Number, description: 'subTotal' })
  @IsNotEmpty()
  subTotal: number;

  @ApiProperty({ type: String, description: 'orderDate' })
  @IsOptional()
  orderDate?: string;
}*/

export class CreateOrderDto {
	@ApiProperty({ type: String, description: "name" })
	@IsString()
	name: String;

	@ApiProperty({ type: Number, example: 1 })
	@IsNumber()
	tableid: number;

	@ApiProperty({ type: String, example: "arturo illia 777", required: false })
	@IsOptional()
	@IsString()
	direction: String;

	@ApiProperty({ type: Number, example: 3533442781, required: false })
	@IsOptional()
	@IsNumber()
	phoneNumber: number;

	@ApiProperty({ type: String, example: "Cordoba", required: false })
	@IsOptional()
	@IsString()
	location: String;

	@ApiProperty({ type: Number, example: 3500 })
	@IsOptional()
	@IsNumber()
	total: number;

	@ApiProperty({ type: Number, example: 5000, required: false })
	@IsOptional()
	@IsNumber()
	postalCode: number;

	@ApiProperty({ type: Boolean, example: false })
	@IsOptional()
	@IsBoolean()
	@ToBoolean()
	delivery: boolean;

	@ApiProperty({ type: String, description: "paymentMethod" })
	@IsString()
	paymentMethod: String;
}
