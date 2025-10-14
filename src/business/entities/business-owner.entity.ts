import { User } from "src/users/entities/user.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Business } from "./business.entity";
import { Permission } from "src/permission/entities/permission.entity";

@Entity()
export class BusinessOwner {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP",
	})
	createdAt: Date;

	@DeleteDateColumn()
	deletedAt?: Date;

	@ManyToOne(
		() => User,
		(user) => user.businessOwners,
		{
			onDelete: "CASCADE",
		},
	)
	@JoinColumn()
	user: User;

	@ManyToOne(
		() => Business,
		(business) => business.businessOwners,
		{
			onDelete: "CASCADE",
		},
	)
	@JoinColumn()
	business: Business;

	@OneToMany(
		() => Permission,
		(permission) => permission.businessOwner,
		{ cascade: ["remove"] },
	)
	permissions: Permission[];
}
