import { forwardRef, HttpException, Inject, Injectable } from "@nestjs/common";
import { Order } from "./entities/order.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WsException } from "@nestjs/websockets";
import { UpdateOrderDTO } from "./dto/update-order.dto";
import { totalmem } from "os";
import { filter, map } from "rxjs";
import { equal } from "assert";
import { TablesService } from "src/tables/tables.service";
import { Table } from "src/tables/entities/table.entity";
import { ErrorList } from "src/common/enums/error.enum";
import { BadRequestException_C, InternalServerErrorException_C, NotFoundException_C } from "src/common/Custom/http-response";
import { ClsService } from "nestjs-cls";
import { CreateOrderDto } from "./dto/create-order.dto";
import { CreateOrderDTO } from "src/order-product/dto/create-order-product.dto";
import { OrderProductService } from "src/order-product/order-product.service";
import { OrderProduct } from "src/order-product/entities/order-product.entity";
import { ProductService } from "src/product/product.service";
import { Branch } from "src/branch/entities/branch.entity";
import { WebSocketServerService } from "src/websocket/websocket.service";
import { NotificationList } from "src/common/enums/notification.enum";

@Injectable()
export class OrdersService {
	constructor(
		@InjectRepository(Order)
		private readonly orderRepository: Repository<Order>,
		@Inject(forwardRef(() => OrderProductService)) private orderProductService: OrderProductService,
		@Inject(forwardRef(() => TablesService)) private tablesService: TablesService,
		@Inject(forwardRef(() => ProductService)) private productService: ProductService,
		@Inject(forwardRef(() => WebSocketServerService)) private wsService: WebSocketServerService,
		private clsService: ClsService,
	) {}

	async confirm(confirmOrderDto: CreateOrderDTO) {
		/*
    const { name ,paymentMethod, delivery, direction, location, phoneNumber, postalCode, tableid, products, total,  } = confirmOrderDto;
    const branch = this.clsService.get("branch");
    let order = await this.orderRepository.create({ branch });
    order = await this.orderRepository.save(order);
    const table = await this.tablesService.findOne(tableid)

    const orderProduct : OrderProduct[] = [];

    for(let [i, id] of products.entries()){
      const orderProduct_new = await this.orderProductService.create({
        note : products[i].note, 
        orderId : order.id,
        productId : products[i].productId,
        quantity : products[i].quantity,
      });

      orderProduct.push(orderProduct_new);

    }

    order.orderProducts = orderProduct;
    order.orderProducts.forEach(async (orderproduct)=> {
      await this.productService.increaseTopSeller(orderproduct.product.id, 1);
    });
    order.clientName = name;
    order.paymentMethod = paymentMethod;
    order.total = total; //this.getTotal(order);
    order.isActive = true;
    order.branch = branch;
    order.delivery = delivery;
    order.direction = direction;
    order.location = location;
    order.phoneNumber = phoneNumber;
    order.postal_code = postalCode;
    order.table = table;

    order = await this.orderRepository.save(order);
    this.wsService.notification("NewOrder", order);
    return {
      id: order.id
    };*/
		return "OK";
	}

	async delete(id: number) {
		/*
    const branch = this.clsService.get("branch");
    const order = await this.orderRepository.findOne({
      where: { id, branch },
    });

    if (!order || !order.isActive) {
      throw new NotFoundException_C(ErrorList.OrderNotFound);
    }

    order.isActive = false;

    const orderSaved = await this.orderRepository.save(order);
    
    return {
      id: orderSaved.id
    };
    */
		return "OK";
	}

	async update(id: number, neworderRequest: UpdateOrderDTO) {
		/*
    const {id, tableid, ...neworder} = neworderRequest;
    const branch = this.clsService.get("branch");
    const order = await this.orderRepository.findOne({ where: { id, branch }, relations:["orderProducts", "table"] });

    if(!order || (!order.isActive && order.paymentMethod != "")) throw new NotFoundException_C(ErrorList.OrderNotFound);

    Object.keys(order).forEach(key => {
      if(neworder[key]) order[key] = neworder[key];
    });

    if(tableid){
      order.table = await this.tablesService.findOne(tableid);
    }

    const result_order = await this.orderRepository.save(order);
    return this.filterOrder(result_order);
    */
		return new Order();
	}

	async init() {
		throw new BadRequestException_C(ErrorList.Deprecated);
		/*
    const branch = this.clsService.get("branch");
    const order = await this.orderRepository.create();
    order.branch = branch;
    if(!order) throw new InternalServerErrorException_C(ErrorList.OrderInitError);

    const orderSaved = await this.orderRepository.save(order);
    
    return {
      id: orderSaved.id
    };
    */
	}

	async findOne(id: number) {
		/*
    const branch = this.clsService.get("branch");
    const order = await this.orderRepository.findOne({ where: { id, branch }, relations: ["orderProducts", "orderProducts.product", "table"] });
    if(!order) throw new NotFoundException_C(ErrorList.OrderNotFound);
    return order;
    */
		return new Order();
	}

	filterOrder(order: Order) {
		const { isActive, ...rest } = order;
		return rest;
	}

	async setOrderStatus(id: number, status: String) {
		const order = await this.findOne(id);

		if (!order) throw new NotFoundException_C(ErrorList.OrderNotFound);

		order.status = status;

		return await this.orderRepository.save(order);
	}

	async pending(id: number) {
		return await this.filterOrder(await this.setOrderStatus(id, "pending"));
	}

	async inprogress(id: number) {
		return await this.filterOrder(await this.setOrderStatus(id, "inprogress"));
	}

	async delivered(id: number) {
		return await this.filterOrder(await this.setOrderStatus(id, "delivered"));
	}

	async findAll(delivery: boolean) {
		/*
    const branch : Branch = this.clsService.get("branch");
    const orders = await this.orderRepository.find({
      where: { isActive: true, branch: {id: branch.id}, delivery },
      relations: ["orderProducts", "orderProducts.product", "table"]
    });

    if(!orders) throw new NotFoundException_C(ErrorList.OrderNotFound);

    return orders.filter(order => order.isActive);
    */
		return new Order[2]();
	}

	async findAllByStatus(delivery: boolean, status: String) {
		/*
    const branch = this.clsService.get("branch");
    const orders = await this.orderRepository.find({
      where: { status, isActive: true, branch, delivery },
      relations: ["orderProducts", "orderProducts.product", ...(!delivery ? ["table"] : [])]
   })
    return orders;
    */
		return new Order[2]();
	}

	async findAllPending(delivery: boolean) {
		return await this.findAllByStatus(delivery, "pending");
	}

	async findAllInProgress(delivery: boolean) {
		return await this.findAllByStatus(delivery, "inprogress");
	}

	async findAllDelivered(delivery: boolean) {
		return await this.findAllByStatus(delivery, "delivered");
	}

	getTotal(order: Order) {
		/*
    let total = 0;

    order.orderProducts.forEach((e) =>{
      total += e.product.price * e.quantity;
    });

    return total;
    */
		return 2;
	}

	async count() {
		/*
    const branch = this.clsService.get("branch");
    const count = await this.orderRepository.count({ where: {isActive: true,  branch }});

    return count;
    */
		return 2;
	}

	async countDelivery() {
		/*
    const branch = this.clsService.get("branch");
    const count = await this.orderRepository.count({ where: {isActive: true, status: "delivered", branch}});

    return count; 
    */
	}

	async countPending() {
		/*
    const branch = this.clsService.get("branch");
    const count = await this.orderRepository.count({ where: {isActive: true, delivery: true, status: "pending", branch}});

    return count; 
    */
		return 2;
	}

	async countInProgress() {
		/*
    const branch = this.clsService.get("branch");
    const count = await this.orderRepository.count({ where: {isActive: true, status: "inprogress", branch}});

    return count; 
    */
	}

	async countDeliveryGraphic() {
		return {
			incomming: await this.countInProgress(),
			shipping: await this.countDelivery(),
			others: await this.countPending(),
		};
	}

	async totalSales() {
		/*
    const branch = this.clsService.get("branch");
    const count = await this.orderRepository.count({where: {isActive: true, branch}});

    return count;
    */
		return 2;
	}

	async shipping(shipping: boolean) {
		/*
    const branch = this.clsService.get("branch");
    const orders = shipping ?  await this.orderRepository.find({ where: {isActive: true, delivery: shipping, branch}, relations:["table"]}) : await this.orderRepository.find({ where: {isActive: true, delivery: shipping, branch}});

    if(!orders) throw new NotFoundException_C(ErrorList.OrderNotFound);

    return orders;
    */
		return new Order();
	}
}
