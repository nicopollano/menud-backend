import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinTable, JoinColumn, DeleteDateColumn, ManyToMany } from "typeorm";
import { Product } from "src/product/entities/product.entity";
import { Branch } from "src/branch/entities/branch.entity";
import { Subcategory } from "src/subcategory/entities/subcategory.entity";
import { Menu } from "src/menu/entities/menu.entity";
import { Expose } from "class-transformer";

@Entity()
export class Category {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column({ default: "" })
	image: string;

	@Column({ nullable: true })
	description: string;

	@Column({ default: true })
	enabled: boolean;

	@DeleteDateColumn()
	deletedAt?: Date;

	@Expose()
	get summary() {
		return {
			totalProducts: this.products.length + this.subcategories?.reduce((sum, subcategory) => sum + subcategory?.summary.totalProducts, 0),
			totalSubcategories: this.subcategories.length,
		};
	}


	@OneToMany(
		() => Subcategory,
		(subcategory) => subcategory.category,
		{
			cascade: ["remove"],
		},
	)
	subcategories: Subcategory[];

	@ManyToMany(
		() => Product,
		(product) => product.categories,
		{
			cascade: true,
			onDelete: "CASCADE",
		},
	)
	@JoinTable({ name: "product_category" })
	products: Product[];

	@ManyToOne(
		() => Menu,
		(menu) => menu.categories,
		{
			onDelete: "CASCADE",
		},
	)
	@JoinColumn()
	menu: Menu;

	async findProduct(name: string): Promise<Product | null> {
		const product = await this.products.find((product) => product.name === name);
		if (product) {
			return product;
		}

		for (const subcategory of this.subcategories) {
			const foundProduct = subcategory.findProduct(name);
			if (foundProduct) {
				return foundProduct;
			}
		}

		return null;
	}
}
