import { Category } from "src/category/entities/category.entity";
import { EntitySubscriberInterface, EventSubscriber, SoftRemoveEvent } from "typeorm";
import { Subcategory } from "../entities/subcategory.entity";
import { isEmpty } from "class-validator";

@EventSubscriber()
export class SubcategoryCategorySubscriber implements EntitySubscriberInterface<Category> {
	listenTo(): typeof Category {
		return Category;
	}

	async beforeSoftRemove(event: SoftRemoveEvent<Category>): Promise<Subcategory> {
		const subcategories = await event.manager.find(Subcategory, {
			where: {
				category: {
					id: event.entityId,
				},
			},
		});

		if (isEmpty(subcategories)) return;

		await event.manager.softRemove(subcategories);
	}
}
