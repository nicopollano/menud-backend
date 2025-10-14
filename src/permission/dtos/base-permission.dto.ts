import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum } from "class-validator";
import { Actions } from "src/common/enums/actions.enum";
import { ModuleEnum } from "src/common/enums/modules.enum";

export class BasePermissionsDTO{
    @IsEnum(ModuleEnum)
    @ApiProperty({ example: ModuleEnum.BUSINESSES, enum: ModuleEnum })
    module: ModuleEnum;

    @IsArray()
    @IsEnum(Actions)
    @ApiProperty({ example:  [Actions.CREATE, Actions.LIST], enum: Actions, isArray: true })
    actions: Actions[];
}