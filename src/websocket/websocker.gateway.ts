import { forwardRef, Inject, Injectable, UseFilters, UseGuards, UseInterceptors } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { BadRequestException_C, NotFoundException_C } from "src/common/Custom/http-response";
import { wsResponse } from "src/common/Custom/ws-response";
import { ErrorList } from "src/common/enums/error.enum";
import { WsExceptionsFilter } from "src/common/filters/ws-exception.filter";
import { WsJwtGuard } from "src/common/guards/wss.guard";
import { WebSocketInterceptor } from "src/common/interceptors/ws.interceptor";
import { validateDTO } from "src/common/tools/validate-dto.tool";
import { UpdateOrderDTO } from "src/orders/dto/update-order.dto";
import { FindStatusWSDTO } from "src/orders/dto/ws/findstatus-ws.dto";
import { Order } from "src/orders/entities/order.entity";
import { OrdersService } from "src/orders/orders.service";
import { SoldMarginWSDTO } from "src/summary/dtos/websocket/soldmargin.dto";
import { SummaryService } from "src/summary/summary.service";

@WebSocketGateway({
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
})
@UseInterceptors(WebSocketInterceptor)
@UseGuards(WsJwtGuard)
@UseFilters(WsExceptionsFilter)
@Injectable()
export class WebSocketServerGateway {
	@WebSocketServer() server: Server;
	private definedEvents = new Set<string>();
	constructor(
		@Inject(forwardRef(() => OrdersService)) private readonly ordersService: OrdersService,
		@Inject(forwardRef(() => SummaryService)) private readonly summaryService: SummaryService,
		private reflector: Reflector,
	) {}

	onModuleInit() {
		const port = parseInt(process.env.WEBSOCKET_PORT);
		this.server.listen(port);
	}

	afterInit() {
		// Extrae los eventos definidos automáticamente
		const prototype = Object.getPrototypeOf(this);
		Object.getOwnPropertyNames(prototype).forEach((methodName) => {
			if (methodName == "server") return;
			const event = this.reflector.get<string>("message", prototype[methodName]);
			if (event) {
				this.definedEvents.add(event);
			}
		});
	}

	handleConnection(socket: Socket) {
		socket.onAny((eventName, ...arg) => {
			if (this.definedEvents.has(eventName)) return;
			wsResponse(socket, new BadRequestException_C(ErrorList.WebScoketInvalid), true);
		});
	}

	broadcastMessage(msg: string, context: string, data: any) {
		this.server.emit("notification", {
			context,
			data,
		});
	}

	/************************************************************************************************
	 *************************************************************************************************
	 *                                         ORDERS                                                *
	 *************************************************************************************************
	 ************************************************************************************************/

	@SubscribeMessage("findone")
	async findOne(@ConnectedSocket() client, @MessageBody("id") id: number) {
		try {
			const order = await this.ordersService.findOne(id);
			if (!order.isActive) throw new NotFoundException_C(ErrorList.OrderNotFound);

			const order_filtered = await this.ordersService.filterOrder(order);

			if (!order_filtered.delivery) {
				const { phoneNumber, location, postal_code, direction, ...rest } = order_filtered;
				wsResponse(client, rest, false);
				return;
			}
			wsResponse(client, order_filtered, false);
		} catch (err) {
			wsResponse(client, err, true);
		}
	}

	//@Public()
	@SubscribeMessage("update")
	async update(@ConnectedSocket() client, @MessageBody() updateOrderDTO: UpdateOrderDTO) {
		try {
			await validateDTO(updateOrderDTO, UpdateOrderDTO);
			//wsResponse(client, await this.ordersService.update(updateOrderDTO), false);
		} catch (err) {
			wsResponse(client, err, true);
		}
	}

	//@Public()
	@SubscribeMessage("findstatus")
	async findByStatus(@ConnectedSocket() client, @MessageBody() data: FindStatusWSDTO) {
		try {
			const { status, type } = data;
			const fKeys = {
				pending: async (delivery) => {
					return await this.ordersService.findAllPending(delivery);
				},
				inprogress: async (delivery) => {
					return await this.ordersService.findAllInProgress(delivery);
				},
				delivered: async (delivery) => {
					return await this.ordersService.findAllDelivered(delivery);
				},
				all: async (delivery) => {
					return (await this.ordersService.findAll(delivery)).map(({ isActive, ...rest }) => rest);
				},
			};

			let delivery = false;

			const typeKeys = ["order", "delivery"];

			if (!typeKeys.includes(type)) throw new BadRequestException_C(ErrorList.OrderBadRequest);

			if (type == "delivery") delivery = true;

			if (Object.keys(fKeys).includes(status)) {
				const orders: Order[] = await fKeys[status](delivery);
				wsResponse(
					client,
					orders.map(({ phoneNumber, location, postal_code, direction, ...order }) => {
						if (order.delivery) {
							return {
								phoneNumber,
								location,
								postal_code,
								direction,
								...order,
							};
						}
						return order;
					}),
					false,
				);
			}
		} catch (err) {
			wsResponse(client, new BadRequestException_C(ErrorList.OrderBadRequest), true);
		}
	}

	/************************************************************************************************
	 *************************************************************************************************
	 *                                         SUMMARY                                               *
	 *************************************************************************************************
	 ************************************************************************************************/

	@SubscribeMessage("earning")
	async earning(@ConnectedSocket() client: Socket) {
		try {
			wsResponse(client, await this.summaryService.earningSummary(), false);
		} catch (err) {
			wsResponse(client, err, true);
		}
	}

	@SubscribeMessage("orders")
	async orders(@ConnectedSocket() client: Socket) {
		try {
			wsResponse(client, await this.summaryService.totalOrders(), false);
		} catch (err) {
			wsResponse(client, err, true);
		}
	}

	@SubscribeMessage("delivered")
	//@Public()
	async delivered(@MessageBody("type") type: string, @ConnectedSocket() client: Socket) {
		try {
			switch (type) {
				case "Total":
					wsResponse(client, await this.summaryService.totalDelivery(), false);
				case "GraphicSummary":
					wsResponse(client, await this.summaryService.totalDeliveryGaphicSummary(), false);
			}
		} catch (err) {
			wsResponse(client, err, true);
		}
	}

	@SubscribeMessage("sold")
	async sales(@ConnectedSocket() client: Socket) {
		try {
			wsResponse(client, await this.summaryService.totalSales(), false);
		} catch (err) {
			wsResponse(client, err, true);
		}
	}

	@SubscribeMessage("soldmargin")
	async soldSchedule(@ConnectedSocket() client: Socket, @MessageBody() data: SoldMarginWSDTO) {
		const { from, to } = data;
		const fromDate = new Date(from);
		const toDate = new Date(to);

		try {
			if (!fromDate.getDate()) throw new BadRequestException_C(ErrorList.SummaryBadRequest);
			wsResponse(client, await this.summaryService.soldMargin(fromDate, toDate), false);
		} catch (err) {
			wsResponse(client, err, true);
		}
	}

	@SubscribeMessage("top-seller")
	//@Public()
	async decrecientTopSeller(@ConnectedSocket() client: Socket) {
		try {
			wsResponse(client, await this.summaryService.decrecientTopSeller(), false);
		} catch (err) {
			wsResponse(client, err, true);
		}
	}
}
