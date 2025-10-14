import { forwardRef, Inject } from "@nestjs/common";
import { OrdersService } from "src/orders/orders.service";
import { ScheduleOrdersSoldDTO } from "./dtos/schedule-orders-sold.dto";
import { ProductService } from "src/product/product.service";
import { Order } from "src/orders/entities/order.entity";

export class SummaryService {
	constructor(
		@Inject(forwardRef(() => OrdersService)) private ordersService: OrdersService,
		@Inject(forwardRef(() => ProductService)) private productService: ProductService,
	) {}

	async earningSummary() {
		const orders_nodelivery = await this.ordersService.findAll(false);
		const orders_delivery = await this.ordersService.findAll(true);

		const orders: Order[] = [];

		orders.push(...orders_delivery);
		orders.push(...orders_nodelivery);

		let total = 0;

		orders.forEach((o) => (total += o.total));

		return total;
	}

	async totalOrders() {
		const count = await this.ordersService.count();

		return count;
	}

	async totalDelivery() {
		const count = await this.ordersService.countDelivery();

		return count;
	}

	async totalDeliveryGaphicSummary() {
		const counts = await this.ordersService.countDeliveryGraphic();
		return counts;
	}

	async totalSales() {
		const count = await this.ordersService.totalSales();

		return count;
	}

	async soldMargin(from: Date, to: Date) {
		const orders_nodelivery = await this.ordersService.findAll(false);
		const orders_delivery = await this.ordersService.findAll(true);

		const orders: Order[] = [];

		orders.push(...orders_delivery);
		orders.push(...orders_nodelivery);

		let ordersTargets: ScheduleOrdersSoldDTO[] = [];

		orders.forEach((o) => {
			let exist = false;
			let discard = true;
			if (from < o.orderDate && to > o.orderDate) {
				ordersTargets.forEach((t) => {
					if (t.date.getFullYear() == o.orderDate.getFullYear() && t.date.getMonth() == o.orderDate.getMonth() && t.date.getDate() == o.orderDate.getDate()) {
						exist = true;
						t.quantity++;
						return;
					}
				});
				discard = false;
			} else if (
				(!to.getDate() || from.toDateString() == to.toDateString()) &&
				from.getFullYear() == o.orderDate.getFullYear() &&
				from.getMonth() == o.orderDate.getMonth() &&
				from.getDate() + 1 == o.orderDate.getDate()
			) {
				discard = false;
			}

			if (exist || discard) return;

			ordersTargets.push({
				date: new Date(o.orderDate.getFullYear(), o.orderDate.getMonth(), o.orderDate.getDate()),
				quantity: 1,
			});
		});

		return ordersTargets;
	}

	async decrecientTopSeller() {
		const orders = await this.productService.decrecientTopSeller(4);
		return orders;
	}
}
