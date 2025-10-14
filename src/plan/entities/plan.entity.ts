import { PlanEnum } from "src/common/enums/plan.enum";
import { Subscription } from "src/subscription/entities/subscription.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Plan {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	description: string;

	@Column({ type: "float" })
	price: number;

	@Column()
	maxUsers: number;

	@Column()
	maxBusinesses: number;

	@Column()
	maxMenus: number;

	@Column({ type: "enum", enum: PlanEnum, nullable: true })
	type: PlanEnum;

	@Column({ type: "boolean", default: false })
	hasProductManagement: boolean;

	@Column({ type: "boolean", default: false })
	hasCustomCategories: boolean;

	@Column({ type: "boolean", default: false })
	hasQrGenerator: boolean;

	@Column({ type: "boolean", default: false })
	hasLinkit: boolean;

	@Column({ type: "boolean", default: false })
	hasRoleSystem: boolean;

	@Column({ type: "boolean", default: false })
	hasAutomaticAlerts: boolean;

	@Column({ type: "boolean", default: false })
	hasAutomaticDarkMode: boolean;

	@Column({ type: "boolean", default: false })
	hasMultiLanguage: boolean;

	@Column({ type: "boolean", default: false })
	hasBackendPanel: boolean;

	@Column({ type: "boolean", default: false })
	hasPrioritySupport: boolean;

	@OneToMany(
		() => Subscription,
		(subscription) => subscription.plan,
	)
	subscriptions: Subscription[];
}
