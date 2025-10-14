import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { RoleEnum, RoleKey } from "src/common/enums/role.enum";

export class AddPermissionsByRole{
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ required: true, example: 1 })
    userId: number;

    @IsEnum(RoleEnum)
    @IsNotEmpty()
    @ApiProperty({ required: true, example: RoleEnum.owner })
    role: RoleKey;
}