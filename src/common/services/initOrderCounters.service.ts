import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "src/orders/entities/order.entity";
import { Repository } from "typeorm";
@Injectable()
export class InitOrderCounterService {
	constructor(@InjectRepository(Order) private orderRepository: Repository<Order>) {
		this.init().then(() => {
			const logger = new Logger(InitOrderCounterService.name);
			logger.log("Values initialized");
		});
	}

	async init() {
		try {
			const orders_notdelivery = (await this.orderRepository.find({ where: { delivery: false }, order: { orderNumber: "DESC" } })).filter(
				(order) => order.orderNumber,
			);
			const orders_delivery = (await this.orderRepository.find({ where: { delivery: true }, order: { orderNumber: "DESC" } })).filter(
				(order) => order.orderNumber,
			);

			orders_delivery[0].initCounters(orders_delivery[0].orderNumber + 1 || 1, orders_notdelivery[0].orderNumber + 1 || 1);
			this.orderRepository.save(orders_delivery[0]);
		} catch {}
	}
}
