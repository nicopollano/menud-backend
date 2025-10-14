import { BusinessOwner } from "src/business/entities/business-owner.entity";
import { Actions } from "src/common/enums/actions.enum";
import { ModuleEnum } from "src/common/enums/modules.enum";
import { BranchMember } from "src/member/entities/branch_member.entity";
import { User } from "src/users/entities/user.entity";
import { Check, Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
@Index("IDX_UNIQUE_BUSINESS_OWNER_MODULE", ["module", "businessOwner"], { unique: true })
@Index("IDX_UNIQUE_BRANCH_MEMBER_MODULE", ["module", "branchMember"], { unique: true })
//@Check(`("businessOwnerId" IS NULL OR module = 'businesses')`)
//@Check(`("branchMemberId" IS NULL OR module != 'businesses')`)
export class Permission {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "enum", enum: ModuleEnum })
	module: ModuleEnum;

	@Column({ type: "enum", enum: Actions, array: true, nullable: true })
	actions: Actions[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt?: Date;

	@DeleteDateColumn()
	deletedAt?: Date;

	@ManyToOne(
		() => BusinessOwner,
		(businessOwner) => businessOwner.permissions,
		{ onDelete: "CASCADE" },
	)
	@JoinColumn()
	businessOwner: BusinessOwner;

	@ManyToOne(
		() => BranchMember,
		(branchMember) => branchMember.permissions,
		{ onDelete: "CASCADE" },
	)
	@JoinColumn()
	branchMember: BranchMember;
}
