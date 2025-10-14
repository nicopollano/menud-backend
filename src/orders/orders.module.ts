import { forwardRef, Module } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { Table } from "src/tables/entities/table.entity";
import { TablesService } from "src/tables/tables.service";
import { TablesModule } from "src/tables/tables.module";
import { OrderProductModule } from "src/order-product/order-product.module";
import { ProductModule } from "src/product/product.module";
import { APP_GUARD } from "@nestjs/core";
import { WsJwtGuard } from "src/common/guards/wss.guard";
import { JwtModule } from "@nestjs/jwt";
import { BranchModule } from "src/branch/branch.module";
import { UsersModule } from "src/users/users.module";
import { WebSocketServerModule } from "src/websocket/websocket.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([Order, Table]),
		forwardRef(() => TablesModule),
		forwardRef(() => OrderProductModule),
		forwardRef(() => ProductModule),
		forwardRef(() => BranchModule),
		forwardRef(() => UsersModule),
		forwardRef(() => WebSocketServerModule),
		JwtModule.register({ secret: "secret" }),
	],
	controllers: [OrdersController],
	providers: [OrdersService],
	exports: [OrdersService],
})
export class OrdersModule {}
