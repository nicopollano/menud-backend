import { EntitySubscriberInterface, EventSubscriber, SoftRemoveEvent } from "typeorm";
import { Business } from "../entities/business.entity";
import { BusinessOwner } from "../entities/business-owner.entity";
import { isEmpty } from "class-validator";
import { Linkit } from "src/linkit/entities/linkit.entity";

@EventSubscriber()
export class BusinessOwnerSubscriber implements EntitySubscriberInterface<Business> {
	listenTo(): typeof Business {
		return Business;
	}

	async beforeSoftRemove(event: SoftRemoveEvent<Business>) {
		const freshManager = event.connection.createEntityManager();
		const businessOwners = await freshManager
			.getRepository(BusinessOwner)
			.createQueryBuilder("bO")
			.leftJoinAndSelect("bO.business", "b")
			.where("b.id = :id", { id: event.entityId })
			.getMany();

		if (isEmpty(businessOwners)) return;

		await event.manager.softRemove(businessOwners);

		const linkit = await freshManager
			.getRepository(Linkit)
			.createQueryBuilder("l")
			.leftJoinAndSelect("l.business", "b")
			.where("b.id = :id", { id: event.entityId })
			.getMany();

		if (isEmpty(linkit)) return;

		await event.manager.softRemove(linkit);
	}
}
