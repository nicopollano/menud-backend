import { forwardRef, Module } from "@nestjs/common";
import { ClsModule } from "nestjs-cls";
import { BranchService } from "./branch.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Branch } from "./entities/branch.entity";
import { BusinessModule } from "src/business/business.module";
import { BranchController, BranchControllerPrivate } from "./branch.controller";
import { UploadModule } from "src/upload/upload.module";
import { UsersModule } from "src/users/users.module";
import { MemberModule } from "src/member/member.module";
import { MenuModule } from "src/menu/menu.module";
import { ScheduleModule } from "src/schedule/schedule.module";
import { LinkitModule } from "src/linkit/linkit.module";
import { PermissionModule } from "src/permission/permission.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([Branch]),
		forwardRef(() => ClsModule),
		forwardRef(() => BusinessModule),
		forwardRef(() => UsersModule),
		forwardRef(() => UploadModule),
		forwardRef(() => MemberModule),
		forwardRef(() => MenuModule),
		forwardRef(() => ScheduleModule),
		forwardRef(()=> LinkitModule),
		forwardRef(()=> PermissionModule),
	],
	providers: [BranchService],
	controllers: [BranchController, BranchControllerPrivate],
	exports: [BranchService],
})
export class BranchModule {}
