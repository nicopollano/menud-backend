import { Business } from "src/business/entities/business.entity";
import { BillingCycleEnum } from "src/common/enums/billin-cycle.enum";
import { BillingStatusEnum } from "src/common/enums/billing-status.dto";
import { Plan } from "src/plan/entities/plan.entity";
import { User } from "src/users/entities/user.entity";
import {
	AfterInsert,
	AfterUpdate,
	BeforeInsert,
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
export class Subscription {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "timestamp" })
	available_until: Date;

	@Column({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP",
	})
	paid: Date;

	@Column({ enum: BillingCycleEnum })
	billingCycle: BillingCycleEnum;

	@Column({ enum: BillingStatusEnum })
	billingStatus: BillingStatusEnum;

	@Column({ default: 0 })
	maxUsers: number;

	@Column({ default: 0 })
	maxMenus: number;

	@Column({ default: 0 })
	maxBusinesses: number;

	@OneToMany(
		() => Business,
		(business) => business.subscription,
		{
			onDelete: "CASCADE",
		},
	)
	businesses: Business[];

	@OneToOne(
		() => User,
		(user) => user.subscription,
		{
			onDelete: "CASCADE",
		},
	)
	@JoinColumn()
	user: User;

	@Column({ default: true })
	enabled: boolean;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@DeleteDateColumn()
	deletedAt?: Date;

	@ManyToOne(
		() => Plan,
		(plan) => plan.subscriptions,
		{
			onDelete: "SET NULL",
		},
	)
	@JoinColumn()
	plan: Plan;

	@BeforeInsert()
	@AfterUpdate()
	async calculateTimeExpire() {
		const now = new Date();
		const calcutatedDate = new Date(now.setDate(now.getDate() + (this.billingCycle === BillingCycleEnum.MONTHLY ? 30 : 365)));
		this.available_until = calcutatedDate;
	}
}
