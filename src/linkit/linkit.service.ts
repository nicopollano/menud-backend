import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { CreateLinkitDTO } from "./dto/create-linkit.dto";
import { UpdateLinkitDTO } from "./dto/update-linkit.dto";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Linkit } from "./entities/linkit.entity";
import { ClsService } from "nestjs-cls";
import { BadRequestException_C, InternalServerErrorException_C } from "src/common/Custom/http-response";
import { ErrorList } from "src/common/enums/error.enum";
import { BusinessService } from "src/business/business.service";

@Injectable()
export class LinkitService {
	constructor(
		@InjectRepository(Linkit) private linkitRepository: Repository<Linkit>,
		@Inject(forwardRef(() => ClsService)) private clsService: ClsService,
		@Inject(forwardRef(() => BusinessService))
		private businessService: BusinessService,
	) {}

	async findAllByBusinessId(businessId: number) {
		const business = await this.businessService.findOne(businessId);
		return this.linkitRepository.find({
			where: { business: { id: business.id } },
			relations: { business: true },
		});
	}

	async create(createLinkitDto: CreateLinkitDTO) {
		const business = this.clsService.get("business");

		const alreadyExist = await this.linkitRepository.count({
			where: { business: { id: business.id } },
		});

		if (alreadyExist) throw new BadRequestException_C(ErrorList.LinkitAlreadyExist);

		const linkit = await this.linkitRepository.save({
			...createLinkitDto,
			business,
		});

		if (!linkit) throw new InternalServerErrorException_C(ErrorList.LinkitCreationError);

		return linkit;
	}

	async findAll() {
		const business = this.clsService.get("business");
		console.log("===== FIND ALL ====");
		console.log("business", business);
		const linkits = await this.linkitRepository.find({
			where: {
				business: { id: business.id },
			},
			relations: ["business"],
		});

		console.log("linkits", linkits);
		console.log("*********************************\n\n");
		if (!linkits) throw new BadRequestException_C(ErrorList.LinkitNotFound);

		return linkits;
	}

	async findAllByUserId(userId: number) {
		const linkits = await this.linkitRepository.find({
			where: {
				business: { businessOwners: { user: { id: userId } } },
			},
			relations: { business: true },
			order: { business: { name: "ASC" } },
		});

		if (!linkits) throw new BadRequestException_C(ErrorList.LinkitNotFound);

		return linkits;
	}

	async findOne(id: number) {
		const business = this.clsService.get("business");

		const linkit = await this.linkitRepository.findOne({
			where: {
				id,
				business: { id: business.id },
			},
		});

		if (!linkit) throw new BadRequestException_C(ErrorList.LinkitNotFound);

		return linkit;
	}

	async update(id: number, updateLinkitDto: UpdateLinkitDTO) {
		const business = this.clsService.get("business");

		const linkit = await this.linkitRepository.findOne({
			where: {
				id,
				business: { id: business.id },
			},
		});

		if (!linkit) throw new BadRequestException_C(ErrorList.LinkitNotFound);

		await this.linkitRepository.update(id, updateLinkitDto);

		return this.linkitRepository.findOne({ where: { id } });
	}

	async remove(id: number) {
		const business = this.clsService.get("business");

		const linkit = await this.linkitRepository.findOne({
			where: {
				id,
				business: { id: business.id },
			},
		});

		if (!linkit) throw new BadRequestException_C(ErrorList.LinkitNotFound);

		await this.linkitRepository.softRemove(linkit);

		return linkit;
	}

	async summary() {
		const business = this.clsService.get("business");
		const count = await this.linkitRepository.count({
			where: { business: { id: business.id } },
		});
		return {
			totalLinkits: count,
		};
	}
}
