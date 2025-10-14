import { forwardRef, Module } from "@nestjs/common";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";
import { BusinessModule } from "src/business/business.module";
import { BranchModule } from "src/branch/branch.module";
import { MenuModule } from "src/menu/menu.module";
import { SubscriptionModule } from "src/subscription/subscription.module";

@Module({
	imports: [forwardRef(() => BusinessModule), forwardRef(() => BranchModule), forwardRef(() => MenuModule), forwardRef(() => SubscriptionModule)],
	controllers: [ProfileController],
	providers: [ProfileService],
	exports: [ProfileService],
})
export class ProfileModule {}
