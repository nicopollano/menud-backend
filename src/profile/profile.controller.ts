import { Controller, Get, Version } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ProfileService } from "./profile.service";
import { ProfileSummaryDTO } from "./dtos/profile-summary.dto";
import { ModuleName } from "src/common/decorators/module.decorator";
import { Permission } from "src/common/decorators/permission.decorator";
import { Public } from "src/common/decorators/public.decorator";
import { Permissive } from "src/common/decorators/permissive.decorator";

@ApiTags("Profile")
@Controller("public/profile")
@ApiBearerAuth("Authorization")
@ModuleName("profile")
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@Get("summary")
	@ApiOperation({ summary: "Get profile summary" })
	@Version("1")
	@Permissive()
	async getSummary(): Promise<ProfileSummaryDTO> {
		return await this.profileService.getSummary();
	}

	@Get("subscription")
	@ApiOperation({ summary: "Get user subscription" })
	@Version("1")
	@Permissive()
	async getSubscription() {
		return await this.profileService.getSubscription();
	}
}
