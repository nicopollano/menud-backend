import { Branch } from "src/branch/entities/branch.entity";
import { EntitySubscriberInterface, EventSubscriber, SoftRemoveEvent } from "typeorm";
import { Product } from "../entities/product.entity";
import { isEmpty } from "class-validator";

@EventSubscriber()
export class ProductBranch implements EntitySubscriberInterface<Branch> {
	listenTo(): typeof Branch {
		return Branch;
	}

	async beforeSoftRemove(event: SoftRemoveEvent<Branch>): Promise<Product> {
		const products = await event.manager.find(Product, {
			where: [
				{ categories: { menu: { branch: { id: event.entityId} } } },
				{ subcategories: { category: { menu: { branch: { id: event.entityId} } } } },
			],
			relations: ["categories", "subcategories", "categories.menu.branch", "subcategories.category", "subcategories.category.menu.branch"],
		});

		if (isEmpty(products)) return;

		await event.manager.softRemove(products);
	}
}
