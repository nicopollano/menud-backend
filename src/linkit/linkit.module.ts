import { forwardRef, Module } from "@nestjs/common";
import { LinkitService } from "./linkit.service";
import { LinkitController } from "./linkit.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Linkit } from "./entities/linkit.entity";
import { LinkitFindAllController } from "./linkit-find-all.controller";
import { BusinessModule } from "src/business/business.module";

@Module({
	imports: [TypeOrmModule.forFeature([Linkit]), forwardRef(() => BusinessModule)],
	controllers: [LinkitController, LinkitFindAllController],
	providers: [LinkitService],
	exports: [LinkitService],
})
export class LinkitModule {}
