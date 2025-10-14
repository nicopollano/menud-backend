import { forwardRef, Module } from "@nestjs/common";
import { BusinessService } from "./business.service";
import { UsersModule } from "src/users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Business } from "./entities/business.entity";
import {
  BusinessController,
  BusinessControllerPrivate,
  BusinessSeoController,
} from "./business.controller";
import { BusinessOwner } from "./entities/business-owner.entity";
import { UploadModule } from "src/upload/upload.module";
import { BranchModule } from "src/branch/branch.module";
import { PermissionModule } from "src/permission/permission.module";
import { LinkitModule } from "src/linkit/linkit.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Business, BusinessOwner]),
    forwardRef(() => UsersModule),
    forwardRef(() => UploadModule),
    forwardRef(() => BranchModule),
    forwardRef(() => PermissionModule),
    forwardRef(() => LinkitModule),
  ],
  controllers: [
    BusinessController,
    BusinessControllerPrivate,
    BusinessSeoController,
  ],
  providers: [BusinessService],
  exports: [BusinessService],
})
export class BusinessModule {}
