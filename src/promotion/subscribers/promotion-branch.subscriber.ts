import { Branch } from "src/branch/entities/branch.entity";
import { EntitySubscriberInterface, EventSubscriber, SoftRemoveEvent } from "typeorm";
import { Promotion } from "../entities/promotion.entity";
import { isEmpty } from "class-validator";

@EventSubscriber()
export class PromotionBranchSubscriber implements EntitySubscriberInterface<Branch> {
	listenTo(): typeof Branch {
		return Branch;
	}

	async beforeSoftRemove(event: SoftRemoveEvent<Branch>): Promise<Promotion> {
		const promotions = await event.manager.find(Promotion, {
			where: {
				menu: {
					branch: {
						id: event.entityId,
					},
				},
			},
		});

		if (isEmpty(promotions)) return;

		await event.manager.softRemove(promotions);
	}
}
