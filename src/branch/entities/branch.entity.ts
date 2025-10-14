import { Category } from "src/category/entities/category.entity";
import { Business } from "src/business/entities/business.entity";
import { BranchMember } from "src/member/entities/branch_member.entity";
import { Menu } from "src/menu/entities/menu.entity";
import { OrderProduct } from "src/order-product/entities/order-product.entity";
import { Order } from "src/orders/entities/order.entity";
import { Product } from "src/product/entities/product.entity";
import { Subscription } from "src/subscription/entities/subscription.entity";
import { Table } from "src/tables/entities/table.entity";
import { User } from "src/users/entities/user.entity";
import { Schedule } from "src/schedule/entities/schedule.entity";
import {
	AfterUpdate,
	BeforeInsert,
	BeforeUpdate,
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { CurrencyList } from "src/common/enums/currency.enum";
import slugify from "slugify";
import { Expose } from "class-transformer";
import { Promotion } from "src/promotion/entities/promotion.entity";

@Entity()
/*@Index("IDX_BRANCH_SLUG", ["slug"], {
	unique: true,
	where: '"deletedAt" IS NULL',
})*/
export class Branch {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true })
	name: string;

	@Column({ nullable: true })
	slug: string;

	@Column({ nullable: true })
	description: string;

	@Column({ nullable: true })
	logo: string;

	@Expose()
	get summary() {
		return {
			totalMenus: this.menus?.length ?? 0,
		};
	}

	@Column({ nullable: true })
	phone: string;

	@Column({ nullable: true })
	address: string;

	@Column({ nullable: true })
	location: string;

	@Column({ nullable: true })
	country: string;

	@Column({ default: CurrencyList.ARS })
	currency: string;

	@Column({ default: true })
	enabled: boolean;

	@DeleteDateColumn()
	deletedAt?: Date;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt?: Date;

	/* @OneToMany(
		() => Product,
		(product) => product.branch,
		{
			cascade: ["remove"],
		},
	)
	products: Product[]; */

	@OneToMany(
		() => Menu,
		(menu) => menu.branch,
		{
			cascade: ["remove"],
		},
	)
	menus: Menu[];

	@OneToMany(
		() => BranchMember,
		(branchMember) => branchMember.branch,
		{
			cascade: ["remove"],
		},
	)
	branchMembers: BranchMember[];

	/*
    @OneToMany(()=> OrderProduct, orderproduct => orderproduct.branch)
    orderProduct: OrderProduct[];

    @OneToMany(()=> Order, order => order.branch)
    order: Order[];

    @OneToMany(()=> Table, table => table.branch)
    table: Table[];
*/
	@OneToMany(
		() => Schedule,
		(schedule) => schedule.branch,
		{
			cascade: ["remove"],
		},
	)
	schedules: Schedule[];

	@ManyToOne(
		() => Business,
		(business) => business.branches,
		{
			onDelete: "CASCADE",
		},
	)
	@JoinColumn()
	business: Business;

	@BeforeInsert()
	@BeforeUpdate()
	async setSlug() {
		this.slug = slugify(this.name, { lower: true, strict: true });
	}
}
