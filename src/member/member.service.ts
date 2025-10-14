import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { ClsService } from "nestjs-cls";
import { BranchService } from "src/branch/branch.service";
import { Branch } from "src/branch/entities/branch.entity";
import { BadRequestException_C, NotFoundException_C } from "src/common/Custom/http-response";
import { ErrorList } from "src/common/enums/error.enum";
import { Business } from "src/business/entities/business.entity";
import { UsersService } from "src/users/users.service";
import { AddMemberToBranchDTO } from "./dtos/add-member-to-branch.dto";
import { BranchMember } from "./entities/branch_member.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateUserMemberDTO } from "./dtos/update-user-member.dto";
import { AddMemberToBranchSuperAdminDTO } from "./dtos/add-member-to-branch-super-admin.dto";
import { UpdateUserMemberSuperAdminDTO } from "./dtos/update-user-member-super-admin.dto";
import { RoleMap } from "src/common/constants/roles.constants";
import { User } from "src/users/entities/user.entity";
import { BusinessService } from "src/business/business.service";
import { EmailService } from "src/email/email.service";
import { AuthService } from "src/auth/auth.service";
import { PermissionService } from "src/permission/permission.service";
import { GeneralsPermissionsList } from "src/common/permissions/generals.list";
import { BusinessOwner } from "src/business/entities/business-owner.entity";
import { Permission } from "src/permission/entities/permission.entity";
import { RoleEnum, RoleKey } from "src/common/enums/role.enum";
import { ModuleEnum } from "src/common/enums/modules.enum";
import { CreatePermissionDTO } from "src/permission/dtos/create-permission.dto";
import { response } from "express";

@Injectable()
export class MemberService {
	constructor(
		@InjectRepository(BranchMember) private branchMemberRepository: Repository<BranchMember>,
		@Inject(forwardRef(() => BusinessService)) private businessService: BusinessService,
		@Inject(forwardRef(() => BranchService)) private branchService: BranchService,
		@Inject(forwardRef(() => ClsService)) private clsService: ClsService,
		@Inject(forwardRef(() => UsersService)) private usersService: UsersService,
		@Inject(forwardRef(() => AuthService)) private authService: AuthService,
		@Inject(forwardRef(() => PermissionService)) private permissionService: PermissionService,
	) {}

	async addUserToBranch(addMemberToBranchDTO: AddMemberToBranchDTO | AddMemberToBranchSuperAdminDTO, enableErrorOnExists = false) {
		const business: Business = this.clsService.get("business");
		const { role, email, name, password, status } = addMemberToBranchDTO;
		const branch = this.clsService.get("branch");

		const branchMembers = await this.branchService.getMembers(branch.id, business.id);
		const businessBranches = await this.businessService.getBranches(business.id);

		if (!businessBranches.find((_branch) => _branch.id == branch.id)) throw new BadRequestException_C(ErrorList.BranchNotFound);
		if (branchMembers.find((member) => member.user.email == email)) throw new BadRequestException_C(ErrorList.UserAlreadyExist);

		let user: User = null;

		try {
			user = await this.usersService.findOneRaw(email);
			if (enableErrorOnExists && user) return new BadRequestException_C(ErrorList.UserAlreadyExist);
		} catch (err) {
			const newUser = await this.usersService.create({
				email,
				name,
				surname: null,
				phone: null,
				password,
			});
			user = await this.usersService.findOneRaw(newUser.id);
			//const sta = await this.authService.sendInvitation(user.id, name, email, business, branch);
			//console.log("Invitation sent", sta);
		}

		let branchMember: BranchMember = new BranchMember();

		branchMember.user = user;
		branchMember.role = role;
		branchMember.branch = branch;
		branchMember.permissions = null;
		branchMember.status = status;

		const response = await this.branchMemberRepository.createQueryBuilder().insert().into(BranchMember).values(branchMember).returning("id").execute();
		branchMember.id = response.identifiers[0].id;

		const permissionListFinded = GeneralsPermissionsList.find((gP) => gP.role == role);

		if (!permissionListFinded) throw new BadRequestException_C(ErrorList.RoleNotFound);

		const permissionListFindedFiltered = permissionListFinded?.permissions; //?.filter((permission) => permission.module != ModuleEnum.BUSINESSES) ?? null;
		const permissions = permissionListFindedFiltered ?? null;

		if (permissions) {
			const createPermissionDTOArray: CreatePermissionDTO[] = [];
			for (const permission of permissions) {
				createPermissionDTOArray.push({
					actions: permission.actions,
					module: permission.module,
					branchMemberId: branchMember.id,
				});
			}
			await this.permissionService.createArray(createPermissionDTOArray);
		}

		return branchMember;
	}

	async updateUserMember(updateMember: UpdateUserMemberDTO | UpdateUserMemberSuperAdminDTO, admin: boolean = false) {
		const { enabled, role, status, email } = updateMember;
		const business: Business = this.clsService.get("business");
		const branch: Branch = this.clsService.get("branch");
		const user: User = this.clsService.get("user");

		const branchMembers = await this.branchService.getMembers(branch.id, business.id);
		const businessBranches = await this.businessService.getBranches(business.id);
		const userBranchMember = await this.usersService.getBranchMember(user.id);

		if (!businessBranches.find((_branch) => _branch.id == branch.id)) throw new BadRequestException_C(ErrorList.BranchNotFound);

		const branchMemberIndex = branchMembers.findIndex((bm) => bm.user.email == email);

		if (branchMemberIndex < 0) throw new BadRequestException_C(ErrorList.UserNotFound);

		const branchMember = branchMembers[branchMemberIndex];

		if (!admin) {
			const userBranch = userBranchMember.find((member) => member.branch.id == branch.id);
			const role = branchMembers[branchMemberIndex].role;
			const value = RoleMap[role];
			const userValue = RoleMap[userBranch.role];

			if (value < RoleMap.superAdmin && value < userValue) throw new BadRequestException_C(ErrorList.MemberRoleForbidden);
		}

		/*
        if(permissions){
            for(const permission of permissions) {
                const newPermission = await this.permissionService.create(permission);
                branchMember.permissions.push(newPermission);
            };
        }*/

		branchMember.enabled = enabled;
		branchMember.role = role;
		branchMember.status = status;

		return await this.branchMemberRepository.save(branchMember);
	}

	async deleteUserMember(userId: number, admin: boolean = false) {
		const business: Business = this.clsService.get("business");
		const branch: Branch = this.clsService.get("branch");
		const user: User = this.clsService.get("user");

		const branchMembers = await this.branchService.getMembers(branch.id, business.id);
		const businessBranches = await this.businessService.getBranches(business.id);
		const userBranchMember = await this.usersService.getBranchMember(user.id);

		if (!businessBranches.find((_branch) => _branch.id == branch.id)) throw new BadRequestException_C(ErrorList.BranchNotFound);

		const branchMemberIndex = branchMembers.findIndex((bm) => bm.user.id == userId);

		if (branchMemberIndex < 0) throw new BadRequestException_C(ErrorList.UserNotFound);

		if (!admin) {
			const userBranch = userBranchMember.find((member) => member.branch.id == branch.id);
			const role = branchMembers[branchMemberIndex].role;
			const value = RoleMap[role];
			const userValue = RoleMap[userBranch.role];

			if (value < RoleMap.superAdmin && value < userValue) throw new BadRequestException_C(ErrorList.MemberRoleForbidden);
		}

		const branchMember = branchMembers[branchMemberIndex];

		return await this.branchMemberRepository.softRemove(branchMember);
	}

	async findOneMember(id: number = null, role: string = undefined, name: string = undefined, email: string = undefined) {
		const branch: Branch = this.clsService.get("branch");
		const business: Business = this.clsService.get("business");
		const members = await this.branchService.getMembers(branch.id, business.id, { role, name, email });
		if (id) {
			const member = members.find((member) => member.user.id == id);
			if (!member) throw new BadRequestException_C(ErrorList.UserNotFound);
			const { password, branchMembers, businessOwners, version, ...rest } = member.user;
			return rest;
		}

		return members;
	}

	async findOne(id: number) {
		const branch: Branch = this.clsService.get("branch");
		const member = await this.branchMemberRepository.findOne({
			where: {
				id,
				branch: {
					id: branch?.id ?? undefined,
				},
			},
		});

		if (!member) throw new NotFoundException_C(ErrorList.MemberNotFound);

		return member;
	}

	async findOneByUserID(userId: number, branchParam: Branch = null) {
		const branch: Branch = branchParam ? branchParam : this.clsService.get("branch");
		const member = await this.branchMemberRepository.findOne({
			where: {
				user: { id: userId },
				branch: { id: branch?.id ?? undefined },
			},
			relations: { permissions: true },
		});

		if (!member) throw new NotFoundException_C(ErrorList.MemberNotFound);

		return member;
	}

	async getSummary() {
		const members = (await this.findOneMember()) as BranchMember[];

		return {
			totalMembers: members.length,
		};
	}

	async createDirect(params: Partial<BranchMember>) {
		return await this.branchMemberRepository.save(params);
	}

	async count(branchId: number): Promise<number> {
		const count = await this.branchMemberRepository.count({
			where: { branch: { id: branchId } },
		});
		return count ?? 0;
	}
}
