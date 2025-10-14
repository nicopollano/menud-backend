import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BusinessService } from "src/business/business.service";
import { BusinessOwner } from "src/business/entities/business-owner.entity";
import { Business } from "src/business/entities/business.entity";
import { PlanEnum } from "src/common/enums/plan.enum";
import { Linkit } from "src/linkit/entities/linkit.entity";
import { Permission } from "src/permission/entities/permission.entity";
import { Plan } from "src/plan/entities/plan.entity";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";

@Injectable()
export class BootstrapService {
	constructor(
		@InjectRepository(Business) private readonly businessRepository: Repository<Business>,
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		@InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
		@InjectRepository(BusinessOwner) private readonly businessOwnerRepository: Repository<BusinessOwner>,
		@InjectRepository(Plan) private readonly planRepository: Repository<Plan>,
		@InjectRepository(Linkit) private readonly linkitRepository: Repository<Linkit>,
	) {}

	private readonly logger = new Logger(BootstrapService.name);

	async onModuleInit() {
		this.logger.log("Bootstrap initialized");

		this.logger.log("Checking businesses...");
		const businesses = await this.businessRepository.find({ relations: { linkits: true } });

		for (const business of businesses) {
			const businessHasLinkits = business.linkits && business.linkits.length > 0;
			this.logger.log(`Found business: ${business.id} - linkit: [${businessHasLinkits ? "✅" : "❌"}]`);

			if (businessHasLinkits) continue;

			const linkit = await this.linkitRepository.save({ business });

			if (!linkit) {
				this.logger.error(`Failed to create linkit for business: ${business.id}`);
				continue;
			}

			this.logger.log(`Created linkit for business: ${business.id}`);
		}

		this.logger.log("Bootstrap finished");
	}
}
