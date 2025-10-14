import { forwardRef, Inject, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "src/users/users.module";
import { WsJwtGuard } from "src/common/guards/wss.guard";
import { EmailModule } from "src/email/email.module";
import { BranchModule } from "src/branch/branch.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		JwtModule.register({
			secret: "secret",
			signOptions: { expiresIn: "30s" },
		}),
		forwardRef(() => UsersModule),
		forwardRef(() => EmailModule),
		forwardRef(() => BranchModule),
	],
	controllers: [AuthController],
	providers: [AuthService, WsJwtGuard],
	exports: [WsJwtGuard, JwtModule, AuthService],
})
export class AuthModule {}
