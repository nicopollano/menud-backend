import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Promotion } from "./entities/promotion.entity";
import { ProductModule } from "src/product/product.module";
import { PromotionController } from "./promotion.controller";
import { PromotionService } from "./promotion.service";
import { ScheduleModule } from "src/schedule/schedule.module";
import { MenuModule } from "src/menu/menu.module";
import { UploadModule } from "src/upload/upload.module";

@Module({
	imports: [TypeOrmModule.forFeature([Promotion]), forwardRef(()=> UploadModule),forwardRef(()=> MenuModule), forwardRef(() => ProductModule), forwardRef(() => ScheduleModule)],
	controllers: [PromotionController],
	providers: [PromotionService],
	exports: [PromotionService],
})
export class PromotionModule {}
