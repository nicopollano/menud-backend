import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { AddMemberToBranchDTO } from "./add-member-to-branch.dto";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { BaseMemberToBranchSuperAdminDTO } from "./base-member-to-branch-super-admin.dto";
import { StatusEnum } from "src/common/enums/status.enum";
import { ToBoolean } from "src/common/tools/to-boolean.tool";

export class UpdateUserMemberSuperAdminDTO extends PartialType(BaseMemberToBranchSuperAdminDTO) {
	@IsOptional()
	@IsEnum(StatusEnum)
	@ApiProperty({ enum: StatusEnum, example: StatusEnum.ACTIVE })
	status: StatusEnum;

	@IsNotEmpty()
	@IsString()
	email: string;

	@IsNotEmpty()
	@IsBoolean()
	@ToBoolean()
	@IsOptional()
	@ApiProperty({ example: true })
	enabled: boolean;
}
