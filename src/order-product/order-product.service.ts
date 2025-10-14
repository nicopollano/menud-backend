import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { CreateOrderProductDto } from "./dto/create-order-product.dto";
import { OrdersService } from "src/orders/orders.service";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderProduct } from "./entities/order-product.entity";
import { Repository } from "typeorm";
import { ProductService } from "src/product/product.service";
import { WsException } from "@nestjs/websockets";
import { Order } from "src/orders/entities/order.entity";
import { UpdateOrderProductDto } from "./dto/update-order-product.dto";
import { DeleteOrderProductDto } from "./dto/delete-order-product.dto";
import { ErrorList } from "src/common/enums/error.enum";
import { BadRequestException_C, NotFoundException_C } from "src/common/Custom/http-response";
import { ClsService } from "nestjs-cls";

@Injectable()
export class OrderProductService {
	constructor(
		@Inject(forwardRef(() => OrdersService)) private readonly ordersService: OrdersService,
		private readonly productService: ProductService,

		@InjectRepository(OrderProduct)
		private readonly orderProductRepository: Repository<OrderProduct>,
		@InjectRepository(Order)
		private readonly orderRepository: Repository<Order>,
		private clsService: ClsService,
	) {}

	async create(createOrderProductDto: CreateOrderProductDto) {
		const branch = this.clsService.get("branch");
		const { orderId, productId, quantity, note } = createOrderProductDto;

		const product = await this.productService.findOne(productId);

		if (!product) throw new NotFoundException_C(ErrorList.ProductNotFound);

		const order = await this.ordersService.findOne(orderId);

		// if (!order) {
		//   throw new WsException('Order broke or not found');
		// }

		let orderProduct = new OrderProduct();

		orderProduct.quantity = quantity;
		orderProduct.note = note;
		/*
    orderProduct.branch = branch;
    orderProduct.order = order;
    orderProduct.product = product;
    */
		const orderProductCreated = await this.orderProductRepository.create(orderProduct);

		this.orderProductRepository.save(orderProductCreated);

		return orderProductCreated;
	}

	async findAll() {
		// Usar QueryBuilder para obtener la información de la orden con productos
		/*
    const branch = this.clsService.get("branch");
    const orders = await this.orderRepository.find({
      where: { isActive: true, branch },
      relations: ['orderProducts', 'orderProducts.product'],
      select: {
        id: true,
        clientName: true,
        total: true,
        orderDate: true,
        isActive: true,
        orderProducts: {
          quantity: true,
          product: {
            id: true,
            name: true,
            price: true,
            category: true,
            stock: true,
          },
        },
      } as any,
    });
    if(!orders) throw new NotFoundException_C(ErrorList.OrderProductNotFound);
    // Transformar los resultados para agrupar los productos por orden
    return orders.map((order) => ({
      id: order.id,
      name: order.clientName,
      subTotal: order.total,
      orderDate: order.orderDate,
      products: order.orderProducts.map((op) => ({
        id: op.product.id,
        name: op.product.name,
        price: op.product.price,
        subcategory: op.product.subcategory,
        category: op.product.subcategory.category,
        //stock: op.product.stock,
        quantity: op.quantity,
      })),
    }));*/
		return new Order[2]();
	}

	async findOne(id: number) {
		const branch = this.clsService.get("branch");
		const order_product = await this.orderProductRepository.findOneBy({ id /*branch*/ });
		if (!order_product) throw new NotFoundException_C(ErrorList.OrderProductNotFound);
		return order_product;
	}

	async remove(id: number) {
		const res = await this.ordersService.delete(id);

		if (!res) {
			throw new NotFoundException_C(ErrorList.OrderNotFound);
		}

		return res;
	}

	async update(id: number, updateOrderProductDto: UpdateOrderProductDto) {
		const branch = this.clsService.get("branch");
		const { quantity, note } = updateOrderProductDto;
		const orderProduct = await this.orderProductRepository.findOneBy({ id /* branch */ });

		if (!orderProduct) throw new NotFoundException_C(ErrorList.OrderProductNotFound);

		orderProduct.quantity = quantity;
		orderProduct.note = note;

		return await this.orderProductRepository.update(id, orderProduct);
	}

	async delete(id) {
		const orderProduct = await this.findOne(id);

		if (!orderProduct) throw new NotFoundException_C(ErrorList.OrderProductNotFound);

		return await this.orderProductRepository.remove(orderProduct);
	}
}
