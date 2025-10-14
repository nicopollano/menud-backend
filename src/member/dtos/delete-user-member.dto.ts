import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, ValidateIf } from "class-validator";

export class DeleteUserMemberDTO {
	@IsNotEmpty()
	@IsNumber()
	@ApiProperty({ example: 1 })
	userId: number;

	@IsNotEmpty()
	@IsNumber()
	@ApiProperty({ example: 1 })
	branchId: number;
}
