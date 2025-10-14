import { Branch } from "src/branch/entities/branch.entity";
import { Linkit } from "src/linkit/entities/linkit.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BusinessOwner } from "./business-owner.entity";
import { Subscription } from "src/subscription/entities/subscription.entity";
import { Expose } from "class-transformer";

@Entity()
@Index("IDX_BUSINESS_NAME", ["name"], { unique: true, where: '"deletedAt" IS NULL' })
export class Business {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column({ nullable: true })
	logo: string;

	@Column({ nullable: true })
	description: string;

	@Column({ nullable: true })
	phone: string;

	@Column({ nullable: true })
	address: string;

	@Column({ nullable: true })
	location: string;

	@Column({ nullable: true })
	country: string;

	@Column({ default: true })
	enabled: boolean;

	@DeleteDateColumn()
	deletedAt?: Date;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt?: Date;

	@Expose()
	get summary() {
		return {
			totalBranches: this.branches.length,
		};
	}

	@OneToMany(
		() => Branch,
		(branch) => branch.business,
		{
			cascade: ["remove"],
		},
	)
	branches: Branch[];

	@OneToMany(
		() => BusinessOwner,
		(businessOwner) => businessOwner.business,
		{
			cascade: ["remove"],
		},
	)
	businessOwners: BusinessOwner[];

	@ManyToOne(
		() => Subscription,
		(subscription) => subscription.businesses,
		{
			cascade: ["remove"],
		},
	)
	@JoinColumn()
	subscription: Subscription;

	@OneToMany(
		() => Linkit,
		(linkit) => linkit.business,
	)
	linkits: Linkit[];
}
