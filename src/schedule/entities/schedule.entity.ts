import { Branch } from "src/branch/entities/branch.entity";
import { Menu } from "src/menu/entities/menu.entity";
import { Promotion } from "src/promotion/entities/promotion.entity";
import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

@Entity()
export class Schedule {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "varchar", nullable: true })
	openTime: string; // formato 'yyyy-mm-dd hh:mm' o solo 'hh:mm'

	@Column({ type: "varchar", nullable: true })
	closeTime: string; // formato 'yyyy-mm-dd hh:mm' o solo 'hh:mm'

	@Column("int", { array: true, nullable: true })
	days: number[];

	@Column({ default: true })
	enabled: boolean;

	@ManyToOne(
		() => Branch,
		(branch) => branch.schedules,
		{
			onDelete: "CASCADE",
		},
	)
	@JoinColumn()
	branch: Branch;

	@ManyToOne(
		() => Menu,
		(menu) => menu.schedules,
		{
			onDelete: "CASCADE",
		},
	)
	@JoinColumn()
	menu?: Menu;

	@DeleteDateColumn()
	deletedAt?: Date;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt?: Date;

	@OneToOne(
		() => Promotion,
		(promotion) => promotion.schedule,
	)
	@JoinColumn()
	promotion: Promotion;
}
