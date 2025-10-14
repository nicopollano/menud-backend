import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { BasePermissionsDTO } from "./base-permission.dto";
import { ModuleEnum } from "src/common/enums/modules.enum";
import { ApiProperty } from "@nestjs/swagger";
import { Actions } from "src/common/enums/actions.enum";
import { RoleEnum, RoleKey } from "src/common/enums/role.enum";

export class UpdatePermissionDTO {
    @IsEnum(RoleEnum)
    @IsNotEmpty()
    @ApiProperty({ example: RoleEnum.manager, required: true })
    role: RoleKey;
}