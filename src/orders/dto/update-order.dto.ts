import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ToBoolean } from "src/common/tools/to-boolean.tool";

export class UpdateOrderDTO {
	@ApiProperty({ type: String, description: "paymentMethod", required: false })
	@IsOptional()
	@IsString()
	paymentMethod: String;

	@ApiProperty({ type: String, description: "clientName", required: false })
	@IsOptional()
	@IsString()
	clientName: String;

	@ApiProperty({ type: Number, description: "tableid", required: false })
	@IsOptional()
	@IsNumber()
	tableid: number;

	@ApiProperty({ type: String, description: "direction", required: false })
	@IsOptional()
	@IsString()
	direction: String;

	@ApiProperty({ type: Number, description: "phoneNumber", required: false })
	@IsOptional()
	@IsNumber()
	phoneNumber: number;

	@ApiProperty({ type: String, description: "location", required: false })
	@IsOptional()
	@IsString()
	location: String;

	@ApiProperty({ type: Number, description: "postalCode", required: false })
	@IsOptional()
	@IsNumber()
	postalCode: number;

	@ApiProperty({ type: Boolean, description: "delivery", required: false })
	@IsOptional()
	@IsBoolean()
	@ToBoolean()
	delivery: boolean;
}
