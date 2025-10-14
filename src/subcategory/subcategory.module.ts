import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Subcategory } from "./entities/subcategory.entity";
import { SubcategoryService } from "./subcategory.service";
import { ClsModule } from "nestjs-cls";
import { CategoryModule } from "src/category/category.module";
import { UploadModule } from "src/upload/upload.module";
import { SubcategoryController } from "./subcategory.controller";
import { ProductModule } from "src/product/product.module";
import { MenuModule } from "src/menu/menu.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([Subcategory]),
		ClsModule,
		forwardRef(() => CategoryModule),
		forwardRef(() => UploadModule),
		forwardRef(() => ProductModule),
		forwardRef(() => MenuModule),
	],
	controllers: [SubcategoryController],
	providers: [SubcategoryService],
	exports: [SubcategoryService],
})
export class SubcategoryModule {}
