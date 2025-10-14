import { IsArray, IsEnum, IsNumber, IsString } from "class-validator";
import { BasePermissionsDTO } from "./base-permission.dto";
import { ModuleEnum } from "src/common/enums/modules.enum";
import { ApiProperty } from "@nestjs/swagger";
import { Actions } from "src/common/enums/actions.enum";

export class CreatePermissionDTO extends BasePermissionsDTO {
    @IsNumber()
    @ApiProperty({ example: 1, required: false })
    businessOwnerId?: number;

    @IsNumber()
    @ApiProperty({ example: 1, required: false })
    branchMemberId?: number;

    @IsEnum(ModuleEnum)
    @ApiProperty({ example: ModuleEnum.BUSINESSES, enum: ModuleEnum })
    module: ModuleEnum;

    @IsArray()
    @IsEnum(Actions)
    @ApiProperty({ example:  [Actions.CREATE, Actions.LIST], enum: Actions, isArray: true })
    actions: Actions[];

}