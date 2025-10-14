import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class SharedPalette {
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
}
