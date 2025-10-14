import { forwardRef, Module } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";
import { Category } from "./entities/category.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UploadModule } from "src/upload/upload.module";
import { ProductModule } from "src/product/product.module";
import { MenuModule } from "src/menu/menu.module";

@Module({
	imports: [TypeOrmModule.forFeature([Category]), forwardRef(() => UploadModule), forwardRef(() => ProductModule), forwardRef(() => MenuModule)],
	controllers: [CategoryController],
	providers: [CategoryService],
	exports: [CategoryService, TypeOrmModule.forFeature([Category])],
})
export class CategoryModule {}
