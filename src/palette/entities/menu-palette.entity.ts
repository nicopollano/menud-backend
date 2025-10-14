import { Menu } from "src/menu/entities/menu.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class MenuPalette {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	color1: string;

	@Column()
	color2: string;

	@Column()
	color3: string;

	@Column({ default: true })
	enabled: boolean;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@DeleteDateColumn()
	deletedAt?: Date;

	@ManyToOne(
		() => Menu,
		(menu) => menu.menuPalettes,
		{ onDelete: "CASCADE" },
	)
	@JoinColumn()
	menu: Menu;
}
