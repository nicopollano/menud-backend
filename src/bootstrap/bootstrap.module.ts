import { Module } from "@nestjs/common";
import { BootstrapService } from "./bootstrap.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Linkit } from "src/linkit/entities/linkit.entity";
import { Business } from "src/business/entities/business.entity";
import { Permission } from "src/permission/entities/permission.entity";
import { User } from "src/users/entities/user.entity";
import { BusinessOwner } from "src/business/entities/business-owner.entity";
import { Plan } from "src/plan/entities/plan.entity";

@Module({
	imports: [TypeOrmModule.forFeature([Business, Linkit, Permission, User, BusinessOwner, Plan])],
	providers: [BootstrapService],
	exports: [BootstrapService],
})
export class BootstrapModule {}
