import { Controller, forwardRef, Inject, Post, Version } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiProperty } from "@nestjs/swagger";
import { WebSocketServerService } from "./websocket.service";
import { Order } from "src/orders/entities/order.entity";
import { ClsService } from "nestjs-cls";

@Controller("public/websocket-test")
@ApiBearerAuth("Authorization")
export class WebSocketController {
	constructor(
		private webSocketService: WebSocketServerService,
		@Inject(forwardRef(() => ClsService)) private clsService: ClsService,
	) {}

	@ApiOperation({ summary: "Test: simulate new order notification" })
	@Post("create-notification")
	@Version("1")
	async testNotificationOrder() {
		const branch = this.clsService.get("branch");
		return await this.webSocketService.notification("NewOrder", {
			branch,
			clientName: "ramon",
			delivery: true,
			direction: "coca",
			id: 5,
			isActive: true,
			location: "las varillas",
			paymentMethod: "cash",
			phoneNumber: 3533440757,
			postal_code: 5000,
			status: "enabled",
			table: {
				branch,
				enabled: true,
				id: 5,
				nro_mesa: 5,
			},
			total: 5000,
		} as Partial<Order>);
	}
}
