import { forwardRef, Inject, Injectable } from "@nestjs/common";
import * as dns from "dns/promises";
import { Branch } from "src/branch/entities/branch.entity";
import { BadRequestException_C } from "src/common/Custom/http-response";
import { ErrorList } from "src/common/enums/error.enum";
import { User } from "src/users/entities/user.entity";
import * as fs from "fs";
import * as Handlebars from "handlebars";
import { ClsService } from "nestjs-cls";
import * as nodemailer from "nodemailer";
import { config } from "src/config";

@Injectable()
export class EmailService {
	private transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.GMAIL_USER,
			pass: process.env.GMAIL_APP_PASSWORD,
		},
	});

	constructor(@Inject(forwardRef(() => ClsService)) private clsService: ClsService) {}

	async sendEmail(to: string, subject: string, content: string) {
		if (!(await this.verifyDomain(to))) throw new BadRequestException_C(ErrorList.EmailInvalid);

		return await this.transporter.sendMail({
			to,
			subject,
			text: content,
		});
	}

	async accountCreationAdmin(to: string, user: User, businessname: string) {
		if (!(await this.verifyDomain(to))) throw new BadRequestException_C(ErrorList.EmailInvalid);
		const file = fs.readFileSync(`${config.email.templatePath}/account-created-admin.hbs`, "utf-8");
		const template = Handlebars.compile(file);
		const html = template({ username: user.name, branch_name: businessname });

		return await this.transporter.sendMail({
			to,
			subject: `Gastronomic: Cuenta creada`,
			html,
		});
	}

	async accountCreationEmployer(to: string, user: User, branch: Branch) {
		if (!(await this.verifyDomain(to))) throw new BadRequestException_C(ErrorList.EmailInvalid);
		const file = fs.readFileSync(`${config.email.templatePath}/account-created-employer.hbs`, "utf-8");
		const template = Handlebars.compile(file);
		const html = template({ username: user.name, branch_name: branch.name });

		return await this.transporter.sendMail({
			to,
			subject: `${branch.name}: Cuenta creada`,
			html,
		});
	}

	async passwordReset(to: string, user: User, accessToken: string) {
		if (!(await this.verifyDomain(to))) throw new BadRequestException_C(ErrorList.EmailInvalid);
		const domain = config.email.domain;
		const branch: Branch = this.clsService.get("branch");
		const file = fs.readFileSync(`${config.email.templatePath}/password-reset.hbs`);
		const template = Handlebars.compile(file);
		const html = template({ username: user.name, url: `${domain}/reset_password?token=${accessToken}` });

		return await this.transporter.sendMail({
			to,
			subject: `${branch.name}: Recuperacion de cuenta`,
			html,
		});
	}

	async passwordResetSuccess(to: string, user: User) {
		if (!(await this.verifyDomain(to))) throw new BadRequestException_C(ErrorList.EmailInvalid);
		const branch: Branch = this.clsService.get("branch");
		const file = fs.readFileSync(`${config.email.templatePath}/password-reset-success.hbs`);
		const template = Handlebars.compile(file);
		const html = template({ username: user.name });

		return await this.transporter.sendMail({
			to,
			subject: `${branch.name}: Recuperacion de cuenta`,
			html,
		});
	}

	async verifyDomain(email: string): Promise<boolean> {
		const domain = email.split("@")[1];
		try {
			const mxRecords = await dns.resolveMx(domain);
			return mxRecords.length > 0;
		} catch (error) {
			return false;
		}
	}

	async sendInvitation(to: string, name: string, businessName: string, branchName: string, invitationToken: string) {
		if (!(await this.verifyDomain(to))) throw new BadRequestException_C(ErrorList.EmailInvalid);
		const file = fs.readFileSync(`${config.email.templatePath}/${branchName ? "invitation-to-branch.hbs" : "invitation-to-business.hbs"}`, "utf-8");
		const template = Handlebars.compile(file);
		const link = `${config.email.domain}/register?token=${invitationToken}`;
		const html = template({ username: name, businessName, link, branchName });

		return await this.transporter.sendMail({
			to,
			subject: `Ristokit: Invitacion a ${branchName ? branchName : businessName}`,
			html,
		});
	}
}
