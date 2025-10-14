import { Controller, Post, Body, Delete, Param, Put, Get, Query, NotFoundException, Version, Patch } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { UpdateOrderDTO } from "./dto/update-order.dto";
import { Public } from "src/common/decorators/public.decorator";
import { SetStatusOrderDTO } from "./dto/set-status-order.dto";
import { BadRequestException_C, NotFoundException_C } from "src/common/Custom/http-response";
import { ErrorList } from "src/common/enums/error.enum";
import { Roles } from "src/common/decorators/role.decorator";
import { CreateOrderDTO } from "src/order-product/dto/create-order-product.dto";
import { validateDTO } from "src/common/tools/validate-dto.tool";
import { Order } from "./entities/order.entity";

@ApiTags("Orders")
@Controller("public/businesses/{businessid}/branches/{branchid}/order")
@ApiParam({ name: "businessid", example: "{{businessid}}", required: true, description: "Business ID" })
@ApiParam({ name: "branchid", example: "{{branchid}}", required: true, description: "Branch ID" })
@ApiBearerAuth("Authorization")
export class OrdersController {
	constructor(private readonly ordersService: OrdersService) {}

	//@Public()
	@ApiOperation({ summary: "Create a order [DEPRECATED]", deprecated: true })
	@Get()
	@Version("1")
	async init() {
		return await this.ordersService.init();
	}

	@Public()
	@ApiOperation({ summary: "Find a order by id" })
	@Get("find/:id")
	@Version("1")
	async findOne(@Param("id") id: number) {
		const order = await this.ordersService.findOne(id);
		if (!order.isActive) throw new NotFoundException_C(ErrorList.OrderNotFound);

		const order_filtered = await this.ordersService.filterOrder(order);

		if (!order_filtered.delivery) {
			const { phoneNumber, location, postal_code, direction, table, ...rest } = order_filtered;
			return rest;
		}
		return order_filtered;
	}

	//@Public()
	@ApiOperation({ summary: "Create a new order" })
	@ApiBody({
		description: "",
		type: CreateOrderDTO,
		examples: {
			example1: {
				summary: "Simple order [Without delivery]",
				value: { name: "ramon", tableid: 1, delivery: false, paymentMethod: "Cash", total: 3500, products: [{ productId: 1, quantity: 5, note: "sin queso" }] },
			},
			example2: {
				summary: "Delivery Order",
				value: {
					name: "ramon",
					tableid: 1,
					delivery: true,
					paymentMethod: "Cash",
					total: 3500,
					direction: "arturo illia 116",
					phoneNumber: 3533440727,
					location: "Cordoba",
					postalCode: 5000,
					products: [{ productId: 1, quantity: 5, note: "sin queso" }],
				},
			},
		},
	})
	@Post("create-order")
	@Version("1")
	async confirm(@Body() confirmOrderDto: CreateOrderDTO) {
		await validateDTO(confirmOrderDto, CreateOrderDTO);
		return await this.ordersService.confirm(confirmOrderDto);
	}

	//@Public()
	@ApiOperation({ summary: "Delete an existing Order" })
	@Delete(":id")
	@Version("1")
	async delete(@Param("id") id: number) {
		return await this.ordersService.delete(id);
	}

	//@Public()
	@ApiOperation({ summary: "Update Order values" })
	@ApiBody({ type: UpdateOrderDTO })
	@Patch(":id")
	@Version("1")
	async update(@Param("id") id: number, @Body() updateOrderDTO: UpdateOrderDTO) {
		await validateDTO(updateOrderDTO, UpdateOrderDTO);
		return await this.ordersService.update(id, updateOrderDTO);
	}

	//@Public()
	@ApiOperation({ summary: "Update Order status to defined" })
	@ApiQuery({ name: "status", required: true, enum: ["pending", "inprogress", "delivered"] })
	@Post("setstatus/:id")
	@Version("1")
	async setStatus(@Param("id") id: number, @Query("status") status: string) {
		const fKeys = {
			pending: async (id) => {
				return await this.ordersService.pending(id);
			},
			inprogress: async (id) => {
				return await this.ordersService.inprogress(id);
			},
			delivered: async (id) => {
				return await this.ordersService.delivered(id);
			},
		};

		if (Object.keys(fKeys).includes(status)) {
			return await fKeys[status](id);
		}

		throw new NotFoundException("Bad request");
	}

	//@Public()
	@ApiOperation({ summary: "Get all order with defined status." })
	@ApiParam({ name: "type", required: true, enum: ["order", "delivery"] })
	@ApiQuery({ name: "status", required: true, enum: ["pending", "inprogress", "delivered", "all"], type: String })
	@Get("findstatus/:type")
	@Version("1")
	async findByStatus(@Param("type") type, @Query("status") status: string) {
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
			return orders.map(({ phoneNumber, location, postal_code, direction, table, ...order }) => {
				if (order.delivery) {
					return {
						phoneNumber,
						location,
						postal_code,
						direction,
						...order,
					};
				}
				return {
					...order,
					table,
				};
			});
		}

		throw new NotFoundException("Bad request");
	}

	//@Public()
	@ApiOperation({ deprecated: true, summary: "[ DEPRECATED ]" })
	@ApiQuery({ name: "shipping", required: true, enum: ["Delivery", "InPlace"], type: String })
	@Get("shipping")
	@Version("1")
	async shipping(@Query("shipping") shipping: string) {
		throw new BadRequestException_C(ErrorList.Deprecated);

		const fkey = {
			delivery: async () => {
				return await this.ordersService.shipping(true);
			},
			Inplace: async () => {
				return await this.ordersService.shipping(false);
			},
		};

		if (Object.keys(fkey).includes(shipping)) {
			const orders: Order[] = await fkey[shipping]();
			return orders.map(({ phoneNumber, location, postal_code, direction, ...order }) => {
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
			});
		}

		throw new NotFoundException("Bad request");
	}
}
