import { Menu } from "src/menu/entities/menu.entity";
import { EntitySubscriberInterface, EventSubscriber, SoftRemoveEvent } from "typeorm";
import { Category } from "../entities/category.entity";
import { isEmpty } from "class-validator";

@EventSubscriber()
export class CategoryMenuSubscriber implements EntitySubscriberInterface<Menu> {
	listenTo(): typeof Menu {
		return Menu;
	}

	async beforeSoftRemove(event: SoftRemoveEvent<Menu>): Promise<Category> {
		const categories = await event.manager.find(Category, {
			where: {
				menu: {
					id: event.entityId,
				},
			},
		});

		if (isEmpty(categories)) return;

		await event.manager.softRemove(categories);
	}
}
