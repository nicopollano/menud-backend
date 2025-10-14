import { forwardRef, Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController, UsersControllerPrivate } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { SubscriptionModule } from "src/subscription/subscription.module";
import { BranchModule } from "src/branch/branch.module";
import { ClsModule } from "nestjs-cls";
import { EmailModule } from "src/email/email.module";
import { BusinessModule } from "src/business/business.module";
import { UploadModule } from "src/upload/upload.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		forwardRef(() => SubscriptionModule),
		forwardRef(() => BranchModule),
		forwardRef(() => ClsModule),
		forwardRef(() => EmailModule),
		forwardRef(() => BusinessModule),
		forwardRef(() => UploadModule),
		forwardRef(() => SubscriptionModule),
	],
	controllers: [UsersController, UsersControllerPrivate],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
