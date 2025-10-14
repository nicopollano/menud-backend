import { forwardRef, Module } from "@nestjs/common";
import { SummaryService } from "./summary.service";
import { SummaryController } from "./summary.controller";
import { OrdersModule } from "src/orders/orders.module";
import { ProductModule } from "src/product/product.module";
import { JwtModule } from "@nestjs/jwt";
import { BranchModule } from "src/branch/branch.module";
import { UsersModule } from "src/users/users.module";

@Module({
	imports: [forwardRef(() => OrdersModule), forwardRef(() => ProductModule), forwardRef(() => BranchModule), forwardRef(() => UsersModule)],
	providers: [SummaryService],
	controllers: [SummaryController],
	exports: [SummaryService],
})
export class SummaryModule {}
