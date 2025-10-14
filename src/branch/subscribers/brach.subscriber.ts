import { Business } from "src/business/entities/business.entity";
import { EntitySubscriberInterface, EventSubscriber, SoftRemoveEvent, In } from "typeorm";
import { Branch } from "../entities/branch.entity";
import { isEmpty } from "class-validator";

@EventSubscriber()
export class BranchSubscriber implements EntitySubscriberInterface<Business> {
	listenTo(): typeof Business {
		return Business;
	}

	async beforeSoftRemove(event: SoftRemoveEvent<Business>) {
		const branches = await event.manager.find(Branch, {
			where: { business: {
				id: event.entityId
			} },
		});

		if (isEmpty(branches)) return;

		await event.manager.softRemove(branches);
	}
}
