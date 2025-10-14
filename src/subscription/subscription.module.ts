import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Subscription } from "./entities/subscription.entity";
import { UsersModule } from "src/users/users.module";
import { SubscriptionService } from "./substription.service";
import { BusinessModule } from "src/business/business.module";
import { PlanModule } from "src/plan/plan.module";
import { SubscriptionPrivateController } from "./subscription-private.controller";

@Module({
	imports: [TypeOrmModule.forFeature([Subscription]), forwardRef(() => UsersModule), forwardRef(() => BusinessModule), forwardRef(() => PlanModule)],
	controllers: [SubscriptionPrivateController],
	providers: [SubscriptionService],
	exports: [SubscriptionService],
})
export class SubscriptionModule {}
