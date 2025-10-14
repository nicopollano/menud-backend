import { Business } from "src/business/entities/business.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Linkit {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true })
	whatsapp: string;

	@Column({ nullable: true })
	website: string;

	@Column({ nullable: true })
	instagram: string;

	@Column({ nullable: true })
	facebook: string;

	@Column({ nullable: true })
	location: string;

	@Column({ nullable: true })
	twitter: string;

	@Column({ nullable: true })
	tiktok: string;

	@Column({ nullable: true })
	linkedin: string;

	@Column({ default: false })
	enabled: boolean;

	@DeleteDateColumn()
	deletedAt?: Date;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt?: Date;

	@ManyToOne(
		() => Business,
		(business) => business.linkits,
		{
			onDelete: "CASCADE",
		},
	)
	@JoinColumn()
	business: Business;
}
