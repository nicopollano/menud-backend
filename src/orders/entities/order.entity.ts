import { Branch } from "src/branch/entities/branch.entity";
import { OrderProduct } from "src/order-product/entities/order-product.entity";
import { Table } from "src/tables/entities/table.entity";
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	BeforeInsert,
	OneToOne,
	JoinColumn,
	CreateDateColumn,
	ManyToOne,
	JoinTable,
	AfterInsert,
	AfterUpdate,
	BeforeUpdate,
	AfterLoad,
	AfterRecover,
} from "typeorm";

//@Entity()
export class Order {
	// AGREGAR CAMPO PROMO
	// DESCUENTOS
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true })
	orderNumber: number;

	@Column({ default: 0, nullable: true })
	total: number;

	/*
  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order, {
    eager: true,
  })
  orderProducts: OrderProduct[];
*/

	@ManyToOne(
		() => Table,
		(table) => table.id,
	)
	@JoinColumn()
	table: Table;

	@Column({ default: false })
	isActive: boolean;

	@CreateDateColumn({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP",
	})
	orderDate: Date;

	@Column({ default: "" })
	paymentMethod: String;

	@Column({ default: "pending" })
	status: String;

	// CLIENT DATA

	@Column({ default: "", nullable: true })
	clientName: String;

	@Column({ default: "", nullable: true })
	direction: String;

	@Column("bigint", { default: 0 })
	phoneNumber: number;

	@Column({ default: "", nullable: true })
	location: String;

	@Column({ default: 0, nullable: true })
	postal_code: number;

	@Column({ default: false, nullable: true })
	delivery: boolean;

	/*
  @ManyToOne(() => Branch, branch => branch.order)
  @JoinTable()
  branch: Branch;

  */

	private static notDeliveryCounter = 1;
	private static deliveryCounter = 1;

	initCounters(delivery: number, notdelivery: number) {
		Order.deliveryCounter = delivery;
		Order.notDeliveryCounter = notdelivery;
	}

	@BeforeUpdate()
	assignOrderNumber() {
		if (this.delivery) this.orderNumber = Order.deliveryCounter++;
		else this.orderNumber = Order.notDeliveryCounter++;
	}
}
