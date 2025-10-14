import { Promotion } from "src/promotion/entities/promotion.entity";
import { EntitySubscriberInterface, EventSubscriber, SoftRemoveEvent } from "typeorm";
import { Schedule } from "../entities/schedule.entity";
import { isEmpty } from "class-validator";

@EventSubscriber()
export class SchedulePromotionSubscriber implements EntitySubscriberInterface<Promotion> {
	listenTo(): typeof Promotion {
		return Promotion;
	}

	async beforeSoftRemove(event: SoftRemoveEvent<Promotion>): Promise<Schedule> {
		const schedule = await event.manager.findOne(Schedule, {
			where: {
				promotion: { id: event.entityId },
			},
		});

		if (isEmpty(schedule)) return;

		await event.manager.softRemove(schedule);
	}
}
