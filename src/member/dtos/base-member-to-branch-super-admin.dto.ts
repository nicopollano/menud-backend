import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsEnum, IsIn, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateIf } from "class-validator";
import { RoleEnum, RoleKey, RoleList } from "src/common/enums/role.enum";
import { StatusEnum } from "src/common/enums/status.enum";
import { ToBoolean } from "src/common/tools/to-boolean.tool";
import { BasePermissionsDTO } from "src/permission/dtos/base-permission.dto";

export class BaseMemberToBranchSuperAdminDTO {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ example: "Nicolas", required: true })
	name: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({ example: "nico_pollano@hotmail.com", required: true })
	email: string;

	@IsString()
	@IsIn(["employer"])
	@ApiProperty({ enum: RoleEnum, example: "employer" })
	role: RoleKey;

	@IsBoolean()
	@ToBoolean()
	@IsOptional()
	@ApiProperty({ example: true, required: false })
	enabled: boolean;

	@IsEnum(StatusEnum)
	@IsOptional()
	status: StatusEnum;

	/*
	  TEMPORARY FIELD
	*/
	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	password: string;
}
