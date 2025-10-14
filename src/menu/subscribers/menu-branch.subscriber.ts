import { Branch } from "src/branch/entities/branch.entity";
import { EntitySubscriberInterface, EventSubscriber, SoftRemoveEvent } from "typeorm";
import { Menu } from "../entities/menu.entity";
import { isEmpty } from "class-validator";

@EventSubscriber()
export class MenuBranchSubscriber implements EntitySubscriberInterface<Branch> {
	listenTo(): typeof Branch {
		return Branch;
	}

	async beforeSoftRemove(event: SoftRemoveEvent<Branch>): Promise<Menu> {
		const menus = await event.manager.find(Menu, {
			where: {
				branch: {
					id: event.entityId,
				},
			},
		});

		if (isEmpty(menus)) return;

		await event.manager.softRemove(menus);
	}
}
