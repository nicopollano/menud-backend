import { Branch } from "src/branch/entities/branch.entity";
import { Category } from "src/category/entities/category.entity";
import { MenuPalette } from "src/palette/entities/menu-palette.entity";
import { TypographyList } from "src/common/enums/typography.enum";
import { Schedule } from "src/schedule/entities/schedule.entity";
import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { Expose } from "class-transformer";
import { Promotion } from "src/promotion/entities/promotion.entity";

@Entity()
export class Menu {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column({ nullable: true })
	description: string;

	@Column({ nullable: true })
	logo: string;

	@Column({ nullable: true })
	cover: string;

	@Column({ type: "enum", enum: TypographyList, default: TypographyList.poppins })
	typography: TypographyList;

	@Column({ default: false })
	enabled: boolean;

	@UpdateDateColumn()
	updatedAt?: Date;

	@DeleteDateColumn()
	deletedAt?: Date;

	@CreateDateColumn()
	createdAt: Date;

	@Expose()
	get summary() {
		return {
			totalCategories: this.categories?.length ?? 0,
			totalProducts:
				this.categories?.reduce(
					(sum, category) =>
						sum + category.products?.length + category.subcategories?.reduce((subSum, subcategory) => subSum + subcategory?.summary.totalProducts, 0),
					0,
				) ?? 0,
		};
	}

	@ManyToOne(
		() => Branch,
		(branch) => branch.menus,
		{
			onDelete: "CASCADE",
		},
	)
	@JoinColumn()
	branch: Branch;

	@OneToMany(
		() => Category,
		(category) => category.menu,
		{
			cascade: ["remove"],
		},
	)
	categories: Category[];

	@OneToMany(
		() => MenuPalette,
		(menuPalette) => menuPalette.menu,
		{ cascade: ["remove"] },
	)
	menuPalettes: MenuPalette[];

	@OneToMany(
		() => Schedule,
		(schedule) => schedule.menu,
		{
			cascade: ["remove"],
		},
	)
	schedules?: Schedule[];

	@OneToMany(
		() => Promotion,
		(promotion) => promotion.menu,
		{
			cascade: ["remove"],
		},
	)
	promotions: Promotion[];
}
