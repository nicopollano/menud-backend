import { EntitySubscriberInterface, EventSubscriber, SoftRemoveEvent } from "typeorm";
import { MenuPalette } from "../entities/menu-palette.entity";
import { Menu } from "src/menu/entities/menu.entity";

@EventSubscriber()
export class MenuPaletteSubscriber implements EntitySubscriberInterface<MenuPalette> {
	listenTo(): typeof MenuPalette {
		return MenuPalette;
	}

	async beforeSoftRemove(event: SoftRemoveEvent<MenuPalette>) {
		const menu = await event.manager.find(Menu, {
			where: { id: event.entity.menu.id },
		});

		if (menu) {
			await event.manager.softRemove(menu);
		}
	}
}
