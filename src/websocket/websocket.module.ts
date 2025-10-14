import { forwardRef, Module } from "@nestjs/common";
import { WebSocketServerService } from "./websocket.service";
import { WebSocketServerGateway } from "./websocker.gateway";
import { SummaryModule } from "src/summary/summary.module";
import { OrdersModule } from "src/orders/orders.module";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { BranchModule } from "src/branch/branch.module";
import { UsersModule } from "src/users/users.module";
import { ClsModule } from "nestjs-cls";
import { WebSocketController } from "./websocket.controller";

@Module({
	controllers: [WebSocketController],
	imports: [
		forwardRef(() => SummaryModule),
		forwardRef(() => OrdersModule),
		forwardRef(() => BranchModule),
		forwardRef(() => UsersModule),
		JwtModule.register({ secret: "secret" }),
		forwardRef(() => ClsModule),
	],
	providers: [WebSocketServerService, WebSocketServerGateway],
	exports: [WebSocketServerService, WebSocketServerGateway],
})
export class WebSocketServerModule {}
