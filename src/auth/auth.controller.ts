import { Controller, Post, Body, Headers, UseFilters, Query, Inject, forwardRef, Version } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Public } from "src/common/decorators/public.decorator";
import { UsersService } from "src/users/users.service";
import { HttpExceptionFilter } from "src/common/filters/http-exception.filter";
import { LoginUserDTO } from "src/users/dto/login-user.dto";
import { Roles } from "src/common/decorators/role.decorator";
import { validateDTO } from "src/common/tools/validate-dto.tool";
//import { MailerService } from '@nestjs-modules/mailer';
//import { EmailService } from 'src/email/email.service';
import { UsersModule } from "src/users/users.module";
import { RefreshTokenDTO } from "./dtos/refresh-token.dto";
import { InvitationTokenAccess } from "src/common/decorators/invitation-token-access.decorator";

@Controller("public/auth")
@ApiBearerAuth("Authorization")
@ApiTags("Authentications")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UsersService,
	) {}

	@Post("sign-in")
	@Public()
	@ApiOperation({ summary: "Sign in" })
	@ApiBody({
		description: "",
		type: LoginUserDTO,
		examples: {
			owner: { value: { email: "nicolas@example.com", password: "password" } },
			employer: { value: { email: "employer@example.com", password: "password" } },
		},
	})
	@Version("1")
	@InvitationTokenAccess()
	async signIn(@Body() loginUserDto: LoginUserDTO) {
		await validateDTO(loginUserDto, LoginUserDTO);
		return await this.authService.signIn(loginUserDto);
	}

	@Post("sign-up")
	@Public()
	@Roles("any")
	@ApiOperation({ summary: "Create an account" })
	@ApiBody({
		description: "",
		type: CreateUserDto,
		examples: {
			example1: {
				summary: "Admin account creation example",
				value: { email: "nicolas@example.com", name: "nicolas", surname: "pollano", phone: "3533440727", password: "password" },
			},
			example2: {
				summary: "Employer user account creation example",
				description: "Only owners can create employer account. You must be logged as one.",
				value: { email: "employer@example.com", name: "ramon", surname: "rodriges", phone: "351545454", password: "password" },
			},
		},
	})
	@Version("1")
	async signUp(@Body() createUserDto: CreateUserDto) {
		await validateDTO(createUserDto, CreateUserDto);
		return await this.userService.create(createUserDto);
	}

	@Public()
	@ApiOperation({ summary: "Refresh token" })
	@Post("refresh")
	@ApiBody({ description: "", type: String, schema: { type: "string", example: { refreshToken: "asdlandkjansdkasd" } } })
	@Version("1")
	async refresh(@Body() refreshTokenDTO: RefreshTokenDTO) {
		const refreshTokenValidated = await validateDTO(refreshTokenDTO, RefreshTokenDTO);
		return this.authService.refresh(refreshTokenValidated);
	}

	@Public()
	@Post("request-password-reset")
	@Version("1")
	async requestPasswordReset(@Query("useremail") user: string) {
		this.authService.resetPassword(user);
	}

	@Post("reset_password")
	@Version("1")
	@InvitationTokenAccess()
	async passwordReset(@Query("newpassword") newpassword: string) {
		return await this.userService.resetPassword(newpassword);
	}
}
