import { forwardRef, Module } from "@nestjs/common";
import { BranchModule } from "src/branch/branch.module";
import { MembersController } from "./member.controller";
import { MemberService } from "./member.service";
import { UsersModule } from "src/users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BranchMember } from "./entities/branch_member.entity";
import { BusinessModule } from "src/business/business.module";
import { AuthModule } from "src/auth/auth.module";
import { PermissionModule } from "src/permission/permission.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([BranchMember]),
		forwardRef(() => BranchModule),
		forwardRef(() => UsersModule),
		forwardRef(() => BusinessModule),
		forwardRef(() => AuthModule),
		forwardRef(() => PermissionModule),
	],
	controllers: [MembersController],
	providers: [MemberService],
	exports: [MemberService],
})
export class MemberModule {}
