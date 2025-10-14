import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Menu } from "./entities/menu.entity";
import { MenuController } from "./menu.controller";
import { MenuService } from "./menu.service";
import { BranchModule } from "src/branch/branch.module";
import { UploadModule } from "src/upload/upload.module";
import { PaletteModule } from "src/palette/palette.module";
import { ScheduleModule } from "src/schedule/schedule.module";
import { ProductModule } from "src/product/product.module";
import { CategoryModule } from "src/category/category.module";
import { SubcategoryModule } from "src/subcategory/subcategory.module";
import { SharedPaletteModule } from "src/shared-palette/shared-palette.module";
import { PromotionModule } from "src/promotion/promotion.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([Menu]),
		forwardRef(() => BranchModule),
		forwardRef(() => UploadModule),
		forwardRef(() => PaletteModule),
		forwardRef(() => ScheduleModule),
		forwardRef(() => ProductModule),
		forwardRef(() => CategoryModule),
		forwardRef(() => SubcategoryModule),
		forwardRef(() => SharedPaletteModule),
		forwardRef(() => PromotionModule),
	],
	controllers: [MenuController],
	providers: [MenuService],
	exports: [MenuService],
})
export class MenuModule {}
