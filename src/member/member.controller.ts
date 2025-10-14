import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Version } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { MemberService } from "./member.service";
import { AddMemberToBranchDTO } from "./dtos/add-member-to-branch.dto";
import { UpdateUserMemberDTO } from "./dtos/update-user-member.dto";
import { AddMemberToBranchSuperAdminDTO } from "./dtos/add-member-to-branch-super-admin.dto";
import { UpdateUserMemberSuperAdminDTO } from "./dtos/update-user-member-super-admin.dto";
import { validateDTO } from "src/common/tools/validate-dto.tool";
import { BranchRequired } from "src/common/decorators/branch.decorator";
import { BusinessRequired } from "src/common/decorators/business.decorator";
import { BranchMember } from "./entities/branch_member.entity";
import { RoleEnum } from "src/common/enums/role.enum";
import { BadRequestException_C } from "src/common/Custom/http-response";
import { SubscriptionAction } from "src/common/decorators/subscription.decorator";

@ApiTags("Members")
@ApiBearerAuth("Authorization")
@Controller()
@BranchRequired()
@BusinessRequired()
export class MembersController {
	constructor(private memberService: MemberService) {}

	@Get("/public/businesses/:businessid/branches/:branchid/members/summary")
	@ApiParam({ name: "businessid", example: "{{businessid}}", required: true, description: "Business ID" })
	@ApiParam({ name: "branchid", example: "{{branchid}}", required: true, description: "Branch ID" })
	@ApiOperation({ summary: "Get summary" })
	@Version("1")
	async summary() {
		const summary = await this.memberService.getSummary();
		return summary;
	}

	@Get("/public/businesses/:businessid/branches/:branchid/members")
	@ApiParam({ name: "businessid", example: "{{businessid}}", required: true, description: "Business ID" })
	@ApiParam({ name: "branchid", example: "{{branchid}}", required: true, description: "Branch ID" })
	@ApiQuery({ name: "role", enum: RoleEnum, required: false, description: "Filter by role" })
	@ApiQuery({ name: "name", required: false, description: "Filter by name" })
	@ApiQuery({ name: "email", required: false, description: "Filter by email" })
	@ApiOperation({ summary: "Get all member of a branch" })
	@Version("1")
	async getMembers(@Query("role") role: string, @Query("name") name: string, @Query("email") email: string) {
		const members = (await this.memberService.findOneMember(null, role, name, email)) as BranchMember[];
		const membersFiltered = members.map((member) => {
			return {
				id: member.user.id,
				mail: member.user.email,
				name: member.user.name,
				role: member.role,
				status: member.status,
				enabled: member.enabled,
			};
		});

		return membersFiltered;
	}

	@Post("/public/businesses/:businessid/branches/:branchid/members")
	@ApiParam({ name: "businessid", example: "{{businessid}}", required: true, description: "Business ID" })
	@ApiParam({ name: "branchid", example: "{{branchid}}", required: true, description: "Branch ID" })
	@ApiOperation({ summary: "Add member to branch" })
	@Version("1")
	@SubscriptionAction("BRANCH_MEMBER_CREATE")
	async addMember(@Body() addMember: AddMemberToBranchDTO) {
		await validateDTO(addMember, AddMemberToBranchDTO);
		const member = await this.memberService.addUserToBranch(addMember);

		if (member instanceof BadRequestException_C) throw member;

		return member.user.email;
	}

	@Patch("/public/businesses/:businessid/branches/:branchid/members")
	@ApiParam({ name: "businessid", example: "{{businessid}}", required: true, description: "Business ID" })
	@ApiParam({ name: "branchid", example: "{{branchid}}", required: true, description: "Branch ID" })
	@ApiOperation({ summary: "Update values of a branch member" })
	@Version("1")
	async updateMember(@Param("id") id: number, @Body() updateMember: UpdateUserMemberDTO) {
		await validateDTO(updateMember, UpdateUserMemberDTO);
		const member = await this.memberService.updateUserMember(updateMember);
		const { password, branchMembers, businessOwners, version, ...rest } = member.user;
		return {
			...rest,
			status: member.status,
		};
	}

	@Delete("/public/businesses/:businessid/branches/:branchid/members/:id")
	@ApiParam({ name: "businessid", example: "{{businessid}}", required: true, description: "Business ID" })
	@ApiParam({ name: "branchid", example: "{{branchid}}", required: true, description: "Branch ID" })
	@ApiOperation({ summary: "Delete a branch member" })
	@Version("1")
	async deleteMember(@Param("id") id: number) {
		const member = await this.memberService.deleteUserMember(id);
		return member.user.email;
	}

	@Get("/public/businesses/:businessid/branches/:branchid/members/:id")
	@ApiParam({ name: "businessid", example: "{{businessid}}", required: true, description: "Business ID" })
	@ApiParam({ name: "branchid", example: "{{branchid}}", required: true, description: "Branch ID" })
	@ApiOperation({ summary: "Delete a branch member" })
	@Version("1")
	async findOne(@Param("id") id: number) {
		const member = await this.memberService.findOneMember(id);
		return member;
	}

	@Post("/private/businesses/:businessid/branches/:branchid/members/:id")
	@ApiParam({ name: "businessid", example: "{{businessid}}", required: true, description: "Business ID" })
	@ApiParam({ name: "branchid", example: "{{branchid}}", required: true, description: "Branch ID" })
	@ApiOperation({ summary: "Add member to branch" })
	@Version("1")
	async addMemberSuperAdmin(@Body() addMember: AddMemberToBranchSuperAdminDTO) {
		await validateDTO(addMember, AddMemberToBranchSuperAdminDTO);
		return await this.memberService.addUserToBranch(addMember);
	}

	@Patch("/private/businesses/:businessid/branches/:branchid/members/:id")
	@ApiParam({ name: "businessid", example: "{{businessid}}", required: true, description: "Business ID" })
	@ApiParam({ name: "branchid", example: "{{branchid}}", required: true, description: "Branch ID" })
	@ApiOperation({ summary: "Update values of a branch member" })
	@Version("1")
	async updateMemberSuperAdmin(@Body() updateMember: UpdateUserMemberSuperAdminDTO) {
		await validateDTO(updateMember, UpdateUserMemberSuperAdminDTO);
		return await this.memberService.updateUserMember(updateMember);
	}

	@Delete("/private/businesses/:businessid/branches/:branchid/members/:id")
	@ApiParam({ name: "businessid", example: "{{businessid}}", required: true, description: "Business ID" })
	@ApiParam({ name: "branchid", example: "{{branchid}}", required: true, description: "Branch ID" })
	@ApiOperation({ summary: "Delete a branch member" })
	@Version("1")
	async deleteMemberSuperAdmin(@Param("id") id: number) {
		return await this.memberService.deleteUserMember(id, true);
	}
}
