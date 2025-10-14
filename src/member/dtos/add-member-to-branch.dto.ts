import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsIn, IsNotEmpty, IsNumber, IsObject, IsString, ValidateIf } from "class-validator";
import { BaseMemberToBranchDTO } from "./base-member-to-branch.dto";
import { RoleEnum, RoleKey, RoleList } from "src/common/enums/role.enum";
import { BasePermissionsDTO } from "src/permission/dtos/base-permission.dto";

export class AddMemberToBranchDTO extends BaseMemberToBranchDTO {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsString()
	email: string;

	@IsEnum(RoleEnum)
	@IsIn(Object.values(RoleEnum))
	@ApiProperty({ enum: RoleEnum, example: "employer" })
	role: RoleKey;

	/*
	  TEMPORARY FIELD
	*/
	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	password: string;
}
