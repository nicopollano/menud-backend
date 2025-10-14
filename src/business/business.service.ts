import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Business } from "./entities/business.entity";
import { Repository } from "typeorm";
import { CreateBusinessDTO } from "./dtos/create-business.dto";
import { UsersService } from "src/users/users.service";
import { InternalServerErrorException_C, NotFoundException_C } from "src/common/Custom/http-response";
import { ErrorList } from "src/common/enums/error.enum";
import { User } from "src/users/entities/user.entity";
import { AddToBusinessDTO } from "./dtos/add-to-business.dto";
import { ClsService } from "nestjs-cls";
import { BusinessOwner } from "./entities/business-owner.entity";
import { threadId } from "worker_threads";
import { UpdateBusinessDTO } from "./dtos/update-business.dto";
import { UploadService } from "src/upload/upload.service";
import { BusinessesSummaryDTO, BusinessWithSummaryDTO } from "./dtos/businesses-summary.dto";
import { BranchService } from "src/branch/branch.service";
import { PermissionService } from "src/permission/permission.service";
import { ALL_PERMISSIONS } from "src/common/decorators/instant-permission.decoratio";
import { ModuleEnum } from "src/common/enums/modules.enum";
import { LinkitService } from "src/linkit/linkit.service";
import { CreateLinkitDTO } from "src/linkit/dto/create-linkit.dto";
import { BusinessSitemapDTO } from "./dtos/business-sitemap.dto";

@Injectable()
export class BusinessService {
	constructor(
		@InjectRepository(Business)
		private businessRepository: Repository<Business>,
		@InjectRepository(BusinessOwner)
		private businessOwnerRepository: Repository<BusinessOwner>,
		@Inject(forwardRef(() => UsersService)) private userService: UsersService,
		@Inject(forwardRef(() => UploadService))
		private uploadService: UploadService,
		@Inject(forwardRef(() => BranchService))
		private branchService: BranchService,
		@Inject(forwardRef(() => PermissionService))
		private permissionService: PermissionService,
		@Inject(forwardRef(() => LinkitService))
		private linkitService: LinkitService,
		private clsService: ClsService,
	) {}

	async create(file: Express.Multer.File, createBusiness: CreateBusinessDTO, addUserToBusinessOwners: boolean = true) {
		const user: User = this.clsService.get("user");

		const business = await this.businessRepository.create(createBusiness);

		business.subscription = user.subscription;

		if (!business) throw new InternalServerErrorException_C(ErrorList.BusinessCreationError);

		const businessCreated = await this.businessRepository.save(business);

		this.clsService.set("business", businessCreated);

		await this.linkitService.create({} as CreateLinkitDTO);

		if (file) {
			if (!file.originalname) file.originalname = `${business.name}_${new Date(Date.now()).getMilliseconds()}`;
			file.filename = file.originalname;
			try {
				business.logo = await this.uploadService.uploadImage(file, "Businesses", true);
				await this.businessRepository.save(business);
			} catch (err) {
				await this.businessRepository.remove(businessCreated);
				throw new InternalServerErrorException_C(ErrorList.UploadError);
			}
		}

		if (addUserToBusinessOwners) {
			await this.add({
				businessId: businessCreated.id,
				userId: user.id,
			});
		}

		return businessCreated;
	}

	async update(id: number, file: Express.Multer.File, updateBusinessDTO: UpdateBusinessDTO, userId?: number) {
		const business = await this.findOne(id, userId);

		Object.assign(business, updateBusinessDTO);

		if (file) {
			if (!file.originalname) file.originalname = `${name}_${new Date(Date.now()).getMilliseconds()}`;
			business.logo = await this.uploadService.uploadImage(file, "Businesses", true);
		}

		return await this.businessRepository.save(business);
	}

	async delete(id: number, userId?: number) {
		const business = await this.findOne(id, userId, null, null);

		return await this.businessRepository.softRemove(business);
	}

	async add(addToBusiness: AddToBusinessDTO) {
		const { businessId, userId } = addToBusiness;
		const business = await this.findOne(businessId);
		const user = await this.userService.findOneRaw(userId);

		const businessOwner = await this.businessOwnerRepository.create();

		businessOwner.user = user;
		businessOwner.business = business;

		const module: ModuleEnum = ModuleEnum.BUSINESSES;

		if (business.businessOwners) business.businessOwners.push(businessOwner);
		else business.businessOwners = [businessOwner];

		const businessOwnerSaved = await this.businessOwnerRepository.save(businessOwner);

		await this.permissionService.create({
			actions: ALL_PERMISSIONS(module).actions,
			module,
			businessOwnerId: businessOwnerSaved.id,
		});

		return businessOwnerSaved;
	}

	async findOneBusinessOwner(id: number) {
		const business = this.clsService.get("business");

		const businessOwner = await this.businessOwnerRepository.findOne({
			where: {
				id,
				business: {
					id: business?.id ?? undefined,
				},
			},
		});

		if (!businessOwner) throw new NotFoundException_C(ErrorList.BusinessUserNotFound);

		return businessOwner;
	}

	async findOneBusinessOwnerByUserId(userId: number, businessParam: Business = null) {
		const business = businessParam ? businessParam : this.clsService.get("business");

		const businessOwner = await this.businessOwnerRepository.findOne({
			where: {
				user: {
					id: userId,
				},
				business: {
					id: business.id,
				},
			},
		});

		if (!businessOwner) throw new NotFoundException_C(ErrorList.BusinessUserNotFound);

		return businessOwner;
	}

	async findOne(id: number, userId?: number, includeBranches = false, includeUsers = false) {
		let qb = this.businessRepository.createQueryBuilder("business");

		if (includeBranches) qb.leftJoinAndSelect("business.branches", "branches");
		else qb.leftJoin("business.branches", "branches");

		if (includeUsers)
			qb.leftJoinAndSelect("business.businessOwners", "businessOwners")
				.leftJoinAndSelect("businessOwners.user", "businessOwner")
				.leftJoinAndSelect("branches.branchMembers", "branchMembers")
				.leftJoinAndSelect("branchMembers.user", "branchMember");

		qb.leftJoinAndSelect("business.subscription", "subscription");

		if (userId) {
			if (!includeUsers) {
				qb.leftJoin("business.businessOwners", "businessOwner").leftJoin("branches.branchMembers", "branchMember");
			}
			qb.where("(businessOwner.user.id = :userId OR branchMember.user.id = :userId) AND business.id = :businessId", { businessId: id, userId });
		} else qb.where("business.id = :businessId", { businessId: id });

		const business = await qb.getOne();

		if (!business) throw new NotFoundException_C(ErrorList.BusinessNotFound);

		return business;
	}

	async findAllBranchAdmin(business: Business) {
		const businessFind = await this.businessRepository.findOne({
			where: {
				id: business.id,
			},
			relations: ["branches"],
			order: {
				name: "ASC",
				branches: { name: "ASC" },
			},
		});
		return businessFind.branches;
	}

	async getOwners(id: number) {
		const business = await this.businessRepository.findOne({
			where: { id },
			relations: ["businessOwners", "businessOwners.user"],
			order: {
				name: "ASC",
				businessOwners: { user: { email: "ASC" } },
			},
		});

		if (!business) throw new NotFoundException_C(ErrorList.BusinessNotFound);

		return business.businessOwners;
	}

	async getBranches(id: number) {
		const business = await this.businessRepository.findOne({
			where: { id },
			relations: ["branches"],
			order: {
				name: "ASC",
				branches: { name: "ASC" },
			},
		});

		if (!business) throw new NotFoundException_C(ErrorList.BusinessNotFound);

		return business.branches;
	}

	async findAll(userId?: number, includeBranches = false) {
		const asOwner = await this.businessRepository.find({
			where: {
				businessOwners: {
					user: {
						id: userId,
					},
				},
			},
			relations: { businessOwners: true, branches: !!includeBranches },
			order: {
				name: "asc",
			},
		});

		const asBranchMember = await this.businessRepository.find({
			where: {
				branches: {
					branchMembers: {
						user: {
							id: userId,
						},
					},
				},
			},
			relations: { businessOwners: true, branches: !!includeBranches },
		});

		const map = new Map<number, Business>();
		[...asOwner, ...asBranchMember].forEach((b) => map.set(b.id, b));

		const businesses = Array.from(map.values());

		if (!businesses) throw new NotFoundException_C(ErrorList.BusinessNotFound);

		return businesses;
	}

	async getSummaryByUserId(userId: number): Promise<BusinessesSummaryDTO> {
		const businesses = await this.businessRepository.find({
			where: {
				businessOwners: { user: { id: userId } },
			},
			relations: ["branches"],
			order: {
				name: "ASC",
				branches: { name: "ASC" },
			},
		});

		const totalBusinesses = businesses.length;
		const totalBranches = businesses.reduce((acc, business) => acc + business.branches.length, 0);

		return {
			totalBranches,
			totalBusinesses,
		};
	}

	async findAllByUserId(userId: number): Promise<BusinessWithSummaryDTO[]> {
		const asOwner = await this.businessRepository.find({
			where: {
				businessOwners: { user: { id: userId } },
			},
			relations: ["branches"],
			order: {
				name: "asc",
			},
		});
		const asBranchMember = await this.businessRepository.find({
			where: {
				branches: {
					branchMembers: {
						user: {
							id: userId,
						},
					},
				},
			},
			relations: ["branches"],
			order: {
				name: "asc",
			},
		});

		const map = new Map<number, Business>();
		[...asOwner, ...asBranchMember].forEach((b) => map.set(b.id, b));

		const businesses = Array.from(map.values());

		const formattedBusinesses: BusinessWithSummaryDTO[] = businesses.map(({ branches, ...business }) => ({
			...business,
			summary: {
				totalBranches: branches.length,
			},
		}));

		return formattedBusinesses;
	}

	async userExist(businessId: number, userId: number) {
		const userExist = await this.businessRepository.findOne({
			where: [
				{ id: businessId, businessOwners: { user: { id: userId } } },
				{
					id: businessId,
					branches: { branchMembers: { user: { id: userId } } },
				},
			],
			relations: ["businessOwners.user", "branches.branchMembers.user"],
			order: {
				name: "ASC",
			},
		});
		return userExist ? true : false;
	}

	async permanentRemove(id: number) {
		const business = await this.businessRepository.findOne({
			where: { id },
			withDeleted: true,
		});
		if (!business) throw new NotFoundException_C(ErrorList.BusinessNotFound);
		return this.businessRepository.remove(business);
	}

	async findAllForSitemap(): Promise<BusinessSitemapDTO[]> {
		const businesses = await this.businessRepository.find({
			where: {
				enabled: true,
			},
			select: ["id", "name"],
			order: {
				name: "ASC",
			},
		});

		return businesses.map((business) => ({
			id: business.id,
			name: business.name,
		}));
	}

	async count(userId: number): Promise<number> {
		const count = await this.businessRepository.count({
			where: {
				businessOwners: {
					user: { id: userId },
				},
			},
		});

		return count ?? 0;
	}

	async branchCount(businessId: number): Promise<number> {
		const count = await this.branchService.countByBusinessId(businessId);
		return count ?? 0;
	}

	async businessOwnerCount(businessId: number): Promise<number> {
		const count = await this.businessOwnerRepository.count({
			where: { business: { id: businessId } },
		});
		return count ?? 0;
	}
}
