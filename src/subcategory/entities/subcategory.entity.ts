import { Expose } from "class-transformer";
import { Branch } from "src/branch/entities/branch.entity";
import { Category } from "src/category/entities/category.entity";
import { Product } from "src/product/entities/product.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Subcategory {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column({ nullable: true })
	description: string;

	@Column({ nullable: true })
	image: string;

	@Column({ default: true })
	enabled: boolean;

	@DeleteDateColumn()
	deletedAt?: Date;

	@Expose()
	get summary() {
		return {
			totalProducts: this.products.length,
		};
	}

	@ManyToOne(
		() => Category,
		(category) => category.subcategories,
		{ onDelete: "CASCADE" },
	)
	@JoinColumn()
	category: Category;

	@ManyToMany(
		() => Product,
		(product) => product.subcategories,
		{
			onDelete: "CASCADE",
			eager: true,
		},
	)
	products: Product[];

	findProduct(name: string): Product | null {
		return this.products.find((product) => product.name === name) || null;
	}
}
