import { Branch } from "src/branch/entities/branch.entity";
import { RoleEnum, RoleKey } from "src/common/enums/role.enum";
import { StatusEnum } from "src/common/enums/status.enum";
import { Permission } from "src/permission/entities/permission.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class BranchMember {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	role: RoleKey;

	@Column({ default: true })
	enabled: boolean;

	@Column({
		type: "enum",
		enum: StatusEnum,
		nullable: false,
		default: StatusEnum.PENDING,
	})
	status: StatusEnum;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt?: Date;

	@DeleteDateColumn()
	deletedAt?: Date;

	@ManyToOne(
		() => User,
		(user) => user.branchMembers,
		{
			onDelete: "CASCADE",
		},
	)
	@JoinColumn()
	user: User;

	@ManyToOne(
		() => Branch,
		(branch) => branch.branchMembers,
		{
			onDelete: "CASCADE",
		},
	)
	@JoinColumn()
	branch: Branch;

	@OneToMany(
		() => Permission,
		(permission) => permission.branchMember,
		{ cascade: ["remove"] },
	)
	permissions: Permission[];
}
