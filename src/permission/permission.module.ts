import { forwardRef, Module } from "@nestjs/common";
import { PermissionService } from "./permission.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Permission } from "./entities/permission.entity";
import { UsersModule } from "src/users/users.module";
import { PermissionController } from "./permission.controller";
import { MemberModule } from "src/member/member.module";
import { BusinessModule } from "src/business/business.module";

@Module({
    imports:[
        TypeOrmModule.forFeature([Permission]),
        forwardRef(()=> UsersModule),
        forwardRef(()=> MemberModule),
        forwardRef(()=> BusinessModule),
    ],
    controllers: [PermissionController],
    providers: [PermissionService],
    exports: [PermissionService]
})
export class PermissionModule {}