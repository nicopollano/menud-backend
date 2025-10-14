import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Branch } from "./entities/branch.entity";
import { Repository } from "typeorm";
import { BadRequestException_C, InternalServerErrorException_C, NotFoundException_C } from "src/common/Custom/http-response";
import { ErrorList } from "src/common/enums/error.enum";
import { CreateBranchDTO } from "./dtos/create-branch.dto";
import { BusinessService } from "src/business/business.service";
import { ClsService } from "nestjs-cls";
import { Business } from "src/business/entities/business.entity";
import { User } from "src/users/entities/user.entity";
import { UploadService } from "src/upload/upload.service";
import { UsersService } from "src/users/users.service";
import { UpdateBranchDTO } from "./dtos/update-branch.dto";
import { MemberService } from "src/member/member.service";
import { AddMemberToBranchDTO } from "src/member/dtos/add-member-to-branch.dto";
import { AddMemberToBranchSuperAdminDTO } from "src/member/dtos/add-member-to-branch-super-admin.dto";
import { MenuService } from "src/menu/menu.service";
import { BranchesSummaryDTO, BranchWithSummaryDTO } from "./dtos/branches-summary.dto";
import { CurrencyList } from "src/common/enums/currency.enum";
import { Schedule } from "src/schedule/entities/schedule.entity";
import { ScheduleService } from "src/schedule/schedule.service";
import { CreateScheduleDTO } from "src/schedule/dtos/create-schedule.dto";
import { Menu } from "src/menu/entities/menu.entity";
import { ALL_PERMISSIONS } from "src/common/decorators/instant-permission.decoratio";
import { ROLE_KEY } from "src/common/decorators/role.decorator";
import { RoleEnum } from "src/common/enums/role.enum";
import { BasePermissionsDTO } from "src/permission/dtos/base-permission.dto";
import { ModuleEnum } from "src/common/enums/modules.enum";
import { GeneralsPermissionsList } from "src/common/permissions/generals.list";
import { OwnerPermissions } from "src/common/permissions/business/generals/owner.permission";
import { permission } from "process";
import { ManagerPermissions } from "src/common/permissions/business/generals/manager.permission";
import { LinkitService } from "src/linkit/linkit.service";
import { CreateLinkitDTO } from "src/linkit/dto/create-linkit.dto";
import { CopyBranchDTO } from "./dtos/copy-branch.dto";
import { MoveBranchDTO } from "./dtos/move-branch.dto";
import { StatusEnum } from "src/common/enums/status.enum";
import { PermissionService } from "src/permission/permission.service";
import { ConfigService } from "@nestjs/config";
import pLimit from "p-limit";
@Injectable()
export class BranchService {
	constructor(
		@InjectRepository(Branch) private branchRepository: Repository<Branch>,
		@Inject(forwardRef(() => UsersService)) private usersService: UsersService,
		@Inject(forwardRef(() => BusinessService)) private businessService: BusinessService,
		@Inject(forwardRef(() => ClsService)) private clsService: ClsService,
		@Inject(forwardRef(() => UploadService)) private uploadService: UploadService,
		@Inject(forwardRef(() => MemberService)) private memberService: MemberService,
		@Inject(forwardRef(() => MenuService)) private menuService: MenuService,
		@Inject(forwardRef(() => ScheduleService)) private scheduleService: ScheduleService,
		@Inject(forwardRef(() => LinkitService)) private linkitService: LinkitService,
		@Inject(forwardRef(() => PermissionService)) private permissionService: PermissionService,
	) {}

	async findOne(id: number, userId: number = undefined) {
		const branch = await this.branchRepository.findOne({
			where: {
				id,
				branchMembers: { user: { id: userId } },
			},
			relations: ["business", "schedules.promotion", "menus" /*, "menus.schedules"*/],
			order: {
				name: "ASC",
				business: { name: "ASC" },
				menus: { name: "ASC" },
				schedules: { days: "ASC" },
			},
		});

		if (!branch) throw new NotFoundException_C(ErrorList.BranchNotFound);

		//const menuActive = this.menuService.findActiveMenu(branch.menus) ?? null;

		return branch;
	}

	async create(logo: Express.Multer.File, createBranch: CreateBranchDTO, addUserToBranchMembers: boolean = true) {
		const { name, address, currency, country, location, phone, description, enabled } = createBranch;

		const business: Business = this.clsService.get("business");
		const businessWithBranches = await this.businessService.findOne(business.id, null, true);
		if (!business || !businessWithBranches) throw new InternalServerErrorException_C(ErrorList.BusinessNotFound);

		try {
			const branchExist = businessWithBranches.branches.find((branch: Branch) => branch.name == name);
			if (branchExist) throw new BadRequestException_C(ErrorList.BranchAlreadyExist);
		} catch {}
		/*
		try{
			await this.uploadService.createBucket();
		}catch{}
*/
		const schedules: Schedule[] = await this.scheduleService.create(
			Array.from({ length: 7 }, (_, i) => ({
				days: [i + 1],
				closeTime: "",
				enabled: false,
				openTime: "",
			})),
		);

		const branch = await this.branchRepository.create({
			name,
			business: businessWithBranches,
			description,
			address,
			currency,
			country,
			location,
			phone,
			schedules,
		});

		if (!branch) throw new InternalServerErrorException_C(ErrorList.BranchCreationError);

		let branchSaved: Branch;
		try {
			branchSaved = await this.branchRepository.save(branch);
		} catch (e) {
			throw new InternalServerErrorException_C(ErrorList.BranchDuplicatedSlug);
		}

		this.clsService.set("branch", branchSaved);

		if (logo) {
			branchSaved.logo = await this.uploadService.uploadImage(logo, "Logo");
			await this.branchRepository.save(branchSaved);
		}

		if (addUserToBranchMembers) {
			const owners = await this.businessService.getOwners(business.id);

			const limit = pLimit(3);
			owners.map(async (owner) =>
				limit(async () => {
					return await this.memberService.addUserToBranch({
						email: owner.user.email,
						name: owner.user.name,
						role: RoleEnum.owner,
						branchId: branchSaved.id,
						status: StatusEnum.APPROVED,
						enabled: true,
						permissions: ManagerPermissions.permissions,
						password: null,
					} as AddMemberToBranchDTO | AddMemberToBranchSuperAdminDTO);
				}),
			);
		}

		return branchSaved;
	}

	async update(id: number, logo: Express.Multer.File, updateBranch: UpdateBranchDTO) {
		const business: Business = this.clsService.get("business");
		if (!business) throw new InternalServerErrorException_C(ErrorList.BusinessNotFound);

		const branch = await this.findOne(id);

		if (!branch) throw new BadRequestException_C(ErrorList.BranchNotFound);

		Object.assign(branch, updateBranch);

		let branchSaved: Branch;

		try {
			branchSaved = await this.branchRepository.save(branch);
		} catch (e) {
			throw new InternalServerErrorException_C(ErrorList.BranchDuplicatedSlug);
		}

		if (logo) {
			branchSaved.logo = await this.uploadService.uploadImage(logo, "Logo");
			await this.branchRepository.save(branchSaved);
		}

		return branchSaved;
	}

	async delete(branchId: number) {
		const branch = await this.findOne(branchId);

		if (!branch) throw new BadRequestException_C(ErrorList.BranchNotFound);

		return await this.branchRepository.softRemove(branch);
	}

	async findAll(userId?: number) {
		const user = this.clsService.get("user");

		if (!user) throw new InternalServerErrorException_C(ErrorList.UserNotFound);

		const business: Business = this.clsService.get("business");
		if (!business) throw new InternalServerErrorException_C(ErrorList.BusinessNotFound);

		const branches = await this.branchRepository.find({
			where: {
				branchMembers: {
					user: {
						id: user.id,
					},
				},
				business: {
					id: business.id,
				},
			},
			relations: ["business", "schedules.promotion", "branchMembers", "branchMembers.user" /*, "menus.schedules"*/],
			order: {
				name: "ASC",
				business: { name: "ASC" },
				branchMembers: { user: { email: "ASC" } },
				menus: { name: "ASC", schedules: { days: "ASC" } },
			},
		});

		branches.map((branch) => {
			return {
				...branch,
				schedules:
					branch.schedules
						?.filter((schedule) => !schedule.promotion)
						.map((schedule) => {
							return {
								...schedule,
								day: schedule.days?.[0] ?? null,
							};
						}) ?? null,
			};
		});

		if (!branches) throw new NotFoundException_C(ErrorList.BranchNotFound);

		return branches;
	}

	async findAllSlugs() {
		const branches = await this.branchRepository.find({
			where: {
				enabled: true,
				menus: {
					enabled: true,
				},
			},
		});

		const branchesMapped = branches.map((branch) => {
			return {
				id: branch.id,
				slug: branch.slug,
			};
		});

		return branchesMapped;
	}

	async findOneBySlug(slug: string) {
		const branch = await this.branchRepository.findOne({
			where: {
				slug,
			},
			relations: [
				"business",
				"branchMembers",
				"branchMembers.user",
				"menus",
				"menus.schedules",
				"menus.categories",
				"menus.categories.products",
				"menus.categories.subcategories.products",
			],
		});

		if (!branch) throw new NotFoundException_C(ErrorList.BranchNotFound);

		const menuActive = this.menuService.findActiveMenu(branch.menus);

		return {
			...branch,
			menuActive,
		};
	}

	async findOneBySlugFiltered(slug: string) {
		const branch = await this.branchRepository.findOne({
			where: {
				slug,
			},
			relations: [
				"business",
				"branchMembers",
				"schedules.promotion",
				"branchMembers.user",
				"menus",
				/*"menus.schedules",*/
				"menus.categories",
				"menus.menuPalettes",
				"menus.categories.products",
				"menus.categories.subcategories.products",
			],
			order: {
				name: "ASC",
				business: { name: "ASC" },
				schedules: { days: "ASC" },
				menus: { name: "ASC", categories: { name: "ASC", products: { name: "ASC" }, subcategories: { name: "ASC", products: { name: "ASC" } } } },
			},
		});

		if (!branch) throw new NotFoundException_C(ErrorList.BranchNotFound);

		//const menuActive = this.menuService.findActiveMenu(branch.menus); -- ESTO ES FILTRO EN BASE AL HORARIO

		const menuFinded: Menu = branch.menus?.find((menu) => menu.enabled);
		const { menuPalettes, ...menuRest } = menuFinded ?? ({ menuPalettes: undefined } as Menu);

		const palette = menuPalettes?.find((palette) => palette.enabled);

		menuRest?.categories?.forEach((category) => {
			category.products = category.products?.filter((product) => product.enabled == true) ?? null;
			category.subcategories?.forEach((subcategory) => (subcategory.products = subcategory.products?.filter((product) => product.enabled == true) ?? []));
		});

		branch.schedules = branch.schedules?.filter((schedule) => schedule.enabled) ?? null;

		const { menus, ...branchRest } = branch;
		return {
			...branchRest,
			menu: {
				...menuRest,
				palette,
			},
			//menuActive
		};
	}

	async findOneByIdFiltered(id: number) {
		const branch = await this.branchRepository.findOne({
			where: {
				id,
			},
			relations: [
				"business",
				"branchMembers",
				"schedules.promotion",
				"branchMembers.user",
				"menus",
				/*"menus.schedules",*/
				"menus.categories",
				"menus.menuPalettes",
				"menus.categories.products",
				"menus.categories.subcategories.products",
			],
			order: {
				name: "ASC",
				business: { name: "ASC" },
				schedules: { days: "ASC" },
				menus: { name: "ASC", categories: { name: "ASC", products: { name: "ASC" }, subcategories: { name: "ASC", products: { name: "ASC" } } } },
			},
		});

		if (!branch) throw new NotFoundException_C(ErrorList.BranchNotFound);

		//const menuActive = this.menuService.findActiveMenu(branch.menus); -- ESTO ES FILTRO EN BASE AL HORARIO

		const menuFinded: Menu = branch.menus?.find((menu) => menu.enabled);
		const { menuPalettes, ...menuRest } = menuFinded ?? ({ menuPalettes: undefined } as Menu);

		const palette = menuPalettes?.find((palette) => palette.enabled);

		menuRest?.categories?.forEach((category) => {
			category.products = category.products?.filter((product) => product.enabled == true) ?? null;
			category.subcategories?.forEach((subcategory) => (subcategory.products = subcategory.products?.filter((product) => product.enabled == true) ?? []));
		});

		branch.schedules = branch.schedules?.filter((schedule) => schedule.enabled) ?? null;

		const { menus, ...branchRest } = branch;
		return {
			...branchRest,
			menu: {
				...menuRest,
				palette,
			},
			//menuActive
		};
	}

	async findOneWithBusiness(branchid: number, businessid: number) {
		const branch = await this.branchRepository.findOne({
			where: {
				id: branchid,
				business: {
					id: businessid,
				},
			},
			relations: ["business", "branchMembers", "branchMembers.user", "schedules.promotion"],
			order: {
				name: "ASC",
				business: { name: "ASC" },
				branchMembers: { user: { name: "ASC" } },
			},
		});

		if (!branch) throw new BadRequestException_C(ErrorList.BranchNotFound);

		return branch;
	}

	async getMembers(id: number, businessid: number, filters: { name: string; email: string; role: string } = undefined) {
		const query = this.branchRepository
			.createQueryBuilder("branch")
			.leftJoinAndSelect("branch.branchMembers", "branchMember")
			.leftJoinAndSelect("branchMember.user", "user")
			.where("branch.id = :id", { id })
			.andWhere("branch.businessId = :businessid", { businessid });

		if (filters) {
			if (filters.name) {
				query.andWhere("user.name ILIKE :name", { name: `%${filters.name}%` });
			}
			if (filters.email) {
				query.andWhere("user.email ILIKE :email", { email: `%${filters.email}%` });
			}
			if (filters.role) {
				query.andWhere("branchMember.role = :role", { role: filters.role });
			}
		}

		const branch = await query.orderBy("user.name", "ASC").getOne();

		if (!branch) throw new BadRequestException_C(ErrorList.UserNotFound);

		return branch.branchMembers;
	}

	async findAllSuperAdmin() {
		const branches = await this.branchRepository.find({
			relations: ["business", "schedules.promotion", "branchMembers", "branchMembers.user"],
		});

		if (!branches) throw new NotFoundException_C(ErrorList.BranchNotFound);

		return branches;
	}

	async findOneSuperAdmin(id: number) {
		const branch = await this.branchRepository.findOne({
			where: {
				id,
			},
			relations: ["business", "schedules.promotion", "branchMembers", "branchMembers.user"],
			order: {
				name: "ASC",
				business: { name: "ASC" },
				branchMembers: { user: { name: "ASC" } },
			},
		});

		if (!branch) throw new NotFoundException_C(ErrorList.BranchNotFound);

		return branch;
	}

	async getSummaryByBusinessId(businessId: number): Promise<BranchesSummaryDTO> {
		const userId = this.clsService.get("user")?.id;

		const branches = await this.branchRepository.find({
			where: {
				business: { id: businessId },
				branchMembers: { user: { id: userId } },
			},
			relations: ["menus"],
			order: {
				name: "ASC",
				menus: { name: "ASC" },
			},
		});

		const totalBranches = branches.length;
		const totalMenus = branches.reduce((acc, branch) => acc + branch.menus.length, 0);

		return {
			totalBranches,
			totalMenus,
		};
	}

	async findAllByBusinessId(businessId: number): Promise<BranchWithSummaryDTO[]> {
		const userId = this.clsService.get("user")?.id;

		const branches = await this.branchRepository.find({
			where: {
				business: { id: businessId },
				branchMembers: { user: { id: userId } },
			},
			relations: ["menus", "schedules.promotion"],
			order: {
				name: "ASC",
				menus: { name: "ASC" },
				schedules: { days: "ASC" },
			},
		});

		const formattedBranches: BranchWithSummaryDTO[] = branches.map(({ menus, ...branch }) => ({
			...branch,
			currency: branch.currency as CurrencyList,
			summary: {
				totalMenus: menus.length,
			},
		}));

		return formattedBranches;
	}

	async permanentRemove(id: number) {
		const branch = await this.branchRepository.findOne({
			where: { id },
			withDeleted: true,
		});
		if (!branch) throw new NotFoundException_C(ErrorList.BranchNotFound);
		return this.branchRepository.remove(branch);
	}

	async copy(fromBranchId: number, copyBranchDTO: CopyBranchDTO) {
		const { toBusinessId } = copyBranchDTO;
		const business: Business = this.clsService.get("business");
		const user: User = this.clsService.get("user");

		const branch = await this.branchRepository.findOne({
			where: {
				id: fromBranchId,
				business: { id: business.id },
			},
			relations: { schedules: { promotion: true }, branchMembers: { user: true }, menus: true },
		});

		if (!branch) throw new NotFoundException_C(ErrorList.BranchNotFound);

		const toBusiness = await this.businessService.findOne(toBusinessId, user.id);

		async function getCopyLabel() {
			async function alreadyExists(name: string) {
				const baseName = branch.name.includes(" - Copy") ? branch.name.substring(0, branch.name.lastIndexOf(" - Copy")) : branch.name;
				const exists = await this.branchRepository.exist({
					where: {
						name: `${baseName} - ${name}`,
						business: { id: toBusinessId },
					},
				});
				return exists;
			}

			const baseName = branch.name.includes(" - Copy") ? branch.name.substring(0, branch.name.lastIndexOf(" - Copy")) : branch.name;

			if (!(await alreadyExists.call(this, "Copy"))) return `${baseName} - Copy`;
			else {
				let i = 2;
				while (await alreadyExists.call(this, `Copy (${i})`)) i++;
				return `${baseName} - Copy (${i})`;
			}
		}

		const copyLabel = await getCopyLabel.call(this);

		const newBranch = await this.branchRepository.save({
			...branch,
			id: undefined,
			business: { id: toBusinessId },
			menus: undefined,
			branchMembers: undefined,
			schedules: await Promise.all(
				branch.schedules
					?.filter((schedule) => !schedule.promotion)
					.map(async (schedule) => {
						return await this.scheduleService.createDirect({
							...schedule,
							id: undefined,
							branch: undefined,
							menu: undefined,
							promotion: undefined,
						});
					}),
			),
			logo: undefined,
			name: copyLabel,
			//slug: copyLabel,
		});

		newBranch.logo = branch.logo ? await this.uploadService.copyImage(branch.logo, "Logo", false, toBusiness, newBranch) : null;

		await this.branchRepository.update(newBranch.id, { logo: newBranch.logo });

		newBranch.branchMembers = await Promise.all(
			branch.branchMembers.map(async (member) => {
				const newMember = await this.memberService.createDirect({
					status: member.status,
					role: member.role,
					enabled: member.enabled,
					user: member.user,
					id: undefined,
					branch: newBranch,
				});
				const memberPermssions = await this.memberService.findOneByUserID(member.user.id, branch);
				await this.permissionService.addPermission(
					member.user.id,
					business,
					newBranch,
					[],
					memberPermssions.permissions.filter((permission) => permission.module != ModuleEnum.BUSINESSES),
				);

				return member;
			}),
		);

		newBranch.menus = await Promise.all(
			branch.menus?.map(async (menu) => {
				return await this.menuService.copy(menu.id, { toBranchId: newBranch.id }, true);
			}),
		);

		return newBranch;
	}

	async move(fromBranchId: number, moveBranchDTO: MoveBranchDTO) {
		const { toBusinessId } = moveBranchDTO;
		const business = this.clsService.get("business");
		const user: User = this.clsService.get("user");

		const branch = await this.branchRepository.findOne({
			where: {
				id: fromBranchId,
				business: { id: business.id },
			},
		});

		await this.businessService.findOne(toBusinessId);

		if (!branch) throw new NotFoundException_C(ErrorList.BranchNotFound);

		await this.uploadService.moveFolder(
			`/${process.env.STAGE}/buk${business.id}/branches/${branch.id}`,
			`/${process.env.STAGE}/buk${toBusinessId}/branches/${branch.id}`,
		);

		return await this.branchRepository.save({
			...branch,
			business: { id: toBusinessId },
		});
	}

	async countByBusinessId(businessId: number): Promise<number> {
		const count = await this.branchRepository.count({
			where: { business: { id: businessId } },
		});

		return count ?? 0;
	}

	async branchMemberCount(branchId: number): Promise<number> {
		const count = await this.memberService.count(branchId);

		return count ?? 0;
	}

	async totalMenus(businessId: number): Promise<number> {
		const branches = await this.branchRepository.find({
			where: { business: { id: businessId } },
			relations: ["menus"],
		});

		if (!branches) throw new NotFoundException_C(ErrorList.BranchNotFound);

		const totalMenus = branches.reduce((acc, branch) => acc + branch.menus.length, 0);
		return totalMenus;
	}
}
