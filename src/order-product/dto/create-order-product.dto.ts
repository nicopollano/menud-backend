import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { CreateOrderDto } from "src/orders/dto/create-order.dto";
import { Type } from "class-transformer";

export class CreateOrderProductDto {
	@ApiProperty({ type: Number, description: "orderId" })
	@IsNumber()
	@IsNotEmpty()
	orderId: number;

	@ApiProperty({ type: Number, description: "productId" })
	@IsNumber()
	@IsNotEmpty()
	productId: number;

	@ApiProperty({ type: Number, description: "quantity" })
	@IsNumber()
	@IsNotEmpty()
	quantity: number;

	@ApiProperty({ type: String, description: "note" })
	@IsString()
	note: String;
}

export class CreateOrderDTO extends CreateOrderDto {
	@ApiProperty({ example: [{ productId: 1, quantity: 5, note: "sin queso" }] })
	@IsNotEmpty()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ProductDTO)
	products: ProductDTO[];
}

export class ProductDTO {
	@IsNotEmpty()
	@IsNumber()
	productId: number;

	@IsNotEmpty()
	@IsNumber()
	quantity: number;

	@IsString()
	note: string;
}
