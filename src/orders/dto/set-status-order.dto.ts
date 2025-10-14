import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class SetStatusOrderDTO {
	@ApiProperty({ type: Number, description: "orderid" })
	@IsNumber()
	@IsNotEmpty()
	id: number;

	/*@ApiProperty({type: String, description: "pending/inprogress/delivered"})
    @IsNumber()
    @IsNotEmpty()
    status: String;*/
}
