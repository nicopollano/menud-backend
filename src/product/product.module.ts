import { forwardRef, Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { CategoryModule } from "src/category/category.module";
import { UploadModule } from "src/upload/upload.module";
import { SubcategoryModule } from "src/subcategory/subcategory.module";
import { MenuModule } from "src/menu/menu.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([Product]),
		CategoryModule,
		forwardRef(() => UploadModule),
		forwardRef(() => SubcategoryModule),
		forwardRef(() => CategoryModule),
		forwardRef(() => MenuModule),
	],
	controllers: [ProductController],
	providers: [ProductService],
	exports: [ProductService],
})
export class ProductModule {}
