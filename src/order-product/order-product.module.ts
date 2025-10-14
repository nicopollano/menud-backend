import { forwardRef, Module } from "@nestjs/common";
import { OrderProductService } from "./order-product.service";
import { OrdersModule } from "src/orders/orders.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderProduct } from "./entities/order-product.entity";
import { ProductModule } from "src/product/product.module";

import { Order } from "src/orders/entities/order.entity";
import { AuthModule } from "src/auth/auth.module";
import { OrderProductController } from "./order-product.controller";

@Module({
	imports: [forwardRef(() => OrdersModule), TypeOrmModule.forFeature([OrderProduct]), TypeOrmModule.forFeature([Order]), ProductModule, AuthModule],
	//controllers: [OrderProductController],
	providers: [OrderProductService],
	exports: [OrderProductService],
})
export class OrderProductModule {}
