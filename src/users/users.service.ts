import { BadRequestException, forwardRef, Get, Inject, Injectable, Post, Query } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Not, Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { ErrorList } from "src/common/enums/error.enum";
import { BadRequestException_C, NotFoundException_C } from "src/common/Custom/http-response";
import { BranchService } from "src/branch/branch.service";
import { ClsService } from "nestjs-cls";
//import { EmailService } from 'src/email/email.service';
import { BusinessService } from "src/business/business.service";
import { UploadService } from "src/upload/upload.service";
import { Branch } from "src/branch/entities/branch.entity";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { isNotEmpty } from "class-validator";
import { JwtService } from "@nestjs/jwt";
import { ModuleEnum } from "src/common/enums/modules.enum";
import { Permission } from "src/permission/entities/permission.entity";
import { GlobalRole } from "src/common/enums/global-role.enum";
import { Business } from "src/business/entities/business.entity";
import { SubscriptionService } from "src/subscription/substription.service";
export { ErrorType } from "../common/enums/error.enum";

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User) private userRepository: Repository<User>,
		@Inject(forwardRef(() => BranchService)) private branchService: BranchService,
		@Inject(forwardRef(() => ClsService)) private clsService: ClsService,
		//@Inject(forwardRef(()=> EmailService)) private emailService: EmailService,
		@Inject(forwardRef(() => BusinessService)) private businessService: BusinessService,
		@Inject(forwardRef(() => UploadService)) private uploadService: UploadService,
		@Inject(forwardRef(() => SubscriptionService)) private subscriptionService: SubscriptionService,
	) {}

	async create(createUserDto: CreateUserDto) {
		const { password, email, name, phone, surname } = createUserDto;
		const emailToLower = email.toLowerCase();

		const userChecked = await this.checkEmailExist(emailToLower);
		if (userChecked) throw new BadRequestException_C(ErrorList.UserAlreadyExist);

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = password ? await bcrypt.hash(password, salt) : "";

		const user: User = new User();

		user.name = name;
		user.surname = surname;
		user.email = emailToLower;
		user.phone = phone;
		user.password = hashedPassword;

		user.subscription = await this.subscriptionService.createBasicSubscription()

		await this.userRepository.save(user);

		return {
			id: user.id,
			name: user.name,
			surname: user.surname,
			email: user.email,
		};
	}

	async checkEmailExist(email: string, passwordShow: boolean = false) {
		const emailToLower = email.toLowerCase();
		const userFind = await this.userRepository
			.createQueryBuilder("user")
			.addSelect(passwordShow ? "user.password" : "")
			.leftJoinAndSelect("user.branchMembers", "branchMembers")
			.where("user.email = :email", { email: emailToLower })
			.getOne();

		if (!userFind) return null;

		return userFind;
	}

	async findAll() {
		return this.userRepository.find();
	}

	async remove(id: number) {
		const user = await this.findOneRaw(id);
		return this.userRepository.remove(user);
	}

	async permanentRemove(id: number) {
		const user = await this.userRepository.findOneBy({ id });
		return this.userRepository.remove(user);
	}

	async findOne(id: number, checkPermission: boolean = true, passwordShow: boolean = false) {
		const branch: Branch = this.clsService.get("branch");
		const user = await this.userRepository
			.createQueryBuilder("user")
			.addSelect(passwordShow ? "user.password" : "")
			.leftJoinAndSelect("user.branchMembers", "branchMembers")
			.leftJoinAndSelect("user.businessOwners", "businessOwners")
			.where("user.id = :id", { id })
			.getOne();

		if (!user) throw new NotFoundException_C(ErrorList.UserNotFound);

		if (checkPermission) {
			const branchMemberFinded = user.branchMembers.find((branchMember) => branchMember.id == branch.id);

			if (!branchMemberFinded) throw new BadRequestException_C(ErrorList.BranchNotFound);

			const businessOwnerFinded = user.businessOwners.find((businessOwner) => businessOwner.business.id == branch.business.id);

			return {
				id: user.id,
				email: user.email,
				role: branchMemberFinded.role,
				permission: [...branchMemberFinded.permissions, ...businessOwnerFinded.permissions],
			};
		} else {
			return {
				id: user.id,
				email: user.email,
				branches: user.branchMembers,
				businesses: user.businessOwners,
			};
		}
	}

	async findOneAdmin(id: number, passwordShow: boolean = false) {
		const user = await this.userRepository
			.createQueryBuilder("user")
			.addSelect(passwordShow ? "user.password" : "")
			.leftJoinAndSelect("user.branchMembers", "branchMembers")
			.where("user.id = :id", { id })
			.getOne();

		if (!user) throw new NotFoundException_C(ErrorList.UserNotFound);

		return {
			id: user.id,
			email: user.email,
			branches: user.branchMembers,
		};
	}

	async findOneRaw(id: number | string, passwordShow: boolean = false) {
		const user = await this.userRepository
			.createQueryBuilder("user")
			.addSelect(passwordShow ? "user.password" : "")
			.leftJoinAndSelect("user.branchMembers", "branchMembers")
			.leftJoinAndSelect("user.subscription", "subscription")
			.where(typeof id == "string" ? "user.email = :id" : "user.id = :id", { id })
			.getOne();

		if (!user) throw new NotFoundException_C(ErrorList.UserNotFound);

		return user;
	}

	async getUserPermissions(id: number, module: ModuleEnum) {
		const business: Business = this.clsService.get("business");
		const branch: Branch = this.clsService.get("branch");
		const qb = this.userRepository
			.createQueryBuilder("user")
			.leftJoinAndSelect("user.businessOwners", "businessOwner")
			.leftJoinAndSelect("businessOwner.business", "business")
			.leftJoinAndSelect("businessOwner.permissions", "boPermissions")
			.leftJoinAndSelect("boPermissions.businessOwner", "boOfPermission")
			.leftJoinAndSelect("user.branchMembers", "branchMember")
			.leftJoinAndSelect("branchMember.branch", "branch")

		if(branch){
			qb.leftJoinAndSelect("branchMember.permissions", "bmPermissions")
			.leftJoinAndSelect("bmPermissions.branchMember", "bmOfPermission")
			.where("user.id = :id", { id })
			.andWhere("(boPermissions.module = :module OR bmPermissions.module = :module)", { module })
			.andWhere("business.id = :businessId OR branch.id = :branchId", { businessId: business?.id, branchId: branch?.id })

		}
		else{
			qb.where("user.id = :id", { id })
				.andWhere("boPermissions.module = :module", { module })
				.andWhere("business.id = :businessId", { businessId: business?.id})
		}
			const user = await qb.getOne();

		if (!user) return null;

		const userBranchPermissions = user.branchMembers.flatMap((branchMember) => {
			const permission = branchMember.permissions.filter((permission) => permission.module === module);
			for (let x = 0; x < permission.length; x++) {
				permission[x].branchMember.branch = branchMember.branch;
			}

			return permission;
		});

		const userBusinessPermissions = user.businessOwners.flatMap((businessOwner) => {
			const permission = businessOwner.permissions.filter((permission) => permission.module === module);
			for (let x = 0; x < permission.length; x++) {
				permission[x].businessOwner.business = businessOwner.business;
			}
			return permission;
		});

		return [...userBranchPermissions, ...userBusinessPermissions];
	}

	async resetPassword(newpassword: string) {
		const user: User = this.clsService.get("user");
		if (!user) throw new BadRequestException_C(ErrorList.UserNotFound);
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(newpassword, salt);
		user.password = hashedPassword;

		await this.userRepository.save(user);
		//await this.emailService.passwordResetSuccess(user.email, user);

		return "Success";
	}

	async getBranchMember(id: number) {
		const user = await this.userRepository.findOne({
			where: {
				id,
			},
			relations: ["branchMembers", "branchMembers.branch"],
			order: {
				email: "ASC",
				branchMembers: { id: "ASC", branch: { name: "ASC" } },
			},
		});

		if (!user) throw new BadRequestException_C(ErrorList.UserNotFound);

		return user.branchMembers;
	}

	async update(updateUserDTO: UpdateUserDTO) {
		const { password, oldPassword, ...updateUserRest } = updateUserDTO;
		const user = await this.findOneRaw(updateUserRest.email, true);
		Object.keys(updateUserRest).forEach((key) => {
			if (isNotEmpty(updateUserRest[key])) {
				user[key] = updateUserRest[key];
			}
		});

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = isNotEmpty(password) ? await bcrypt.hash(password, salt) : "";
		const isOldPasswordValid = isNotEmpty(user.password) && (await bcrypt.compare(oldPassword, user.password));

		if (isNotEmpty(user.password) && !isOldPasswordValid) throw new BadRequestException_C(ErrorList.AuthInvalidPasswordNotEqual);

		user.password = hashedPassword;
		user.version = ++user.version;
		return await this.userRepository.save(user);
	}

	async isSuperAdmin(id: number) {
		const user = await this.userRepository.findOne({
			where: {
				id,
				role: GlobalRole.SUPERADMIN,
			},
			relations: ["branchMembers", "businessOwners"],
		});

		return !!user;
	}

	async isSubscriptionOwner(id: number, businessId?: number, branchId?: number){
		const user = await this.userRepository.existsBy(!branchId ? { 
			id,
			businessOwners: { business: { id: businessId, subscription: { user: { id }}  }, user: { id } },
			subscription: { id: Not(IsNull()) }
		 } :
		 { 
			id,
			branchMembers: { branch: { id: branchId, business: { subscription: { user: { id } } } }, user: { id } },
			subscription: { id: Not(IsNull()) }
		 }
		);

		return user;
	}

	async getUserSubscription(id: number) {
		const user = await this.userRepository
			.createQueryBuilder("user")
			.leftJoinAndSelect("user.subscription", "subscription")
			.leftJoinAndSelect("subscription.plan", "plan")
			.where("user.id = :id", { id })
			.getOne();

		if (!user) throw new BadRequestException_C(ErrorList.UserNotFound);

		return user.subscription;
	}
}
