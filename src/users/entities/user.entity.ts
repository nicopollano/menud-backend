import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
	JoinTable,
	OneToOne,
	DeleteDateColumn,
	OneToMany,
	CreateDateColumn,
	UpdateDateColumn,
} from "typeorm";
import * as bcrypt from 'bcryptjs';
import { Subscription } from "src/subscription/entities/subscription.entity";
import { Branch } from "src/branch/entities/branch.entity";
import { Business } from "src/business/entities/business.entity";
import { BusinessOwner } from "src/business/entities/business-owner.entity";
import { BranchMember } from "src/member/entities/branch_member.entity";
import { Expose } from "class-transformer";
import { GlobalRole } from "src/common/enums/global-role.enum";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ select: false })
	password: string;

	@Column({ nullable: true })
	name: string;

	@Column({ nullable: true })
	surname: string;

	@Column({ nullable: true })
	phone: string;

	@Column({ nullable: true })
	email: string;

	@Column({ default: 0 })
	version: number;

	@Column({ nullable: true })
	recuperation_code: string;

	@Column({ nullable: true })
	recuperation_code_time: Date;

	@Column({ default: true })
	enabled: boolean;

	@Column({ enum: GlobalRole, default: GlobalRole.CUSTOMER })
	role: GlobalRole;

	@DeleteDateColumn()
	deletedAt?: Date;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt?: Date;

	@OneToMany(
		() => BusinessOwner,
		(businessOwner) => businessOwner.user,
		{
			cascade: ["remove"],
		},
	)
	businessOwners: BusinessOwner[];

	@OneToMany(
		() => BranchMember,
		(branchMember) => branchMember.user,
		{
			cascade: ["remove"],
		},
	)
	branchMembers: BranchMember[];

	@OneToOne(
		() => Subscription,
		(subscription) => subscription.user,
	)
	subscription: Subscription;

	async validatePassword(password: string): Promise<boolean> {
		return bcrypt.compare(password, this.password);
	}
}
