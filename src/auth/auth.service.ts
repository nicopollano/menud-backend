import { BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Int32, Repository } from "typeorm";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "src/users/entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { LoginUserDTO } from "src/users/dto/login-user.dto";
import { ErrorList } from "src/common/enums/error.enum";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { BadRequestException_C, NotFoundException_C, UnauthorizedException_C } from "src/common/Custom/http-response";
import { EmailService } from "src/email/email.service";
import { UsersService } from "src/users/users.service";
import { ClsService } from "nestjs-cls";
import { RefreshTokenDTO } from "./dtos/refresh-token.dto";
import { Business } from "src/business/entities/business.entity";
import { Branch } from "src/branch/entities/branch.entity";
@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly jwtService: JwtService,
		@Inject(forwardRef(() => EmailService)) private emailService: EmailService,
		@Inject(forwardRef(() => UsersService)) private userService: UsersService,
		@Inject(forwardRef(() => ClsService)) private clsService: ClsService,
	) {}

	async signIn(loginUserDTO: LoginUserDTO) {
		const { password, email, singinToken } = loginUserDTO;
		const emailToLower = email?.toLowerCase() ?? null;

		if ((emailToLower && !password) || (!emailToLower && !singinToken)) {
			throw new BadRequestException_C(ErrorList.AuthInvalid);
		}

		if (singinToken) {
			const token = this.jwtService.decode(singinToken);

			if (!token) {
				throw new UnauthorizedException_C(ErrorList.AuthUnauthorized);
			}

			try {
				await this.jwtService.verifyAsync(singinToken);
				return {
					invitationToken: true,
					email: token.email,
					name: token.name,
				};
			} catch (e) {
				throw new UnauthorizedException_C(ErrorList.AuthVerificatonTokenError);
			}
		}

		const userFind = await this.userService.checkEmailExist(emailToLower, true);

		if (!userFind) {
			throw new BadRequestException_C(ErrorList.UserNotFound);
		}

		const isPasswordValid = await userFind.validatePassword(password);

		if (!isPasswordValid) {
			throw new BadRequestException_C(ErrorList.AuthInvalidPassword);
		}

		const payload = {
			sub: userFind.id,
			reg: true,
			ctrl_name: `${userFind.email},22`,
			version: userFind.version,
		};

		const tokenDuration: number = Number(process.env.TOKENDURATION) * 60;
		const refreshTokenDuration = Number(process.env.REFRESHTOKENDURATION) * 60;
		const accessToken = await this.jwtService.signAsync(
			{ ...payload, refresh: false },
			{
				expiresIn: `${tokenDuration}s`,
			},
		);
		const refreshToken = await this.jwtService.signAsync(
			{ ...payload, refresh: true },
			{
				expiresIn: `${refreshTokenDuration}s`,
			},
		);

		const now = Date.now();
		return {
			invitationToken: false,
			accessToken,
			refreshToken,
			accessTokenExpiresAt: new Date(now + (tokenDuration - 15) * 1000),
			refreshTokenExpiresAt: new Date(now + (refreshTokenDuration - 15) * 1000),
			id: userFind.id,
			email: userFind.email,
		};
	}

	/*
  async singInWithToken(singinToken: string) {
    const token = this.jwtService.decode(singinToken);
    if (!token) {
      throw new UnauthorizedException_C(ErrorList.AuthUnauthorized);
    }

    try {
      await this.jwtService.verifyAsync(singinToken);
    } catch (e) {
      throw new UnauthorizedException_C(ErrorList.AuthVerificatonTokenError);
    }

    if(token.reg === false) {
      throw new UnauthorizedException_C(ErrorList.AuthInvitationToken);
    }
  }
  
  */
	async refresh(refreshTokenDTO: RefreshTokenDTO) {
		const { refreshToken } = refreshTokenDTO;
		const decodedToken = this.jwtService.decode(refreshToken);
		if (!decodedToken) {
			throw new UnauthorizedException_C(ErrorList.AuthUnauthorized);
		}
		try {
			await this.jwtService.verifyAsync(refreshToken);
		} catch (e) {
			throw new UnauthorizedException_C(ErrorList.AuthVerificatonTokenError);
		}
		if (decodedToken.reg !== true) throw new UnauthorizedException_C(ErrorList.AuthInvitationToken);

		const userFind = await this.userRepository.findOne({ where: { id: decodedToken.sub }, order: { email: "ASC" } });

		const ctrl_array = decodedToken.ctrl_name.split(",");
		const version = decodedToken.version;

		if (version != userFind.version) throw new BadRequestException_C(ErrorList.TokenRefreshError);

		if (ctrl_array[0] != userFind.email || ctrl_array[1] != "22" || !decodedToken.refresh) throw new BadRequestException_C(ErrorList.TokenInvalid);

		if (!userFind) throw new NotFoundException_C(ErrorList.UserNotFound);

		userFind.version++;

		await this.userRepository.save(userFind);

		const payload = {
			sub: userFind.id,
			reg: true,
			ctrl_name: `${userFind.email},22`,
			version: version + 1,
		};

		const tokenDuration: number = Number(process.env.TOKENDURATION) * 60;
		const refreshTokenDuration = Number(process.env.REFRESHTOKENDURATION) * 60;
		const accessToken = await this.jwtService.signAsync(
			{ ...payload, refresh: false },
			{
				expiresIn: `${tokenDuration}s`,
			},
		);
		const newrefreshToken = await this.jwtService.signAsync(
			{ ...payload, refresh: true },
			{
				expiresIn: `${refreshTokenDuration}s`,
			},
		);

		const now = Date.now();

		return {
			invitationToken: false,
			accessToken,
			refreshToken: newrefreshToken,
			accessTokenExpiresAt: new Date(now + (tokenDuration - 15) * 1000),
			refreshTokenExpiresAt: new Date(now + (refreshTokenDuration - 15) * 1000),
			id: userFind.id,
			email: userFind.email,
		};
	}

	async resetPassword(user: string) {
		const userFind = await this.userService.checkEmailExist(user);
		if (!userFind) throw new NotFoundException_C(ErrorList.UserNotFound);

		const payload = {
			sub: userFind.id,
			reg: true,
			role: "reset_password",
			ctrl_name: `${userFind.email},22`,
			version: userFind.version,
		};

		const tokenduration = process.env.TOKENRESETPASSWORDDURATION;

		const accessToken: string = await this.jwtService.signAsync(
			{ ...payload, refresh: false },
			{
				expiresIn: `${tokenduration}m`,
			},
		);

		//this.emailService.passwordReset(userFind.email, userFind, accessToken);
	}

	async sendInvitation(id: number, name: string, email: string, business: Business, branch: Branch) {
		if (!email) {
			throw new BadRequestException_C(ErrorList.UserNotFound);
		}

		const payload = {
			sub: id,
			email,
			name,
			reg: false,
			ctrl_name: `${email},22`,
			version: 0,
		};

		const invitationToken = await this.jwtService.signAsync(
			{ ...payload, refresh: false },
			{
				expiresIn: `${process.env.TOKENINVITATIONDURATION}d`,
			},
		);

		await this.emailService.sendInvitation(email, name, business.name, branch.name, invitationToken);
	}
}
