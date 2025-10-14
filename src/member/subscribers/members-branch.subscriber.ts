import { Branch } from "src/branch/entities/branch.entity";
import { EntitySubscriberInterface, EventSubscriber, SoftRemoveEvent } from "typeorm";
import { BranchMember } from "../entities/branch_member.entity";
import { isEmpty } from "class-validator";

@EventSubscriber()
export class MembersBranchSubscriber implements EntitySubscriberInterface<Branch> {
	listenTo(): typeof Branch {
		return Branch;
	}

	async beforeSoftRemove(event: SoftRemoveEvent<Branch>): Promise<BranchMember> {
		const members = await event.manager.find(BranchMember, {
			where: {
				branch: {
					id: event.entityId,
				},
			},
		});

		if (isEmpty(members)) return;

		await event.manager.softRemove(members);
	}
}
