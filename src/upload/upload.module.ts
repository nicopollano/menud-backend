import { forwardRef, Module } from "@nestjs/common";
import { UploadController } from "./upload.controller";
import { UploadService } from "./upload.service";
import { BusinessModule } from "src/business/business.module";
import { BranchModule } from "src/branch/branch.module";

@Module({
	imports: [forwardRef(() => UploadModule), forwardRef(() => BusinessModule), forwardRef(() => BranchModule)],
	controllers: [UploadController],
	providers: [UploadService],
	exports: [UploadService],
})
export class UploadModule {}
