import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinTable, DeleteDateColumn, ManyToMany, JoinColumn } from "typeorm";
import { OrderProduct } from "src/order-product/entities/order-product.entity";
import { Branch } from "src/branch/entities/branch.entity";
import { Subcategory } from "src/subcategory/entities/subcategory.entity";
import { Category } from "src/category/entities/category.entity";
import { Promotion } from "src/promotion/entities/promotion.entity";

@Entity()
export class Product {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	price: number;

	@Column({ default: 0 })
	discountedPrice: number;

	@Column("text", { array: true, default: [] })
	images: string[];

	@Column({ default: "" })
	description: string;

	@Column({ default: 0 })
	sell_count: number;

	@Column({ default: true })
	enabled: boolean;

	@DeleteDateColumn()
	deletedAt?: Date;

	/*
  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.product)
  orderProducts: OrderProduct[];
*/

	@ManyToMany(
		() => Subcategory,
		(subcategory) => subcategory.products,
		{
			nullable: true,
			cascade: ["insert", "update"],
			onDelete: "CASCADE",
		},
	)
	@JoinTable({ name: "product_subcategory" })
	subcategories: Subcategory[];

	@ManyToMany(
		() => Category,
		(category) => category.products,
		{
			nullable: true,
			onDelete: "CASCADE",
		},
	)
	@JoinTable({ name: "product_category" })
	categories: Category[];

	/* @ManyToOne(
		() => Branch,
		(branch) => branch.products,
		{
			onDelete: "CASCADE",
		},
	)
	@JoinColumn()
	branch: Branch; */

	@ManyToMany(
		() => Promotion,
		(promotion) => promotion.products,
		{
			nullable: true,
		}
	)
	promotions: Promotion[];
}
