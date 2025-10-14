import { Entity, ManyToOne, Column, PrimaryGeneratedColumn, JoinTable } from "typeorm";
import { Order } from "src/orders/entities/order.entity";
import { Product } from "src/product/entities/product.entity";
import { Branch } from "src/branch/entities/branch.entity";

export class OrderProduct {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	quantity: number;

	@Column()
	note: String;

	/*
  @ManyToOne(() => Branch, branch => branch.orderProduct)
  @JoinTable()
  branch: Branch;

  @ManyToOne(() => Order, (order) => order.orderProducts)
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderProducts)
  product: Product;
  */
}
