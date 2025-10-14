import { Branch } from "src/branch/entities/branch.entity";
import { Menu } from "src/menu/entities/menu.entity";
import { Product } from "src/product/entities/product.entity";
import { Schedule } from "src/schedule/entities/schedule.entity";
import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

@Entity()
export class Promotion {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true })
	title: string;

	@Column({ nullable: true })
	description: string;

	@Column({ nullable: true })
	image: string;
	
	@Column({ default: true })
	enabled: boolean;

	@UpdateDateColumn()
	updatedAt?: Date;

	@DeleteDateColumn()
	deletedAt?: Date;

	@CreateDateColumn()
	createdAt: Date;

	@ManyToMany(
		() => Product,
		(product) => product.promotions,
	)
	@JoinTable()
	products: Product[];

	@ManyToOne(
		() => Menu,
		(menu) => menu.id,
		{
			onDelete: "CASCADE",
		},
	)

	@JoinColumn()
	menu: Menu;

	@OneToOne(
		() => Schedule,
		(schedule) => schedule.promotion,
	)
	schedule: Schedule;
}
