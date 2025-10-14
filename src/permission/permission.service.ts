import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Permission } from "./entities/permission.entity";
import { Repository } from "typeorm";
import { CreatePermissionDTO } from "./dtos/create-permission.dto";
import { ErrorList } from "src/common/enums/error.enum";
import { BadRequestException_C } from "src/common/Custom/http-response";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";
import { UpdatePermissionDTO } from "./dtos/update-permission.dto";
import { BranchMember } from "src/member/entities/branch_member.entity";
import { BusinessOwner } from "src/business/entities/business-owner.entity";
import { MemberService } from "src/member/member.service";
import { BusinessService } from "src/business/business.service";
import { GeneralsPermissionsList, PermissionListInterface } from "src/common/permissions/generals.list";
import { ClsService } from "nestjs-cls";
import { RoleEnum, RoleKey } from "src/common/enums/role.enum";
import { Business } from "src/business/entities/business.entity";
import { Branch } from "src/branch/entities/branch.entity";
import { ModuleEnum } from "src/common/enums/modules.enum";
import { BasePermissionsDTO } from "./dtos/base-permission.dto";

@Injectable()
export class PermissionService {
	constructor(
		@InjectRepository(Permission) private permissionRepository: Repository<Permission>,
		@Inject(forwardRef(() => MemberService)) private memberService: MemberService,
		@Inject(forwardRef(() => BusinessService)) private businessService: BusinessService,
		@Inject(forwardRef(() => ClsService)) private clsService: ClsService,
	) {}

	async create(createPermissionDTO: CreatePermissionDTO) {
		const permission = await this.permissionRepository.create(createPermissionDTO);
		const { branchMemberId, businessOwnerId } = createPermissionDTO;

		if (branchMemberId && businessOwnerId) throw new BadRequestException_C(ErrorList.PermissionOnlyOneParameterAllowed);
		if (!branchMemberId && !businessOwnerId) throw new BadRequestException_C(ErrorList.PermissionOneParameterRequired);

		if (!permission) throw new BadRequestException_C(ErrorList.PermissionCreationError);

		if (branchMemberId) {
			const branchMember = await this.memberService.findOne(branchMemberId);
			permission.branchMember = branchMember;
		}

		if (businessOwnerId) {
			const businessOwner = await this.businessService.findOneBusinessOwner(businessOwnerId);
			permission.businessOwner = businessOwner;
		}

		const permissionSaved = await this.permissionRepository.save(permission);

		if (!permissionSaved) throw new BadRequestException_C(ErrorList.PermissionCreationError);

		return permissionSaved;
	}
	async createArray(createPermissionsDTO: CreatePermissionDTO[]) {
		let permissions: Permission[] = [];

		const { branchMemberId, businessOwnerId } = createPermissionsDTO[0];

		if (branchMemberId && businessOwnerId) throw new BadRequestException_C(ErrorList.PermissionOnlyOneParameterAllowed);
		if (!branchMemberId && !businessOwnerId) throw new BadRequestException_C(ErrorList.PermissionOneParameterRequired);

		let branchMember: BranchMember = null;
		let businessOwner: BusinessOwner = null;

		if (branchMemberId) {
			branchMember = await this.memberService.findOne(branchMemberId);
		}

		if (businessOwnerId) {
			businessOwner = await this.businessService.findOneBusinessOwner(businessOwnerId);
		}

		for (const createPermissionDTO of createPermissionsDTO) {
			const permission = await this.permissionRepository.create(createPermissionDTO);

			if (!permission) throw new BadRequestException_C(ErrorList.PermissionCreationError);

			if (branchMemberId) permission.branchMember = branchMember;
			if (businessOwnerId) permission.businessOwner = businessOwner;

			permissions.push(permission);
		}

		const permissionsSaved = await this.permissionRepository.save(permissions);

		if (!permissionsSaved && permissionsSaved.length == 0) throw new BadRequestException_C(ErrorList.PermissionCreationError);

		return permissionsSaved;
	}

	async findOne(id: number) {
		const permission = await this.permissionRepository.findOne({ where: { id } });
		if (!permission) throw new BadRequestException_C(ErrorList.PermissionNotFound);

		return permission;
	}

	async findAll(id: number, branchParam: Branch = null) {
		const branch: Branch = branchParam ? branchParam : this.clsService.get("branch");
		const business = this.clsService.get("business");

		const permissions: Permission[] = [];

		const qb = this.permissionRepository
			.createQueryBuilder("permission")
			.leftJoin("permission.branchMember", "branchMember")
			.leftJoin("branchMember.user", "user")
			.leftJoin("branchMember.branch", "branchMemberBranch")
			.leftJoin("permission.businessOwner", "businessOwner")
			.leftJoin("businessOwner.user", "businessOwnerUser")
			.leftJoin("businessOwner.business", "business")

			.where("(user.id = :id OR businessOwnerUser.id = :id)", { id });

		if (business) {
			const qbCopy = qb.clone();
			qbCopy.andWhere("business.id = :businessId", { businessId: business.id });
			const temp = await qbCopy.getMany();
			permissions.push(...temp);
		}

		if (branch) {
			const qbTemp = qb.clone().andWhere("branchMember.branch.id = :branchId", { branchId: branch.id });
			const temp = await qbTemp.getMany();
			permissions.push(...temp);
		}

		if (!permissions) throw new BadRequestException_C(ErrorList.PermissionNotFound);

		return permissions;
	}

	async update(id: number, updatePermissionDTO: UpdatePermissionDTO) {
		const permission = await this.findOne(id);

		if (!permission) throw new BadRequestException_C(ErrorList.PermissionNotFound);

		Object.assign(permission, updatePermissionDTO);

		const updatedPermission = await this.permissionRepository.save(permission);

		if (!updatedPermission) throw new BadRequestException_C(ErrorList.PermissionUpdateError);

		return updatedPermission;
	}

	async delete(id: number) {
		const permission = await this.findOne(id);
		if (!permission) throw new BadRequestException_C(ErrorList.PermissionNotFound);

		const deletedPermission = await this.permissionRepository.softRemove(permission);
		if (!deletedPermission) throw new BadRequestException_C(ErrorList.PermissionDeleteError);

		return deletedPermission;
	}

	async addRolePermissions(
		userId: number,
		role: RoleKey,
		onlyIfpermissionsExists: boolean = false,
		businessParam: Business = null,
		branchParam: Branch = null,
	) {
		const branchSaved = branchParam ?? this.clsService.get("branch");
		const business = businessParam ?? this.clsService.get("business");

		const permissionsToApply = GeneralsPermissionsList.find((permissions) => permissions.role == role);

		const userPermissions = await this.findAll(userId, branchParam);

		if ((!userPermissions || userPermissions?.length == 0) && onlyIfpermissionsExists) throw new BadRequestException_C(ErrorList.PermissionUpdateError);

		const branches: Branch[] = [branchSaved];
		let totalBranches = branches.length;

		const newUserPermission: Permission[] = [];

		for (let x = 0; x < totalBranches; x++) {
			const branch = branches[x];
			const businessPermissionsToApplyIndex = permissionsToApply.permissions.findIndex((perm) => perm.module == ModuleEnum.BUSINESSES);
			if (businessPermissionsToApplyIndex >= 0) {
				const branchesInBusiness = await this.businessService.getBranches(business.id);
				const branchesInBusinessFiltered = branchesInBusiness.filter((branchInBusiness) => branchInBusiness.id != branch.id);
				totalBranches += branchesInBusinessFiltered.length;
				branches.push(...branchesInBusinessFiltered);
				const businessPermissionsToApply = permissionsToApply.permissions.splice(businessPermissionsToApplyIndex, 1);
				const permission = await this.addPermission(userId, business, null, userPermissions, businessPermissionsToApply);
				newUserPermission.push(...permission);
			} else {
				const permission = await this.addPermission(userId, business, branch, userPermissions, permissionsToApply.permissions);
				newUserPermission.push(...permission);
			}
		}

		return newUserPermission;
	}

	async updateRolePermissions(userId: number, updatePermission: UpdatePermissionDTO) {
		const { role } = updatePermission;

		return await this.addRolePermissions(userId, role, true);
	}

	async addPermission(userId: number, business: Business, branch: Branch, userPermissions: Permission[], permissionsToApply: BasePermissionsDTO[]) {
		const newUserPermissions: Permission[] = [];
		for (const permission of permissionsToApply) {
			const userPermissionAlreadyExist = userPermissions.find((userPermission) => userPermission.module == permission.module);

			if (userPermissionAlreadyExist) {
				userPermissionAlreadyExist.actions = permission.actions;

				const permissionUpdated = await this.permissionRepository.save(userPermissionAlreadyExist);

				newUserPermissions.push(permissionUpdated);
			} else {
				const newPermission: Permission = new Permission();

				newPermission.module = permission.module;
				newPermission.actions = permission.actions;

				if (branch && newPermission.module != ModuleEnum.BUSINESSES) newPermission.branchMember = await this.memberService.findOneByUserID(userId, branch);
				else if (business && newPermission.module == ModuleEnum.BUSINESSES) {
					try {
						newPermission.businessOwner = await this.businessService.findOneBusinessOwnerByUserId(userId, business);
					} catch {}
				}

				const permissionCreated = await this.permissionRepository.save(newPermission);

				newUserPermissions.push(permissionCreated);
			}
		}

		const userPermissionsTemp = [...userPermissions];

		if (newUserPermissions.length < userPermissions.length) {
			newUserPermissions.forEach((newUserPermission) => {
				const permissionIndex = userPermissionsTemp.findIndex((perm) => perm.module == newUserPermission.module);

				if (permissionIndex >= 0) {
					userPermissionsTemp.splice(permissionIndex, 1);
				}
			});
		}

		for (const userPermission of userPermissionsTemp) {
			await this.delete(userPermission.id);
		}

		return newUserPermissions;
	}

	async deleteRolePermissions(userId: number, role: RoleKey) {
		const branchSaved = this.clsService.get("branch");
		const clsBusiness: Business = this.clsService.get("business");
		const business = await this.businessService.findOne(clsBusiness.id, undefined, true);
		const businessBranches = await this.businessService.getBranches(business.id);
		const permissionsToApply = GeneralsPermissionsList.find((permissions) => permissions.role == role);

		let branches: Branch[] = [branchSaved];

		if (role == RoleEnum.owner) {
			branches = businessBranches;
		}

		const modulesToApply = permissionsToApply.permissions.map(({ module }) => module);
		let businessModuleIndex = modulesToApply.findIndex(() => ModuleEnum.BUSINESSES);

		for (let x = 0; x < branches.length; x++) {
			const branch = branches[x];
			const userPermissions = await this.findAll(userId, branch);

			if (businessModuleIndex >= 0) {
				const modules = modulesToApply.splice(businessModuleIndex, 1);

				await this.deletePermissions(userId, business, null, modules, userPermissions);
				businessModuleIndex = -1;
			}

			const userPermissionsCopy = [...userPermissions];

			await this.deletePermissions(userId, business, branch, modulesToApply, userPermissionsCopy);
		}

		return null;
	}

	private async deletePermissions(userId: number, business: Business, branch: Branch, modules: ModuleEnum[], userPermissions: Permission[]) {
		const userPermissionCount = userPermissions.length;
		for (let x = 0; x < userPermissionCount; x++) {
			const userPermissionIndex = userPermissions.findIndex((userPermission) => modules.find((module) => module == userPermission.module));
			if (userPermissionIndex >= 0) {
				await this.permissionRepository.softRemove(userPermissions[userPermissionIndex]);
				userPermissions.splice(userPermissionIndex, 1);
			}
		}

		return userPermissions;
	}
}
