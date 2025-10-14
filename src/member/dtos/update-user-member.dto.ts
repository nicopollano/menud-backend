import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { BaseMemberToBranchDTO } from "./base-member-to-branch.dto";
import { StatusEnum } from "src/common/enums/status.enum";
import { ToBoolean } from "src/common/tools/to-boolean.tool";

export class UpdateUserMemberDTO extends PartialType(BaseMemberToBranchDTO) {
	@IsOptional()
	@IsEnum(StatusEnum)
	@ApiProperty({ enum: StatusEnum, example: StatusEnum.ACTIVE })
	status: StatusEnum;

	@IsNotEmpty()
	@IsString()
	email: string;

	@IsOptional()
	@IsBoolean()
	@ToBoolean()
	@IsOptional()
	@ApiProperty({ example: true })
	enabled: boolean;
}
